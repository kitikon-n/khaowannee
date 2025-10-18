import { useState, useEffect, useRef } from 'react';

export const useN8nStream = (url, body = null) => {
    const [messages, setMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (!url) return;

        const startStream = async () => {
            setIsLoading(true);
            abortControllerRef.current = new AbortController();

            try {
                const response = await fetch(url, {
                    method: body ? 'POST' : 'GET',
                    headers: body ? {
                        'Content-Type': 'application/json',
                    } : {},
                    body: body ? JSON.stringify(body) : null,
                    signal: abortControllerRef.current.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setIsConnected(true);
                setIsLoading(false);

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        console.log('Stream completed');
                        setIsConnected(false);
                        break;
                    }

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');

                    // เก็บบรรทัดสุดท้ายไว้ใน buffer (อาจไม่สมบูรณ์)
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.trim() === '') continue;

                        try {
                            const data = JSON.parse(line);

                            // กรองเฉพาะ type: "item"
                            if (data.type === 'item' && data.content) {
                                const content = JSON.parse(data.content);

                                console.log('Parsed content:', content);

                                setLastMessage(content);
                                setMessages(prev => [...prev, content]);
                            } else if (data.type === 'begin') {
                                console.log('Stream begin:', data.metadata);
                            } else if (data.type === 'end') {
                                console.log('Stream end:', data.metadata);
                            }
                        } catch (parseError) {
                            console.warn('Failed to parse line:', line, parseError);
                        }
                    }
                }

            } catch (err) {
                if (err.name === 'AbortError') {
                    console.log('Stream aborted');
                } else {
                    console.error('Stream error:', err);
                    setError(err);
                }
                setIsConnected(false);
                setIsLoading(false);
            }
        };

        startStream();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [url, JSON.stringify(body)]);

    const clearMessages = () => {
        setMessages([]);
        setLastMessage(null);
    };

    return {
        messages,
        lastMessage,
        isConnected,
        isLoading,
        error,
        clearMessages,
    };
};