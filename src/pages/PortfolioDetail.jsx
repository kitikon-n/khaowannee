// // ============================================
// // pages/PortfolioDetail.jsx
// // ============================================
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ChevronDown, Edit2, ChevronLeft, ArrowUpDown } from 'lucide-react';
// import { GRADIENT_BG } from '@/components/share/constants';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';

// export default function PortfolioDetail({ portfolio, onBack }) {
//   const [activeTab, setActiveTab] = useState('holdings');
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

//   // Mock holdings data
//   const [holdings] = useState([
//     {
//       id: 1,
//       symbol: 'COTI',
//       name: 'COTI / TetherUS',
//       allocation: 100.00,
//       qty: -100,
//       avgPrice: 0.04384,
//       priceUnit: 'USDT',
//       invested: 4.39,
//       investedUnit: 'USD',
//       unrealizedGain: -0.42,
//       unrealizedGainUnit: 'USD',
//       dailyGain: -0.00,
//       dailyGainUnit: 'USD',
//       totalDividend: 0.00,
//       dividendUnit: 'USD',
//       totalGain: -0.42,
//       totalGainUnit: 'USD'
//     }
//   ]);

//   // Portfolio summary cards data
//   const summaryCards = [
//     {
//       title: 'Portfolio value',
//       value: '-0.42',
//       unit: 'USD',
//       subtext: 'Cash -4.39'
//     },
//     {
//       title: 'Unrealized gain',
//       value: '-0.42',
//       unit: 'USD',
//       percentage: '-9.55%',
//       subtext: 'Last day -0.00',
//       subtextPercentage: '-0.10%',
//       isNegative: true
//     },
//     {
//       title: 'Realized gain',
//       value: '0.00',
//       unit: 'USD',
//       subtext: 'Total dividends 0.00 USD'
//     },
//     {
//       title: 'Total gain',
//       value: '-0.42',
//       unit: 'USD',
//       percentage: '-9.55%',
//       subtext: 'Annualized yield -97.44%',
//       isNegative: true
//     }
//   ];

//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const sortedHoldings = [...holdings].sort((a, b) => {
//     if (!sortConfig.key) return 0;
    
//     const aValue = a[sortConfig.key];
//     const bValue = b[sortConfig.key];
    
//     if (aValue < bValue) {
//       return sortConfig.direction === 'asc' ? -1 : 1;
//     }
//     if (aValue > bValue) {
//       return sortConfig.direction === 'asc' ? 1 : -1;
//     }
//     return 0;
//   });

//   const SortableHeader = ({ column, children }) => (
//     <TableHead 
//       className="cursor-pointer hover:bg-gray-700 transition-colors"
//       onClick={() => handleSort(column)}
//     >
//       <div className="flex items-center gap-1">
//         {children}
//         <ArrowUpDown size={14} className="text-gray-400" />
//       </div>
//     </TableHead>
//   );

//   return (
//     <div className="min-h-screen" style={GRADIENT_BG}>
//       <div className="max-w-7xl mx-auto p-6">
//         {/* Header Section */}
//         <div className="mb-6">
//           <Button 
//             variant="ghost" 
//             onClick={onBack}
//             className="mb-4 text-gray-700 hover:text-gray-900"
//           >
//             <ChevronLeft size={20} className="mr-1" />
//             Back to Portfolios
//           </Button>

