import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/ui/date-input';
import { showToast } from '../share/toast';
import { transactionValidation, validateTransactionForm } from './validation';
import { portfolioService } from '@/services/portfolioService';
import { toInputDateFormat } from '@/lib/dateUtils';

export default function EditTransactionModal({ isOpen, onClose, transaction, onUpdate }) {
    const [formData, setFormData] = useState({
        side: 'buy',
        symbolId: '',
        symbolLabel: '',
        date: '',
        price: '',
        quantity: '1',
        commission: '0',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Helper function to remove unnecessary decimal zeros
    const formatNumberInput = (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return '';
        // Remove trailing zeros and unnecessary decimal point
        return num.toString();
    };

    // Initialize form data when transaction changes
    useEffect(() => {
        if (transaction && isOpen) {
            setFormData({
                side: transaction.transaction_type,
                symbolId: transaction.cryptocurrency_id,
                symbolLabel: `${transaction.cryptocurrency_name} (${transaction.cryptocurrency_symbol})`,
                symbolIcon: transaction.cryptocurrency_symbol?.charAt(0),
                date: toInputDateFormat(transaction.transaction_date),
                price: formatNumberInput(transaction.price_per_unit),
                quantity: formatNumberInput(transaction.quantity),
                commission: formatNumberInput(transaction.fee),
                notes: transaction.notes || ''
            });
            setErrors({});
        }
    }, [transaction, isOpen]);

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

    const handleSubmit = async () => {
        // Validate all fields
        const validationErrors = validateTransactionForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Show first error in toast
            const firstError = Object.values(validationErrors)[0];
            showToast.error(firstError);
            return;
        }

        setIsLoading(true);
        try {
            const price = parseFloat(formData.price);
            const quantity = parseFloat(formData.quantity);
            const commission = parseFloat(formData.commission);

            // Prepare transaction data for API
            const transactionData = {
                transaction_id: transaction.id,
                quantity: quantity,
                price_per_unit: price,
                total_amount: price * quantity,
                fee: commission,
                transaction_date: formData.date,
                notes: formData.notes
            };

            // Call API to update transaction
            const result = await portfolioService.updateTransaction(transactionData);

            if (result.success) {
                showToast.success('แก้ไข Transaction สำเร็จ!');

                // Call callback function with updated transaction
                if (onUpdate) {
                    onUpdate(result.data);
                }

                // Close modal
                onClose();
            }
        } catch (error) {
            showToast.error(error.message || 'เกิดข้อผิดพลาดในการแก้ไข Transaction');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-stone-900 max-w-[95vw] sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-stone-900 dark:text-stone-100">Edit transaction</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    {/* Side (Disabled) */}
                    <div>
                        <label className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">Side</label>
                        <div className="grid grid-cols-2 gap-2 opacity-60 cursor-not-allowed">
                            <button
                                type="button"
                                disabled
                                className={`py-2.5 px-4 rounded-md font-medium ${formData.side === 'sell'
                                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-700'
                                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-stone-700'
                                    }`}
                            >
                                Sell
                            </button>
                            <button
                                type="button"
                                disabled
                                className={`py-2.5 px-4 rounded-md font-medium ${formData.side === 'buy'
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-700'
                                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-stone-700'
                                    }`}
                            >
                                Buy
                            </button>
                        </div>
                    </div>

                    {/* Symbol (Disabled) */}
                    <div>
                        <label className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">Symbol</label>
                        <div className="relative">
                            <div className="w-full px-3 py-2.5 pl-10 border border-stone-300 dark:border-stone-700 rounded-md bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 cursor-not-allowed opacity-60">
                                {formData.symbolLabel}
                            </div>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-stone-600 dark:text-stone-400">
                                {formData.symbolIcon}
                            </span>
                        </div>
                    </div>

                    {/* Date and Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 block">Date</label>
                            <DateInput
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('date')}
                                error={errors.date}
                                className="dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700"
                            />
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
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white"
                        >
                            {isLoading ? 'กำลังบันทึก...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
