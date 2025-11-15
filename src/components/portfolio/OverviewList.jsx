import React, { useState, useEffect } from 'react';
import AssetAnalysis from './AssetAnalysis';
import { portfolioService } from '@/services/portfolioService';
import { showToast } from '../share/toast';

export default function OverviewList({ overview }) {
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [recommendationData, setRecommendationData] = useState(null);
    const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
    // Hardcoded data for now
    const hardcodedAssets = [];

    const assets = overview && overview.length > 0 ? overview : hardcodedAssets;

    // Auto-select first asset when assets are loaded
    useEffect(() => {
        if (assets.length > 0 && !selectedAsset) {
            handleAssetClick(assets[0]);
        }
    }, [assets]);

    const handleAssetClick = async (asset) => {
        // Toggle selection
        if (selectedAsset?.symbol === asset.symbol) {
            setSelectedAsset(null);
            setRecommendationData(null);
            return;
        }

        setSelectedAsset(asset);

        // Load recommendation data if asset has cryptocurrency_id
        if (asset.cryptocurrency_id) {
            setIsLoadingRecommendation(true);
            try {
                const result = await portfolioService.getInvestmentRecommendation(asset.cryptocurrency_id);
                if (result.success) {
                    setRecommendationData(result.data);
                }
            } catch (error) {
                showToast.error('ไม่สามารถโหลดข้อมูลคำแนะนำการลงทุนได้');
                setRecommendationData(null);
            } finally {
                setIsLoadingRecommendation(false);
            }
        }
    };

    return (
        <div>
            {/* Horizontal Scrollable Asset Cards */}
            <div className="overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                <div className="flex gap-3 min-w-max">
                    {assets.map((asset, index) => (
                        <div
                            key={index}
                            onClick={() => handleAssetClick(asset)}
                            className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                                selectedAsset?.symbol === asset.symbol
                                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md'
                                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/80'
                            }`}
                        >
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-base font-bold text-amber-700 dark:text-amber-400">
                                    {asset.symbol.charAt(0)}
                                </span>
                            </div>

                            {/* Symbol */}
                            <p className="font-bold text-stone-800 dark:text-stone-100 min-w-[60px]">
                                {asset.symbol}
                            </p>

                            {/* Profit/Loss */}
                            <div className="flex items-center gap-1">
                                <span className={`text-base font-bold ${asset.unrealizedGain > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {asset.unrealizedGain < 0 ? '↓' : '↑'}
                                </span>
                                <span className={`text-base font-bold ${asset.unrealizedGain > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    ${Math.abs(Number(asset.unrealizedGain)).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Asset Analysis Section */}
            {selectedAsset && (
                <AssetAnalysis
                    asset={selectedAsset}
                    recommendationData={recommendationData}
                    isLoading={isLoadingRecommendation}
                />
            )}
        </div>
    );
}
