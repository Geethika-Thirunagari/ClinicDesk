import React, { useState } from 'react';
import { Menu, Search, Bell, Settings, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import QuickNoteModal from './QuickNoteModal';

const TopNavbar = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const [isQuickNoteOpen, setIsQuickNoteOpen] = useState(false);

  return (
    <header className="h-20 px-8 flex items-center justify-between bg-transparent border-b border-transparent sticky top-0 z-30 font-['Outfit']">

      {/* User Section */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-slate-400">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm">
            <img src={user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop"} alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-sm font-black text-[#0a1a0f] leading-none flex items-center gap-1.5 uppercase tracking-tight">
              {user?.name?.split(' ')[0] || 'User'} <span className="text-base normal-case">👋</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Medical Ops Active</p>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center bg-slate-50 rounded-xl h-10 px-4 border border-[#e2e8e2] hover:border-emerald-200 transition-all cursor-pointer group">
          <Search size={16} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </div>

        <button className="p-2.5 rounded-xl bg-white border border-[#e2e8e2] text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
        </button>

        <button className="p-2.5 rounded-xl bg-white border border-[#e2e8e2] text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all">
          <Settings size={18} />
        </button>

        <div className="hidden sm:block h-8 w-px bg-slate-100 mx-2" />

        <button
          type="button"
          onClick={() => setIsQuickNoteOpen(true)}
          className="flex items-center gap-2 bg-[#0a1a0f] text-white px-3 sm:px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
          aria-label="Open quick note"
        >
          <Plus size={14} strokeWidth={3} />
          <span className="hidden sm:inline">Quick Note</span>
        </button>
      </div>

      <QuickNoteModal isOpen={isQuickNoteOpen} onClose={() => setIsQuickNoteOpen(false)} />
    </header>
  );
};

export default TopNavbar;
