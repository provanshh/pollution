import React from 'react';
import { Ward, AQICategory } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';

interface TrendsViewProps {
  wards: Ward[];
}

const TrendsView: React.FC<TrendsViewProps> = ({ wards }) => {
  // Aggregate data for city-wide charts
  const avgAQI = Math.round(wards.reduce((acc, w) => acc + w.aqi, 0) / wards.length);
  
  // Histogram data
  const distributionData = [
    { name: 'Good', value: wards.filter(w => w.category === AQICategory.GOOD).length, color: '#10b981' },
    { name: 'Moderate', value: wards.filter(w => w.category === AQICategory.MODERATE).length, color: '#f59e0b' },
    { name: 'Poor', value: wards.filter(w => w.category === AQICategory.POOR).length, color: '#f97316' },
    { name: 'Severe', value: wards.filter(w => w.category === AQICategory.SEVERE).length, color: '#ef4444' },
  ];

  // Dummy 7-day data
  const weeklyData = [
      { day: 'Mon', aqi: 120 }, { day: 'Tue', aqi: 135 }, { day: 'Wed', aqi: 110 }, 
      { day: 'Thu', aqi: 145 }, { day: 'Fri', aqi: 160 }, { day: 'Sat', aqi: 90 }, { day: 'Sun', aqi: 85 }
  ];

  // Simulated Pollutant Composition Trend
  const pollutantTrendData = [
      { time: '06:00', pm25: 80, pm10: 120, no2: 40 },
      { time: '09:00', pm25: 140, pm10: 180, no2: 85 }, // Traffic peak
      { time: '12:00', pm25: 110, pm10: 150, no2: 60 },
      { time: '15:00', pm25: 100, pm10: 140, no2: 55 },
      { time: '18:00', pm25: 150, pm10: 200, no2: 90 }, // Evening peak
      { time: '21:00', pm25: 130, pm10: 170, no2: 70 },
  ];

  // Radar Chart Data - Risk Profile (Averaged across high pollution wards)
  const severeWards = wards.filter(w => w.aqi > 200);
  const targetWards = severeWards.length > 0 ? severeWards : wards;
  const avgRisk = {
      respiratory: Math.round(targetWards.reduce((a, w) => a + w.pollutants.pm25, 0) / targetWards.length / 2),
      visibility: Math.round(targetWards.reduce((a, w) => a + w.pollutants.pm10, 0) / targetWards.length / 3),
      toxicity: Math.round(targetWards.reduce((a, w) => a + w.pollutants.no2, 0) / targetWards.length),
      traffic: Math.round(targetWards.reduce((a, w) => a + w.trafficIndex, 0) / targetWards.length),
      industrial: Math.round(targetWards.reduce((a, w) => a + (w.primarySources.includes('Industrial') ? 100 : 20), 0) / targetWards.length),
  };

  const riskData = [
      { subject: 'Respiratory Risk', A: avgRisk.respiratory, fullMark: 150 },
      { subject: 'Visibility Loss', A: avgRisk.visibility, fullMark: 150 },
      { subject: 'Toxicity', A: avgRisk.toxicity, fullMark: 150 },
      { subject: 'Traffic Stress', A: avgRisk.traffic, fullMark: 100 },
      { subject: 'Industrial Load', A: avgRisk.industrial, fullMark: 100 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">City-Wide Trends & Insights</h1>
        <p className="text-slate-500">Aggregated pollution data analysis across all municipal zones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Trend */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">7-Day City Average AQI</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                        <defs>
                            <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Area type="monotone" dataKey="aqi" stroke="#6366f1" fillOpacity={1} fill="url(#colorWeekly)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Current Ward Status Distribution</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData} layout="vertical">
                         <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                            {distributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pollutant Composition */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-2">Hourly Pollutant Breakdown</h3>
              <p className="text-xs text-slate-500 mb-6">Correlating PM2.5, PM10 and NO2 spikes with traffic hours.</p>
              <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={pollutantTrendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip contentStyle={{borderRadius: '8px'}}/>
                          <Legend />
                          <Line type="monotone" dataKey="pm25" stroke="#8884d8" strokeWidth={2} name="PM2.5" />
                          <Line type="monotone" dataKey="pm10" stroke="#82ca9d" strokeWidth={2} name="PM10" />
                          <Line type="monotone" dataKey="no2" stroke="#ff7300" strokeWidth={2} name="NO2" />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Risk Profile Radar */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-2">Environmental Risk Profile</h3>
              <p className="text-xs text-slate-500 mb-6">Multi-dimensional risk assessment for high-priority wards.</p>
              <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 150]} />
                          <Radar name="City Average" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                          <Tooltip />
                      </RadarChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>

      {/* Top 5 Polluted vs Cleanest */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-red-50 p-4 border-b border-red-100">
                <h3 className="font-bold text-red-800">Top 5 Most Polluted Wards</h3>
            </div>
            <div className="p-0">
                {[...wards].sort((a,b) => b.aqi - a.aqi).slice(0, 5).map((w, i) => (
                    <div key={w.id} className="flex justify-between items-center p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">{i+1}</span>
                            <span className="font-medium text-slate-700">{w.name}</span>
                        </div>
                        <span className="font-bold text-red-600">{w.aqi}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="bg-emerald-50 p-4 border-b border-emerald-100">
                <h3 className="font-bold text-emerald-800">Top 5 Cleanest Wards</h3>
            </div>
            <div className="p-0">
                {[...wards].sort((a,b) => a.aqi - b.aqi).slice(0, 5).map((w, i) => (
                    <div key={w.id} className="flex justify-between items-center p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">{i+1}</span>
                            <span className="font-medium text-slate-700">{w.name}</span>
                        </div>
                        <span className="font-bold text-emerald-600">{w.aqi}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsView;