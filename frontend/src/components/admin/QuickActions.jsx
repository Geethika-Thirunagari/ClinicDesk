import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, FileText, Bell, CalendarClock, Stethoscope, Users } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

const ActionButton = ({ label, icon: Icon, color, delay, onClick }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all shadow-sm",
      "bg-white/50 border-white/40 hover:bg-white/80 dark:bg-slate-900/50 dark:border-slate-800 dark:hover:bg-slate-800/80"
    )}
  >
    <div className={cn(
      "w-12 h-12 rounded-full flex items-center justify-center",
      color
    )}>
      <Icon size={24} className="text-white" />
    </div>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center leading-tight">
      {label}
    </span>
  </motion.button>
);

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-2xl p-6 h-full shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-blue-500 rounded-full" />
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <ActionButton label="Create Doctor" icon={Stethoscope} color="bg-blue-500" delay={0.1} onClick={() => navigate('/admin/doctors')} />
        <ActionButton label="Create Patient" icon={UserPlus} color="bg-emerald-500" delay={0.15} onClick={() => navigate('/admin/patients')} />
        <ActionButton label="Create Staff" icon={Users} color="bg-purple-500" delay={0.2} onClick={() => navigate('/admin/staff')} />
        <ActionButton label="Assign Schedules" icon={CalendarClock} color="bg-amber-500" delay={0.25} />
        <ActionButton label="Generate Reports" icon={FileText} color="bg-indigo-500" delay={0.3} onClick={() => navigate('/admin/reports')} />
        <ActionButton label="Send Alerts" icon={Bell} color="bg-rose-500" delay={0.35} />
      </div>
    </div>
  );
};

export default QuickActions;
