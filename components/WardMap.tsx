import React, { useState, useMemo } from 'react';
import { Ward, AQICategory } from '../types';
import { MapPin } from 'lucide-react';

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
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    setMousePos({ x, y });
  };

  const selectedWard = wards.find(w => w.id === selectedWardId);

  // Sort wards to ensure selected ward renders last (on top) for proper glow/stroke visibility
  const sortedWards = useMemo(() => {
    return [...wards].sort((a, b) => {
        if (a.id === selectedWardId) return 1;
        if (b.id === selectedWardId) return -1;
        return 0;
    });
  }, [wards, selectedWardId]);

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
            Live National Grid
        </span>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-slate-900/90 p-4 rounded-xl shadow-2xl border border-slate-700 text-xs backdrop-blur-md z-20 pointer-events-none hidden sm:block min-w-[150px]">
        <h4 className="font-bold mb-3 text-slate-100 border-b border-slate-700 pb-2 tracking-widest uppercase text-[10px]">AQI Severity</h4>
        <div className="space-y-3">
            <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] border border-green-400/50"></span> 
                    <span className="font-medium">Good</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono bg-slate-800/50 px-1 rounded">0-50</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)] border border-yellow-400/50"></span> 
                    <span className="font-medium">Moderate</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono bg-slate-800/50 px-1 rounded">51-100</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)] border border-orange-400/50"></span> 
                    <span className="font-medium">Poor</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono bg-slate-800/50 px-1 rounded">101-200</span>
            </div>
             <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] border border-red-400/50"></span> 
                    <span className="font-medium">Severe</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono bg-slate-800/50 px-1 rounded">&gt;200</span>
            </div>
        </div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.2 }}></div>

      <svg viewBox="0 0 380 340" className="w-full h-full drop-shadow-2xl">
        <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
             <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <path d="M0,0 L0,10 L10,5 z" fill="#fff" />
            </marker>
        </defs>
        
        {/* Render Wards */}
        {sortedWards.map((ward) => {
          const isSelected = selectedWardId === ward.id;
          const isHovered = hoveredWard?.id === ward.id;
          
          return (
            <g 
                key={ward.id} 
                onClick={() => onSelectWard(ward)}
                onMouseEnter={() => setHoveredWard(ward)}
                className={`cursor-pointer transition-all duration-300 ${isSelected ? 'z-50' : 'z-10'}`}
                style={{ transformOrigin: `${ward.center[0]}px ${ward.center[1]}px` }}
            >
              <path
                d={ward.path}
                fill={getFillColor(ward.category)}
                stroke={isSelected ? '#ffffff' : isHovered ? '#cbd5e1' : '#0f172a'}
                strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                fillOpacity={isSelected || isHovered ? 0.9 : 0.6}
                className="transition-all duration-300 ease-in-out"
                style={{ 
                    filter: (isSelected || isHovered) ? 'url(#glow)' : 'none',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                }}
              />
              
              {/* Label */}
              <text
                x={ward.center[0]}
                y={ward.center[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[6px] font-bold pointer-events-none fill-white drop-shadow-md transition-opacity ${isSelected || isHovered ? 'opacity-100' : 'opacity-40'}`}
                style={{
                    transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.3s ease-in-out'
                }}
              >
                {ward.name.split(',')[0]}
              </text>
            </g>
          );
        })}

        {/* Selected Ward Marker/Pin */}
        {selectedWard && (
            <g transform={`translate(${selectedWard.center[0]}, ${selectedWard.center[1] - 20})`} className="pointer-events-none transition-all duration-500 ease-out">
                <circle cx="0" cy="20" r="4" fill="white" className="animate-ping opacity-75" />
                <circle cx="0" cy="20" r="2" fill="red" />
                
                {/* Pin Icon */}
                <path 
                    d="M-6,-14 C-6,-19 -3,-22 0,-22 C3,-22 6,-19 6,-14 C6,-10 0,0 0,0 C0,0 -6,-10 -6,-14 Z" 
                    fill="#3b82f6" 
                    stroke="white" 
                    strokeWidth="1.5"
                    className="animate-bounce"
                />
                <circle cx="0" cy="-14" r="2" fill="white" className="animate-bounce"/>
            </g>
        )}
      </svg>

      {/* Interactive Hover Tooltip */}
      {hoveredWard && (
        <div 
            style={{ 
                left: Math.min(mousePos.x + 15, 200),
                top: Math.min(mousePos.y + 15, 250)
            }} 
            className="absolute z-50 bg-slate-900/95 text-white p-3 rounded-xl border border-slate-600 shadow-2xl pointer-events-none text-xs w-52 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
            <div className="flex justify-between items-start mb-2 border-b border-slate-700 pb-2">
                <div>
                    <div className="font-bold text-sm leading-tight text-white">{hoveredWard.name}</div>
                    <div className="text-[10px] text-slate-400">{hoveredWard.zone}</div>
                </div>
                <div className={`font-black text-xl ${getAQITextColor(hoveredWard.category)}`}>{hoveredWard.aqi}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-300">
                <div className="flex justify-between"><span>PM2.5</span><span className="font-mono font-bold text-white">{hoveredWard.pollutants.pm25}</span></div>
                <div className="flex justify-between"><span>Temp</span><span className="font-mono font-bold text-white">{hoveredWard.weather.temperature.toFixed(1)}°</span></div>
            </div>
        </div>
      )}
    </div>
  );
};

export default WardMap;