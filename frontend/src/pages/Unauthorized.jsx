import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, getHome, logout } = useAuthStore();

  const handleGoHome = () => {
    if (user) {
      navigate(getHome());
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 relative overflow-hidden select-none">
      {/* Decorative Background blur circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-[130px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-2xl rounded-3xl p-8 md:p-12 text-center max-w-lg w-full relative z-10 flex flex-col items-center space-y-6"
      >
        {/* Animated Access Denied shield Visual */}
        <div className="relative w-36 h-28 flex items-center justify-center">
          {/* Pulsing background circle */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-rose-500 rounded-full filter blur-xl opacity-20"
          />

          {/* Shield Icon */}
          <motion.div
            animate={{ rotateY: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", repeatDelay: 1 }}
            className="absolute z-10 bg-gradient-to-tr from-rose-600 to-orange-500 p-5 rounded-3xl shadow-lg shadow-rose-500/20 text-white"
          >
            <ShieldAlert size={42} />
          </motion.div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">403 — Access Denied</h1>
          <h2 className="text-md font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Restricted Workspace</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2">
            You do not have the required permissions to view this clinic area. If you believe this is an error, please contact your systems administrator.
          </p>
          {user && (
            <p className="text-xs font-semibold text-slate-400 mt-2">
              Logged in as: <span className="font-bold text-slate-600 dark:text-slate-350">{user.name}</span> (<span className="capitalize">{user.role}</span>)
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <button 
            onClick={handleLogout}
            className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-1.5"
          >
            <LogOut size={16} />
            Switch Account
          </button>
          <button 
            onClick={handleGoHome}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg shadow-blue-500/25 text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Workspace Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
