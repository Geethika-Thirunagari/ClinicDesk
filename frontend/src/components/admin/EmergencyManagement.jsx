import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, Ambulance, Users, ArrowRight } from 'lucide-react';

const EmergencyCase = ({ id, priority, type, waitTime, status }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
      <div>
        <p className="text-sm font-bold text-[#0a1a0f] ">{id} - {type}</p>
        <p className="text-xs text-slate-500 font-medium">Wait time: <span className="text-rose-500">{waitTime}</span></p>
      </div>
    </div>
    <span className="text-xs font-bold px-2 py-1 rounded bg-rose-500/20 text-rose-700 uppercase tracking-wider">
      {status}
    </span>
  </div>
);

const EmergencyManagement = () => {
  return (
    <div className="bg-rose-50 #1a0f14] backdrop-blur-xl border border-rose-200 rounded-[24px] p-6 h-full shadow-sm flex flex-col relative overflow-hidden">
      {/* Decorative background pulse */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-lg font-bold text-rose-700 flex items-center gap-2">
          <AlertOctagon className="text-rose-500 animate-pulse" />
          Emergency Control
        </h2>
        <span className="text-xs font-bold px-2 py-1 bg-rose-500 text-white rounded-lg shadow-sm shadow-rose-500/30">
          3 Critical
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
        <div className="p-3 rounded-xl bg-white/60 border border-rose-100 flex flex-col justify-center items-center text-center">
          <Ambulance size={20} className="text-rose-500 mb-1" />
          <span className="text-xl font-bold text-[#0a1a0f] ">2</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Inbound</span>
        </div>
        <div className="p-3 rounded-xl bg-white/60 border border-rose-100 flex flex-col justify-center items-center text-center">
          <Users size={20} className="text-rose-500 mb-1" />
          <span className="text-xl font-bold text-[#0a1a0f] ">1</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Queue</span>
        </div>
      </div>

      <div className="flex-1 space-y-2 relative z-10">
        <EmergencyCase id="ER-402" type="Trauma" waitTime="2 mins" status="Triage" />
        <EmergencyCase id="ER-403" type="Cardiac" waitTime="0 mins" status="Operating" />
        <EmergencyCase id="ER-404" type="Burn" waitTime="5 mins" status="Pending" />
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="mt-4 w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-colors relative z-10"
      >
        Declare Protocol Red
        <ArrowRight size={16} />
      </motion.button>
    </div>
  );
};

export default EmergencyManagement;
