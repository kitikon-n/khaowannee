import { useEffect, useRef, useState, useCallback } from 'react';

export const useWebSocket = (url) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState(null);
    const [error, setError] = useState(null);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 3;

    // ฟังก์ชันสำหรับเชื่อมต่อ
    const connect = useCallback(() => {
        try {
            wsRef.current = new WebSocket(url);

            wsRef.current.onopen = () => {
                console.log('✅ WebSocket Connected');
                setIsConnected(true);
                setError(null);
                reconnectAttemptsRef.current = 0; // รีเซ็ต counter เมื่อเชื่อมต่อสำเร็จ
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 Received:', data);

                    if (data) {
                        setLastMessage(data);
                        setMessages((prev) => [...prev, data]);
                    } else {
                        setMessages([]);
                        setLastMessage(null);
                        setError(null);
                    }


                    // Clear error ถ้ารับข้อมูลสำเร็จ
                    if (data.type !== 'error') {
                        setError(null);
                    } else {
                        setError(data.message);
                    }
                } catch (error) {
                    console.error('❌ Error parsing message:', error);
                    setError('Failed to parse message');
                }
            };

            wsRef.current.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                // ไม่แสดง error ถ้ายังไม่เคยเชื่อมต่อสำเร็จ (initial connection)
                if (reconnectAttemptsRef.current > 0) {
                    setError('Connection error - retrying...');
                }
            };

            wsRef.current.onclose = (event) => {
                console.log('❌ WebSocket Disconnected', event.code, event.reason);
                setIsConnected(false);

                // Auto reconnect ถ้ายังไม่เกินจำนวนครั้งที่กำหนด
                if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current += 1;
                    const delay = Math.min(1000 * reconnectAttemptsRef.current, 5000); // เพิ่ม delay แบบ exponential แต่ไม่เกิน 5 วินาที

                    console.log(`🔄 Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts}) in ${delay}ms`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, delay);
                } else {
                    setError('ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบว่า WebSocket server กำลังรันอยู่');
                }
            };
        } catch (error) {
            console.error('❌ Connection error:', error);
            setError('Failed to connect');
        }
    }, [url]);

    // ฟังก์ชันสำหรับส่งข้อมูล (รับ array ของ symbols)
    const subscribeToSymbols = useCallback((symbols) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const message = {
                symbol: symbols
            };
            wsRef.current.send(JSON.stringify(message));
            console.log('📤 Sent:', message);
            return true;
        } else {
            console.warn('⚠️ WebSocket is not connected');
            setError('WebSocket is not connected');
            return false;
        }
    }, []);

    // ฟังก์ชันสำหรับส่งข้อมูลทั่วไป
    const sendMessage = useCallback((data) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data));
            console.log('📤 Sent:', data);
            return true;
        } else {
            console.warn('⚠️ WebSocket is not connected');
            setError('WebSocket is not connected');
            return false;
        }
    }, []);

    // ฟังก์ชันสำหรับปิดการเชื่อมต่อ
    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (wsRef.current) {
            wsRef.current.close();
        }
    }, []);

    // ฟังก์ชันสำหรับล้างข้อความ
    const clearMessages = useCallback(() => {
        setMessages([]);
        setLastMessage(null);
        setError(null);
    }, []);

    // เชื่อมต่อเมื่อ component mount
    useEffect(() => {
        connect();

        // Cleanup เมื่อ component unmount
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connect]);

    return {
        isConnected,
        messages,
        lastMessage,
        error,
        subscribeToSymbols,  // ใหม่: สำหรับ subscribe symbols
        sendMessage,
        disconnect,
        clearMessages,
    };
};