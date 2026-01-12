import React, { useState, useMemo } from 'react';
import { Ward } from '../types';
import { Calendar, TrendingDown, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeatmapWidgetProps {
  ward: Ward;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS = [2022, 2023, 2024, 2025, 2026];

const HeatmapWidget: React.FC<HeatmapWidgetProps> = ({ ward }) => {
  const [metric, setMetric] = useState<'AQI' | 'PM2.5'>('AQI');
  const [startIndex, setStartIndex] = useState(0);
  const VISIBLE_COUNT = 3;

  // Deterministally generate data based on Ward ID to ensure stability across re-renders
  const historicalData = useMemo(() => {
    const seed = ward.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return YEARS.map((year, yIdx) => {
      const monthsData = MONTHS.map((month, mIdx) => {
        // Seasonality Factor (Indian Context)
        // Winter (Oct-Jan): High | Summer (Apr-Jun): Moderate | Monsoon (Jul-Sep): Good
        let seasonalBase = 100;
        if ([9, 10, 11, 0].includes(mIdx)) seasonalBase = 250; // Oct, Nov, Dec, Jan
        if ([1, 2, 3].includes(mIdx)) seasonalBase = 180; // Feb, Mar, Apr
        if ([4, 5].includes(mIdx)) seasonalBase = 150; // May, Jun
        if ([6, 7, 8].includes(mIdx)) seasonalBase = 60; // Jul, Aug, Sep

        // Random variations per ward/year
        const randomFactor = Math.sin(seed + yIdx * 10 + mIdx) * 30;
        
        // Trend Factor: Future years show improvement (simulating policy effect)
        let trendFactor = 0;
        if (year > 2024) {
             trendFactor = (yIdx - 1) * -20; // Aggressive improvement for projections
        } else {
             trendFactor = (yIdx - 1) * -5; // Mild historic trend
        }

        let val = Math.max(30, Math.round(seasonalBase + randomFactor + trendFactor));
        
        // If metric is PM2.5, it's roughly 60% of AQI in this sim
        if (metric === 'PM2.5') {
            val = Math.round(val * 0.6);
        }

        return {
           year,
           month,
           value: val
        };
      });

      return {
          year,
          months: monthsData
      };
    });
  }, [ward.id, metric]);

  const visibleData = historicalData.slice(startIndex, startIndex + VISIBLE_COUNT);

  const getColor = (val: number) => {
    // Thresholds
    const good = metric === 'AQI' ? 50 : 30;
    const mod = metric === 'AQI' ? 100 : 60;
    const poor = metric === 'AQI' ? 200 : 90;
    const severe = metric === 'AQI' ? 300 : 120;

    if (val <= good) return 'bg-emerald-500 shadow-emerald-200';
    if (val <= mod) return 'bg-amber-400 shadow-amber-200';
    if (val <= poor) return 'bg-orange-500 shadow-orange-200';
    if (val <= severe) return 'bg-red-500 shadow-red-200';
    return 'bg-purple-700 shadow-purple-200'; // Hazardous
  };

  const getLabel = (val: number) => {
      if (metric === 'AQI') {
        if (val <= 50) return 'Good';
        if (val <= 100) return 'Moderate';
        if (val <= 200) return 'Poor';
        if (val <= 300) return 'Very Poor';
        return 'Severe';
      } else {
        // PM2.5 roughly
        if (val <= 30) return 'Safe';
        if (val <= 60) return 'Acceptable';
        if (val <= 90) return 'Unhealthy';
        return 'Critical';
      }
  };

  const handleNext = () => {
    if (startIndex + VISIBLE_COUNT < YEARS.length) {
        setStartIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
        setStartIndex(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar size={20} className="text-blue-500" />
            Seasonal Impact Calendar
          </h2>
          <p className="text-sm text-slate-500">Historical & Projected {metric} heatmap (Month-on-Month)</p>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setMetric('AQI')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${metric === 'AQI' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    AQI Index
                </button>
                <button 
                    onClick={() => setMetric('PM2.5')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${metric === 'PM2.5' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    PM2.5 Levels
                </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                <button 
                    onClick={handlePrev} 
                    disabled={startIndex === 0}
                    className="p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:shadow-none text-slate-600 transition-all"
                >
                    <ChevronLeft size={16} />
                </button>
                <button 
                    onClick={handleNext} 
                    disabled={startIndex + VISIBLE_COUNT >= YEARS.length}
                    className="p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:shadow-none text-slate-600 transition-all"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleData.map((yearData, idx) => {
            const yearAvg = Math.round(yearData.months.reduce((acc, curr) => acc + curr.value, 0) / 12);
            
            // Calculate difference from previous year
            const actualIndex = startIndex + idx;
            const prevYearAvg = actualIndex > 0 
                ? Math.round(historicalData[actualIndex-1].months.reduce((acc, curr) => acc + curr.value, 0) / 12) 
                : yearAvg;
            const diff = yearAvg - prevYearAvg;

            const isFuture = yearData.year > new Date().getFullYear();

            return (
                <div key={yearData.year} className={`relative rounded-xl p-4 border transition-colors ${isFuture ? 'bg-indigo-50/40 border-indigo-200 border-dashed' : 'bg-slate-50/50 border-slate-100 hover:border-blue-100'}`}>
                    {isFuture && (
                        <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-bold rounded-full uppercase tracking-wider border border-indigo-200 shadow-sm">
                            Projected
                        </div>
                    )}
                    <div className="flex justify-between items-end mb-4 px-1">
                        <div>
                            <div className={`text-xl font-bold leading-none ${isFuture ? 'text-indigo-900' : 'text-slate-800'}`}>{yearData.year}</div>
                            <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${isFuture ? 'text-indigo-400' : 'text-slate-400'}`}>
                                {isFuture ? 'Estimated Avg' : 'Yearly Avg'}
                            </div>
                        </div>
                        <div className="text-right">
                             <div className={`text-2xl font-black leading-none ${isFuture ? 'text-indigo-800' : 'text-slate-700'}`}>{yearAvg}</div>
                             {actualIndex > 0 && diff !== 0 && (
                                 <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${diff < 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                     {diff < 0 ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                                     {Math.abs(diff)}%
                                 </div>
                             )}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                        {yearData.months.map((cell, cIdx) => (
                            <div 
                                key={cIdx} 
                                className={`aspect-square rounded-lg flex flex-col items-center justify-center relative group cursor-default transition-transform hover:scale-105 hover:z-10 shadow-sm ${getColor(cell.value)} ${isFuture ? 'opacity-90' : ''}`}
                            >
                                <span className="text-[10px] font-bold text-white/90 drop-shadow-sm">{cell.month}</span>
                                
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-28 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 text-center">
                                    <div className="font-bold border-b border-white/10 pb-1 mb-1">{cell.month} {cell.year}</div>
                                    <div className="flex justify-between items-center">
                                        <span className="opacity-70">{metric}</span>
                                        <span className="font-bold">{cell.value}</span>
                                    </div>
                                    <div className={`mt-1 font-bold text-[10px] uppercase tracking-wide ${
                                        getLabel(cell.value) === 'Severe' || getLabel(cell.value) === 'Critical' ? 'text-red-300' : 'text-emerald-300'
                                    }`}>{getLabel(cell.value)}</div>
                                    {/* Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap gap-6 items-center justify-center">
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500 shadow-sm"></div> 
              <span className="text-xs font-medium text-slate-600">Good / Safe</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-400 shadow-sm"></div> 
              <span className="text-xs font-medium text-slate-600">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500 shadow-sm"></div> 
              <span className="text-xs font-medium text-slate-600">Poor / Unhealthy</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500 shadow-sm"></div> 
              <span className="text-xs font-medium text-slate-600">Severe</span>
          </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-700 shadow-sm"></div> 
              <span className="text-xs font-medium text-slate-600">Hazardous</span>
          </div>
      </div>
    </div>
  );
};

export default HeatmapWidget;