import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import PortfolioList from '../components/portfolio/PortfolioList';
import AddPortfolioModal from '../components/portfolio/AddPortfolioModal';
import { Card, CardContent } from '@/components/ui/card';
import { portfolioService } from '@/services/portfolioService';
import { showToast } from '@/components/share/toast';

export default function PortfoliosPage() {
    const [portfolios, setPortfolios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load portfolios on component mount
    useEffect(() => {
        loadPortfolios();
    }, []);

    const loadPortfolios = async () => {
        try {
            const result = await portfolioService.getPortfolios();
            if (result.success) {
                setPortfolios(result.data);
            }
        } catch (error) {
            showToast.error('ไม่สามารถโหลดข้อมูล Portfolio ได้');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPortfolio = (newPortfolio) => {
        // Add new portfolio to the list
        setPortfolios([...portfolios, newPortfolio]);
    };

    const handleDeletePortfolio = async (id) => {
        try {
            const result = await portfolioService.deletePortfolio(id);

            if (result.success) {
                // Remove portfolio from the list
                setPortfolios(portfolios.filter(p => p.id !== id));
                showToast.success('ลบ Portfolio สำเร็จ!');
            }
        } catch (error) {
            showToast.error(error.message || 'ไม่สามารถลบ Portfolio ได้');
        }
    };

    const calculateTotal = () => {        
        return portfolios.reduce((sum, p) => sum + Number(p.total_invested), 0);
    };

    return (
        <MainLayout activeMenu="portfolios">
            <div className="h-full overflow-y-auto scroll-smooth p-4 md:p-6 lg:p-8">
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

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                            <p className="mt-4 text-stone-600 dark:text-stone-400">กำลังโหลดข้อมูล...</p>
                        </div>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </MainLayout>
    );
}