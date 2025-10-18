import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import PortfolioList from '../components/portfolio/PortfolioList';
import AddPortfolioModal from '../components/portfolio/AddPortfolioModal';
import { Card, CardContent } from '@/components/ui/card';

export default function PortfoliosPage() {
    const [portfolios, setPortfolios] = useState([
        { id: 1, name: 'Bitcoin', asset: '01', total_invested: 0.5, change: 2.5 },
        { id: 2, name: 'Ethereum', asset: '02', total_invested: 5, change: -1.2 },
        { id: 3, name: 'Cardano', asset: '03', total_invested: 1000, change: 5.8 }
    ]);

    const handleAddPortfolio = (newPortfolio) => {
        setPortfolios([...portfolios, newPortfolio]);
    };

    const handleDeletePortfolio = (id) => {
        // if (confirm('คุณต้องการลบ Portfolio นี้ใช่หรือไม่?')) {
        setPortfolios(portfolios.filter(p => p.id !== id));
        // }
    };

    const calculateTotal = () => {
        return portfolios.reduce((sum, p) => sum + p.total_invested, 0);
    };

    return (
        <MainLayout activeMenu="portfolios">
            {/* Header - ซ่อนบนมือถือเพราะมีใน mobile header แล้ว */}
            <div className="hidden lg:flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">My Portfolios</h2>
                    <p className="text-stone-600 dark:text-stone-400 mt-1">จัดการ crypto portfolio ของคุณ</p>
                </div>
                <AddPortfolioModal onAdd={handleAddPortfolio} />
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden flex justify-between items-center mb-4">
                <p className="text-stone-600 dark:text-stone-400 text-sm">จัดการ crypto portfolio ของคุณ</p>
                <AddPortfolioModal onAdd={handleAddPortfolio} />
            </div>

            {/* Total Value Card */}
            <Card className="mb-4 md:mb-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white border-none shadow-xl">
                <CardContent className="pt-4 md:pt-6">
                    <p className="text-amber-100 text-xs md:text-sm font-medium">มูลค่ารวม Portfolio</p>
                    <p className="text-2xl md:text-4xl font-bold mt-1 md:mt-2">
                        ${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm">USD</span>
                    </p>
                </CardContent>
            </Card>

            {/* Portfolio List */}
            <PortfolioList portfolios={portfolios} onDelete={handleDeletePortfolio} />
        </MainLayout>
    );
}