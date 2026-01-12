import React, { useState } from 'react';
import { Ward, AQICategory } from '../types';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ScatterChart, Scatter } from 'recharts';
import { Wind, Droplets, Thermometer, Factory, Activity, Zap, AlertTriangle, TrendingUp, TrendingDown, RefreshCw, Car, HardHat, Plus, X, ArrowRightLeft } from 'lucide-react';
import { getWardAnalysis } from '../services/geminiService';

interface WardAnalyticsProps {
  ward: Ward;
  allWards: Ward[];
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            active 
            ? 'border-blue-600 text-blue-600' 
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        }`}
    >
        {children}
    </button>
);

const MetricCard = ({ label, value, unit, icon, trend }: any) => (
    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:border-slate-200 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                {icon} {label}
            </span>
            {trend && (
                <span className={`text-xs font-bold ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </span>
            )}
        </div>
        <div className="text-2xl font-bold text-slate-900">
            {value} <span className="text-sm font-medium text-slate-400 ml-0.5">{unit}</span>
        </div>
    </div>
);

const WardAnalytics: React.FC<WardAnalyticsProps> = ({ ward, allWards }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'forecast' | 'correlation' | 'compare'>('overview');
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);

  const handleGenerateInsight = async () => {
    setLoadingAi(true);
    const result = await getWardAnalysis(ward);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  const comparisonWards = allWards.filter(w => comparisonIds.includes(w.id));
  const availableWards = allWards.filter(w => w.id !== ward.id && !comparisonIds.includes(w.id));

  // Data Preparations
  const trendData = ward.trend.map((val, idx) => ({ time: `${idx}:00`, aqi: val }));
  
  const forecastData = ward.forecast.map((val, idx) => ({ 
    time: `+${idx+1}h`, 
    aqi: val, 
    threshold: 100 
  }));

  // Comparison Forecast Data Merging
  const comparisonForecastData = ward.forecast.map((_, i) => {
      const point: any = { time: `+${i+1}h` };
      point[ward.name] = ward.forecast[i];
      comparisonWards.forEach(cw => {
          point[cw.name] = cw.forecast[i];
      });
      return point;
  });
  
  // Correlation Data
  const correlationData = Array.from({ length: 12 }, (_, i) => ({
      hour: i,
      aqi: ward.trend[i * 2] || 100,
      traffic: Math.min(100, (ward.trafficIndex * (0.8 + Math.random() * 0.4))),
  }));

  const getAQIColor = (cat: AQICategory) => {
    switch (cat) {
        case AQICategory.GOOD: return 'text-emerald-600';
        case AQICategory.MODERATE: return 'text-amber-500';
        case AQICategory.POOR: return 'text-orange-500';
        case AQICategory.SEVERE: return 'text-red-600';
        default: return 'text-slate-600';
    }
  };

  const getAQIBg = (cat: AQICategory) => {
    switch (cat) {
        case AQICategory.GOOD: return 'bg-emerald-50 border-emerald-100';
        case AQICategory.MODERATE: return 'bg-amber-50 border-amber-100';
        case AQICategory.POOR: return 'bg-orange-50 border-orange-100';
        case AQICategory.SEVERE: return 'bg-red-50 border-red-100';
        default: return 'bg-slate-50 border-slate-100';
    }
  };

  const getPrimaryPollutant = (w: Ward = ward) => {
    const entries = Object.entries(w.pollutants);
    if (entries.length === 0) return { name: 'N/A', val: 0 };
    const maxEntry = entries.reduce((max, current) => current[1] > max[1] ? current : max, entries[0]);
    let name = maxEntry[0].toUpperCase();
    if (name === 'PM25') name = 'PM2.5';
    if (name === 'PM10') name = 'PM10';
    return { name, val: maxEntry[1] };
  };

  const primaryPollutant = getPrimaryPollutant(ward).name;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
      {/* Ward Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {ward.name}
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">{ward.id}</span>
          </h2>
          <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-2">
            {ward.zone} Zone <span className="text-slate-300">|</span> {ward.population.toLocaleString()} Residents
          </p>
        </div>
        <button 
            onClick={handleGenerateInsight}
            disabled={loadingAi}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
            <Zap size={14} className={loadingAi ? 'animate-spin' : 'fill-blue-700'} />
            {loadingAi ? 'Analyzing...' : 'AI Insight'}
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
        
        {/* Live AQI Big Card */}
        <div className={`rounded-2xl p-6 border ${getAQIBg(ward.category)} transition-colors relative overflow-hidden`}>
            {/* Live Indicator Pulse */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                 <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live</span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="text-7xl font-black tracking-tighter text-slate-900">{ward.aqi}</div>
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-2xl font-bold ${getAQIColor(ward.category)}`}>{ward.category}</span>
                        <div className="flex items-center gap-2 mt-1">
                             <span className="text-slate-600 text-sm font-medium">Primary Pollutant:</span>
                             <span className="bg-white/50 px-2 py-0.5 rounded text-sm font-bold text-slate-800 border border-slate-200/50">{primaryPollutant}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-8 border-l border-slate-200/50 pl-8">
                     <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Live Trend</div>
                        <div className="flex items-center gap-2 font-semibold text-slate-700">
                            {ward.aqi > 150 ? <TrendingUp className="text-red-500" size={18} /> : <TrendingDown className="text-green-500" size={18} />}
                            {ward.aqi > 150 ? 'Rising' : 'Stable'}
                        </div>
                     </div>
                     <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Last Updated</div>
                        <div className="flex items-center gap-2 font-semibold text-slate-700">
                             <RefreshCw size={14} className="text-slate-400 animate-spin-slow" /> Just now
                        </div>
                     </div>
                </div>
            </div>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <MetricCard label="Traffic Index" value={ward.trafficIndex} unit="/100" icon={<Car size={14} />} trend={5} />
             <MetricCard label="Wind Speed" value={ward.weather.windSpeed.toFixed(1)} unit="km/h" icon={<Wind size={14} />} />
             <MetricCard label="Temperature" value={ward.weather.temperature.toFixed(1)} unit="°C" icon={<Thermometer size={14} />} />
             <MetricCard label="Active Sites" value={ward.activeConstructionSites} unit="Zones" icon={<HardHat size={14} />} />
        </div>

        {/* Tabbed Analysis */}
        <div className="border-b border-slate-200 flex gap-2">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview & Trends</TabButton>
            <TabButton active={activeTab === 'forecast'} onClick={() => setActiveTab('forecast')}>AI Forecast</TabButton>
            <TabButton active={activeTab === 'correlation'} onClick={() => setActiveTab('correlation')}>Source Correlation</TabButton>
            <TabButton active={activeTab === 'compare'} onClick={() => setActiveTab('compare')}>Compare</TabButton>
        </div>

        <div className="min-h-[300px]">
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="h-64 w-full">
                        <h4 className="text-sm font-semibold text-slate-700 mb-4">24 Hour AQI Trend</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
                                />
                                <Area type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAqi)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-4">Pollutant Composition</h4>
                        <div className="grid grid-cols-5 gap-2">
                            {Object.entries(ward.pollutants).map(([key, val]) => (
                                <div key={key} className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">{key}</div>
                                    <div className="text-lg font-bold text-slate-800">{val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'forecast' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                     <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex gap-3">
                        <Zap className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold text-indigo-900 text-sm">AI Prediction Model (Live)</h4>
                            <p className="text-xs text-indigo-700 mt-1">
                                Real-time projection updating every 5s based on sensor streams. 
                                Pollution is expected to {ward.forecast[5] > ward.aqi ? 'rise' : 'stabilize'} over the next 4 hours.
                            </p>
                        </div>
                     </div>
                     <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecastData}>
                                <defs>
                                    <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" tick={{fontSize: 12}} />
                                <YAxis domain={[0, 'auto']} tick={{fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    labelStyle={{ color: '#64748b' }}
                                />
                                <Legend wrapperStyle={{paddingTop: '10px'}}/>
                                <Area 
                                    type="monotone" 
                                    dataKey="aqi" 
                                    name="Predicted AQI" 
                                    stroke="#6366f1" 
                                    strokeWidth={3} 
                                    fill="url(#forecastGradient)" 
                                    activeDot={{ r: 6 }}
                                />
                                <Line 
                                    type="step" 
                                    dataKey="threshold" 
                                    name="Safety Threshold (100 AQI)" 
                                    stroke="#ef4444" 
                                    strokeDasharray="4 4" 
                                    strokeWidth={2} 
                                    dot={false} 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'correlation' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-sm text-slate-500">Correlating traffic density with AQI spikes to identify vehicular contribution.</p>
                     <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={correlationData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="hour" label={{ value: 'Time (Hours ago)', position: 'insideBottom', offset: -5 }} />
                                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" />
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="aqi" name="AQI Level" stroke="#3b82f6" strokeWidth={2} />
                                <Line yAxisId="right" type="monotone" dataKey="traffic" name="Traffic Index" stroke="#f59e0b" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
            
            {activeTab === 'compare' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    {/* Controls */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-800">Compare with other wards</h4>
                            <span className="text-xs text-slate-400">{comparisonIds.length}/2 Selected</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                             {/* Selected Chips */}
                             <div className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                                {ward.name} <span className="bg-blue-200 text-blue-800 text-[10px] px-1 rounded">Current</span>
                             </div>
                             {comparisonWards.map(cw => (
                                 <div key={cw.id} className="bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                                     {cw.name}
                                     <button onClick={() => setComparisonIds(prev => prev.filter(id => id !== cw.id))} className="hover:text-red-500">
                                        <X size={14} />
                                     </button>
                                 </div>
                             ))}
                             
                             {/* Selector */}
                             {comparisonIds.length < 2 && (
                                 <div className="relative group">
                                     <button className="flex items-center gap-1 bg-white border border-dashed border-slate-300 text-slate-500 px-3 py-1.5 rounded-full text-xs hover:border-slate-400 hover:text-slate-700 transition-colors">
                                        <Plus size={14} /> Add Ward
                                     </button>
                                     <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-lg max-h-48 overflow-y-auto hidden group-hover:block z-50">
                                         {availableWards.map(aw => (
                                             <button 
                                                key={aw.id}
                                                onClick={() => setComparisonIds(prev => [...prev, aw.id])}
                                                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 border-b border-slate-50 last:border-0"
                                             >
                                                 {aw.name}
                                             </button>
                                         ))}
                                     </div>
                                 </div>
                             )}
                        </div>
                    </div>

                    {/* Stats Comparison Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[ward, ...comparisonWards].map((w, index) => {
                            const prim = getPrimaryPollutant(w);
                            return (
                            <div key={w.id} className={`p-4 rounded-xl border ${index === 0 ? 'bg-blue-50/30 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                                <h5 className="font-bold text-slate-800 text-sm truncate mb-3">{w.name}</h5>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500">AQI</span>
                                        <span className={`font-black text-xl ${getAQIColor(w.category)}`}>{w.aqi}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500">Primary ({prim.name})</span>
                                        <span className="font-mono font-bold text-slate-700 text-sm">{prim.val}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500">Traffic</span>
                                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-slate-500 h-full" style={{width: `${w.trafficIndex}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>

                    {/* Comparative Chart */}
                    <div className="h-64 w-full">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Forecast Comparison (24h)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={comparisonForecastData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" tick={{fontSize: 10}} />
                                <YAxis tick={{fontSize: 10}} />
                                <Tooltip contentStyle={{borderRadius: '8px'}} />
                                <Legend wrapperStyle={{fontSize: '12px'}} />
                                <Line type="monotone" dataKey={ward.name} stroke="#2563eb" strokeWidth={3} dot={false} />
                                {comparisonWards.map((cw, idx) => (
                                    <Line 
                                        key={cw.id} 
                                        type="monotone" 
                                        dataKey={cw.name} 
                                        stroke={idx === 0 ? '#ea580c' : '#16a34a'} 
                                        strokeWidth={2} 
                                        dot={false} 
                                        strokeDasharray="5 5"
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>

        {/* AI Analysis Panel */}
        {aiAnalysis && (
             <div className="mt-4 bg-slate-50 rounded-xl p-5 text-slate-700 text-sm leading-relaxed border border-blue-200/50 shadow-inner animate-in fade-in">
                <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                    <Zap size={16} /> Generated Mitigation Strategy
                </div>
                <div className="prose prose-sm max-w-none text-slate-600">
                        <div className="whitespace-pre-wrap">{aiAnalysis}</div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default WardAnalytics;