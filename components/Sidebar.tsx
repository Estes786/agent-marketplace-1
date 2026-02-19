
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  deployedCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ deployedCount }) => {
  const location = useLocation();
  const [rootDepth, setRootDepth] = useState(65);

  useEffect(() => {
    const interval = setInterval(() => {
      setRootDepth(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 5)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/', label: 'Marketplace', icon: '🏪' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊', badge: deployedCount > 0 ? deployedCount : null },
    { path: '/architect', label: 'Architect Mode', icon: '🏗️' },
    { path: '/media-lab', label: 'Media Lab', icon: '🎬' },
  ];

  return (
    <div className="w-72 bg-slate-950 border-r border-slate-900 flex flex-col hidden md:flex h-screen sticky top-0 z-30">
      <div className="p-8 border-b border-slate-900 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-2xl shadow-indigo-600/40 border border-indigo-400/30 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer group">
          <span className="group-hover:animate-pulse">🌀</span>
        </div>
        <div>
          <h1 className="font-black text-xl leading-none tracking-tighter text-white">GANI HYPHA</h1>
          <p className="text-[9px] text-slate-600 uppercase tracking-[0.3em] font-black mt-1.5 font-mono">Kernel v1.2.8-LRT</p>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-3 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group border ${
                isActive 
                ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/40 shadow-2xl shadow-indigo-600/10 translate-x-1' 
                : 'text-slate-500 hover:bg-slate-900 border-transparent hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                <span className={`font-black text-[11px] uppercase tracking-widest ${isActive ? 'text-white' : ''}`}>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg ring-4 ring-slate-950 shadow-lg">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto space-y-4">
        <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-slate-800/60 shadow-inner group transition-all">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.2em]">Root Depth (Mycelium)</p>
            <span className="text-[10px] font-mono text-indigo-400 font-bold">{Math.round(rootDepth)}%</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-1000 ease-in-out" 
              style={{ width: `${rootDepth}%` }}
            ></div>
          </div>
          <p className="text-[8px] text-slate-700 mt-2 font-mono uppercase italic">Akar Dalam, Cabang Tinggi</p>
        </div>

        <div className="bg-slate-900/60 rounded-[2rem] p-5 border border-slate-800/60 shadow-inner group cursor-pointer hover:border-indigo-500/30 transition-all">
          <p className="text-[9px] text-slate-600 mb-3 font-black uppercase tracking-[0.2em]">Node Environment</p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">HYPHA_SYNC_OK</span>
              <span className="text-[8px] font-mono text-slate-700 uppercase tracking-widest mt-0.5">Global Mesh active</span>
            </div>
          </div>
          
          <div className="mt-6 pt-5 border-t border-slate-800/60 grid grid-cols-2 gap-2">
             <div className="flex flex-col">
                <span className="text-[7px] font-bold text-slate-600 uppercase">Uptime</span>
                <span className="text-[9px] font-mono text-slate-400">99.98%</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[7px] font-bold text-slate-600 uppercase">Latency</span>
                <span className="text-[9px] font-mono text-emerald-500">22ms</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
