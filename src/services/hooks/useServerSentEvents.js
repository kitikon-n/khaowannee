import { useState, useEffect, useRef } from 'react';

export const useServerSentEvents = (url, options = {}) => {
    const [messages, setMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const eventSourceRef = useRef(null);

    useEffect(() => {
        if (!url) return;

        try {
            // สร้าง EventSource connection
            eventSourceRef.current = new EventSource(url);

            eventSourceRef.current.onopen = () => {
                console.log('SSE Connected');
                setIsConnected(true);
                setError(null);
            };

            eventSourceRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setLastMessage(data);
                    setMessages((prev) => [...prev, data]);

                    // เรียก callback ถ้ามี
                    if (options.onMessage) {
                        options.onMessage(data);
                    }
                } catch (err) {
                    console.error('Error parsing SSE data:', err);
                }
            };

            eventSourceRef.current.onerror = (err) => {
                console.error('SSE Error:', err);
                setIsConnected(false);
                setError(err);

                // Auto reconnect หลัง 5 วินาที
                setTimeout(() => {
                    if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
                        eventSourceRef.current.close();
                        // EventSource จะ reconnect อัตโนมัติ
                    }
                }, 5000);
            };

        } catch (err) {
            console.error('Failed to create EventSource:', err);
            setError(err);
        }

        // Cleanup
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, [url]);

    const clearMessages = () => {
        setMessages([]);
        setLastMessage(null);
    };

    return {
        messages,
        lastMessage,
        isConnected,
        error,
        clearMessages,
    };
};