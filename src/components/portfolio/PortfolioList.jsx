import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Wallet, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PortfolioList({ portfolios, onDelete }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [portfolioToDelete, setPortfolioToDelete] = useState(null);
    const navigate = useNavigate();
    
    const handleDeleteClick = (portfolio) => {
        setPortfolioToDelete(portfolio);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (portfolioToDelete) {
            onDelete(portfolioToDelete.id);
        }
        setIsDeleteDialogOpen(false);
        setPortfolioToDelete(null);
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setPortfolioToDelete(null);
    };
    if (portfolios.length === 0) {
        return (
            <Alert className="bg-stone-50 dark:bg-stone-900 border-stone-300 dark:border-stone-700">
                <AlertDescription className="text-stone-700 dark:text-stone-300">
                    ยังไม่มี Portfolio คลิกปุ่ม "เพิ่ม Portfolio" เพื่อเริ่มต้น
                </AlertDescription>
            </Alert>
        );
    }

    const handleCardClick = (portfolioId) => {
        navigate(`/portfolios/${portfolioId}`);
    };

    return (
        <div className="grid gap-4">
            {portfolios.map((portfolio) => (
                <Card key={portfolio.id} className="shadow-md hover:shadow-lg transition-shadow border-stone-200 dark:border-stone-700 dark:bg-stone-800" onClick={() => handleCardClick(portfolio.id)}>
                    <CardContent className="p-4 md:p-6">
                        {/* Mobile Layout */}
                        <div className="lg:hidden space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                                        <Wallet className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-stone-800 dark:text-stone-100">{portfolio.name}</h3><span className="text-sm dark:text-stone-300">{portfolio.asset_name}</span>
                                        {/* <p className="text-sm text-stone-600">{portfolio.description}</p> */}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(portfolio);
                                    }}
                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-stone-600 dark:text-stone-400">จำนวน</p>
                                    <p className="font-semibold text-stone-800 dark:text-stone-100">{portfolio.total_invested.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-stone-600 dark:text-stone-400">มูลค่ารวม</p>
                                    <p className="font-bold text-stone-800 dark:text-stone-100">
                                        ${(portfolio.total_invested * portfolio.total_invested).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-stone-600 dark:text-stone-400">การเปลี่ยนแปลง</p>
                                    <div className={`flex items-center gap-1 ${portfolio.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {portfolio.change >= 0 ? (
                                            <TrendingUp className="h-4 w-4" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4" />
                                        )}
                                        <span className="font-semibold">{portfolio.change > 0 ? '+' : ''}{portfolio.change}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden lg:flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                                    <Wallet className="h-6 w-6 text-amber-700 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">{portfolio.name}</h3><span className="text-sm dark:text-stone-300">{portfolio.asset_name}</span>
                                    {/* <p className="text-sm text-stone-600">{portfolio.description}</p> */}
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-sm text-stone-600 dark:text-stone-400">จำนวน</p>
                                    <p className="text-lg font-semibold text-stone-800 dark:text-stone-100">{portfolio.total_invested.toLocaleString()}</p>
                                </div>

                                {/* <div className="text-right">
                                    <p className="text-sm text-stone-600">ราคา</p>
                                    <p className="text-lg font-semibold text-stone-800">${portfolio.price.toLocaleString()}</p>
                                </div> */}

                                <div className="text-right">
                                    <p className="text-sm text-stone-600 dark:text-stone-400">มูลค่ารวม</p>
                                    <p className="text-lg font-bold text-stone-800 dark:text-stone-100">
                                        {(portfolio.current_value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-stone-600 dark:text-stone-400">การเปลี่ยนแปลง</p>
                                    <div className={`flex items-center gap-1 ${portfolio.profit_loss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {portfolio.profit_loss >= 0 ? (
                                            <TrendingUp className="h-4 w-4" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4" />
                                        )}
                                        <span className="font-semibold">{portfolio.profit_loss > 0 ? '+' : ''}{portfolio.profit_loss}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(portfolio);
                                    }}
                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-stone-800 dark:text-stone-100">ยืนยันการลบ Portfolio</DialogTitle>
                        <DialogDescription className="text-stone-600 dark:text-stone-400">
                            คุณต้องการลบ Portfolio "{portfolioToDelete?.name}" ใช่หรือไม่?
                            การดำเนินการนี้ไม่สามารถยกเลิกได้
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={handleCancelDelete}
                            className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white ml-1"
                        >
                            ตกลง ลบเลย
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
