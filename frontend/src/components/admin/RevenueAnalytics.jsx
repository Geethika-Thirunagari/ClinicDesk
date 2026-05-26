import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Banknote } from 'lucide-react';

const data = [
  { name: 'Jan', revenue: 4000, pending: 2400 },
  { name: 'Feb', revenue: 3000, pending: 1398 },
  { name: 'Mar', revenue: 2000, pending: 9800 },
  { name: 'Apr', revenue: 2780, pending: 3908 },
  { name: 'May', revenue: 1890, pending: 4800 },
  { name: 'Jun', revenue: 2390, pending: 3800 },
  { name: 'Jul', revenue: 3490, pending: 4300 },
];

const RevenueAnalytics = () => {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-2xl p-6 h-full shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Banknote className="text-emerald-500" />
          Revenue Analytics
        </h2>
        <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-none">
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `$${val/1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Income</p>
          <p className="text-sm font-bold text-emerald-500">$19,550</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Payments</p>
          <p className="text-sm font-bold text-amber-500">$4,230</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
