import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function NewsCard({ news }) {
    // กำหนดสีตาม impact level
    const getImpactColor = (level) => {
        switch (level?.toUpperCase()) {
            case 'CRITICAL':
                return 'bg-red-500 hover:bg-red-600';
            case 'HIGH':
                return 'bg-red-500 hover:bg-red-600';
            case 'MEDIUM':
                return 'bg-yellow-500 hover:bg-yellow-600';
            case 'LOW':
                return 'bg-green-500 hover:bg-green-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    // กำหนด icon ตาม sentiment
    const getSentimentIcon = (score) => {
        if (!score) return <Minus className="w-4 h-4" />;
        if (score > 0) return <TrendingUp className="w-4 h-4" />;
        if (score < 0) return <TrendingDown className="w-4 h-4" />;
        return <Minus className="w-4 h-4" />;
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-bold line-clamp-2 flex-1">
                        {news.title}
                    </CardTitle>
                    {news.impact_level && (
                        <Badge className={`${getImpactColor(news.impact_level)} text-white shrink-0`}>
                            {news.impact_level}
                        </Badge>
                    )}
                </div>

                <CardDescription className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    {formatDate(news.published_at)}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">
                    {news.summary || news.content}
                </p>

                {news.sentiment_score !== null && (
                    <div className="flex items-center gap-2 mt-4 text-sm">
                        {getSentimentIcon(news.sentiment_score)}
                        <span className="font-medium">
                            Sentiment: {news.sentiment_score > 0 ? 'Positive' : news.sentiment_score < 0 ? 'Negative' : 'Neutral'}
                        </span>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between items-center">
                {news.is_verified && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        ✓ Verified
                    </Badge>
                )}

                {news.url && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => window.open(news.url, '_blank')}
                    >
                        Read More
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}