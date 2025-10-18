import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

export default function MainLayout({ children, activeMenu }) {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const handleMenuChange = (menu) => {
        navigate(`/${menu}`);
    };

    const handleLogout = () => {
        // if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
        // TODO: เรียก logout จาก AuthContext
        logout();
        navigate('/login');
        // }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 dark:from-stone-950 dark:to-stone-900">
            <Sidebar
                activeMenu={activeMenu}
                onMenuChange={handleMenuChange}
                onLogout={handleLogout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-4 sticky top-0 z-30 shadow-sm">
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
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}