import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f4f7f4] font-['Outfit'] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-200/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-300/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#0a1a0f] flex items-center justify-center shadow-lg shadow-emerald-900/10">
              <Stethoscope className="text-emerald-400 w-6 h-6" />
            </div>
            <span className="text-3xl font-black tracking-tight text-[#0a1a0f]">
              FINAI<span className="text-emerald-500">CLINIC</span>
            </span>
          </div>

          {/* Form Container */}
          <div className="finai-card p-8 sm:p-10 w-full">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
