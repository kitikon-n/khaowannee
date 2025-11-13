import MainLayout from '../components/layout/MainLayout';
import { useWebSocket } from '../services/hooks/useWebSocket';
import { useState, useEffect, useRef } from 'react';
import { NewsCard } from './NewsCard';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, WifiOff, Newspaper } from "lucide-react";
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
            isInitialLoad.current = true; // รีเซ็ตเพื่อรอข่าวใหม่เมื่อ reconnect
            previousNewsIds.current.clear(); // ล้าง IDs เก่า
            setNewsData([]); // ล้างข่าวที่แสดงอยู่
        }
    }, [isConnected]);

    // อัพเดทข่าวเมื่อมีข้อมูลใหม่
    useEffect(() => {
        if (lastMessage?.type === 'data' && lastMessage?.data) {
            if (lastMessage?.data?.length > 0) {

                // ถ้าเป็นครั้งแรก ให้เก็บ IDs แต่ไม่แสดงข่าว (รอให้ข่าวใหม่เข้ามา)
                if (isInitialLoad.current) {
                    lastMessage.data.forEach(news => {
                        previousNewsIds.current.add(news.id);
                    });
                    isInitialLoad.current = false;
                    // ไม่ set newsData ในครั้งแรก - ให้แสดง "ไม่มีข่าว" แทน
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
            } else {
                setNewsData([]);
            }

        } else {
            setNewsData([]);
        }
    }, [lastMessage]);

    return (
        <MainLayout activeMenu="news">
            {/* Facebook-style Feed Layout with Scrollable Container */}
            <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
                {/* Fixed Header with Status */}
                <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="max-w-2xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    News Feed
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    {newsData.length > 0 ? `${newsData.length} posts` : 'Loading...'}
                                </p>
                            </div>

                            {/* Connection Status Badge */}
                            <div className="flex items-center gap-2">
                                {isConnected ? (
                                    <>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Live</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-red-600 dark:text-red-400">Offline</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto scroll-smooth" style={{ scrollbarGutter: 'stable' }}>
                    <div className="max-w-2xl mx-auto px-4 py-4">
                        {/* Error Message (แบบ Facebook banner) */}
                        {error && (
                            <div className="mb-4">
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                                {error}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* News Feed - Single Column แบบ Facebook */}
                        {newsData.length > 0 ? (
                            <div className="space-y-4 pb-8">
                                {newsData.map((news, index) => (
                                    <NewsCard key={`${news.id}-${index}`} news={news} />
                                ))}

                                {/* End of Feed Indicator */}
                                <div className="flex items-center justify-center py-8">
                                    <div className="text-center">
                                        <div className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                                            <div className="w-16 h-px bg-gray-300 dark:bg-gray-700"></div>
                                            <span>คุณดูข่าวครบแล้ว</span>
                                            <div className="w-16 h-px bg-gray-300 dark:bg-gray-700"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 mt-8">
                                <CardContent className="flex flex-col items-center justify-center py-16">
                                    <div className="relative mb-6">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                                            {isLoading ? (
                                                <div className="animate-spin rounded-full h-10 w-10 border-3 border-gray-200 border-t-blue-600"></div>
                                            ) : isNoNews ? (
                                                <Newspaper className="w-10 h-10 text-gray-400" />
                                            ) : (
                                                <WifiOff className="w-10 h-10 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {isLoading ? 'กำลังโหลดข่าว...' : isNoNews ? 'ไม่มีข่าวในขณะนี้' : 'กำลังเชื่อมต่อ...'}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                                        {isLoading
                                            ? 'กำลังดึงข้อมูลข่าวล่าสุด'
                                            : isNoNews
                                                ? 'รอการอัพเดทข่าวใหม่'
                                                : 'กำลังเชื่อมต่อกับ server'
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}