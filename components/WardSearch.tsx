import React, { useState, useEffect, useRef } from 'react';
import { Ward, AQICategory } from '../types';
import { Search, MapPin, X, Crosshair, Navigation } from 'lucide-react';

interface WardSearchProps {
  wards: Ward[];
  onSelect: (ward: Ward) => void;
}

const WardSearch: React.FC<WardSearchProps> = ({ wards, onSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Simulation: Since we don't have a real GIS backend to map Lat/Lng to polygon,
                // we simulate finding a location in Delhi (e.g., Connaught Place or Shahdara)
                // In a real app, this would perform a point-in-polygon check.
                setTimeout(() => {
                    const randomWard = wards[Math.floor(Math.random() * wards.length)];
                    onSelect(randomWard);
                    setQuery(randomWard.name);
                    setIsLocating(false);
                    setIsOpen(false);
                }, 1500);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setIsLocating(false);
                alert("Could not detect location. Please search manually.");
            }
        );
    } else {
        setIsLocating(false);
        alert("Geolocation is not supported by this browser.");
    }
  };

  const filteredWards = wards.filter(w => 
    w.name.toLowerCase().includes(query.toLowerCase()) || 
    w.id.toLowerCase().includes(query.toLowerCase()) ||
    w.pois.some(poi => poi.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search places (e.g. Shahdara, India Gate)..."
          className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {query ? (
                <button 
                    onClick={() => { setQuery(''); setIsOpen(false); }}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                    <X size={14} />
                </button>
            ) : (
                <button 
                    onClick={handleLocateMe}
                    disabled={isLocating}
                    className={`p-1.5 rounded-md transition-colors ${isLocating ? 'text-blue-500 animate-pulse' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                    title="Use my location"
                >
                    <Crosshair size={16} />
                </button>
            )}
        </div>
      </div>
      
      {isLocating && (
        <div className="absolute mt-1 w-full bg-blue-50 border border-blue-100 p-2 rounded-lg text-xs text-blue-700 flex items-center justify-center gap-2 z-50">
            <Navigation size={12} className="animate-spin" /> Locating you in Delhi NCR...
        </div>
      )}

      {isOpen && query.length > 0 && (
        <div className="absolute mt-1 w-full bg-white shadow-xl rounded-lg border border-slate-100 max-h-80 overflow-y-auto z-50 divide-y divide-slate-50 animate-in fade-in zoom-in-95 duration-100">
          {filteredWards.length > 0 ? (
            filteredWards.map(ward => (
              <button
                key={ward.id}
                onClick={() => {
                  onSelect(ward);
                  setQuery('');
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-1.5 rounded-full shrink-0 ${
                        ward.category === AQICategory.GOOD ? 'bg-green-100 text-green-600' :
                        ward.category === AQICategory.MODERATE ? 'bg-yellow-100 text-yellow-600' :
                        ward.category === AQICategory.POOR ? 'bg-orange-100 text-orange-600' :
                        'bg-red-100 text-red-600'
                    }`}>
                        <MapPin size={14} />
                    </div>
                    <div className="min-w-0">
                        <div className="font-medium text-slate-800 text-sm group-hover:text-blue-600 transition-colors truncate">{ward.name}</div>
                        <div className="text-xs text-slate-500 truncate">
                            {ward.pois.filter(p => p.toLowerCase().includes(query.toLowerCase()))[0] || ward.zone}
                        </div>
                    </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                    <div className={`font-bold ${
                         ward.category === AQICategory.GOOD ? 'text-green-600' :
                         ward.category === AQICategory.MODERATE ? 'text-yellow-600' :
                         ward.category === AQICategory.POOR ? 'text-orange-600' :
                         'text-red-600'
                    }`}>{ward.aqi}</div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400">AQI</div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-sm text-slate-500 text-center">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default WardSearch;