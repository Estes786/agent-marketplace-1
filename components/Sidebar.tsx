
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  deployedCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ deployedCount }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Marketplace', icon: '🏪' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊', badge: deployedCount > 0 ? deployedCount : null },
    { path: '/architect', label: 'Architect Mode', icon: '🏗️' },
    { path: '/media-lab', label: 'Media Lab', icon: '🎬' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
          🌀
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight text-white">GANI HYPHA</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Master Engine v1.2</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_-5px_rgba(79,70,229,0.3)]' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-slate-900">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <p className="text-[10px] text-slate-500 mb-1">NODE STATUS</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-emerald-400">HYPHA SYNCHRONIZED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
