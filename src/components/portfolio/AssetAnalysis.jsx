import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function AssetAnalysis({ asset, recommendationData, isLoading }) {

    console.log(recommendationData);
    
    const [activeTimeframe, setActiveTimeframe] = useState('short');

    // Helper function to format enum values for display
    const formatEnumValue = (value) => {
        if (!value) return 'N/A';
        // Convert STRONG_BUY to Strong Buy
        return value.split('_').map(word =>
            word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ');
    };

    // Helper function to get signal color
    const getSignalColor = (signal) => {
        if (!signal) return 'text-stone-600 dark:text-stone-400';
        if (signal === 'STRONG_BUY' || signal === 'BUY') {
            return 'text-green-600 dark:text-green-400';
        } else if (signal === 'STRONG_SELL' || signal === 'SELL') {
            return 'text-red-600 dark:text-red-400';
        } else if (signal === 'HOLD') {
            return 'text-amber-600 dark:text-amber-400';
        }
        return 'text-blue-600 dark:text-blue-400';
    };

    // Helper function to calculate percentage
    const calculatePercentage = (target, entry) => {
        if (!target || !entry || entry === 0) return 0;
        return ((target - entry) / entry * 100).toFixed(1);
    };

    // Helper function to calculate risk/reward ratio
    const calculateRiskReward = (target, entry, stopLoss) => {
        if (!target || !entry || !stopLoss) return '1:0';
        const reward = target - entry;
        const risk = entry - stopLoss;
        if (risk === 0) return '1:0';
        const ratio = (reward / risk).toFixed(1);
        return `1:${ratio}`;
    };

    // Map API data to analysis format
    const analysisData = recommendationData ? {
        short: {
            timeframe: recommendationData.short_term_timeframe || '4H',
            signal: formatEnumValue(recommendationData.short_term_signal),
            signalColor: getSignalColor(recommendationData.short_term_signal),
            confidence: recommendationData.short_term_score || 0,
            momentum: formatEnumValue(recommendationData.short_market_momentum),
            trendDirection: formatEnumValue(recommendationData.short_trend_direction),
            riskLevel: formatEnumValue(recommendationData.short_term_risk_level),
            volatility: recommendationData.short_market_volatility || 'N/A',
            liquidity: recommendationData.short_liquidity || 'N/A',
            entryPrice: recommendationData.short_term_entry_price || 0,
            targetPrice: recommendationData.short_term_target_price || 0,
            targetPercent: calculatePercentage(recommendationData.short_term_target_price, recommendationData.short_term_entry_price),
            stopLoss: recommendationData.short_term_stop_loss || 0,
            stopLossPercent: calculatePercentage(recommendationData.short_term_stop_loss, recommendationData.short_term_entry_price),
            riskReward: calculateRiskReward(recommendationData.short_term_target_price, recommendationData.short_term_entry_price, recommendationData.short_term_stop_loss),
            potentialGain: (recommendationData.short_term_target_price || 0) - (recommendationData.short_term_entry_price || 0),
            recommendation: recommendationData.short_term_recommendation || 'N/A'
        },
        medium: {
            timeframe: recommendationData.medium_term_timeframe || '1W',
            signal: formatEnumValue(recommendationData.medium_term_signal),
            signalColor: getSignalColor(recommendationData.medium_term_signal),
            confidence: recommendationData.medium_term_score || 0,
            momentum: formatEnumValue(recommendationData.medium_market_momentum),
            trendDirection: formatEnumValue(recommendationData.medium_trend_direction),
            riskLevel: formatEnumValue(recommendationData.medium_term_risk_level),
            volatility: recommendationData.medium_market_volatility || 'N/A',
            liquidity: recommendationData.medium_liquidity || 'N/A',
            entryPrice: recommendationData.medium_term_entry_price || 0,
            targetPrice: recommendationData.medium_term_target_price || 0,
            targetPercent: calculatePercentage(recommendationData.medium_term_target_price, recommendationData.medium_term_entry_price),
            stopLoss: recommendationData.medium_term_stop_loss || 0,
            stopLossPercent: calculatePercentage(recommendationData.medium_term_stop_loss, recommendationData.medium_term_entry_price),
            riskReward: calculateRiskReward(recommendationData.medium_term_target_price, recommendationData.medium_term_entry_price, recommendationData.medium_term_stop_loss),
            potentialGain: (recommendationData.medium_term_target_price || 0) - (recommendationData.medium_term_entry_price || 0),
            recommendation: recommendationData.medium_term_recommendation || 'N/A'
        },
        long: {
            timeframe: recommendationData.long_term_timeframe || '1M',
            signal: formatEnumValue(recommendationData.long_term_signal),
            signalColor: getSignalColor(recommendationData.long_term_signal),
            confidence: recommendationData.long_term_score || 0,
            momentum: formatEnumValue(recommendationData.long_market_momentum),
            trendDirection: formatEnumValue(recommendationData.long_trend_direction),
            riskLevel: formatEnumValue(recommendationData.long_term_risk_level),
            volatility: recommendationData.long_market_volatility || 'N/A',
            liquidity: recommendationData.long_liquidity || 'N/A',
            entryPrice: recommendationData.long_term_entry_price || 0,
            targetPrice: recommendationData.long_term_target_price || 0,
            targetPercent: calculatePercentage(recommendationData.long_term_target_price, recommendationData.long_term_entry_price),
            stopLoss: recommendationData.long_term_stop_loss || 0,
            stopLossPercent: calculatePercentage(recommendationData.long_term_stop_loss, recommendationData.long_term_entry_price),
            riskReward: calculateRiskReward(recommendationData.long_term_target_price, recommendationData.long_term_entry_price, recommendationData.long_term_stop_loss),
            potentialGain: (recommendationData.long_term_target_price || 0) - (recommendationData.long_term_entry_price || 0),
            recommendation: recommendationData.long_term_recommendation || 'N/A'
        }
    } : null;

    const currentAnalysis = analysisData?.[activeTimeframe];
    console.log(currentAnalysis);
    

    if (!asset) return null;

    // Show loading state
    if (isLoading) {
        return (
            <Card className="mt-6 border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                <CardContent className="p-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                        <p className="text-stone-600 dark:text-stone-400">กำลังโหลดข้อมูลการวิเคราะห์...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Show error state if no data
    if (!recommendationData || !currentAnalysis) {
        return (
            <Card className="mt-6 border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                <CardContent className="p-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <p className="text-stone-600 dark:text-stone-400">ไม่พบข้อมูลการวิเคราะห์สำหรับสินทรัพย์นี้</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mt-6 border-stone-200 dark:border-stone-700 dark:bg-stone-800">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <span className="text-lg font-bold text-amber-700 dark:text-amber-400">
                                {asset.symbol?.charAt(0) || 'S'}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">
                                {asset.symbol || 'N/A'} - Investment Analysis
                            </h3>
                            <p className="text-sm text-stone-600 dark:text-stone-400">
                                Current Price: ${Number(recommendationData.current_price || asset.currentPrice || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                        {recommendationData.analysis_date
                            ? new Date(recommendationData.analysis_date).toLocaleDateString('th-TH')
                            : 'N/A'
                        }
                    </p>
                </div>
            </CardHeader>

            <CardContent>
                {/* Timeframe Tabs */}
                <Tabs value={activeTimeframe} onValueChange={setActiveTimeframe} className="mb-6">
                    <TabsList className="grid w-full grid-cols-3 max-w-md">
                        <TabsTrigger value="short">
                            <span className="hidden sm:inline">SHORT TERM </span>
                            <span>({analysisData?.short?.timeframe || '4H'})</span>
                        </TabsTrigger>
                        <TabsTrigger value="medium">
                            <span className="hidden sm:inline">MEDIUM TERM </span>
                            <span>({analysisData?.medium?.timeframe || '1W'})</span>
                        </TabsTrigger>
                        <TabsTrigger value="long">
                            <span className="hidden sm:inline">LONG TERM </span>
                            <span>({analysisData?.long?.timeframe || '1M'})</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Analysis Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Signal & Confidence */}
                    <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-900/50">
                        <CardHeader>
                            <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                                Signal & Confidence
                            </h4>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🔥</span>
                                    <span className={`text-xl font-bold ${currentAnalysis.signalColor}`}>
                                        {currentAnalysis.signal}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">
                                        Confidence Score: {currentAnalysis.confidence}/100
                                    </p>
                                </div>
                                <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-700">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-stone-600 dark:text-stone-400">Market Momentum:</span>
                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                            {currentAnalysis.momentum}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-stone-600 dark:text-stone-400">Trend Direction:</span>
                                        <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                                            {currentAnalysis.trendDirection}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Price Strategy */}
                    <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-900/50">
                        <CardHeader>
                            <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                                Price Strategy
                            </h4>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🎯</span>
                                    <div>
                                        <p className="text-xs text-stone-600 dark:text-stone-400">Entry Price</p>
                                        <p className="text-lg font-bold text-stone-800 dark:text-stone-100">
                                            ${Number(currentAnalysis.entryPrice).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🎯</span>
                                    <div>
                                        <p className="text-xs text-stone-600 dark:text-stone-400">Target Price</p>
                                        <p className="text-base font-bold text-green-600 dark:text-green-400">
                                            ${Number(currentAnalysis.targetPrice).toFixed(2)} (+{currentAnalysis.targetPercent}%)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🛑</span>
                                    <div>
                                        <p className="text-xs text-stone-600 dark:text-stone-400">Stop Loss</p>
                                        <p className="text-base font-bold text-red-600 dark:text-red-400">
                                            ${Number(currentAnalysis.stopLoss).toFixed(2)} ({currentAnalysis.stopLossPercent}%)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">📊</span>
                                    <div>
                                        <p className="text-xs text-stone-600 dark:text-stone-400">Risk/Reward: {currentAnalysis.riskReward}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">💰</span>
                                    <div>
                                        <p className="text-xs text-stone-600 dark:text-stone-400">Potential Gain</p>
                                        <p className="text-base font-bold text-amber-600 dark:text-amber-400">
                                            +${currentAnalysis.potentialGain.toFixed(2)} per coin
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Risk Analysis */}
                    <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-900/50">
                        <CardHeader>
                            <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                                Risk Analysis
                            </h4>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-stone-600 dark:text-stone-400">Risk Level:</span>
                                    <Badge variant={currentAnalysis.riskLevel === 'HIGH' ? 'destructive' : currentAnalysis.riskLevel === 'MEDIUM' ? 'default' : 'secondary'}>
                                        {currentAnalysis.riskLevel} 🔴
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-stone-600 dark:text-stone-400">Market Volatility:</span>
                                    <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                                        {currentAnalysis.volatility}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-stone-600 dark:text-stone-400">Liquidity:</span>
                                    <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                                        {currentAnalysis.liquidity}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommendation */}
                    <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-900/50">
                        <CardHeader>
                            <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                                Recommendation
                            </h4>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-2">
                                <span className="text-lg">✅</span>
                                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                                    {currentAnalysis.recommendation}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analyst Notes */}
                {recommendationData.analyst_notes && (
                    <Card className="mt-6 border-stone-200 dark:border-stone-700 dark:bg-stone-900/50">
                        <CardHeader>
                            <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                                Analyst Notes
                            </h4>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-2">
                                <span className="text-lg">📝</span>
                                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                                    {recommendationData.analyst_notes}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}
