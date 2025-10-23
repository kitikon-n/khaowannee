import MainLayout from '../components/layout/MainLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useN8nStream } from '../services/hooks/useN8nStream';
import { useWebSocket } from '../services/hooks/useWebSocket';
import { useState, useEffect, useRef } from 'react';
import { NewsCard } from './NewsCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Trash2, Send, Wifi, WifiOff, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { showToast } from '../components/share/toast';

export default function NewsPage() {
    // return (
    //     <MainLayout activeMenu="news">
    //         <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">Crypto News</h2>
    //         <Alert className="bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700">
    //             <AlertDescription className="text-stone-700 dark:text-stone-300">
    //                 ฟีเจอร์ News กำลังพัฒนา...
    //             </AlertDescription>
    //         </Alert>
    //     </MainLayout>
    // );
    const [newsData, setNewsData] = useState([]);
    const [currentSymbols, setCurrentSymbols] = useState([]);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
    const previousNewsIds = useRef(new Set());
    const isInitialLoad = useRef(true); // เช็คว่าเป็นการโหลดครั้งแรกหรือไม่
    const hasSubscribed = useRef(false); // เช็คว่า subscribe แล้วหรือยัง

    const {
        isConnected,
        lastMessage,
        error,
        subscribeToSymbols,
    } = useWebSocket('ws://localhost:8081');


    // แจ้งเตือนเมื่อเชื่อมต่อสำเร็จ
    useEffect(() => {
        if (isConnected) {
            showToast.success('เชื่อมต่อสำเร็จ! กำลังรอข่าวใหม่...');
        }
    }, [isConnected]);

    // แจ้งเตือนเมื่อมี error
    useEffect(() => {
        if (error) {
            showToast.error(error);
        }
    }, [error]);

    // กำหนดสถานะการแสดงผล
    const isLoading = isConnected && !hasAttemptedFetch;
    const isNoNews = isConnected && hasAttemptedFetch && newsData.length === 0;


    // Subscribe ทันทีที่เชื่อมต่อสำเร็จ (แต่ทำครั้งเดียว)
    useEffect(() => {
        if (isConnected && !hasSubscribed.current) {
            const defaultSymbols = ['BNB', 'PTT'];
            const success = subscribeToSymbols(defaultSymbols);
            if (success) {
                hasSubscribed.current = true;
                setHasAttemptedFetch(true);
            }
        }

        // Reset flag เมื่อ disconnect
        if (!isConnected) {
            hasSubscribed.current = false;
            setHasAttemptedFetch(false);
        }
    }, [isConnected]);

    // อัพเดทข่าวเมื่อมีข้อมูลใหม่
    useEffect(() => {
        if (lastMessage?.type === 'data' && lastMessage?.data) {
            if (lastMessage?.data?.length > 0) {

                // ถ้าเป็นครั้งแรก ให้เก็บ IDs และไม่แจ้งเตือน
                if (isInitialLoad.current) {
                    lastMessage.data.forEach(news => {
                        previousNewsIds.current.add(news.id);
                    });
                    isInitialLoad.current = false;
                    setNewsData(lastMessage.data);
                    return;
                }

                // หาข่าวใหม่ที่ยังไม่เคยแสดง (เฉพาะรอบที่ 2 เป็นต้นไป)
                const newNews = lastMessage.data.filter(news => {
                    return !previousNewsIds.current.has(news.id);
                });

                // ถ้ามีข่าวใหม่ ให้แจ้งเตือน
                if (newNews.length > 0) {
                    if (newNews.length === 1) {
                        showToast.news(newNews[0]);
                    } else {
                        // ถ้ามีหลายข่าว แสดงทีละข่าว
                        showToast.multipleNews(newNews.slice(0, 3)); // จำกัดแค่ 3 ข่าวแรก

                        // ถ้ามีมากกว่า 3 แสดง summary
                        if (newNews.length > 3) {
                            setTimeout(() => {
                                showToast.success(`มีข่าวใหม่ทั้งหมด ${newNews.length} ข่าว`);
                            }, 1000);
                        }
                    }
                }

                // อัพเดท Set ของ IDs
                lastMessage.data.forEach(news => {
                    previousNewsIds.current.add(news.id);
                });

                setNewsData(lastMessage.data || []);
                setCurrentSymbols(lastMessage.symbols || []);
            } else {
                setNewsData([]);
            }

        } else {
            setNewsData([]);
        }
    }, [lastMessage]);

    return (
        <MainLayout activeMenu="news">
            {/* <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">Crypto News</h2> */}
            {/* <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 py-8 max-w-7xl"> */}

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            📰 Real-time News Feed
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Live updates from economic calendar events
                        </p>
                    </div>

                    {/* Connection Status */}
                    <div className="flex items-center gap-3">
                        {isConnected ? (
                            <>
                                <Wifi className="w-6 h-6 text-green-500 animate-pulse" />
                                <div className="text-right">
                                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                        🟢 Live
                                    </Badge>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Auto-refresh every 5s
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-6 h-6 text-red-500" />
                                <Badge variant="destructive">
                                    🔴 Offline
                                </Badge>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
                    <CardContent className="flex items-center gap-2 p-4">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">
                            {error}
                        </span>
                    </CardContent>
                </Card>
            )}

            {/* Current Subscriptions */}
            {currentSymbols.length > 0 && (
                <Card className="mb-6 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                📊 Monitoring:
                            </span>
                            {currentSymbols.map((symbol, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="px-4 py-2 text-sm font-semibold"
                                >
                                    {symbol}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* News Grid */}
            {newsData.length > 0 ? (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Latest News ({newsData.length})
                        </h2>
                        {lastMessage?.timestamp && (
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase tracking-wide">
                                    Last Update
                                </p>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {new Date(lastMessage.timestamp).toLocaleTimeString('th-TH', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsData.map((news, index) => (
                            <NewsCard key={`${news.id}-${index}`} news={news} />
                        ))}
                    </div>
                </div>
            ) : (
                <Card className="shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    ) : isNoNews ? (
                                        <Newspaper className="w-8 h-8 text-gray-400" />
                                    ) : (
                                        <WifiOff className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {isLoading ? 'Loading news...' : isNoNews ? 'ไม่มีข่าวในขณะนี้' : 'Connecting...'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                            {isLoading
                                ? 'กำลังดึงข้อมูลข่าวล่าสุดจาก server'
                                : isNoNews
                                    ? 'ยังไม่มีข่าวสำหรับสัญลักษณ์ที่เลือก กรุณารอการอัพเดทข่าวใหม่'
                                    : 'กำลังเชื่อมต่อกับ news feed'
                            }
                        </p>
                        {isNoNews && lastMessage?.timestamp && (
                            <p className="text-xs text-gray-400 mt-4">
                                อัพเดทล่าสุด: {new Date(lastMessage.timestamp).toLocaleString('th-TH')}
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </MainLayout>
    );
}