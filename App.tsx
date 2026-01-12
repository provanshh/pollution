import React, { useState, useEffect } from 'react';
import { ViewMode, Ward } from './types';
import { generateInitialWards, simulateLiveUpdate } from './services/dataService';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import WardMap from './components/WardMap';
import WardAnalytics from './components/WardAnalytics';
import WardSearch from './components/WardSearch';
import AdminView from './components/AdminView';
import CitizenView from './components/CitizenView';
import TrendsView from './components/TrendsView';
import VoiceAssistant from './components/VoiceAssistant';
import LiveMonitorCard from './components/LiveMonitorCard';
import HeatmapWidget from './components/HeatmapWidget';
import NewsView from './components/NewsView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.LANDING);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);

  // Initialization
  useEffect(() => {
    const initialData = generateInitialWards();
    setWards(initialData);
    // Default selection
    if (initialData.length > 0) setSelectedWardId(initialData[0].id);
  }, []);

  // Simulation Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setWards(prev => simulateLiveUpdate(prev));
    }, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const selectedWard = wards.find(w => w.id === selectedWardId) || wards[0];

  const handleWardSelect = (ward: Ward) => {
    setSelectedWardId(ward.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {view !== ViewMode.LANDING && (
        <Navigation currentView={view} setView={setView} />
      )}

      <main className="h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden">
        
        {view === ViewMode.LANDING && (
          <LandingPage 
            wards={wards}
            onWardSelect={(ward) => {
                handleWardSelect(ward);
                setView(ViewMode.DASHBOARD);
            }} 
            onStart={() => setView(ViewMode.DASHBOARD)} 
          />
        )}

        {view === ViewMode.DASHBOARD && (
          <div className="h-full p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-6">
             {/* Dashboard Header with Search */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div>
                     <h1 className="text-2xl font-bold text-slate-900">Real-time Pollution Monitor</h1>
                     <p className="text-slate-500">Live ward-wise tracking • Updated every 5s</p>
                 </div>
                 <WardSearch wards={wards} onSelect={handleWardSelect} />
             </div>

             {/* Live Monitor Summary Card */}
             {selectedWard && (
                 <LiveMonitorCard ward={selectedWard} />
             )}

             {/* Historical Heatmap (Month on Month) */}
             {selectedWard && (
                 <HeatmapWidget ward={selectedWard} />
             )}

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
                {/* Map Panel */}
                <div className="lg:col-span-5 flex flex-col h-[500px] lg:h-auto">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-none mb-4">
                        <h2 className="text-lg font-bold text-slate-800">Live Ward Map</h2>
                        <p className="text-sm text-slate-500">Interactive heatmap. Click for details.</p>
                    </div>
                    <div className="flex-1 min-h-0">
                        <WardMap 
                            wards={wards} 
                            selectedWardId={selectedWardId} 
                            onSelectWard={handleWardSelect} 
                        />
                    </div>
                </div>
                
                {/* Analytics Panel */}
                <div className="lg:col-span-7 h-auto lg:h-full min-h-[600px]">
                    {selectedWard && <WardAnalytics ward={selectedWard} allWards={wards} />}
                </div>
            </div>
          </div>
        )}

        {view === ViewMode.TRENDS && (
            <TrendsView wards={wards} />
        )}

        {view === ViewMode.ADMIN && (
            <AdminView wards={wards} />
        )}

        {view === ViewMode.NEWS && (
            <NewsView wards={wards} />
        )}

        {view === ViewMode.CITIZEN && (
            <CitizenView wards={wards} selectedWardId={selectedWardId} />
        )}

        {/* Global Voice Assistant */}
        <VoiceAssistant wards={wards} />

      </main>
    </div>
  );
};

export default App;