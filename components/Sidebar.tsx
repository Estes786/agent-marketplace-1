
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  deployedCount: number;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ deployedCount, isOpen = false, setIsOpen }) => {
  const location = useLocation();
  const [rootDepth, setRootDepth] = useState(72);
  const [meshNodes, setMeshNodes] = useState(12402);
  const [syncPulse, setSyncPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRootDepth(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 3)));
      setMeshNodes(prev => prev + Math.floor(Math.random() * 5));
      setSyncPulse(prev => (prev + 1) % 100);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/', label: 'Marketplace', icon: '🏪' },
    { path: '/dashboard', label: 'Command Center', icon: '📊', badge: deployedCount > 0 ? deployedCount : null },
    { path: '/architect', label: 'Web4 Architect', icon: '🏗️' },
    { path: '/roadmap', label: 'Wealth Journey', icon: '🚀' },
    { path: '/media-lab', label: 'Visual Intel Lab', icon: '🎬' },
  ];

  const handleClose = () => {
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300" 
          onClick={handleClose}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 lg:static w-80 bg-slate-950 border-r border-slate-900 flex flex-col h-screen z-50 transition-transform duration-500 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand Section */}
        <div className="p-10 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center text-3xl shadow-2xl shadow-indigo-600/40 border border-indigo-400/30 transform transition-transform hover:scale-110 cursor-pointer group">
              <span className="group-hover:rotate-180 transition-transform duration-1000">🌀</span>
            </div>
            <div>
              <h1 className="font-black text-2xl leading-none tracking-tighter text-white">GANI HYPHA</h1>
              <p className="text-[9px] text-indigo-500 uppercase tracking-[0.4em] font-black mt-2 font-mono">Web4_Core v4.1</p>
            </div>
          </div>
          <button onClick={handleClose} className="lg:hidden text-slate-500 hover:text-white transition-colors">✕</button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-8 space-y-4" data-tour="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleClose}
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

        {/* Web4 Status Bar */}
        <div className="px-8 mb-4">
           <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800/60 flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Global Mesh Pulse</span>
                 <span className="text-[10px] font-mono text-indigo-400 font-bold">{syncPulse}% SYNC</span>
              </div>
              <div className="flex gap-0.5">
                 {[...Array(5)].map((_, i) => (
                   <div 
                    key={i} 
                    className={`w-1 h-3 rounded-full transition-all ${syncPulse > (i * 20) ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]' : 'bg-slate-800'}`}
                   ></div>
                 ))}
              </div>
           </div>
        </div>

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

          <div className="bg-slate-900/60 rounded-[2rem] p-6 border border-slate-800/60 shadow-2xl group cursor-pointer hover:border-indigo-500/40 transition-all hidden md:block">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.9)]"></div>
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-60"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-white uppercase tracking-tighter">WEB4_MESH_STABLE</span>
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">DID-PROVIDER-V4</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
