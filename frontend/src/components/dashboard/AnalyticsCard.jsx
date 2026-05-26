import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const AnalyticsCard = ({ title, value, change, trend, icon: Icon, delay = 0 }) => {
  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm shadow-slate-200/50 flex flex-col justify-between overflow-hidden relative group"
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      
      <div className="flex justify-between items-start z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-slate-50 flex items-center justify-center shadow-sm border border-slate-100">
          <Icon size={24} className="text-blue-600" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 z-10">
        <span className={cn(
          "flex items-center text-sm font-medium px-2 py-0.5 rounded-full",
          isPositive ? "text-emerald-700 bg-emerald-100" : "text-rose-700 bg-rose-100"
        )}>
          {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
          {change}
        </span>
        <span className="text-sm text-slate-400">vs last month</span>
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;
