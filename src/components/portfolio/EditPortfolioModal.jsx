import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select';
import { showToast } from '../share/toast';
import { portfolioValidation, validatePortfolioForm } from './validation';
import { portfolioService } from '@/services/portfolioService';

export default function EditPortfolioModal({ isOpen, onClose, portfolio, onUpdate }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        asset: '',
        description: ''
    });
    const [errors, setErrors] = useState({});

    // Initialize form data when portfolio changes
    useEffect(() => {
        if (portfolio) {
            setFormData({
                name: portfolio.name || '',
                asset: portfolio.asset || '',
                description: portfolio.description || ''
            });
            setErrors({});
        }
    }, [portfolio]);

    const assetGroups = {
        asset: [
            { value: '01', text: 'Forex' },
            { value: '02', text: 'Crypto' },
            { value: '03', text: 'Thai stock' }
        ]
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (fieldName) => {
        // Validate on blur
        let error = '';
        if (fieldName === 'name') {
            error = portfolioValidation.portfolioName(formData.name);
        } else if (fieldName === 'asset') {
            error = portfolioValidation.asset(formData.asset);
        } else if (fieldName === 'description') {
            error = portfolioValidation.description(formData.description);
        }

        if (error) {
            setErrors(prev => ({ ...prev, [fieldName]: error }));
        }
    };

    const handleSubmit = async () => {
        // Validate all fields
        const validationErrors = validatePortfolioForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            const firstError = Object.values(validationErrors)[0];
            showToast.error(firstError);
            return;
        }

        setIsLoading(true);

        try {
            // Call API to update portfolio
            const result = await portfolioService.updatePortfolio(portfolio.id, {
                name: formData.name,
                description: formData.description,
                asset: formData.asset
            });

            if (result.success) {
                showToast.success('อัพเดท Portfolio สำเร็จ!');
                onUpdate(result.data);
                onClose();
            }
        } catch (error) {
            showToast.error(error.message || 'เกิดข้อผิดพลาดในการอัพเดท Portfolio');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-stone-900 max-w-[95vw] sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl text-stone-800 dark:text-stone-100">
                        แก้ไข Portfolio
                    </DialogTitle>
                    <DialogDescription className="text-stone-600 dark:text-stone-400">
                        แก้ไขข้อมูล Portfolio ของคุณ
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Portfolio name</label>
                        <Input
                            name="name"
                            placeholder="My portfolio"
                            value={formData.name}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('name')}
                            className={`mt-1 dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700 ${errors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Asset</label>
                        <Select
                            value={formData.asset}
                            disabled={true}
                        >
                            <SelectTrigger className="bg-stone-100 dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700 w-full opacity-60 cursor-not-allowed">
                                <SelectValue placeholder="Select Asset" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] dark:bg-stone-800 dark:border-stone-700">
                                <SelectGroup>
                                    {assetGroups.asset.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.text}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {/* <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">ประเภท Asset ไม่สามารถเปลี่ยนแปลงได้หลังสร้าง Portfolio</p> */}
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Description</label>
                            <span className="text-xs text-gray-500 dark:text-stone-400">
                                {formData.description.length}/1200
                            </span>
                        </div>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => {
                                if (e.target.value.length <= 1200) {
                                    setFormData({ ...formData, description: e.target.value });
                                    if (errors.description) {
                                        setErrors(prev => ({ ...prev, description: '' }));
                                    }
                                }
                            }}
                            onBlur={() => handleBlur('description')}
                            className={`resize-none bg-white dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700 ${errors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                            placeholder="Some comments"
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white disabled:opacity-50"
                        >
                            {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
