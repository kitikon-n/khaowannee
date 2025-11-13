import React from 'react';

export default function OverviewList({ overview }) {
    // Hardcoded data for now
    const hardcodedAssets = [
        {
            symbol: 'XRP',
            currentPrice: 868.80,
            quantity: 345.661734,
            totalInvested: 171.51,
            profitLoss: 171.51,
            profitLossType: 'profit' // profit or loss
        },
        {
            symbol: 'SHIB',
            currentPrice: 80.95,
            quantity: 5000283,
            totalInvested: 8.43,
            profitLoss: 8.43,
            profitLossType: 'loss'
        },
        {
            symbol: 'DOGE',
            currentPrice: 54.19,
            quantity: 204.9,
            totalInvested: 8.08,
            profitLoss: 8.08,
            profitLossType: 'loss'
        },
        {
            symbol: 'VTHO',
            currentPrice: 31.59,
            quantity: 6422,
            totalInvested: 7.92,
            profitLoss: 7.92,
            profitLossType: 'loss'
        },
        {
            symbol: 'LCX',
            currentPrice: 27.12,
            quantity: 136.2,
            totalInvested: 17.23,
            profitLoss: 17.23,
            profitLossType: 'loss'
        },
        {
            symbol: 'XLM',
            currentPrice: 17.56,
            quantity: 51.643945,
            totalInvested: 7.72,
            profitLoss: 7.72,
            profitLossType: 'loss'
        },
        {
            symbol: 'PEPE',
            currentPrice: 10.23,
            quantity: 1000209,
            totalInvested: 10.13,
            profitLoss: 10.13,
            profitLossType: 'loss'
        },
        {
            symbol: 'FLOKI',
            currentPrice: 9.89,
            quantity: 100161,
            totalInvested: 12.78,
            profitLoss: 12.78,
            profitLossType: 'loss'
        }
    ];

    const assets = overview && overview.length > 0 ? overview : hardcodedAssets;

    return (
        <div className="space-y-0">
            {assets.map((asset, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                >
                    {/* Left Side: Icon, Symbol, and Price */}
                    <div className="flex items-center gap-3 flex-1">
                        {/* Icon with first letter */}
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <span className="text-lg font-bold text-amber-700 dark:text-amber-400">
                                {asset.symbol.charAt(0)}
                            </span>
                        </div>

                        {/* Symbol and Price */}
                        <div>
                            <p className="font-bold text-stone-800 dark:text-stone-100">
                                {asset.symbol}
                            </p>
                            <p className="text-sm text-stone-600 dark:text-stone-400">
                                ${asset.currentPrice.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Current Price and Total */}
                    <div className="text-right">
                        <p className="font-bold text-stone-800 dark:text-stone-100">
                            {asset.quantity.toLocaleString('en-US', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 6
                            })}
                        </p>
                        <div className="flex items-center gap-1 justify-end">
                            <span className={`text-sm ${asset.unrealizedGain > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {asset.unrealizedGain < 0 ? '↓' : '↑'}
                            </span>
                            <span className={`text-sm ${asset.unrealizedGain > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                ${Number(asset.unrealizedGain).toFixed(2)}
                            </span>
                            <span className="text-xs text-stone-500 dark:text-stone-400">All</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
