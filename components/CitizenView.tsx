import React, { useState, useEffect } from 'react';
import { Ward, AQICategory, CitizenReport, GovAction } from '../types';
import { getGovActions, getPollutionSources } from '../services/dataService';
import { getPollutionCausalityAnalysis } from '../services/geminiService';
import { 
    Heart, Wind, Info, MapPin, AlertTriangle, ShieldCheck, Navigation, 
    Zap, Bike, Footprints, Baby, Briefcase, Smile, Frown, Megaphone, 
    CheckCircle2, Camera, Clock, Award, Leaf, ChevronRight, X, UploadCloud
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      setSelectedFile(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
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
          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 p-2.5 rounded-full text-emerald-600">
                  <Leaf size={24} />
              </div>
              <div>
                  <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">My Eco Score</div>
                  <div className="text-2xl font-black text-slate-800 leading-none">{ecoScore}</div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 2. My Ward Right Now (Hero & Main Content) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
              <div className={`rounded-3xl p-1 bg-gradient-to-br ${getAQIColor(localWard.category)} shadow-xl`}>
                  <div className="bg-white/95 backdrop-blur-sm rounded-[22px] p-6 md:p-10 h-full relative overflow-hidden">
                      {/* Decorative Background */}
                      <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${getAQIColor(localWard.category)} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none`}></div>

                      <div className="flex flex-col md:flex-row gap-10 items-center">
                          {/* Left: Gauge */}
                          <div className="relative w-52 h-52 flex-shrink-0 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="104" cy="104" r="96" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
                                  <circle 
                                    cx="104" cy="104" r="96" 
                                    stroke="currentColor" 
                                    strokeWidth="16" 
                                    fill="transparent" 
                                    strokeDasharray={602} 
                                    strokeDashoffset={602 - (602 * Math.min(localWard.aqi, 500) / 500)} 
                                    className={`${localWard.category === AQICategory.SEVERE ? 'text-red-500' : localWard.category === AQICategory.POOR ? 'text-orange-500' : localWard.category === AQICategory.MODERATE ? 'text-yellow-500' : 'text-emerald-500'} transition-all duration-1000 ease-out`}
                                    strokeLinecap="round"
                                  />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                  <span className="text-6xl font-black text-slate-800 tracking-tight">{localWard.aqi}</span>
                                  <span className="text-sm font-bold text-slate-400 uppercase mt-1">US AQI</span>
                              </div>
                          </div>

                          {/* Right: Info */}
                          <div className="flex-1 space-y-5 w-full">
                              <div>
                                  <h2 className={`text-4xl font-bold ${
                                      localWard.category === AQICategory.SEVERE ? 'text-red-600' : 
                                      localWard.category === AQICategory.POOR ? 'text-orange-500' : 
                                      localWard.category === AQICategory.MODERATE ? 'text-yellow-600' : 'text-emerald-600'
                                  }`}>
                                      {localWard.category} Air
                                  </h2>
                                  <p className="text-slate-600 mt-2 font-medium text-lg">
                                      Dominant Pollutant: <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">PM2.5</span>
                                  </p>
                              </div>

                              {/* AI Causality Module */}
                              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/60 relative hover:border-blue-200 transition-colors">
                                  <div className="absolute top-5 right-5 text-blue-500 animate-pulse"><Zap size={20} fill="currentColor" /></div>
                                  <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">AI Analysis</h3>
                                  <p className="text-slate-700 leading-relaxed min-h-[40px]">
                                      {loadingAi ? (
                                        <span className="flex items-center gap-2 text-slate-400 italic">
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span> Analyzing...
                                        </span>
                                      ) : aiReason}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* 3. Pollution Source Breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Info size={24} className="text-blue-500" /> What's causing the pollution?
                  </h3>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="w-56 h-56 flex-shrink-0 relative">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie 
                                    data={pollutionSources} 
                                    innerRadius={70} 
                                    outerRadius={95} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                    cornerRadius={4}
                                  >
                                      {pollutionSources.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                      ))}
                                  </Pie>
                                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                              </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-slate-400 text-xs font-bold uppercase">Sources</span>
                          </div>
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                          {pollutionSources.map((s, i) => (
                              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors">
                                  <div className="w-4 h-4 rounded-full shadow-sm flex-shrink-0" style={{backgroundColor: s.color}}></div>
                                  <div className="flex-1">
                                      <div className="flex justify-between items-baseline mb-0.5">
                                        <div className="text-sm font-bold text-slate-700">{s.name}</div>
                                        <div className="text-lg font-black text-slate-900">{s.value}%</div>
                                      </div>
                                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                          <div className="h-full rounded-full" style={{width: `${s.value}%`, backgroundColor: s.color}}></div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* 4. Forecast & Safe Windows */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={24} className="text-blue-500" /> 72-Hour Forecast
                    </h3>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Updated 5m ago</span>
                  </div>
                  
                  {/* Timeline Scroller */}
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                      {extendedForecast.map((point, i) => (
                          <div key={i} className={`flex-shrink-0 w-28 p-4 rounded-2xl border flex flex-col items-center text-center snap-start transition-transform hover:scale-105 ${
                              point.safe ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-200'
                          }`}>
                              <span className="text-xs text-slate-400 font-bold uppercase mb-2">{point.time}</span>
                              <span className={`text-2xl font-black mb-2 ${point.safe ? 'text-emerald-600' : 'text-slate-700'}`}>
                                  {point.val}
                              </span>
                              {point.safe ? (
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md w-full">
                                      SAFE
                                  </span>
                              ) : (
                                   <span className="px-2 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-md w-full">
                                      --
                                  </span>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* 5. Activity Safety Advisor */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
                  <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                      <ShieldCheck size={20} className="text-emerald-500" /> Can I go outside?
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
                              <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                                  <div className="flex items-center gap-4 text-slate-700">
                                      <div className="bg-white p-2.5 rounded-xl shadow-sm text-slate-500 border border-slate-100">{activity.icon}</div>
                                      <span className="font-bold text-sm">{activity.label}</span>
                                  </div>
                                  <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
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
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
                   <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                      <Heart size={20} className="text-red-500" /> Health Impact
                  </h3>
                  <div className="space-y-4">
                      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                          <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> General Population
                          </h4>
                          <p className="text-sm text-blue-900 leading-snug font-medium">
                              {localWard.category === AQICategory.GOOD ? "Air quality is good. Enjoy your outdoor activities!" : "Consider reducing prolonged or heavy exertion outdoors."}
                          </p>
                      </div>
                      <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                          <h4 className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Vulnerable Groups
                          </h4>
                          <p className="text-sm text-red-900 leading-snug font-medium">
                              Children, elderly, and asthmatics should {localWard.category === AQICategory.SEVERE ? "strictly avoid all outdoor exertion." : "limit prolonged outdoor exposure."}
                          </p>
                      </div>
                  </div>
              </div>

               {/* 7. Safe Zone Finder */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
                   <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                      <Navigation size={20} className="text-blue-500" /> Cleaner Zones Nearby
                  </h3>
                  <div className="space-y-3">
                      {safeZones.map(zone => (
                          <div key={zone.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-200 hover:shadow-sm">
                              <div>
                                  <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{zone.name.split(',')[0]}</div>
                                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                    <MapPin size={10} /> {zone.distance.toFixed(1)} km away
                                  </div>
                              </div>
                              <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-emerald-200">
                                  {zone.aqi} AQI
                              </span>
                          </div>
                      ))}
                  </div>
               </div>
          </div>

      </div>

      {/* 8. Bottom Section: Action & Reporting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Gov Action Ticker */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Governance Tracker</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">Civic Actions</span>
              </div>
              <div className="space-y-4 flex-1">
                  {govActions.length > 0 ? govActions.map(action => (
                      <div key={action.id} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                          <div className={`mt-1 p-1.5 rounded-full shrink-0 ${action.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                              <CheckCircle2 size={18} />
                          </div>
                          <div>
                              <div className="font-bold text-slate-800 text-sm">{action.title}</div>
                              <div className="text-xs text-slate-500 mt-1 font-medium">{action.department} • {action.lastUpdated}</div>
                          </div>
                      </div>
                  )) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm italic">
                          <Info size={24} className="mb-2 opacity-50"/>
                          No major actions reported in the last 24h.
                      </div>
                  )}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                   <button className="w-full py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                       View All Past Actions
                   </button>
              </div>
          </div>

          {/* Reporting Tool */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-6 md:p-8 text-white relative overflow-hidden h-full flex flex-col justify-center">
               <div className="absolute top-0 right-0 p-40 bg-blue-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
               <div className="absolute bottom-0 left-0 p-32 bg-purple-600 rounded-full blur-3xl opacity-20 translate-y-1/3 -translate-x-1/3"></div>
               
               <div className="relative z-10">
                   <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                        <Megaphone size={24} className="text-yellow-400" />
                   </div>
                   
                   <h3 className="text-2xl font-bold mb-3">Spot Pollution? Report It.</h3>
                   <p className="text-slate-300 text-sm mb-8 leading-relaxed max-w-md">
                       Your reports help calibrate our sensor network. Report garbage burning, construction dust, or industrial smoke instantly.
                   </p>
                   
                   <button 
                    onClick={() => setReportModalOpen(true)}
                    className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-lg shadow-black/20 group"
                   >
                       <Camera size={20} className="group-hover:scale-110 transition-transform text-blue-600" /> Report an Incident
                   </button>
               </div>
          </div>
      </div>
      
      {/* 9. Micro-Actions Footer */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
          <h3 className="text-blue-900 font-bold mb-4">Today's Micro-Action for Cleaner Air</h3>
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm text-blue-800 font-medium border border-blue-100 hover:shadow-md transition-shadow cursor-default">
              <span className="bg-blue-100 p-1.5 rounded-full"><Award size={16} /></span>
              "Turn off your car engine at red lights today."
          </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
                  <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-2 border-b border-slate-50">
                      <h3 className="text-xl font-bold text-slate-900">Report Pollution</h3>
                      <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={20} />
                      </button>
                  </div>
                  <form onSubmit={handleReportSubmit} className="space-y-5">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Incident Type</label>
                          <select 
                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow font-medium text-slate-700"
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
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                          <textarea 
                            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none transition-shadow font-medium text-slate-700 placeholder:font-normal"
                            placeholder="Describe what you see..."
                          ></textarea>
                      </div>

                      {/* Photo Upload Section */}
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Upload Photo Evidence</label>
                          <div className="flex items-center justify-center w-full">
                              <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors ${selectedFile ? 'border-blue-500 bg-blue-50' : ''}`}>
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      {selectedFile ? (
                                        <>
                                            <CheckCircle2 size={32} className="text-green-500 mb-2" />
                                            <p className="text-sm text-slate-700 font-bold">{selectedFile.name}</p>
                                            <p className="text-xs text-slate-500">Click to replace</p>
                                        </>
                                      ) : (
                                        <>
                                            <UploadCloud size={32} className="text-slate-400 mb-2" />
                                            <p className="text-xs text-slate-500 font-medium"><span className="font-bold text-blue-600">Click to upload</span> or drag and drop</p>
                                            <p className="text-[10px] text-slate-400 mt-1">SVG, PNG, JPG (MAX. 5MB)</p>
                                        </>
                                      )}
                                  </div>
                                  <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                              </label>
                          </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs text-blue-700 flex items-center gap-2 font-medium">
                          <MapPin size={14} /> Location will be tagged automatically.
                      </div>
                      <div className="flex gap-3 pt-2">
                          <button 
                            type="button" 
                            onClick={() => setReportModalOpen(false)}
                            className="flex-1 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="flex-1 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]"
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