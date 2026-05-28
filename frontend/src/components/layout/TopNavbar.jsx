import React, { useState } from 'react';
import { Menu, Search, Bell, Settings, SearchIcon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const TopNavbar = ({ onMenuClick }) => {
  const { user } = useAuthStore();

  return (
    <header className="h-20 px-8 flex items-center justify-between bg-white border-b border-slate-50 sticky top-0 z-30">

      {/* Welcome Message */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-slate-500">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
            <img src={user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop"} alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-none flex items-center gap-1.5">
              Welcome, {user?.name?.split(' ')[0] || 'Divine'} <span className="text-base">👋</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">Here is your clinical overview for today</p>
          </div>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-3">
        {/* Compact Search */}
        <div className="sm:flex items-center bg-slate-50 rounded-full h-9 px-3 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer hidden">
          <Search size={16} className="text-slate-400" />
        </div>

        <button className="p-2 rounded-full hover:bg-slate-50 text-slate-500 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full border-2 border-white" />
        </button>

        <button className="p-2 rounded-full hover:bg-slate-50 text-slate-500">
          <Settings size={20} />
        </button>

        <div className="md:hidden h-8 w-px bg-slate-100 ml-2" />

        <button className="hidden sm:flex items-center gap-2 bg-[#0a1a0f] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-slate-900/10 hover:scale-105 transition-all">
          <Plus size={14} />
          <span>Quick Entry</span>
        </button>
      </div>
    </header>
  );
};

const Plus = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default TopNavbar;
