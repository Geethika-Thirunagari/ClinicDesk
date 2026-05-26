import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

const data = [
  { name: '08:00', bookings: 20 },
  { name: '10:00', bookings: 45 },
  { name: '12:00', bookings: 30 },
  { name: '14:00', bookings: 60 },
  { name: '16:00', bookings: 55 },
  { name: '18:00', bookings: 25 },
];

const AppointmentAnalytics = () => {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-2xl p-6 h-full shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Calendar className="text-blue-500" />
          Appointment Trends
        </h2>
        <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-none">
          <option>Today</option>
          <option>This Week</option>
        </select>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            />
            <Area type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Peak Time</p>
          <p className="text-sm font-bold text-slate-800 dark:text-white">14:00</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cancellations</p>
          <p className="text-sm font-bold text-rose-500">12 (3%)</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">No-Shows</p>
          <p className="text-sm font-bold text-slate-800 dark:text-white">4</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentAnalytics;
