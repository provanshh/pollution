import React, { useState } from 'react';
import { Ward, AQICategory } from '../types';
import { AlertTriangle, CheckCircle, FileText, Siren, Play, BarChart2, Filter, Settings, Truck, Zap } from 'lucide-react';

interface AdminViewProps {
  wards: Ward[];
}

const AdminView: React.FC<AdminViewProps> = ({ wards }) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL'>('ALL');
  // Simulation State
  const [policies, setPolicies] = useState({
      oddEven: false,
      constructionBan: false,
      industrialCurfew: false
  });
  
  const sortedWards = [...wards].sort((a, b) => b.aqi - a.aqi);
  const displayedWards = filter === 'CRITICAL' 
    ? sortedWards.filter(w => w.category === AQICategory.SEVERE || w.category === AQICategory.POOR) 
    : sortedWards;

  const severeCount = wards.filter(w => w.category === AQICategory.SEVERE || w.category === AQICategory.POOR).length;
  const avgAqi = Math.round(wards.reduce((acc, w) => acc + w.aqi, 0) / wards.length);

  // Calculate Impact
  let reductionPercentage = 0;
  if (policies.oddEven) reductionPercentage += 12;
  if (policies.constructionBan) reductionPercentage += 8;
  if (policies.industrialCurfew) reductionPercentage += 15;

  const simulatedAvgAqi = Math.round(avgAqi * (1 - reductionPercentage / 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">City Governance Dashboard</h1>
            <p className="text-slate-500">Monitor compliance, enforce regulations, and simulate policy impacts.</p>
        </div>
        <div className="flex gap-3">
             <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 shadow-sm flex items-center gap-2">
                <FileText size={16} /> Generate Daily Report
             </button>
        </div>
      </div>

      {/* Policy Simulation Lab */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg text-white"><Zap size={20} /></div>
            <div>
                <h2 className="text-lg font-bold text-indigo-900">Policy Simulation Lab</h2>
                <p className="text-sm text-indigo-700">Test the impact of emergency interventions on city-wide AQI.</p>
            </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                    onClick={() => setPolicies(p => ({...p, oddEven: !p.oddEven}))}
                    className={`p-4 rounded-xl border text-left transition-all ${policies.oddEven ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-indigo-100 hover:border-indigo-300 text-slate-600'}`}
                >
                    <div className="font-bold mb-1">Odd-Even Traffic</div>
                    <div className="text-xs opacity-80">Reduces vehicular emissions by approx 12%.</div>
                </button>
                <button 
                    onClick={() => setPolicies(p => ({...p, constructionBan: !p.constructionBan}))}
                    className={`p-4 rounded-xl border text-left transition-all ${policies.constructionBan ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-indigo-100 hover:border-indigo-300 text-slate-600'}`}
                >
                    <div className="font-bold mb-1">Halt Construction</div>
                    <div className="text-xs opacity-80">Reduces PM10 dust levels by approx 8%.</div>
                </button>
                <button 
                    onClick={() => setPolicies(p => ({...p, industrialCurfew: !p.industrialCurfew}))}
                    className={`p-4 rounded-xl border text-left transition-all ${policies.industrialCurfew ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-indigo-100 hover:border-indigo-300 text-slate-600'}`}
                >
                    <div className="font-bold mb-1">Industrial Curfew</div>
                    <div className="text-xs opacity-80">Reduces NO2 & SO2 levels by approx 15%.</div>
                </button>
            </div>

            {/* Result */}
            <div className="bg-white rounded-xl p-4 border border-indigo-100 flex flex-col justify-center items-center text-center">
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Projected City AQI</div>
                <div className="text-5xl font-black text-indigo-600 mt-2">{simulatedAvgAqi}</div>
                {reductionPercentage > 0 && (
                    <div className="mt-2 inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                        ↓ {reductionPercentage}% Reduction Expected
                    </div>
                )}
                <div className="mt-3 text-xs text-slate-400">Baseline: {avgAqi} AQI</div>
            </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Critical Wards</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{severeCount}</h3>
                </div>
                <div className="p-2 rounded-lg bg-red-100 text-red-600">
                    <Siren size={20} />
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Requires immediate intervention</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Active Violations</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">8</h3>
                </div>
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <AlertTriangle size={20} />
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">3 Industrial, 5 Construction</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Pending Actions</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">12</h3>
                </div>
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FileText size={20} />
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Approvals needed</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Smog Guns</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">45/60</h3>
                </div>
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                    <Truck size={20} />
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Deployed in hotspots</p>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Ward Performance & Action List</h2>
            <div className="flex gap-2">
                <button 
                    onClick={() => setFilter('ALL')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${filter === 'ALL' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    All Wards
                </button>
                <button 
                    onClick={() => setFilter('CRITICAL')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${filter === 'CRITICAL' ? 'bg-white shadow text-red-600' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    Critical Only
                </button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-3 font-semibold">Ward</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                        <th className="px-6 py-3 font-semibold">AQI Level</th>
                        <th className="px-6 py-3 font-semibold">Primary Source</th>
                        <th className="px-6 py-3 font-semibold">Traffic Index</th>
                        <th className="px-6 py-3 font-semibold">Recommended Action</th>
                        <th className="px-6 py-3 font-semibold">Controls</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {displayedWards.map((ward) => (
                        <tr key={ward.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">{ward.name}</div>
                                <div className="text-xs text-slate-500">{ward.id}</div>
                            </td>
                            <td className="px-6 py-4">
                                {ward.category === AQICategory.SEVERE || ward.category === AQICategory.POOR ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span> Alert
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Stable
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <span className="font-bold text-slate-700">{ward.aqi}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{ward.primarySources[0]}</td>
                            <td className="px-6 py-4 text-sm">
                                <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className={`h-full ${ward.trafficIndex > 70 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                        style={{ width: `${ward.trafficIndex}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-slate-500 mt-1 block">{ward.trafficIndex}/100</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {ward.category === AQICategory.SEVERE 
                                    ? <span className="text-red-700 font-medium">Deploy Smog Guns</span>
                                    : ward.category === AQICategory.POOR 
                                    ? "Traffic Diversion" 
                                    : "Routine Monitor"}
                            </td>
                            <td className="px-6 py-4">
                                <button className="text-blue-600 text-sm font-medium hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Manage
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;