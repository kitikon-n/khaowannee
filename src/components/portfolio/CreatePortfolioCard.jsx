import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function CreatePortfolioCard({ onClick }) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-xl transition-all border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 group"
      style={{ minHeight: '200px' }}
    >
      <CardContent className="flex flex-col items-center justify-center h-full p-8 space-y-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus size={32} className="text-blue-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Create manually
          </h3>
          <p className="text-sm text-gray-500">
            Add only the transactions you want by hand
          </p>
        </div>
      </CardContent>
    </Card>
  );
}