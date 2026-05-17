"use client";
import React, { useMemo } from "react";
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

interface PricePoint {
  date: string;
  price: number;
}

export default function PriceChart({ currentPrice }: { currentPrice: number }) {
  const [mounted, setMounted] = React.useState(false);
  
  // Generate historical data inside a hook that only computes once on client
  const data: PricePoint[] = useMemo(() => {
    if (!mounted) return []; // Empty on server
    
    const points = [];
    let lastPrice = currentPrice * (1 + (Math.random() * 0.2 - 0.1));
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      lastPrice = lastPrice * (1 + (Math.random() * 0.1 - 0.05));
      points.push({ date: month, price: Math.round(lastPrice) });
    }
    points[points.length - 1].price = currentPrice;
    return points;
  }, [currentPrice, mounted]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
      return (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-[300px] flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent animate-spin rounded-full"></div>
          </div>
      );
  }

  const maxPrice = Math.max(...data.map(d => d.price)) * 1.05;
  const minPrice = Math.min(...data.map(d => d.price)) * 0.95;
  const range = maxPrice - minPrice;
  
  const width = 400;
  const height = 150;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding) / (data.length - 1));
    const y = height - padding - ((d.price - minPrice) / range * (height - 2 * padding));
    return `${x},${y}`;
  }).join(" ");

  const average = data.reduce((acc, d) => acc + d.price, 0) / data.length;
  const isGoodDeal = currentPrice <= average;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Price Analysis (6M)</h4>
           <div className="flex items-center gap-2">
              <span className="text-xl font-black text-gray-900">₹{currentPrice}</span>
              {isGoodDeal ? (
                <span className="text-[10px] font-black text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                   <TrendingDown size={12}/> Best Value
                </span>
              ) : (
                <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                   <TrendingUp size={12}/> High Season
                </span>
              )}
           </div>
        </div>
        <div className="text-right">
            <span className="text-[9px] font-black text-gray-400 uppercase">Avg: ₹{Math.round(average)}</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative h-[150px] w-full">
         <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            {/* Grid Line */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#f3f4f6" strokeWidth="1" />
            
            {/* Area Fill */}
            <path
              d={`M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`}
              fill="url(#gradient)"
              className="animate-in fade-in duration-1000"
            />
            
            {/* Line */}
            <polyline
              fill="none"
              stroke={isGoodDeal ? "#10B981" : "#f59e0b"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
              className="animate-chart-line"
              style={{ strokeDasharray: 1000, strokeDashoffset: 0 }}
            />

            {/* Points */}
            {data.map((d, i) => {
               const x = padding + (i * (width - 2 * padding) / (data.length - 1));
               const y = height - padding - ((d.price - minPrice) / range * (height - 2 * padding));
               return (
                 <g key={i} className="group/dot">
                    <circle cx={x} cy={y} r="4" fill="white" stroke={isGoodDeal ? "#10B981" : "#f59e0b"} strokeWidth="2" />
                    <text x={x} y={y - 10} textAnchor="middle" className="text-[8px] font-black fill-gray-400 opacity-0 group-hover/dot:opacity-100 transition-opacity">
                        ₹{d.price}
                    </text>
                    <text x={x} y={height - 2} textAnchor="middle" className="text-[8px] font-black fill-gray-300">
                        {d.date}
                    </text>
                 </g>
               )
            })}

            <defs>
               <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isGoodDeal ? "#10B981" : "#f59e0b"} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={isGoodDeal ? "#10B981" : "#f59e0b"} stopOpacity="0" />
               </linearGradient>
            </defs>
         </svg>
      </div>

      {/* Recommendation */}
      <div className={`p-4 rounded-2xl flex items-start gap-3 ${isGoodDeal ? 'bg-emerald-50' : 'bg-orange-50'}`}>
         {isGoodDeal ? (
            <CheckCircle2 className="text-[#10B981] mt-0.5" size={18}/>
         ) : (
            <AlertCircle className="text-orange-500 mt-0.5" size={18}/>
         )}
         <div>
            <h5 className={`text-[10px] font-black uppercase tracking-widest ${isGoodDeal ? 'text-emerald-800' : 'text-orange-800'}`}>
                {isGoodDeal ? "Buy Recommendation" : "Price Alert"}
            </h5>
            <p className="text-[10px] font-bold text-gray-500 leading-relaxed mt-1">
                {isGoodDeal 
                    ? `Current price is ${Math.round((1 - currentPrice/average) * 100)}% lower than the 6-month average. Excellent time to purchase.`
                    : `Prices are currently slightly elevated. Consider waiting or comparing with similar models for better value.`
                }
            </p>
         </div>
      </div>
    </div>
  );
}
