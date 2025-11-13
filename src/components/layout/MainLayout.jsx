import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '../../contexts/AuthContext';

export default function MainLayout({ children, activeMenu }) {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const { logout } = useAuth();

    const handleMenuChange = (menu) => {
        navigate(`/${menu}`);
    };

    const handleLogoutClick = () => {
        setIsLogoutDialogOpen(true);
    };

    const handleConfirmLogout = () => {
        logout();
        setIsLogoutDialogOpen(false);
        navigate('/login');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-stone-50 to-amber-50 dark:from-stone-950 dark:to-stone-900">
            <Sidebar
                activeMenu={activeMenu}
                onMenuChange={handleMenuChange}
                onLogout={handleLogoutClick}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-4 flex-shrink-0 z-30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-stone-700 dark:text-stone-300"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                            {activeMenu === 'portfolios' ? 'My Portfolios' : 'Crypto News'}
                        </h2>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>

            {/* Logout Confirmation Dialog */}
            <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <DialogContent className="bg-white dark:bg-stone-900">
                    <DialogHeader>
                        <DialogTitle className="text-stone-800 dark:text-stone-100">
                            ยืนยันการออกจากระบบ
                        </DialogTitle>
                        <DialogDescription className="text-stone-600 dark:text-stone-400">
                            คุณต้องการออกจากระบบใช่หรือไม่?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsLogoutDialogOpen(false)}
                            className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            onClick={handleConfirmLogout}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            ออกจากระบบ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}