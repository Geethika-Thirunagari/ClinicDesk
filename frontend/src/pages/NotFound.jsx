import React from 'react';
import { motion } from 'framer-motion';
import { Home as HomeIcon, Stethoscope as StethIcon, AlertTriangle as AlertIcon, ArrowLeft as BackIcon } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f4f7f4] text-slate-900 relative overflow-hidden select-none font-['Outfit']">

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-[#e2e8e2] shadow-sm rounded-[32px] p-8 md:p-12 text-center max-w-lg w-full relative z-10 flex flex-col items-center space-y-8"
      >
        {/* Animated Visual */}
        <div className="relative w-36 h-28 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute inset-0 bg-emerald-500 rounded-full filter blur-2xl"
          />

          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute z-10 bg-[#0a1a0f] p-5 rounded-2xl shadow-xl shadow-emerald-900/10 text-emerald-400"
          >
            <StethIcon size={40} />
          </motion.div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-[#0a1a0f] tracking-tight flex items-center justify-center gap-3">
            <AlertIcon className="text-amber-500" size={32} strokeWidth={3} /> 404
          </h1>
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto leading-relaxed uppercase tracking-wider">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track!
          </p>
        </div>

        {/* Redirect CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-4 bg-slate-50 border border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200 hover:text-slate-900 rounded-2xl font-bold transition-all text-xs uppercase tracking-widest"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 py-4 bg-[#0a1a0f] hover:bg-emerald-950 text-white rounded-2xl font-bold transition-all text-xs flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-emerald-900/20"
          >
            <HomeIcon size={14} />
            Return to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