//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
//                 {portfolio?.name || 'My portfolio Mike'}
//                 <ChevronDown size={24} className="text-gray-600" />
//               </h1>
//             </div>
//             <div className="flex items-center gap-3">
//               <Button 
//                 variant="outline"
//                 className="bg-white"
//               >
//                 Add transaction
//                 <ChevronDown size={16} className="ml-2" />
//               </Button>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 text-gray-600">
//             <span>you success</span>
//             <Edit2 size={16} className="cursor-pointer hover:text-gray-800" />
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           {summaryCards.map((card, index) => (
//             <Card key={index} className="bg-gray-900 text-white border-gray-800">
//               <CardContent className="p-6">
//                 <div className="text-sm text-gray-400 mb-2">{card.title}</div>
//                 <div className="flex items-baseline gap-2 mb-1">
//                   <span className={`text-2xl font-bold ${card.isNegative ? 'text-red-500' : 'text-white'}`}>
//                     {card.value}
//                   </span>
//                   <span className="text-xs text-gray-400">{card.unit}</span>
//                   {card.percentage && (
//                     <span className={`text-sm font-semibold ${card.isNegative ? 'text-red-500' : 'text-green-500'}`}>
//                       {card.percentage}
//                     </span>
//                   )}
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   {card.subtext}
//                   {card.subtextPercentage && (
//                     <span className="ml-1 text-red-500">{card.subtextPercentage}</span>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Tabs Section */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="bg-transparent border-b border-gray-300 rounded-none w-full justify-start h-auto p-0">
//             <TabsTrigger 
//               value="overview"
//               className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent px-6 py-3"
//             >
//               Overview
//             </TabsTrigger>
//             <TabsTrigger 
//               value="holdings"
//               className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent px-6 py-3"
//             >
//               Holdings
//             </TabsTrigger>
//             <TabsTrigger 
//               value="transactions"
//               className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent px-6 py-3"
//             >
//               Transactions
//             </TabsTrigger>
//             <TabsTrigger 
//               value="analysis"
//               className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none bg-transparent px-6 py-3"
//             >
//               Analysis
//             </TabsTrigger>
//           </TabsList>

//           {/* Overview Tab */}
//           <TabsContent value="overview" className="mt-6">
//             <Card className="bg-white">
//               <CardContent className="p-12 text-center">
//                 <p className="text-gray-500 text-lg">Overview content coming soon...</p>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Holdings Tab */}
//           <TabsContent value="holdings" className="mt-6">
//             <Card className="bg-gray-900 text-white border-gray-800">
//               <CardContent className="p-0">
//                 <div className="p-6 border-b border-gray-800">
//                   <h2 className="text-xl font-bold">Total holdings</h2>
//                   <p className="text-sm text-gray-400 mt-1">1 holding</p>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="border-gray-800 hover:bg-gray-800">
//                         <SortableHeader column="symbol">Symbol</SortableHeader>
//                         <SortableHeader column="allocation">Allocation</SortableHeader>
//                         <SortableHeader column="qty">Qty</SortableHeader>
//                         <SortableHeader column="avgPrice">Avg price</SortableHeader>
//                         <SortableHeader column="invested">Invested</SortableHeader>
//                         <SortableHeader column="unrealizedGain">Unrealized gain</SortableHeader>
//                         <SortableHeader column="dailyGain">Daily gain</SortableHeader>
//                         <SortableHeader column="totalDividend">Total dividend</SortableHeader>
//                         <SortableHeader column="totalGain">Total gain</SortableHeader>
//                         <TableHead></TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {sortedHoldings.map((holding) => (
//                         <TableRow key={holding.id} className="border-gray-800 hover:bg-gray-800">
//                           <TableCell>
//                             <div className="flex items-center gap-2">
//                               <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
//                                 C
//                               </div>
//                               <div>
//                                 <div className="font-semibold">{holding.symbol}</div>
//                                 <div className="text-xs text-gray-400">{holding.name}</div>
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>{holding.allocation.toFixed(2)}%</TableCell>
//                           <TableCell>{holding.qty}</TableCell>
//                           <TableCell>
//                             {holding.avgPrice.toFixed(5)} <span className="text-xs text-gray-400">{holding.priceUnit}</span>
//                           </TableCell>
//                           <TableCell>
//                             {holding.invested.toFixed(2)} <span className="text-xs text-gray-400">{holding.investedUnit}</span>
//                           </TableCell>
//                           <TableCell className="text-red-500">
//                             {holding.unrealizedGain.toFixed(2)} <span className="text-xs">{holding.unrealizedGainUnit}</span>
//                           </TableCell>
//                           <TableCell className="text-red-500">
//                             {holding.dailyGain.toFixed(2)} <span className="text-xs">{holding.dailyGainUnit}</span>
//                           </TableCell>
//                           <TableCell>
//                             {holding.totalDividend.toFixed(2)} <span className="text-xs text-gray-400">{holding.dividendUnit}</span>
//                           </TableCell>
//                           <TableCell className="text-red-500">
//                             {holding.totalGain.toFixed(2)} <span className="text-xs">{holding.totalGainUnit}</span>
//                           </TableCell>
//                           <TableCell>
//                             <Button variant="ghost" size="icon" className="h-8 w-8">
//                               <span className="text-gray-400">⋮</span>
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Transactions Tab */}
//           <TabsContent value="transactions" className="mt-6">
//             <Card className="bg-white">
//               <CardContent className="p-12 text-center">
//                 <p className="text-gray-500 text-lg">Transactions content coming soon...</p>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Analysis Tab */}
//           <TabsContent value="analysis" className="mt-6">
//             <Card className="bg-white">
//               <CardContent className="p-12 text-center">
//                 <p className="text-gray-500 text-lg">Analysis content coming soon...</p>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }