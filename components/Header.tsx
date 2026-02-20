
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  credits?: number;
  activePodsCount?: number;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ credits = 0, activePodsCount = 0, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getTitle = () => {
    switch(location.pathname) {
      case '/': return 'Agent Marketplace';
      case '/dashboard': return 'Command Center';
      case '/architect': return 'Ecosystem Architect';
      case '/media-lab': return 'Visual Intelligence Lab';
      default: return 'GANI HYPHA';
    }
  };

  const getBreadcrumb = () => {
    switch(location.pathname) {
      case '/': return 'Browse industry-grade legacy pods';
      case '/dashboard': return 'Live orchestration of microservices';
      case '/architect': return 'High-fidelity system architecture';
      case '/media-lab': return 'Visual intelligence analysis';
      default: return 'GANI HYPHA Node v1.2.0-STABLE';
    }
  };

  return (
    <header className="h-20 glass border-b border-slate-800/60 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4 md:gap-8 overflow-hidden">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden h-10 w-10 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400"
        >
          <span className="text-xl">☰</span>
        </button>

        <div className="truncate">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-sm md:text-xl font-bold text-white tracking-tight truncate">
              {getTitle()}
            </h2>
            <div className="flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 shrink-0">
              <span className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></span>
              <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest">Live</span>
            </div>
          </div>
          <p className="text-[10px] md:text-xs text-slate-500 font-medium tracking-tight truncate">{getBreadcrumb()}</p>
        </div>

        {activePodsCount > 0 && location.pathname !== '/dashboard' && (
          <button 
            onClick={() => navigate('/dashboard')}
            className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-[10px] font-black text-indigo-400 transition-all hover:scale-105 active:scale-95 group shadow-2xl shadow-indigo-600/5 uppercase tracking-widest"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Access Dashboard
            <span className="bg-indigo-500 text-white px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold">{activePodsCount}</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden lg:flex items-center gap-8 px-6 py-2.5 bg-slate-950/40 border border-slate-800/60 rounded-2xl">
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase tracking-[0.2em] font-black mb-0.5">Node Reputation</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400">98.4%</span>
              <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '98%' }}></div>
              </div>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800/60"></div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase tracking-[0.2em] font-black mb-0.5">Hypha Balance</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-indigo-400">{credits.toLocaleString()}</span>
              <span className="text-[9px] font-mono text-slate-600">HYPHA</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800/60"></div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase tracking-[0.2em] font-black mb-0.5">USD Balance</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-emerald-400">$1,500.00</span>
              <span className="text-[9px] font-mono text-slate-600">USD</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="h-10 w-10 rounded-2xl border border-slate-800 flex items-center justify-center hover:bg-slate-800/50 transition-all relative group shrink-0">
            <span className="text-lg group-hover:scale-110 transition-transform">🔔</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
          </button>
          
          <div className="h-10 pl-1.5 pr-2 md:pr-4 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-center gap-3 hover:border-indigo-500/30 transition-all cursor-pointer group shrink-0">
            <div className="w-7 h-7 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 p-0.5">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ChiefStark" alt="User" className="w-full h-full rounded-lg" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">STARK_ADMIN</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none mt-1">Level 4</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
