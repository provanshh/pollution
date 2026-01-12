import React from 'react';
import { Ward, AQICategory } from '../types';
import { Activity, Wind, CloudFog } from 'lucide-react';

interface LiveMonitorCardProps {
  ward: Ward;
}

const LiveMonitorCard: React.FC<LiveMonitorCardProps> = ({ ward }) => {
  const getStatusColor = (category: AQICategory) => {
    switch (category) {
      case AQICategory.GOOD: return 'bg-emerald-500 border-emerald-600 shadow-emerald-200';
      case AQICategory.MODERATE: return 'bg-amber-500 border-amber-600 shadow-amber-200';
      case AQICategory.POOR: return 'bg-orange-500 border-orange-600 shadow-orange-200';
      case AQICategory.SEVERE: return 'bg-red-600 border-red-700 shadow-red-200';
      default: return 'bg-slate-500 border-slate-600 shadow-slate-200';
    }
  };

  const getPrimaryPollutant = (pollutants: any) => {
      const entries = Object.entries(pollutants);
      if (entries.length === 0) return { name: 'N/A', val: 0 };
      const max = entries.reduce((max, curr) => (curr[1] as number) > (max[1] as number) ? curr : max, entries[0]);
      return { name: max[0].toUpperCase(), val: max[1] as number };
  }

  const primary = getPrimaryPollutant(ward.pollutants);

  return (
    <div 
        key={ward.id} // Triggers animation on change
        className="w-full bg-white rounded-xl shadow-lg border border-slate-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4"
    >
       <div className={`absolute top-0 left-0 w-2 h-full ${getStatusColor(ward.category).split(' ')[0]} transition-colors duration-500`}></div>
       
       <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Location Info */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg ${getStatusColor(ward.category).split(' ')[0]} transition-all duration-500`}>
                <Activity size={28} className="animate-pulse" />
            </div>
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected Ward</h3>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">{ward.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                     <span className="text-xs font-medium text-slate-500">Live Stream Active • {ward.zone}</span>
                </div>
            </div>
          </div>

          <div className="h-px w-full md:h-12 md:w-px bg-slate-100"></div>

          {/* Metrics */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-8 md:gap-12 flex-1 w-full md:w-auto">
              
              <div className="flex flex-col items-center md:items-start">
                  <span className="text-xs font-semibold text-slate-400 uppercase mb-1">Real-Time AQI</span>
                  <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-800 tracking-tight transition-all duration-500">{ward.aqi}</span>
                      <span className="text-sm font-medium text-slate-400">US AQI</span>
                  </div>
              </div>

              <div className="flex flex-col items-center md:items-start">
                  <span className="text-xs font-semibold text-slate-400 uppercase mb-1">Category</span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-md ${getStatusColor(ward.category).split(' ')[0]} transition-all duration-500`}>
                      {ward.category}
                  </span>
              </div>

              <div className="flex flex-col items-center md:items-start">
                  <span className="text-xs font-semibold text-slate-400 uppercase mb-1">Major Pollutant</span>
                  <div className="flex items-center gap-2">
                       <CloudFog size={24} className="text-slate-300" />
                       <div>
                           <span className="text-xl font-bold text-slate-700">{primary.name}</span>
                           <span className="text-xs text-slate-400 ml-1">{primary.val} µg/m³</span>
                       </div>
                  </div>
              </div>

          </div>
       </div>
    </div>
  );
};

export default LiveMonitorCard;