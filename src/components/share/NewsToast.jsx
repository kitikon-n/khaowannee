import { Badge } from "@/components/ui/badge";
import { ExternalLink, X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import toast from "react-hot-toast";

export const NewsToast = ({ news, toastId }) => {
    // กำหนดสีตาม impact level
    const getImpactColor = (level) => {
        switch (level?.toUpperCase()) {
            case 'HIGH':
                return 'bg-red-500';
            case 'MEDIUM':
                return 'bg-yellow-500';
            case 'LOW':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    // กำหนดสีขอบตาม impact
    const getBorderColor = (level) => {
        switch (level?.toUpperCase()) {
            case 'HIGH':
                return 'border-l-red-500';
            case 'MEDIUM':
                return 'border-l-yellow-500';
            case 'LOW':
                return 'border-l-green-500';
            default:
                return 'border-l-gray-500';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('th-TH', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const handleOpenLink = () => {
        if (news.url) {
            window.open(news.url, '_blank');
            toast.dismiss(toastId);
        }
    };

    return (
        <div
            className={`
        relative w-full max-w-md bg-white dark:bg-gray-800 
        rounded-lg shadow-xl border-l-4 ${getBorderColor(news.impact_level)}
        p-4 cursor-pointer hover:shadow-2xl transition-all duration-200
        animate-in slide-in-from-right
      `}
            onClick={handleOpenLink}
        >
            {/* Close Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toast.dismiss(toastId);
                }}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
                <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-3 mb-2">
                <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">📰</span>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${getImpactColor(news.impact_level)} text-white text-xs px-2 py-0.5`}>
                            {news.impact_level || 'INFO'}
                        </Badge>
                        {news.is_verified && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                                ✓
                            </Badge>
                        )}
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
                        {news.title}
                    </h4>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(news.published_at)}
                    </p>
                </div>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 pl-13">
                {news.content}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pl-13">
                {news.sentiment_score !== null && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        {news.sentiment_score > 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : news.sentiment_score < 0 ? (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                        ) : (
                            <Minus className="w-3 h-3 text-gray-400" />
                        )}
                        <span className="font-medium">
                            {news.sentiment_score > 0 ? 'Positive' : news.sentiment_score < 0 ? 'Negative' : 'Neutral'}
                        </span>
                    </div>
                )}

                {news.url && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                        <span>Read more</span>
                        <ExternalLink className="w-3 h-3" />
                    </div>
                )}
            </div>

            {/* New Badge Animation */}
            <div className="absolute -top-1 -right-1">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            </div>
        </div>
    );
};