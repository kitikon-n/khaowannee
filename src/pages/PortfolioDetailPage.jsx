import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AddTransactionModal from '../components/portfolio/AddTransactionModal';
import EditPortfolioModal from '../components/portfolio/EditPortfolioModal';
import EditTransactionModal from '../components/portfolio/EditTransactionModal';
import DeleteConfirmDialog from '../components/share/DeleteConfirmDialog';
import HoldingsTable from '../components/portfolio/HoldingsTable';
import TransactionsTable from '../components/portfolio/TransactionsTable';
import OverviewList from '../components/portfolio/OverviewList';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowLeft, Pencil } from 'lucide-react';
import { showToast } from '../components/share/toast';
import { portfolioService } from '@/services/portfolioService';

export default function PortfolioDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [portfolioData, setPortfolioData] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);

    // Load portfolio detail on mount
    useEffect(() => {
        loadPortfolioDetail();
    }, [id]);

    const loadPortfolioDetail = async () => {
        try {
            const result = await portfolioService.getPortfolioDetail(id);
            if (result.success) {
                console.log(result.data);

                setPortfolioData(result.data);
            }
        } catch (error) {
            showToast.error('ไม่สามารถโหลดข้อมูล Portfolio ได้');
            navigate('/portfolios');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTransaction = async (transaction) => {
        // Transaction already created by AddTransactionModal
        // Just reload portfolio data to show updated information
        await loadPortfolioDetail();
    };

    const handleUpdatePortfolio = (updatedData) => {
        // Update portfolio data with new data from API
        setPortfolioData(updatedData);
    };

    const handleEditTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setIsEditTransactionModalOpen(true);
    };

    const handleUpdateTransaction = async (updatedTransaction) => {
        // Transaction already updated by EditTransactionModal
        // Just reload portfolio data to show updated information
        await loadPortfolioDetail();
    };

    const handleDeleteTransaction = (transaction) => {
        setTransactionToDelete(transaction);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteTransaction = async () => {
        if (!transactionToDelete) return;

        try {
            const result = await portfolioService.deleteTransaction(transactionToDelete.id);
            if (result.success) {
                showToast.success('ลบ Transaction สำเร็จ!');
                await loadPortfolioDetail();
            }
        } catch (error) {
            showToast.error(error.message || 'เกิดข้อผิดพลาดในการลบ Transaction');
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <MainLayout activeMenu="portfolios">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                        <p className="mt-4 text-stone-600 dark:text-stone-400">กำลังโหลดข้อมูล...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // If no data, show error
    if (!portfolioData) {
        return (
            <MainLayout activeMenu="portfolios">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-stone-600 dark:text-stone-400">ไม่พบข้อมูล Portfolio</p>
                        <Button onClick={() => navigate('/portfolios')} className="mt-4">
                            กลับไปหน้า Portfolios
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Extract data from API response
    const holdings = portfolioData.portfolio_holdings || [];
    const transactions = portfolioData.transactions || [];
    const analysis = portfolioData.analysis || [];
    const overview = portfolioData.overview || [];

    // Calculate Profit/Loss from overview data
    const calculateProfitLossFromOverview = () => {
        if (overview.length === 0) {
            return {
                totalInvested: 0,
                currentValue: 0,
                profitLoss: 0,
                profitLossPercentage: 0
            };
        }

        const totalInvested = overview.reduce((sum, asset) => sum + (asset.total_invested || 0), 0);
        const currentValue = overview.reduce((sum, asset) => sum + (asset.current_value || 0), 0);
        const profitLoss = overview.reduce((sum, asset) => sum + (asset.unrealizedGain || 0), 0);
        const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

        return {
            totalInvested,
            currentValue,
            profitLoss,
            profitLossPercentage
        };
    };

    const portfolioStats = calculateProfitLossFromOverview();

    const portfolio = {
        id: portfolioData.id,
        name: portfolioData.name,
        description: portfolioData.description,
        asset: portfolioData.asset,
        assetName: portfolioData.asset_name,
        value: portfolioStats.currentValue,
        totalInvested: portfolioStats.totalInvested,
        profitLoss: portfolioStats.profitLoss,
        profitLossPercentage: portfolioStats.profitLossPercentage,
        createdDate: portfolioData.created_date
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'holdings', label: 'Holdings' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'analysis', label: 'Analysis' }
    ];

    return (
        <MainLayout activeMenu="portfolios">
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 max-h-screen overflow-y-auto scrollbar-hide">
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
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">
                                {portfolio.name}
                            </h1>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsEditModalOpen(true)}
                                className="h-8 w-8 text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                            {portfolio.assetName} • {portfolio.description}
                        </p>
                    </div>
                    <AddTransactionModal portfolioId={id} portfolioName={portfolio.name} portfolioAsset={portfolio.asset} onAdd={handleAddTransaction} />
                </div>

                {/* Edit Portfolio Modal */}
                <EditPortfolioModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    portfolio={portfolio}
                    onUpdate={handleUpdatePortfolio}
                />

                {/* Edit Transaction Modal */}
                <EditTransactionModal
                    isOpen={isEditTransactionModalOpen}
                    onClose={() => setIsEditTransactionModalOpen(false)}
                    transaction={selectedTransaction}
                    onUpdate={handleUpdateTransaction}
                />

                {/* Delete Confirm Dialog */}
                <DeleteConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={confirmDeleteTransaction}
                    title="ลบ Transaction"
                    description={transactionToDelete ? `คุณต้องการลบ transaction นี้ใช่หรือไม่?\n${transactionToDelete.cryptocurrency_symbol} - ${transactionToDelete.transaction_type} ${transactionToDelete.quantity}` : ''}
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {/* Portfolio Value */}
                    {/* <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">Portfolio value</p>
                            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                                ${portfolio.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                <span className="text-xs text-stone-500 dark:text-stone-400 font-normal ml-1">USD</span>
                            </p>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                                Total Invested: ${portfolio.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                        </CardContent>
                    </Card> */}

                    {/* Profit/Loss */}
                    <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">Profit/Loss</p>
                            <div className="flex items-baseline gap-2">
                                <p className={`text-2xl font-bold ${portfolio.profitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {portfolio.profitLoss >= 0 ? '+' : ''}${portfolio.profitLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                                <span className={`text-sm font-semibold ${portfolio.profitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {portfolio.profitLoss >= 0 ? '+' : ''}{Number(portfolio.profitLossPercentage).toFixed(2)}%
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Holdings Count */}
                    <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">Holdings</p>
                            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                                {holdings.length}
                                <span className="text-xs text-stone-500 dark:text-stone-400 font-normal ml-1">assets</span>
                            </p>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                                Active positions
                            </p>
                        </CardContent>
                    </Card>

                    {/* Transactions Count */}
                    <Card className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">Transactions</p>
                            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                                {transactions.length}
                                <span className="text-xs text-stone-500 dark:text-stone-400 font-normal ml-1">total</span>
                            </p>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                                All-time trades
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
                        <OverviewList overview={overview} />
                    )}

                    {activeTab === 'holdings' && (
                        <div>
                            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">Total holdings</h2>
                            <HoldingsTable holdings={holdings} />
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div>
                            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">Transaction history</h2>
                            <TransactionsTable
                                transactions={transactions}
                                onEdit={handleEditTransaction}
                                onDelete={handleDeleteTransaction}
                            />
                        </div>
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