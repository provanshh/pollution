import React, { useState } from 'react';
import { Ward, AQICategory } from '../types';

interface WardMapProps {
  wards: Ward[];
  selectedWardId: string | null;
  onSelectWard: (ward: Ward) => void;
}

const getFillColor = (category: AQICategory) => {
  switch (category) {
    case AQICategory.GOOD: return '#22c55e'; // Green
    case AQICategory.MODERATE: return '#eab308'; // Yellow
    case AQICategory.POOR: return '#f97316'; // Orange
    case AQICategory.SEVERE: return '#ef4444'; // Red
    default: return '#cbd5e1';
  }
};

const getAQITextColor = (category: AQICategory) => {
    switch (category) {
      case AQICategory.GOOD: return 'text-green-400';
      case AQICategory.MODERATE: return 'text-yellow-400';
      case AQICategory.POOR: return 'text-orange-400';
      case AQICategory.SEVERE: return 'text-red-500';
      default: return 'text-slate-300';
    }
};

const WardMap: React.FC<WardMapProps> = ({ wards, selectedWardId, onSelectWard }) => {
  const [hoveredWard, setHoveredWard] = useState<Ward | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    // constrain to container bounds to keep coordinates relative
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    setMousePos({ x, y });
  };

  return (
    <div 
        className="w-full h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 relative shadow-inner group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredWard(null)}
    >
      
      {/* Real-time Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10 pointer-events-none">
         <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded border border-red-500/30">
            Live Feed
        </span>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/80 p-3 rounded-lg shadow-lg border border-slate-700 text-xs backdrop-blur-md z-10 pointer-events-none">
        <h4 className="font-bold mb-2 text-slate-300">NCT Delhi AQI</h4>
        <div className="flex items-center gap-2 mb-1 text-slate-400"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div> Good (0-50)</div>
        <div className="flex items-center gap-2 mb-1 text-slate-400"><div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div> Moderate (51-100)</div>
        <div className="flex items-center gap-2 mb-1 text-slate-400"><div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div> Poor (101-200)</div>
        <div className="flex items-center gap-2 text-slate-400"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div> Severe (200+)</div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.2 }}></div>

      <svg viewBox="0 0 340 340" className="w-full h-full drop-shadow-2xl transform scale-95 hover:scale-100 transition-transform duration-700">
        <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        {wards.map((ward) => {
          const isSelected = selectedWardId === ward.id;
          const isHovered = hoveredWard?.id === ward.id;
          
          return (
            <g 
                key={ward.id} 
                onClick={() => onSelectWard(ward)}
                onMouseEnter={() => setHoveredWard(ward)}
                className="cursor-pointer transition-all duration-300 group/path"
            >
              <path
                d={ward.path}
                fill={getFillColor(ward.category)}
                stroke={isSelected || isHovered ? '#ffffff' : '#0f172a'}
                strokeWidth={isSelected || isHovered ? 2 : 1}
                fillOpacity={isSelected || isHovered ? 0.9 : 0.6}
                className="transition-all duration-300 ease-in-out"
                style={{ filter: (isSelected || isHovered) ? 'url(#glow)' : 'none' }}
              />
              <text
                x={ward.center[0]}
                y={ward.center[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[8px] font-bold pointer-events-none fill-white drop-shadow-md transition-opacity ${isSelected || isHovered ? 'opacity-100' : 'opacity-60'}`}
              >
                {ward.name.split('/')[0]}
              </text>
              {(isSelected || isHovered) && (
                  <circle cx={ward.center[0]} cy={ward.center[1]} r="2" fill="white" className="animate-ping" />
              )}
            </g>
          );
        })}
      </svg>

      {/* Interactive Hover Tooltip */}
      {hoveredWard && (
        <div 
            style={{ 
                left: Math.min(mousePos.x + 15, 200), // Keep within bounds rough logic
                top: Math.min(mousePos.y + 15, 250)
            }} 
            className="absolute z-50 bg-slate-900/90 text-white p-3 rounded-xl border border-slate-600 shadow-2xl pointer-events-none text-xs w-48 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-sm leading-tight text-white">{hoveredWard.name}</div>
                <div className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{hoveredWard.id}</div>
            </div>
            
            <div className="flex items-baseline justify-between border-b border-slate-700 pb-2 mb-2">
                <span className="text-slate-400 font-medium">Live AQI</span>
                <span className={`text-2xl font-black ${getAQITextColor(hoveredWard.category)}`}>
                    {hoveredWard.aqi}
                </span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-300">
                <div className="flex justify-between">
                    <span>PM2.5</span>
                    <span className="font-mono font-bold text-white">{hoveredWard.pollutants.pm25}</span>
                </div>
                <div className="flex justify-between">
                    <span>PM10</span>
                    <span className="font-mono font-bold text-white">{hoveredWard.pollutants.pm10}</span>
                </div>
                <div className="flex justify-between">
                    <span>Temp</span>
                    <span className="font-mono font-bold text-white">{hoveredWard.weather.temperature.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                    <span>Wind</span>
                    <span className="font-mono font-bold text-white">{hoveredWard.weather.windSpeed.toFixed(1)}</span>
                </div>
            </div>
            
            <div className="mt-2 pt-2 border-t border-slate-700">
                 <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Primary Source</div>
                 <div className="text-slate-200 truncate">{hoveredWard.primarySources[0]}</div>
            </div>
        </div>
      )}
    </div>
  );
};

export default WardMap;