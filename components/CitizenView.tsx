import React from 'react';
import { Ward, AQICategory } from '../types';
import { Heart, Activity, Wind, Info } from 'lucide-react';

interface CitizenViewProps {
  wards: Ward[];
}

const CitizenView: React.FC<CitizenViewProps> = ({ wards }) => {
  // Simple "User Location" simulation - just picking the first ward
  const localWard = wards[0]; 

  const getHealthAdvice = (category: AQICategory) => {
    switch(category) {
        case AQICategory.SEVERE: return "Avoid all outdoor physical activities. Wear N95 masks if stepping out is necessary.";
        case AQICategory.POOR: return "Reduce prolonged or heavy exertion. Take more breaks during all outdoor activities.";
        case AQICategory.MODERATE: return "Unusually sensitive people should consider reducing prolonged or heavy exertion.";
        case AQICategory.GOOD: return "Air quality is considered satisfactory, and air pollution poses little or no risk.";
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className={`p-8 text-center text-white ${
             localWard.category === AQICategory.SEVERE ? 'bg-red-500' :
             localWard.category === AQICategory.POOR ? 'bg-orange-500' :
             localWard.category === AQICategory.MODERATE ? 'bg-yellow-500' : 'bg-green-500'
        }`}>
            <h2 className="text-lg font-medium opacity-90 mb-1">Current Air Quality in</h2>
            <h1 className="text-3xl font-bold mb-6">{localWard.name}</h1>
            
            <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-6 py-2 mb-4">
                <span className="text-5xl font-bold">{localWard.aqi}</span>
                <span className="ml-2 text-lg font-medium uppercase tracking-wide">{localWard.category}</span>
            </div>
            
            <p className="mt-2 opacity-90 max-w-lg mx-auto text-sm">{getHealthAdvice(localWard.category)}</p>
        </div>

        <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Heart className="text-red-500" /> Health Recommendations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm text-blue-500"><Wind size={18} /></div>
                    <div>
                        <h4 className="font-semibold text-slate-800 text-sm">Ventilation</h4>
                        <p className="text-xs text-slate-600 mt-1">Keep windows closed during peak traffic hours (8-11 AM).</p>
                    </div>
                </div>
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm text-green-500"><Activity size={18} /></div>
                    <div>
                        <h4 className="font-semibold text-slate-800 text-sm">Exercise</h4>
                        <p className="text-xs text-slate-600 mt-1">Indoor exercise recommended today.</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                 <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Info className="text-blue-500" /> Neighborhood Pollution Sources
                </h3>
                 <div className="flex flex-wrap gap-2">
                    {localWard.primarySources.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">{s}</span>
                    ))}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenView;