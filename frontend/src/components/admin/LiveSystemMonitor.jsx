import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const ActivityItem = ({ title, time, type }) => {
  const icons = {
    login: <CheckCircle2 size={16} className="text-emerald-500" />,
    alert: <ShieldAlert size={16} className="text-rose-500" />,
    system: <Activity size={16} className="text-blue-500" />
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="mt-0.5">{icons[type] || icons.system}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{title}</p>
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
          <Clock size={12} />
          {time}
        </div>
      </div>
    </div>
  );
};

const LiveSystemMonitor = () => {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-2xl p-6 h-full shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Live Monitoring
        </h2>
        <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg">
          System Healthy
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Active Users</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">342</span>
            <span className="text-sm text-emerald-500 font-medium mb-1">Online</span>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Available MDs</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">18</span>
            <span className="text-sm text-slate-500 font-medium mb-1">/ 48 Total</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Recent Activity</h3>
        <ActivityItem title="Dr. Sarah logged in" time="2 mins ago" type="login" />
        <ActivityItem title="Emergency Protocol Triggered: ER-3" time="15 mins ago" type="alert" />
        <ActivityItem title="System Backup Completed" time="1 hour ago" type="system" />
        <ActivityItem title="New Patient Record Created" time="2 hours ago" type="system" />
      </div>
    </div>
  );
};

export default LiveSystemMonitor;
