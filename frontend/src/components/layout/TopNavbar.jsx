import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationPanel from '../dashboard/NotificationPanel';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../utils/cn';

const TopNavbar = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 flex-shrink-0 px-6 flex items-center justify-between bg-white/30 backdrop-blur-md border-b border-white/40 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-white/50 transition-colors"
        >
          <Menu size={24} />
        </button>
        
        {/* Search Bar */}
        <div className="hidden sm:flex items-center w-full max-w-md relative group">
          <Search size={18} className="absolute left-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search patients, appointments..." 
            className="w-full h-10 pl-10 pr-4 bg-white/40 border border-white/60 rounded-xl text-sm outline-none transition-all focus:bg-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 text-slate-700 shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-white/50 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white/50"></span>
          </button>
          <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>

        {/* Profile */}
        <div className="relative pl-3 sm:pl-5 border-l border-slate-200/50" ref={menuRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-xs text-slate-500 capitalize">{user?.role || 'User'}</p>
            </div>
            <button className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-white/60 shadow-sm group-hover:border-blue-400 transition-colors">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </button>
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-[120%] w-48 bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-xl shadow-slate-200/50 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-sm font-semibold text-slate-700 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              
              <button 
                onClick={() => { setShowProfileMenu(false); navigate(`/${user?.role}/profile`); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <User size={16} />
                My Profile
              </button>
              
              <button 
                onClick={() => { setShowProfileMenu(false); navigate(`/${user?.role}/settings`); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <Settings size={16} />
                Settings
              </button>
              
              <div className="h-px bg-slate-100 my-1 w-full" />
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
