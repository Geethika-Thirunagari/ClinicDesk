import React from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Banknote, Calendar, ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const StatCard = ({ title, value, icon: Icon, trend, isPositive, delay, alert }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={cn(
      "backdrop-blur-xl border shadow-sm rounded-[24px] p-5 relative overflow-hidden group hover:shadow-md transition-all",
      alert 
        ? "bg-rose-500/5 border-rose-500/20 " 
        : "bg-white/60 border-[#e2e8e2] "
    )}
  >
    <div className={cn(
      "absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity",
      alert ? "text-rose-500" : "text-blue-500"
    )}>
      <Icon size={64} />
    </div>
    <div className="flex items-center gap-3 mb-4">
      <div className={cn(
        "p-2 rounded-lg",
        alert ? "bg-rose-100 text-rose-600 " : "bg-blue-50 text-blue-600 "
      )}>
        <Icon size={20} />
      </div>
      <h3 className={cn("font-medium text-sm", alert ? "text-rose-600 " : "text-slate-500 ")}>{title}</h3>
    </div>
    <div className="flex items-end justify-between relative z-10">
      <h2 className={cn("text-3xl font-bold", alert ? "text-rose-700 " : "text-[#0a1a0f] ")}>{value}</h2>
      <div className={cn(
        "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
        alert ? "text-rose-700 bg-rose-100 " : (isPositive ? "text-emerald-600 bg-emerald-50 " : "text-rose-600 bg-rose-50 ")
      )}>
        {!alert && (isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />)}
        {trend}
      </div>
    </div>
  </motion.div>
);

const TopAnalytics = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard title="Total Doctors" value="48" icon={Stethoscope} trend="+2 this month" isPositive={true} delay={0.1} />
      <StatCard title="Total Patients" value="12,482" icon={Users} trend="+12.5%" isPositive={true} delay={0.15} />
      <StatCard title="Appointments Today" value="342" icon={Calendar} trend="+14 from yesterday" isPositive={true} delay={0.2} />
      <StatCard title="Monthly Revenue" value="$124.5k" icon={Banknote} trend="+8.2%" isPositive={true} delay={0.25} />
      <StatCard title="Active Staff" value="86" icon={ShieldCheck} trend="Optimal" isPositive={true} delay={0.3} />
      <StatCard title="Emergency Cases" value="3" icon={AlertTriangle} trend="Critical" alert={true} delay={0.35} />
    </div>
  );
};

export default TopAnalytics;
