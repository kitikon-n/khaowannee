import React from 'react';
import { Wallet, Newspaper, LogOut, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Sidebar({ activeMenu, onMenuChange, onLogout, isOpen, onClose }) {
    return (
        <>
            {/* Overlay สำหรับมือถือ */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">Crypto App</h1>
                        <p className="text-sm text-stone-600 dark:text-stone-400">Portfolio Manager</p>
                    </div>
                    {/* ปุ่มปิด Sidebar บนมือถือ */}
                    <button
                        onClick={onClose}
                        className="lg:hidden text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="mt-6 flex flex-col h-[calc(100vh-120px)]">
                    <div className="flex-1">
                        <button
                            onClick={() => {
                                onMenuChange('portfolios');
                                onClose();
                            }}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${activeMenu === 'portfolios'
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-r-4 border-amber-600 dark:border-amber-500'
                                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                                }`}
                        >
                            <Wallet className="h-5 w-5" />
                            <span className="font-medium">Portfolios</span>
                        </button>

                        <button
                            onClick={() => {
                                onMenuChange('news');
                                onClose();
                            }}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${activeMenu === 'news'
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-r-4 border-amber-600 dark:border-amber-500'
                                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                                }`}
                        >
                            <Newspaper className="h-5 w-5" />
                            <span className="font-medium">News</span>
                        </button>
                    </div>

                    <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
                        <div className="px-6 py-2 flex items-center justify-between">
                            <span className="text-sm text-stone-600 dark:text-stone-400">Theme</span>
                            <ThemeToggle />
                        </div>

                        <button
                            onClick={() => {
                                onLogout();
                                onClose();
                            }}
                            className="w-full flex items-center gap-3 px-6 py-4 text-left text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
}