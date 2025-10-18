import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { showToast } from '../share/toast';
import { portfolioValidation, validatePortfolioForm } from './validation';

export default function AddPortfolioModal({ onAdd }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        asset: '',    // ค่า default
        total_invested: '',    // หรือ 2 ตามที่ต้องการ
        description: ''     // string ว่าง
    });
    const [errors, setErrors] = useState({});

    // Reset form and errors when modal closes
    useEffect(() => {
        if (!isOpen) {
            // Use setTimeout to ensure modal animation completes
            const timer = setTimeout(() => {
                setFormData({ name: '', asset: '', total_invested: '', description: '' });
                setErrors({});
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const assetGroups = {
        asset: [
            { value: '01', text: 'Forex' },
            { value: '02', text: 'Crypto' },
            { value: '03', text: 'Thai stock' }
        ]
    }

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
        } else if (fieldName === 'total_invested') {
            error = portfolioValidation.amount(formData.total_invested);
        } else if (fieldName === 'description') {
            error = portfolioValidation.description(formData.description);
        }

        if (error) {
            setErrors(prev => ({ ...prev, [fieldName]: error }));
        }
    };

    const handleSubmit = () => {
        // Validate all fields
        const validationErrors = validatePortfolioForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Show first error in toast
            const firstError = Object.values(validationErrors)[0];
            showToast.error(firstError);
            return;
        }

        const newPortfolio = {
            id: Date.now(),
            name: formData.name,
            asset: formData.asset,
            total_invested: parseFloat(formData.total_invested),
            description: formData.description
        };

        onAdd(newPortfolio);
        setIsOpen(false);
        showToast.success('เพิ่ม Portfolio สำเร็จ!');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">เพิ่ม Portfolio</span>
                    <span className="sm:hidden">เพิ่ม</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-stone-900 max-w-[95vw] sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl text-stone-800 dark:text-stone-100">เพิ่ม Portfolio ใหม่</DialogTitle>
                    <DialogDescription className="text-stone-600 dark:text-stone-400">
                        กรอกข้อมูล Port ที่ต้องการเพิ่ม
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
                        {/* <Input
                            name="asset"
                            placeholder="เช่น BTC"
                            value={formData.asset}
                            onChange={handleInputChange}
                            className="mt-1"
                        /> */}
                        <Select
                            value={formData.asset}
                            onValueChange={(value) => {
                                setFormData({ ...formData, asset: value });
                                if (errors.asset) {
                                    setErrors(prev => ({ ...prev, asset: '' }));
                                }
                            }}
                        >
                            <SelectTrigger className={`bg-white dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700 w-full ${errors.asset ? 'border-red-500 dark:border-red-500' : ''}`}>
                                <SelectValue placeholder="Select Asset" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] dark:bg-stone-800 dark:border-stone-700">
                                {/* Forex Group */}
                                <SelectGroup>
                                    {assetGroups.asset.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.text}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.asset && <p className="text-xs text-red-500 mt-1">{errors.asset}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Amount (USD)</label>
                        <Input
                            name="total_invested"
                            type="number"
                            // step="0.00000001"
                            // placeholder="0.00"
                            value={formData.total_invested}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('total_invested')}
                            className={`mt-1 dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700 ${errors.total_invested ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {errors.total_invested && <p className="text-xs text-red-500 mt-1">{errors.total_invested}</p>}
                    </div>

                    <div>
                        {/* <label className="text-sm font-medium text-stone-700">Description</label> */}
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Description</label>
                            <span className="text-xs text-gray-500 dark:text-stone-400">
                                {formData.description.length}/1200
                            </span>
                        </div>
                        {/* <Input
                            name="description"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="mt-1"
                        /> */}
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
                            // rows={4}
                            placeholder="Some comments"
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white"
                    >
                        เพิ่ม Portfolio
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
