import React from 'react';
import { ViewMode } from '../types';
import { Wind, LayoutDashboard, ShieldAlert, Users, Settings, BarChart3 } from 'lucide-react';

interface NavigationProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItemClass = (view: ViewMode) => `
    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer border border-transparent
    ${currentView === view 
      ? 'bg-slate-100 text-slate-900 border-slate-200 shadow-sm' 
      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
  `;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer gap-3" onClick={() => setView(ViewMode.LANDING)}>
            <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Wind className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 leading-none">EcoWard</span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-1">Intelligence Platform</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <button className={navItemClass(ViewMode.DASHBOARD)} onClick={() => setView(ViewMode.DASHBOARD)}>
              <LayoutDashboard size={16} />
              <span>Monitor</span>
            </button>
            <button className={navItemClass(ViewMode.TRENDS)} onClick={() => setView(ViewMode.TRENDS)}>
              <BarChart3 size={16} />
              <span>Trends</span>
            </button>
            <button className={navItemClass(ViewMode.ADMIN)} onClick={() => setView(ViewMode.ADMIN)}>
              <Settings size={16} />
              <span>Policy & Admin</span>
            </button>
            <button className={navItemClass(ViewMode.CITIZEN)} onClick={() => setView(ViewMode.CITIZEN)}>
              <Users size={16} />
              <span>Citizen</span>
            </button>
          </div>

          <div className="md:hidden flex items-center">
              <button className="text-slate-500 hover:text-slate-900 p-2">
                  <LayoutDashboard />
              </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;