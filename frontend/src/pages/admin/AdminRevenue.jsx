import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Banknote, TrendingUp, TrendingDown, Calendar, Download, DollarSign, Wallet } from 'lucide-react';

const revenueData = [
  { name: 'Jan', revenue: 45000, expenses: 32000 },
  { name: 'Feb', revenue: 52000, expenses: 34000 },
  { name: 'Mar', revenue: 48000, expenses: 33000 },
  { name: 'Apr', revenue: 61000, expenses: 36000 },
  { name: 'May', revenue: 59000, expenses: 35000 },
  { name: 'Jun', revenue: 67000, expenses: 38000 },
  { name: 'Jul', revenue: 72000, expenses: 40000 },
  { name: 'Aug', revenue: 75000, expenses: 41000 },
  { name: 'Sep', revenue: 68000, expenses: 39000 },
  { name: 'Oct', revenue: 82000, expenses: 43000 },
  { name: 'Nov', revenue: 85000, expenses: 44000 },
  { name: 'Dec', revenue: 91000, expenses: 46000 },
];

const departmentData = [
  { name: 'Cardiology', value: 340000 },
  { name: 'Neurology', value: 280000 },
  { name: 'Pediatrics', value: 210000 },
  { name: 'Orthopedics', value: 195000 },
  { name: 'Dermatology', value: 150000 },
];

const transactions = [
  { id: 'TX-901', date: '2026-05-20 09:30', patient: 'Alice Johnson', description: 'Consultation - Cardiology', amount: 150, status: 'Completed', method: 'Credit Card' },
  { id: 'TX-902', date: '2026-05-20 10:15', patient: 'Robert Williams', description: 'MRI Scan', amount: 850, status: 'Completed', method: 'Insurance' },
  { id: 'TX-903', date: '2026-05-20 11:00', patient: 'Maria Garcia', description: 'Blood Test Panel', amount: 120, status: 'Pending', method: 'Cash' },
  { id: 'TX-904', date: '2026-05-19 14:20', patient: 'David Lee', description: 'Consultation - Orthopedics', amount: 150, status: 'Failed', method: 'Credit Card' },
  { id: 'TX-905', date: '2026-05-19 15:45', patient: 'Emma Brown', description: 'Vaccination', amount: 80, status: 'Completed', method: 'Debit Card' },
];

const StatCard = ({ title, value, icon: Icon, trend, isPositive, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
    className="bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
        <Icon size={22} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ${isPositive ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-500/10' : 'text-rose-700 bg-rose-100 dark:text-rose-300 dark:bg-rose-500/10'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trend}
      </div>
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{value}</h3>
    </div>
  </motion.div>
);

const AdminRevenue = () => {
  const [dateRange, setDateRange] = useState('This Year');

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Revenue Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Financial overview, transactions, and department performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500">
            <option>This Month</option>
            <option>Last Quarter</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl font-semibold text-sm shadow-md hover:bg-slate-700 transition-all">
            <Download size={18} /> Export CSV
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="$805,000" icon={Banknote} trend="+12.5%" isPositive={true} delay={0.1} />
        <StatCard title="Total Expenses" value="$461,000" icon={Wallet} trend="+4.2%" isPositive={false} delay={0.15} />
        <StatCard title="Net Profit" value="$344,000" icon={DollarSign} trend="+18.4%" isPositive={true} delay={0.2} />
        <StatCard title="Pending Payments" value="$24,500" icon={Calendar} trend="-2.1%" isPositive={true} delay={0.25} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Revenue & Expenses Trend</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="99%" height="99%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
<<<<<<< HEAD
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
=======
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.35} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.25)' }} labelStyle={{ color: '#e2e8f0' }} itemStyle={{ color: '#e2e8f0' }} />
>>>>>>> 822c505efce474b36751a959a31f2aca31330464
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Revenue */}
        <div className="bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Revenue by Department</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="99%" height="99%">
              <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.35} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                <Tooltip cursor={{ fill: 'rgba(15, 23, 42, 0.35)' }} contentStyle={{ borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.25)' }} labelStyle={{ color: '#e2e8f0' }} itemStyle={{ color: '#e2e8f0' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6 overflow-hidden">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="pb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date & Time</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Patient</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Description</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Method</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 text-sm font-mono font-medium text-slate-500 dark:text-slate-400">{tx.id}</td>
                  <td className="py-4 text-sm text-slate-600 dark:text-slate-300">{tx.date}</td>
                  <td className="py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">{tx.patient}</td>
                  <td className="py-4 text-sm text-slate-600 dark:text-slate-300">{tx.description}</td>
                  <td className="py-4 text-sm text-slate-500 dark:text-slate-400">{tx.method}</td>
                  <td className="py-4 text-sm font-bold text-slate-800 dark:text-white">${tx.amount}</td>
                  <td className="py-4">
<<<<<<< HEAD
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      tx.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
=======
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                      tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' :
                      tx.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                    }`}>
>>>>>>> 822c505efce474b36751a959a31f2aca31330464
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  );
};

export default AdminRevenue;
