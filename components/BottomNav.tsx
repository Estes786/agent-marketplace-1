
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BottomNavProps {
  activePodsCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePodsCount }) => {
  const location = useLocation();

  const items = [
    { path: '/', label: 'Market', icon: '🏪' },
    { path: '/dashboard', label: 'Dash', icon: '📊', badge: activePodsCount > 0 ? activePodsCount : null },
    { path: '/dashboard?tab=Governance', label: 'DAO', icon: '⚖️' },
    { path: '/architect', label: 'Arch', icon: '🏗️' },
    { path: '/media-lab', label: 'Lab', icon: '🎬' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-16 glass rounded-[2rem] border border-indigo-500/20 shadow-2xl z-40 flex items-center justify-around px-4">
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 relative group`}
          >
            <div className={`text-xl transition-transform ${isActive ? 'scale-125' : 'group-hover:scale-110'}`}>
              {item.icon}
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest mt-1 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
              {item.label}
            </span>
            
            {/* Active Indicator Dot */}
            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,1)] animate-pulse" />
            )}

            {/* Notification Badge */}
            {item.badge && (
              <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[8px] font-black min-w-[14px] h-[14px] flex items-center justify-center rounded-full ring-2 ring-slate-950">
                {item.badge}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
