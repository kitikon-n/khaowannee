import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Calendar, ChevronDown } from 'lucide-react';
import { showToast } from '../share/toast';
import { transactionValidation, validateTransactionForm } from './validation';

export default function AddTransactionModal({ portfolioName, portfolioSymbol, onAdd }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        side: 'buy',
        symbol: portfolioSymbol || 'XAUUSD',
        date: new Date().toISOString().split('T')[0],
        price: '',
        quantity: '1',
        commission: '0',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    // Reset form and errors when modal closes
    useEffect(() => {
        if (!isOpen) {
            // Use setTimeout to ensure modal animation completes
            const timer = setTimeout(() => {
                setFormData({
                    side: 'buy',
                    symbol: portfolioSymbol || 'XAUUSD',
                    date: new Date().toISOString().split('T')[0],
                    price: '',
                    quantity: '1',
                    commission: '0',
                    notes: ''
                });
                setErrors({});
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen, portfolioSymbol]);

    const availableSymbols = [
        { value: 'XAUUSD', label: 'XAUUSD', icon: '🪙' },
        { value: 'BTC', label: 'Bitcoin', icon: '₿' },
        { value: 'ETH', label: 'Ethereum', icon: 'Ξ' },
        { value: 'USDT', label: 'Tether', icon: '₮' }
    ];

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
        if (fieldName === 'price') {
            error = transactionValidation.price(formData.price);
        } else if (fieldName === 'quantity') {
            error = transactionValidation.quantity(formData.quantity);
        } else if (fieldName === 'commission') {
            error = transactionValidation.commission(formData.commission);
        } else if (fieldName === 'date') {
            error = transactionValidation.transactionDate(formData.date);
        } else if (fieldName === 'notes') {
            error = transactionValidation.notes(formData.notes);
        }

        if (error) {
            setErrors(prev => ({ ...prev, [fieldName]: error }));
        }
    };

    const calculateTotal = () => {
        const price = parseFloat(formData.price) || 0;
        const quantity = parseFloat(formData.quantity) || 0;
        const commission = parseFloat(formData.commission) || 0;

        if (formData.side === 'buy') {
            return (price * quantity) + commission;
        } else {
            return (price * quantity) - commission;
        }
    };

    const handleSubmit = () => {
        // Validate all fields
        const validationErrors = validateTransactionForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Show first error in toast
            const firstError = Object.values(validationErrors)[0];
            showToast.error(firstError);
            return;
        }

        const newTransaction = {
            side: formData.side,
            symbol: formData.symbol,
            date: formData.date,
            price: parseFloat(formData.price),
            quantity: parseFloat(formData.quantity),
            commission: parseFloat(formData.commission),
            notes: formData.notes
        };

        // เรียก callback function
        onAdd(newTransaction);

        // Close modal (reset will be handled by useEffect)
        setIsOpen(false);
        showToast.success('เพิ่ม Transaction สำเร็จ!');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md">
                    <Plus className="h-4 w-4 mr-2" />
                    Add transaction
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-stone-900 max-w-[95vw] sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-stone-900 dark:text-stone-100">Add transaction</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    {/* Side */}
                    <div>
                        <label className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">Side</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, side: 'sell' }))}
                                className={`py-2.5 px-4 rounded-md font-medium transition-colors ${formData.side === 'sell'
                                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-700'
                                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700'
                                    }`}
                            >
                                Sell
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, side: 'buy' }))}
                                className={`py-2.5 px-4 rounded-md font-medium transition-colors ${formData.side === 'buy'
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-700'
                                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700'
                                    }`}
                            >
                                Buy
                            </button>
                        </div>
                    </div>

                    {/* Symbol */}
                    <div>
                        <label className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">Symbol</label>
                        <div className="relative">
                            <select
                                name="symbol"
                                value={formData.symbol}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 pl-10 border border-stone-300 dark:border-stone-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 appearance-none bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                            >
                                {availableSymbols.map((symbol) => (
                                    <option key={symbol.value} value={symbol.value}>
                                        {symbol.label}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                                {availableSymbols.find(s => s.value === formData.symbol)?.icon}
                            </span>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500 dark:text-stone-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Date and Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">Date</label>
                            <div className="relative">
                                <Input
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('date')}
                                    className={`pr-8 dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700 ${errors.date ? 'border-red-500 dark:border-red-500' : ''}`}
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500 dark:text-stone-400 pointer-events-none" />
                            </div>
                            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">Price</label>
                            <div className="relative">
                                <Input
                                    name="price"
                                    type="number"
                                    step="0.001"
                                    placeholder="0"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('price')}
                                    className={`pr-12 dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700 ${errors.price ? 'border-red-500 dark:border-red-500' : ''}`}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-stone-500 dark:text-stone-400">USD</span>
                            </div>
                            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                        </div>
                    </div>

                    {/* Quantity and Commission */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">Quantity</label>
                            <Input
                                name="quantity"
                                type="number"
                                step="0.00000001"
                                placeholder="1"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('quantity')}
                                className={`dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700 ${errors.quantity ? 'border-red-500 dark:border-red-500' : ''}`}
                            />
                            {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">Commission</label>
                            <div className="relative">
                                <Input
                                    name="commission"
                                    type="number"
                                    step="0.01"
                                    placeholder="0"
                                    value={formData.commission}
                                    onChange={handleInputChange}
                                    onBlur={() => handleBlur('commission')}
                                    className={`pr-12 dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700 ${errors.commission ? 'border-red-500 dark:border-red-500' : ''}`}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-stone-500 dark:text-stone-400">USD</span>
                            </div>
                            {errors.commission && <p className="text-xs text-red-500 mt-1">{errors.commission}</p>}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Notes</label>
                            <span className="text-xs text-stone-500 dark:text-stone-400">{formData.notes.length}/128</span>
                        </div>
                        <textarea
                            name="notes"
                            placeholder="Some comments"
                            maxLength={128}
                            value={formData.notes}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('notes')}
                            className={`w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 resize-none h-20 text-sm bg-white dark:bg-stone-800 dark:text-stone-100 ${errors.notes ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        {errors.notes && <p className="text-xs text-red-500 mt-1">{errors.notes}</p>}
                    </div>

                    {/* Total */}
                    <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Total</span>
                            <div>
                                <span className="text-2xl font-bold text-amber-700 dark:text-amber-500">
                                    {calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                                </span>
                                <span className="text-sm text-stone-500 dark:text-stone-400 ml-1">USD</span>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}