import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, title, description }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-stone-900 max-w-[95vw] sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <DialogTitle className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                            {title || 'ยืนยันการลบ'}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-stone-600 dark:text-stone-400 pt-2">
                        {description || 'คุณแน่ใจหรือไม่ที่จะลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้'}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
                    >
                        ลบ
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
