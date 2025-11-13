import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, TrendingDown, Minus, Globe } from "lucide-react";

export function NewsCard({ news }) {
    // กำหนดสีตาม impact level
    const getImpactColor = (level) => {
        switch (level?.toUpperCase()) {
            case 'CRITICAL':
                return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200';
            case 'HIGH':
                return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200';
            case 'MEDIUM':
                return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200';
            case 'LOW':
                return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200';
            default:
                return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200';
        }
    };

    // กำหนด icon และสีตาม sentiment
    const getSentimentDisplay = (score) => {
        if (!score) return { icon: <Minus className="w-4 h-4" />, text: 'Neutral', color: 'text-gray-600' };
        if (score > 0) return { icon: <TrendingUp className="w-4 h-4" />, text: 'Positive', color: 'text-green-600' };
        if (score < 0) return { icon: <TrendingDown className="w-4 h-4" />, text: 'Negative', color: 'text-red-600' };
        return { icon: <Minus className="w-4 h-4" />, text: 'Neutral', color: 'text-gray-600' };
    };

    // Format date แบบ Facebook style (relative time)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'เมื่อสักครู่';
        if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
        if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
        if (diffDays < 7) return `${diffDays} วันที่แล้ว`;

        return new Intl.DateTimeFormat('th-TH', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        }).format(date);
    };

    const sentiment = getSentimentDisplay(news.sentiment_score);

    return (
        <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
            {/* Header - แบบ Facebook Post */}
            <div className="p-4 pb-3">
                <div className="flex items-start gap-3">
                    {/* Avatar/Icon */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-white" />
                    </div>

                    {/* Post Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                Crypto News
                            </h3>
                            {news.is_verified && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs px-1.5 py-0">
                                    ✓
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatDate(news.published_at)}</span>
                            {news.impact_level && (
                                <>
                                    <span>·</span>
                                    <Badge className={`${getImpactColor(news.impact_level)} text-xs px-2 py-0 font-medium`}>
                                        {news.impact_level}
                                    </Badge>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <CardContent className="px-4 pb-3 pt-0">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-base leading-snug">
                    {news.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {news.summary || news.content}
                </p>
            </CardContent>

            {/* Footer - Actions แบบ Facebook */}
            <div className="px-4 pb-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between gap-4">
                    {/* Sentiment */}
                    {news.sentiment_score !== null && (
                        <div className={`flex items-center gap-1.5 text-sm ${sentiment.color}`}>
                            {sentiment.icon}
                            <span className="font-medium">{sentiment.text}</span>
                        </div>
                    )}

                    {/* Read More */}
                    {news.url && (
                        <button
                            onClick={() => window.open(news.url, '_blank')}
                            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                            <span>อ่านเพิ่มเติม</span>
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </Card>
    );
}