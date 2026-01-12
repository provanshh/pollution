import React from 'react';
import { ViewMode, Ward } from '../types';
import { ArrowRight, Activity, Map, Cpu, ShieldCheck, Radio, Search, Globe } from 'lucide-react';
import WardMap from './WardMap';
import WardSearch from './WardSearch';

interface LandingPageProps {
  wards: Ward[];
  onWardSelect: (ward: Ward) => void;
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ wards, onWardSelect, onStart }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <style>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            display: flex;
            animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
            animation-play-state: paused;
        }
      `}</style>
      
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden flex flex-col">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10 w-full flex-1 flex flex-col lg:flex-row gap-12 items-center">
             {/* Left Content */}
             <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200 text-sm font-medium animate-fade-in">
                    <Radio size={14} className="animate-pulse text-red-500" />
                    Live Sensor Network Active • Pan-India Coverage
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                    Real-Time Air Quality<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Intelligence Platform</span>
                </h1>
                
                <p className="text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Identify pollution hotspots instantly. 
                    Search any location like <strong>Connaught Place</strong>, <strong>Bandra West</strong>, or <strong>Indiranagar</strong> to get live, sensor-driven insights.
                </p>

                {/* Search Bar Container */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 max-w-lg mx-auto lg:mx-0 shadow-2xl relative z-20">
                    <div className="flex items-center gap-2 mb-2 text-slate-300 text-xs font-semibold tracking-wide">
                        <Search size={12} /> SEARCH WARD / CITY
                    </div>
                    <WardSearch wards={wards} onSelect={onWardSelect} />
                    <div className="mt-4 flex gap-2 text-xs text-slate-400 px-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            <span className="opacity-70">Trending:</span>
                            <span className="bg-white/5 px-2 py-1 rounded cursor-pointer hover:bg-white/10 hover:text-white transition-colors border border-transparent hover:border-white/20">📍 Delhi</span>
                            <span className="bg-white/5 px-2 py-1 rounded cursor-pointer hover:bg-white/10 hover:text-white transition-colors border border-transparent hover:border-white/20">📍 Mumbai</span>
                            <span className="bg-white/5 px-2 py-1 rounded cursor-pointer hover:bg-white/10 hover:text-white transition-colors border border-transparent hover:border-white/20">📍 Bangalore</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                    <button 
                        onClick={onStart}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                    >
                        Access National Dashboard <ArrowRight size={18} />
                    </button>
                </div>
            </div>
            
            {/* Right Content - Live Map Preview */}
            <div className="w-full lg:w-1/2 h-[500px] relative perspective-1000">
                <div className="bg-slate-800 rounded-2xl p-1.5 shadow-2xl overflow-hidden ring-1 ring-slate-700/50 relative h-full transform hover:rotate-0 transition-all duration-700 lg:rotate-1">
                    {/* Map Header */}
                    <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-blue-500"/> 
                            <span className="font-bold text-slate-200 text-sm tracking-wide">NATIONAL POLLUTION GRID</span>
                        </div>
                        <div className="flex gap-2 text-[10px] font-mono text-slate-400 items-center">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span>REAL-TIME FEED</span>
                        </div>
                    </div>
                    
                    <div className="h-full w-full bg-slate-900 relative group pb-10">
                        <WardMap 
                            wards={wards} 
                            selectedWardId={null} 
                            onSelectWard={onWardSelect} 
                        />
                        {/* Overlay CTA */}
                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur">
                                Select a ward to analyze
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Live Data Ticker */}
        <div className="bg-slate-950/80 backdrop-blur border-t border-slate-800 h-12 flex items-center overflow-hidden z-20">
            <div className="animate-marquee whitespace-nowrap flex gap-12 px-4">
                {[...wards, ...wards].map((w, i) => (
                    <div key={`${w.id}-${i}`} className="flex items-center gap-3 text-sm font-mono text-slate-400">
                        <span className="font-bold text-slate-200">{w.name.split(',')[0]}</span>
                        <div className="h-4 w-px bg-slate-700"></div>
                        <span className={`font-bold ${w.aqi > 200 ? 'text-red-500' : w.aqi > 100 ? 'text-orange-400' : 'text-green-400'}`}>
                            {w.aqi} AQI
                        </span>
                        {w.aqi > 300 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/50 text-red-200 border border-red-800">SEVERE</span>}
                         <span className="text-slate-600 text-xs">PM2.5: {w.pollutants.pm25}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">Advanced Pollution Intelligence</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">City-wide averages hide the truth. Pollution is hyper-local. Our platform empowers targeted action where it matters most.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<Map className="text-blue-500" size={32} />}
                title="Hyper-Local Data"
                desc="Drill down from city view to individual wards like Shahdara or Rohini. Identify hotspots caused by traffic or industry."
            />
            <FeatureCard 
                icon={<Cpu className="text-purple-500" size={32} />}
                title="AI Forecasting"
                desc="Predict pollution spikes 24-72 hours in advance using historical data, weather patterns, and traffic flows."
            />
            <FeatureCard 
                icon={<ShieldCheck className="text-teal-500" size={32} />}
                title="Actionable Policy"
                desc="Generate automated mitigation strategies for authorities. From traffic diversions to dust control mandates."
            />
        </div>
      </div>

      {/* Real-World Interactive Map Section */}
      <div className="w-full bg-white pb-20 pt-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Globe className="text-blue-600" /> Live Satellite Exploration
                    </h2>
                    <p className="mt-2 text-slate-600">
                        Navigate the full interactive map of India. Pan across cities to visualize geographical pollution spread and green cover density.
                    </p>
                </div>
                <button 
                    onClick={onStart}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm flex items-center gap-2"
                >
                    Analyze Map Data <ArrowRight size={16} />
                </button>
            </div>
            
            <div className="relative w-full h-[600px] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 group">
                {/* Updated to focus on India */}
                <iframe 
                    width="100%" 
                    height="100%" 
                    id="gmap_canvas" 
                    src="https://maps.google.com/maps?q=India&t=k&z=5&ie=UTF8&iwloc=&output=embed" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0}
                    allowFullScreen
                    className="w-full h-full filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                    title="Real Time Satellite Map"
                ></iframe>
                
                {/* Status Overlay */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3 pointer-events-none z-10">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-900 leading-none">SATELLITE VIEW</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">PAN-INDIA MONITORING</div>
                    </div>
                </div>

                 <div className="absolute bottom-6 right-6 bg-black/80 text-white backdrop-blur-md px-4 py-2 rounded-lg shadow-lg text-xs pointer-events-none z-10">
                    Scroll to Zoom • Drag to Pan
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow hover:-translate-y-1">
        <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">{icon}</div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;