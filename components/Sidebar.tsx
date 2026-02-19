
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  deployedCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ deployedCount }) => {
  const location = useLocation();
  const [rootDepth, setRootDepth] = useState(72);
  const [meshNodes, setMeshNodes] = useState(12402);

  useEffect(() => {
    const interval = setInterval(() => {
      setRootDepth(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 3)));
      setMeshNodes(prev => prev + Math.floor(Math.random() * 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/', label: 'Marketplace', icon: '🏪' },
    { path: '/dashboard', label: 'Command Center', icon: '📊', badge: deployedCount > 0 ? deployedCount : null },
    { path: '/architect', label: 'Ecosystem Architect', icon: '🏗️' },
    { path: '/media-lab', label: 'Visual Intel Lab', icon: '🎬' },
  ];

  return (
    <div className="w-80 bg-slate-950 border-r border-slate-900 flex flex-col hidden lg:flex h-screen sticky top-0 z-30">
      {/* Brand Section */}
      <div className="p-10 border-b border-slate-900 flex items-center gap-5">
        <div className="w-14 h-14 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center text-3xl shadow-2xl shadow-indigo-600/40 border border-indigo-400/30 transform transition-transform hover:scale-110 cursor-pointer group">
          <span className="group-hover:rotate-180 transition-transform duration-1000">🌀</span>
        </div>
        <div>
          <h1 className="font-black text-2xl leading-none tracking-tighter text-white">GANI HYPHA</h1>
          <p className="text-[9px] text-indigo-500 uppercase tracking-[0.4em] font-black mt-2 font-mono">Master_Kernel v2.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-8 space-y-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-300 group border ${
                isActive 
                ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/40 shadow-2xl shadow-indigo-600/10 translate-x-1' 
                : 'text-slate-500 hover:bg-slate-900 border-transparent hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl transition-transform group-hover:scale-125 ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                <span className={`font-black text-xs uppercase tracking-[0.1em] ${isActive ? 'text-white' : ''}`}>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg ring-4 ring-slate-950 shadow-xl">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status Area */}
      <div className="p-8 mt-auto space-y-6">
        <div className="bg-slate-900/40 rounded-[2rem] p-6 border border-slate-800/60 shadow-inner group transition-all">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Mycelium Root Depth</p>
            <span className="text-[11px] font-mono text-indigo-400 font-bold">{Math.round(rootDepth)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
              style={{ width: `${rootDepth}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[8px] font-mono text-slate-600 uppercase">
             <span>Nodes: {meshNodes.toLocaleString()}</span>
             <span>Sync: Active</span>
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-[2rem] p-6 border border-slate-800/60 shadow-2xl group cursor-pointer hover:border-indigo-500/40 transition-all">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.9)]"></div>
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-60"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-white uppercase tracking-tighter">HYPHA_MESH_STABLE</span>
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">LRT-GLOBAL-V3</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800/60 grid grid-cols-2 gap-4">
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-700 uppercase">Core Uptime</span>
                <span className="text-[10px] font-mono text-slate-400">100.00%</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-700 uppercase">A2A Latency</span>
                <span className="text-[10px] font-mono text-emerald-500">18ms</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
