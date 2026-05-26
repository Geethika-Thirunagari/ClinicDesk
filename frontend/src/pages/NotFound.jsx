import React from 'react';
import { motion } from 'framer-motion';
import { Home, Compass, Stethoscope, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getHome } = useAuthStore();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate(getHome());
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 relative overflow-hidden select-none">
      {/* Decorative Background blur circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-2xl rounded-3xl p-8 md:p-12 text-center max-w-lg w-full relative z-10 flex flex-col items-center space-y-6"
      >
        {/* Animated Heartbeat ECG Flatline 404 Visual */}
        <div className="relative w-36 h-28 flex items-center justify-center">
          {/* Pulsing background circle */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-blue-500 rounded-full filter blur-xl opacity-20"
          />

          {/* Heart/Cross Icon */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute z-10 bg-gradient-to-tr from-blue-600 to-indigo-500 p-4.5 rounded-2xl shadow-lg shadow-blue-500/20 text-white"
          >
            <Stethoscope size={36} />
          </motion.div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center justify-center gap-2">
            <AlertTriangle className="text-amber-500" size={32} /> 404
          </h1>
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Page Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track!
          </p>
        </div>

        {/* Redirect CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button 
            onClick={() => navigate(-1)}
            className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold transition-all text-sm"
          >
            Go Back
          </button>
          <button 
            onClick={handleGoHome}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg shadow-blue-500/25 text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Return to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
