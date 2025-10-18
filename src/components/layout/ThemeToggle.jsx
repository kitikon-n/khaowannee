import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            title={theme === 'dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </Button>
    );
}
