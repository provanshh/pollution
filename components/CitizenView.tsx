import React, { useState, useEffect } from 'react';
import { Ward, AQICategory, CitizenReport, GovAction } from '../types';
import { getGovActions, getPollutionSources } from '../services/dataService';
import { getPollutionCausalityAnalysis } from '../services/geminiService';
import { 
    Heart, Wind, Info, MapPin, AlertTriangle, ShieldCheck, Navigation, 
    Zap, Bike, Footprints, Baby, Briefcase, Smile, Frown, Megaphone, 
    CheckCircle2, Camera, Clock, Award, Leaf, ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, AreaChart, Area, XAxis } from 'recharts';

interface CitizenViewProps {
  wards: Ward[];
  selectedWardId?: string | null;
}

const CitizenView: React.FC<CitizenViewProps> = ({ wards, selectedWardId }) => {
  const localWard = wards.find(w => w.id === selectedWardId) || wards[0]; 
  const [aiReason, setAiReason] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<string>('Garbage Burning');
  const [ecoScore, setEcoScore] = useState(780);

  // Simulated derived data
  const pollutionSources = getPollutionSources(localWard);
  const govActions = getGovActions(localWard);
  
  // Safe Zones Calculation
  const safeZones = wards
    .filter(w => w.id !== localWard.id)
    .map(w => ({ ...w, distance: Math.random() * 5 + 1 })) // Simulating distance
    .sort((a, b) => a.aqi - b.aqi)
    .slice(0, 3);

  // Forecast Logic (72h simulation based on 24h trend extension)
  const extendedForecast = [
      ...localWard.forecast.map((val, i) => ({ time: `+${i+1}h`, val, safe: val < 100 })),
      ...localWard.forecast.map((val, i) => ({ time: `+${i+25}h`, val: Math.round(val * 0.9), safe: val * 0.9 < 100 })),
      ...localWard.forecast.map((val, i) => ({ time: `+${i+49}h`, val: Math.round(val * 1.1), safe: val * 1.1 < 100 })),
  ];

  useEffect(() => {
      const fetchAnalysis = async () => {
          setLoadingAi(true);
          const reason = await getPollutionCausalityAnalysis(localWard);
          setAiReason(reason);
          setLoadingAi(false);
      };
      fetchAnalysis();
  }, [localWard.id]);

  const handleReportSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setReportModalOpen(false);
      setEcoScore(prev => prev + 50); // Gamification
      alert("Report submitted successfully! You earned 50 EcoPoints.");
  };

  const getActivityStatus = (activity: string, aqi: number) => {
      const thresholds: any = {
          'jogging': 150,
          'cycling': 150,
          'kids': 100,
          'elderly': 80,
          'work': 300 // Commute
      };
      const limit = thresholds[activity] || 200;
      return aqi < limit ? 'Safe' : 'Avoid';
  };

  const getAQIColor = (cat: AQICategory) => {
      switch(cat) {
          case AQICategory.SEVERE: return 'from-red-500 to-red-600 shadow-red-200';
          case AQICategory.POOR: return 'from-orange-400 to-orange-500 shadow-orange-200';
          case AQICategory.MODERATE: return 'from-yellow-400 to-amber-500 shadow-yellow-200';
          case AQICategory.GOOD: return 'from-emerald-400 to-emerald-500 shadow-emerald-200';
      }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-sans">
      
      {/* 1. Header & Location Context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <MapPin size={16} className="text-blue-500" />
                  <span>Your Current Location</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{localWard.name}</h1>
              <p className="text-slate-500 text-sm">Ward ID: {localWard.id} • Updated Just Now</p>
          </div>
          
          {/* Eco Score Badge */}
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                  <Leaf size={20} />
              </div>
              <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">My Eco Score</div>
                  <div className="text-xl font-black text-slate-800 leading-none">{ecoScore}</div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 2. My Ward Right Now (Hero) */}
          <div className="lg:col-span-8 space-y-6">
              <div className={`rounded-3xl p-1 bg-gradient-to-br ${getAQIColor(localWard.category)} shadow-xl`}>
                  <div className="bg-white/95 backdrop-blur-sm rounded-[22px] p-6 md:p-8 h-full relative overflow-hidden">
                      {/* Decorative Background */}
                      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${getAQIColor(localWard.category)} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none`}></div>

                      <div className="flex flex-col md:flex-row gap-8 items-center">
                          {/* Left: Gauge */}
                          <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="96" cy="96" r="88" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
                                  <circle 
                                    cx="96" cy="96" r="88" 
                                    stroke="currentColor" 
                                    strokeWidth="16" 
                                    fill="transparent" 
                                    strokeDasharray={552} 
                                    strokeDashoffset={552 - (552 * Math.min(localWard.aqi, 500) / 500)} 
                                    className={`${localWard.category === AQICategory.SEVERE ? 'text-red-500' : localWard.category === AQICategory.POOR ? 'text-orange-500' : localWard.category === AQICategory.MODERATE ? 'text-yellow-500' : 'text-emerald-500'} transition-all duration-1000 ease-out`}
                                    strokeLinecap="round"
                                  />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                  <span className="text-5xl font-black text-slate-800">{localWard.aqi}</span>
                                  <span className="text-sm font-bold text-slate-400 uppercase">US AQI</span>
                              </div>
                          </div>

                          {/* Right: Info */}
                          <div className="flex-1 space-y-4">
                              <div>
                                  <h2 className={`text-3xl font-bold ${
                                      localWard.category === AQICategory.SEVERE ? 'text-red-600' : 
                                      localWard.category === AQICategory.POOR ? 'text-orange-500' : 
                                      localWard.category === AQICategory.MODERATE ? 'text-yellow-600' : 'text-emerald-600'
                                  }`}>
                                      {localWard.category} Air Quality
                                  </h2>
                                  <p className="text-slate-600 mt-2 font-medium">
                                      Dominant Pollutant: <span className="font-bold text-slate-800">PM2.5</span> (Fine Particulate Matter)
                                  </p>
                              </div>

                              {/* AI Causality Module */}
                              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
                                  <div className="absolute top-4 right-4 text-blue-500 animate-pulse"><Zap size={18} fill="currentColor" /></div>
                                  <h3 className="text-sm font-bold text-slate-800 mb-1">Why is my ward polluted right now?</h3>
                                  <p className="text-sm text-slate-600 leading-relaxed min-h-[40px]">
                                      {loadingAi ? "Analyzing satellite and sensor data..." : aiReason}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* 3. Pollution Source Breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Info size={20} className="text-slate-400" /> What's causing this?
                  </h3>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-48 h-48">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie 
                                    data={pollutionSources} 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                  >
                                      {pollutionSources.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} />
                                      ))}
                                  </Pie>
                                  <RechartsTooltip />
                              </PieChart>
                          </ResponsiveContainer>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                          {pollutionSources.map((s, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: s.color}}></div>
                                  <div>
                                      <div className="text-sm font-bold text-slate-800">{s.value}%</div>
                                      <div className="text-xs text-slate-500">{s.name}</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* 4. Forecast & Safe Windows */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={20} className="text-blue-500" /> 72-Hour Forecast & Safe Windows
                    </h3>
                  </div>
                  
                  {/* Timeline Scroller */}
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                      {extendedForecast.map((point, i) => (
                          <div key={i} className={`flex-shrink-0 w-24 p-3 rounded-xl border flex flex-col items-center text-center ${
                              point.safe ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200'
                          }`}>
                              <span className="text-xs text-slate-400 font-medium mb-1">{point.time}</span>
                              <span className={`text-lg font-bold mb-1 ${point.safe ? 'text-emerald-600' : 'text-slate-700'}`}>
                                  {point.val}
                              </span>
                              {point.safe && (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                                      SAFE
                                  </span>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
              
              {/* 5. Activity Safety Advisor */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <ShieldCheck size={20} className="text-emerald-500" /> Activity Safety Advisor
                  </h3>
                  <div className="space-y-3">
                      {[
                          { id: 'jogging', label: 'Outdoor Jogging', icon: <Footprints size={18} /> },
                          { id: 'kids', label: 'Kids Playing Out', icon: <Baby size={18} /> },
                          { id: 'cycling', label: 'Cycling', icon: <Bike size={18} /> },
                          { id: 'work', label: 'Commute to Work', icon: <Briefcase size={18} /> },
                      ].map((activity) => {
                          const status = getActivityStatus(activity.id, localWard.aqi);
                          return (
                              <div key={activity.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                  <div className="flex items-center gap-3 text-slate-700">
                                      <div className="bg-white p-2 rounded-lg shadow-sm text-slate-500">{activity.icon}</div>
                                      <span className="font-medium text-sm">{activity.label}</span>
                                  </div>
                                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                      status === 'Safe' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                      {status === 'Safe' ? <Smile size={14} /> : <Frown size={14} />}
                                      {status}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>

              {/* 6. Health Risk Meter */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                   <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Heart size={20} className="text-red-500" /> Health Impact
                  </h3>
                  <div className="space-y-4">
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                          <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">General Population</h4>
                          <p className="text-sm text-blue-900 leading-snug">
                              {localWard.category === AQICategory.GOOD ? "Enjoy the outdoors!" : "Reduce prolonged exertion outside."}
                          </p>
                      </div>
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                          <h4 className="text-xs font-bold text-red-700 uppercase tracking-wide mb-1">Vulnerable Groups</h4>
                          <p className="text-sm text-red-900 leading-snug">
                              Children, elderly, and asthmatics should {localWard.category === AQICategory.SEVERE ? "strictly stay indoors." : "limit outdoor exposure."}
                          </p>
                      </div>
                  </div>
              </div>

               {/* 7. Safe Zone Finder */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                   <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Navigation size={20} className="text-blue-500" /> Cleaner Zones Nearby
                  </h3>
                  <div className="space-y-3">
                      {safeZones.map(zone => (
                          <div key={zone.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                              <div>
                                  <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600">{zone.name.split(',')[0]}</div>
                                  <div className="text-xs text-slate-400">~{zone.distance.toFixed(1)} km away</div>
                              </div>
                              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold">
                                  {zone.aqi} AQI
                              </span>
                          </div>
                      ))}
                  </div>
               </div>

          </div>

      </div>

      {/* 8. Bottom Section: Action & Reporting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Gov Action Ticker */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">What is being done?</h3>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">Civic Action Tracker</span>
              </div>
              <div className="space-y-4">
                  {govActions.length > 0 ? govActions.map(action => (
                      <div key={action.id} className="flex gap-4 items-start">
                          <div className={`mt-1 p-1 rounded-full ${action.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                              <CheckCircle2 size={16} />
                          </div>
                          <div>
                              <div className="font-bold text-slate-800 text-sm">{action.title}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{action.department} • {action.lastUpdated}</div>
                          </div>
                      </div>
                  )) : (
                      <p className="text-sm text-slate-500 italic">No major actions reported in the last 24h.</p>
                  )}
              </div>
          </div>

          {/* Reporting Tool */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
               
               <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10">
                   <Megaphone size={20} className="text-yellow-400" /> Spot Pollution?
               </h3>
               <p className="text-slate-300 text-sm mb-6 relative z-10">
                   Report garbage burning, construction dust, or industrial smoke. Help us verify sensor data.
               </p>
               
               <button 
                onClick={() => setReportModalOpen(true)}
                className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 relative z-10"
               >
                   <Camera size={18} /> Report an Incident
               </button>
          </div>
      </div>
      
      {/* 9. Micro-Actions Footer */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
          <h3 className="text-blue-900 font-bold mb-4">Today's Micro-Action for Cleaner Air</h3>
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm text-blue-800 font-medium">
              <span className="bg-blue-100 p-1.5 rounded-full"><Award size={16} /></span>
              "Turn off your car engine at red lights today."
          </div>
      </div>

      {/* Report Modal (Simple Simulation) */}
      {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Report Pollution Incident</h3>
                  <form onSubmit={handleReportSubmit} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Incident Type</label>
                          <select 
                            className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                          >
                              <option>Garbage Burning</option>
                              <option>Construction Dust</option>
                              <option>Industrial Smoke</option>
                              <option>Vehicle Emission</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                          <textarea 
                            className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                            placeholder="Describe what you see..."
                          ></textarea>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                          <MapPin size={14} /> Location will be tagged automatically.
                      </div>
                      <div className="flex gap-3 pt-2">
                          <button 
                            type="button" 
                            onClick={() => setReportModalOpen(false)}
                            className="flex-1 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                          >
                              Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="flex-1 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200"
                          >
                              Submit Report
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default CitizenView;