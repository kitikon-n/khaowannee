import { MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PortfolioCard({ portfolio, onClick }) {
  const isNegative = portfolio.change < 0;
  
  return (
    <Card
      onClick={() => onClick(portfolio.id)}
      className="cursor-pointer hover:shadow-xl transition-all hover:scale-105 transform duration-200"
    >
      <CardHeader className="flex flex-row justify-between items-start p-6 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{portfolio.name}</h3>
          <p className="text-xs text-gray-500 mt-1">
            Updated {portfolio.updatedAt}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            // Handle menu click
          }}
          className="h-8 w-8"
        >
          <MoreVertical size={20} className="text-gray-600" />
        </Button>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {portfolio.value.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">USD</span>
            <span className={`text-sm font-semibold ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
              {isNegative ? '' : '+'}{portfolio.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <p className="text-gray-500 mb-1">Yield</p>
            <p className={`font-semibold ${portfolio.yield < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {portfolio.yield.toFixed(2)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 mb-1">Holdings</p>
            <p className="font-semibold text-gray-900">{portfolio.holdings}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}