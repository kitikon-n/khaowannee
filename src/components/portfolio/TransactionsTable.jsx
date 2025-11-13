import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/dateUtils';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TransactionsTable({ transactions, onEdit, onDelete }) {
    return (
        <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-stone-200 dark:border-stone-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Symbol</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Side</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Date</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Qty</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Price</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Commission</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Total</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400">Note</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-stone-600 dark:text-stone-400 w-12">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                                                {transaction.cryptocurrency_symbol?.slice(0, 1)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-stone-800 dark:text-stone-100">{transaction.cryptocurrency_symbol}</p>
                                            <p className="text-xs text-stone-600 dark:text-stone-400">{transaction.cryptocurrency_name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center py-4 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        transaction.transaction_type === 'buy'
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                    }`}>
                                        {transaction.transaction_type}
                                    </span>
                                </td>
                                <td className="text-center py-4 px-4 text-stone-800 dark:text-stone-100">
                                    {formatDate(transaction.transaction_date)}
                                </td>
                                <td className="text-right py-4 px-4 text-stone-800 dark:text-stone-100">
                                    {Number(transaction.quantity).toLocaleString()}
                                </td>
                                <td className="text-right py-4 px-4 text-stone-800 dark:text-stone-100">
                                    ${Number(transaction.price_per_unit).toFixed(5)}
                                </td>
                                <td className="text-right py-4 px-4 text-stone-800 dark:text-stone-100">
                                    ${Number(transaction.fee).toFixed(2)}
                                </td>
                                <td className="text-right py-4 px-4 font-semibold text-stone-800 dark:text-stone-100">
                                    ${Number(transaction.total_amount).toFixed(2)}
                                </td>
                                <td className="py-4 px-4 text-stone-600 dark:text-stone-400 text-sm">
                                    {transaction.notes || '-'}
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                                                <MoreVertical className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                                            <DropdownMenuItem
                                                onClick={() => onEdit && onEdit(transaction)}
                                                className="cursor-pointer text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit transaction...
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onDelete && onDelete(transaction)}
                                                className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
                {transactions.map((transaction) => (
                    <Card key={transaction.id} className="border-stone-200 dark:border-stone-700 dark:bg-stone-800">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                                            {transaction.cryptocurrency_symbol?.slice(0, 1)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-800 dark:text-stone-100">{transaction.cryptocurrency_symbol}</p>
                                        <p className="text-xs text-stone-600 dark:text-stone-400">{transaction.cryptocurrency_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        transaction.transaction_type === 'buy'
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                    }`}>
                                        {transaction.transaction_type}
                                    </span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
                                                <MoreVertical className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700">
                                            <DropdownMenuItem
                                                onClick={() => onEdit && onEdit(transaction)}
                                                className="cursor-pointer text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit transaction...
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onDelete && onDelete(transaction)}
                                                className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                <div>
                                    <p className="text-stone-600 dark:text-stone-400">วันที่</p>
                                    <p className="font-semibold text-stone-800 dark:text-stone-100">
                                        {formatDate(transaction.transaction_date)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-stone-600 dark:text-stone-400">จำนวน</p>
                                    <p className="font-semibold text-stone-800 dark:text-stone-100">
                                        {Number(transaction.quantity).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-stone-600 dark:text-stone-400">ราคา</p>
                                    <p className="font-semibold text-stone-800 dark:text-stone-100">
                                        ${Number(transaction.price_per_unit).toFixed(5)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-stone-600 dark:text-stone-400">Commission</p>
                                    <p className="font-semibold text-stone-800 dark:text-stone-100">
                                        ${Number(transaction.fee).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-stone-200 dark:border-stone-700">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-stone-600 dark:text-stone-400">Total</p>
                                    <p className="font-bold text-stone-800 dark:text-stone-100">
                                        ${Number(transaction.total_amount).toFixed(2)}
                                    </p>
                                </div>
                                {transaction.notes && (
                                    <div>
                                        <p className="text-xs text-stone-600 dark:text-stone-400">Note:</p>
                                        <p className="text-sm text-stone-700 dark:text-stone-300">{transaction.notes}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
