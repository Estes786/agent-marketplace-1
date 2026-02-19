
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  credits?: number;
  activePodsCount?: number;
}

const Header: React.FC<HeaderProps> = ({ credits = 0, activePodsCount = 0 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getTitle = () => {
    switch(location.pathname) {
      case '/': return 'Agent Marketplace';
      case '/dashboard': return 'Command Center';
      case '/architect': return 'Ecosystem Architect';
      default: return 'GANI HYPHA';
    }
  };

  const getBreadcrumb = () => {
    switch(location.pathname) {
      case '/': return 'Discover industry-specific agent pods';
      case '/dashboard': return 'Manage your deployed agentic microservices';
      case '/architect': return 'Design custom autonomous lifeforms';
      default: return 'Welcome back, Chief Stark';
    }
  };

  return (
    <header className="h-20 glass border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {getTitle()}
            <span className="h-1 w-1 bg-slate-600 rounded-full"></span>
          </h2>
          <p className="text-sm text-slate-400">{getBreadcrumb()}</p>
        </div>

        {activePodsCount > 0 && location.pathname !== '/dashboard' && (
          <button 
            onClick={() => navigate('/dashboard')}
            className="hidden md:flex items-center gap-3 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-xs font-bold text-indigo-300 transition-all hover:scale-105 active:scale-95 group shadow-lg shadow-indigo-600/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            GO TO DASHBOARD
            <span className="bg-indigo-500 text-white px-1.5 py-0.5 rounded-md text-[9px] font-mono">{activePodsCount}</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-8 px-6 py-2 bg-slate-900/50 border border-slate-800 rounded-2xl hidden lg:flex">
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase tracking-[0.2em] font-bold">Node Reputation</span>
            <span className="text-xs font-mono font-bold text-emerald-400">98% PRISTINE</span>
          </div>
          <div className="w-px h-6 bg-slate-800"></div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 uppercase tracking-[0.2em] font-bold">Mycelium Balance</span>
            <span className="text-xs font-mono font-bold text-indigo-400">{credits} HYPHA</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="h-10 w-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors relative">
            🔔
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
          </button>
          <div className="h-10 px-4 rounded-full border border-indigo-500/30 bg-indigo-500/5 flex items-center gap-3">
            <div className="w-6 h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
              <img src="https://picsum.photos/32/32?seed=chief" alt="User" />
            </div>
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-tighter">STARK_ADMIN</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
