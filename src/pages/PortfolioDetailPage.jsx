import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AddTransactionModal from '../components/portfolio/AddTransactionModal';
import HoldingsTable from '../components/portfolio/HoldingsTable';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { showToast } from '../components/share/toast';

export default function PortfolioDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('holdings');

    const handleAddTransaction = (transaction) => {
        // คำนวณค่าต่างๆ
        const totalCost = (transaction.price * transaction.quantity) + transaction.commission;
        const currentValue = transaction.price * transaction.quantity; // ในการใช้งานจริงควรดึงราคาปัจจุบันจาก API
        const unrealizedGain = currentValue - totalCost;

        // เช็คว่ามี holding อยู่แล้วหรือไม่
        const existingIndex = holdings.findIndex(h => h.symbol === transaction.symbol);

        if (existingIndex >= 0) {
            // ถ้ามีอยู่แล้ว อัพเดทข้อมูล
            const updated = [...holdings];
            const existing = updated[existingIndex];

            if (transaction.side === 'buy') {
                const newQuantity = existing.quantity + transaction.quantity;
                const newInvested = existing.invested + totalCost;
                updated[existingIndex] = {
                    ...existing,
                    quantity: newQuantity,
                    avgPrice: newInvested / newQuantity,
                    invested: newInvested,
                    unrealizedGain: (transaction.price * newQuantity) - newInvested,
                    totalGain: (transaction.price * newQuantity) - newInvested
                };
            } else {
                // sell
                updated[existingIndex] = {
                    ...existing,
                    quantity: existing.quantity - transaction.quantity
                };
            }

            setHoldings(updated);
        } else {
            // ถ้ายังไม่มี เพิ่มใหม่
            const newHolding = {
                id: Date.now(),
                symbol: transaction.symbol,
                name: transaction.symbol,
                allocation: 0, // คำนวณใหม่ภายหลัง
                quantity: transaction.quantity,
                avgPrice: transaction.price,
                invested: totalCost,
                unrealizedGain: unrealizedGain,
                dailyGain: 0,
                totalDividend: 0,
                totalGain: unrealizedGain
            };

            setHoldings([...holdings, newHolding]);
        }

        showToast.success('เพิ่ม Transaction สำเร็จ!');
    };

    // Mock data - ในการใช้งานจริงจะดึงจาก API ตาม id
    const portfolio = {
        id: id,
        name: 'Bitcoin',
        symbol: 'BTC',
        value: 22500.46,
        cash: -4.39,
        unrealizedGain: 2340.46,
        unrealizedGainPercent: 10.52,
        lastDayGain: -255.11,
        lastDayGainPercent: -2.24,
        realizedGain: 0.00,
        totalDividend: 0.00,
        totalGain: 2340.46,
        totalGainPercent: 10.52,
        annualizedYield: 879.29
    };

    const [holdings, setHoldings] = useState([
        {
            id: 1,
            symbol: 'BTC',
            name: 'Bitcoin',
            allocation: 100.00,
            quantity: 0.5,
            avgPrice: 45000,
            invested: 22500,
            unrealizedGain: 2340.46,
            dailyGain: -255.11,
            totalDividend: 0.00,
            totalGain: 2340.46
        }
    ]);

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'holdings', label: 'Holdings' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'analysis', label: 'Analysis' }
    ];

    return (
        <MainLayout activeMenu="portfolios">
            <div className="max-w-7xl mx-auto">
                {/* Back Button - Mobile */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/portfolios')}
                    className="mb-4 lg:hidden text-stone-700 dark:text-stone-300"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    กลับ
                </Button>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">
                                My portfolio {portfolio.name}
                            </h1>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">you success ✓</p>
                    </div>
                    <AddTransactionModal portfolioName={portfolio.name} portfolioSymbol={portfolio.symbol} onAdd={handleAddTransaction} />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Portfolio Value */}
                    <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">Portfolio value</p>
                            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                                ${portfolio.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                <span className="text-xs text-stone-500 dark:text-stone-400 font-normal ml-1">USD</span>
                            </p>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">Cash {portfolio.cash.toFixed(2)}</p>
                        </CardContent>
                    </Card>

                    {/* Unrealized Gain */}
                    <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">Unrealized gain</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    +${portfolio.unrealizedGain.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                                <span className="text-sm text-green-600 dark:text-green-400 font-semibold">+{portfolio.unrealizedGainPercent}%</span>
                            </div>
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                Last day {portfolio.lastDayGain.toFixed(2)} {portfolio.lastDayGainPercent}%
                            </p>
                        </CardContent>
                    </Card>

                    {/* Realized Gain */}
                    <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">Realized gain</p>
                            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                                ${portfolio.realizedGain.toFixed(2)}
                                <span className="text-xs text-stone-500 dark:text-stone-400 font-normal ml-1">USD</span>
                            </p>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                                Total dividends {portfolio.totalDividend.toFixed(2)} USD
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Gain */}
                    <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">Total gain</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    +${portfolio.totalGain.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                                <span className="text-sm text-green-600 dark:text-green-400 font-semibold">+{portfolio.totalGainPercent}%</span>
                            </div>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                                Annualized yield {portfolio.annualizedYield}%
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="border-b border-stone-200 dark:border-stone-700 mb-6 overflow-x-auto">
                    <div className="flex gap-6 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-3 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-stone-800 dark:text-stone-100 border-b-2 border-amber-600 dark:border-amber-500'
                                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'overview' && (
                        <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                            <CardContent className="p-6">
                                <p className="text-stone-600 dark:text-stone-400">Overview content coming soon...</p>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'holdings' && (
                        <div>
                            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">Total holdings</h2>
                            <HoldingsTable holdings={holdings} />
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                            <CardContent className="p-6">
                                <p className="text-stone-600 dark:text-stone-400">Transactions content coming soon...</p>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'analysis' && (
                        <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                            <CardContent className="p-6">
                                <p className="text-stone-600 dark:text-stone-400">Analysis content coming soon...</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}