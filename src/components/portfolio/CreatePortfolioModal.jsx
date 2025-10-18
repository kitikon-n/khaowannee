// ============================================
// components/portfolio/CreatePortfolioModal.jsx - ใช้ shadcn/ui
// ============================================
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Smile } from 'lucide-react';

export default function CreatePortfolioModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: 'My portfolio',
    currency: 'USD',
    riskFreeRate: 2,
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',           // string ว่าง
        currency: '',    // ค่า default
        total_invested: 100,    // หรือ 2 ตามที่ต้องการ
        description: ''     // string ว่าง
      });
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const currencyGroups = {
    asset: [
      {value: '01', text: 'Forex'},
      {value: '02', text: 'Crypto'},
      {value: '03', text: 'Thai stock'}
    ]
    // forex: [
    //   'NZDUSD', 'EURJPY', 'GBPJPY', 'EURGBP', 'AUDJPY', 'EURAUD',
    //   'EURCHF', 'AUDNZD', 'NZDJPY', 'GBPAUD', 'GBPCAD', 'EURNZD',
    //   'AUDCAD', 'GBPCHF', 'AUDCHF', 'EURCAD', 'CADJPY', 'GBPNZD',
    //   'CADCHF', 'CHFJPY', 'NZDCAD', 'NZDCHF'
    // ],
    // crypto: ['BNB', 'SOL', 'XRP'],
    // 'thai stock': [
    //   'ADVANC', 'AOT', 'AWC', 'BANPU', 'BBL', 'BDMS', 'BEM', 'BGRIM',
    //   'BH', 'BTS', 'CBG', 'CENTEL', 'COM7', 'CPALL', 'CPF', 'CPN',
    //   'CRC', 'DELTA', 'EA', 'EGCO', 'GLOBAL', 'GPSC', 'GULF', 'HMPRO',
    //   'INTUCH', 'IVL', 'KBANK', 'KTB', 'KTC', 'LH', 'MINT', 'MTC',
    //   'OR', 'OSP', 'PTT', 'PTTEP', 'PTTGC', 'RATCH', 'SAWAD', 'SCB',
    //   'SCC', 'SCGP', 'TIDLOR', 'TISCO', 'TLI', 'TOP', 'TRUE', 'TTB',
    //   'TU', 'WHA'
    // ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-stone-900"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 dark:text-stone-100">Create portfolio</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new portfolio form
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Portfolio Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-stone-300">Portfolio name</Label>
            <div className="relative">
              <Smile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-stone-400 z-10" size={20} />
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 bg-white dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700"
                placeholder="My portfolio"
              />
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-stone-300">Asset</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => setFormData({ ...formData, currency: value })}
            >
              <SelectTrigger className="bg-white dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700 w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] dark:bg-stone-800 dark:border-stone-700">
                {/* Forex Group */}
                <SelectGroup>
                  {currencyGroups.asset.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.text}
                    </SelectItem>
                  ))}
                </SelectGroup>

                {/* Crypto Group */}
                {/* <SelectGroup>
                  <SelectLabel>Crypto</SelectLabel>
                  {currencyGroups.crypto.map((currency) => (
                    <SelectItem className="left-3" key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectGroup> */}

                {/* Thai Stock Group */}
                {/* <SelectGroup>
                  <SelectLabel>Thai Stock</SelectLabel>
                  {currencyGroups['thai stock'].map((currency) => (
                    <SelectItem className="left-3" key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectGroup> */}
              </SelectContent>
            </Select>
          </div>

          {/* Risk-free Rate */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-stone-300">Risk-free rate</Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.riskFreeRate}
                onChange={(e) => setFormData({ ...formData, riskFreeRate: parseFloat(e.target.value) || 0 })}
                className="pr-10 bg-white dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-stone-400 text-sm">
                %
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700 dark:text-stone-300">Description</Label>
              <span className="text-xs text-gray-500 dark:text-stone-400">
                {formData.description.length}/1200
              </span>
            </div>
            <Textarea
              value={formData.description}
              onChange={(e) => {
                if (e.target.value.length <= 1200) {
                  setFormData({ ...formData, description: e.target.value });
                }
              }}
              className="resize-none bg-white dark:bg-stone-800 dark:text-stone-100 dark:border-stone-700"
              rows={4}
              placeholder="Some comments"
            />
          </div>
        </div>

        <DialogFooter>
          {/* <Button variant="outline" onClick={onClose}>
            Cancel
          </Button> */}
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}