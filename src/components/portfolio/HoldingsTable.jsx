import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function HoldingsTable({ holdings }) {
    return (
        <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-stone-200 dark:border-stone-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Symbol</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Allocation</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Qty</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Avg price</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Invested</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Unrealized gain</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Daily gain</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Total dividend</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Total gain</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings.map((holding) => (
                            <tr key={holding.id} className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{holding.symbol.slice(0, 1)}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-stone-800 dark:text-stone-100">{holding.symbol}</p>
                                            <p className="text-xs text-stone-600 dark:text-stone-400">{holding.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-right py-4 px-4 text-stone-800 dark:text-stone-100">{holding.allocation}%</td>
                                <td className="text-right py-4 px-4 text-stone-800 dark:text-stone-100">{holding.quantity.toLocaleString()}</td>
                                <td className="text-right py-4 px-4 text-stone-800 dark:text-stone-100">${holding.avgPrice.toFixed(5)}</td>
                                <td className="text-right py-4 px-4 text-stone-800 dark:text-stone-100">${holding.invested.toFixed(2)}</td>
                                <td className={`text-right py-4 px-4 font-semibold ${holding.unrealizedGain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    ${holding.unrealizedGain >= 0 ? '+' : ''}{holding.unrealizedGain.toFixed(2)}
                                </td>
                                <td className={`text-right py-4 px-4 font-semibold ${holding.dailyGain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    ${holding.dailyGain >= 0 ? '+' : ''}{holding.dailyGain.toFixed(2)}
                                </td>
                                <td className="text-right py-4 px-4 text-stone-800 dark:text-stone-100">${holding.totalDividend.toFixed(2)}</td>
                                <td className={`text-right py-4 px-4 font-bold ${holding.totalGain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    ${holding.totalGain >= 0 ? '+' : ''}{holding.totalGain.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
                {holdings.map((holding) => (
                    <Card key={holding.id} className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{holding.symbol.slice(0, 1)}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-800 dark:text-stone-100">{holding.symbol}</p>
                                        <p className="text-xs text-stone-600 dark:text-stone-400">{holding.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-stone-600 dark:text-stone-400">Allocation</p>
                                    <p className="font-semibold text-stone-800 dark:text-stone-100">{holding.allocation}%</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-stone-600 dark:text-stone-400">จำนวน</p>
                                    <p className="font-semibold text-stone-800 dark:text-stone-100">{holding.quantity.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-stone-600 dark:text-stone-400">ราคาเฉลี่ย</p>
                                    <p className="font-semibold text-stone-800 dark:text-stone-100">${holding.avgPrice.toFixed(5)}</p>
                                </div>
                                <div>
                                    <p className="text-stone-600 dark:text-stone-400">ลงทุน</p>
                                    <p className="font-semibold text-stone-800 dark:text-stone-100">${holding.invested.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-stone-600 dark:text-stone-400">กำไร/ขาดทุน</p>
                                    <p className={`font-bold ${holding.totalGain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        ${holding.totalGain >= 0 ? '+' : ''}{holding.totalGain.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}