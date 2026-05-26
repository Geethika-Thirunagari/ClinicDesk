import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { REVENUE_CHART_DATA, MOCK_INVOICES, computeInvoiceTotals } from '../../data/billingMocks';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/90 backdrop-blur-md border border-white/50 shadow-xl rounded-xl p-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500 capitalize">{p.name}:</span>
          <span className="font-semibold text-slate-800">${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, iconBg, iconColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 100 }}
    whileHover={{ y: -3, scale: 1.02 }}
    className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-sm relative overflow-hidden group"
  >
    <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-2xl" style={{ background: iconColor }} />
    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
      <Icon size={18} className={iconColor} />
    </div>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </motion.div>
);

const RevenueAnalytics = ({ delay = 0 }) => {
  const allTotals = MOCK_INVOICES.map((inv) => ({ ...inv, ...computeInvoiceTotals(inv) }));
  const totalRevenue = allTotals.reduce((s, i) => s + i.total, 0);
  const collected = allTotals.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const pending = allTotals.filter((i) => i.status === 'unpaid').reduce((s, i) => s + i.total, 0);
  const overdue = allTotals.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign}    label="Total Billed"   value={`$${totalRevenue.toLocaleString()}`} sub="All invoices"         iconBg="bg-blue-50"    iconColor="text-blue-600"    delay={delay}         />
        <StatCard icon={CheckCircle2}  label="Collected"      value={`$${collected.toLocaleString()}`}    sub="Paid invoices"          iconBg="bg-emerald-50" iconColor="text-emerald-600" delay={delay + 0.07}  />
        <StatCard icon={Clock}         label="Pending"        value={`$${pending.toLocaleString()}`}      sub="Awaiting payment"       iconBg="bg-amber-50"   iconColor="text-amber-600"   delay={delay + 0.14} />
        <StatCard icon={TrendingUp}    label="Overdue"        value={`$${overdue.toLocaleString()}`}      sub="Past due date"          iconBg="bg-rose-50"    iconColor="text-rose-600"    delay={delay + 0.21} />
      </div>

      {/* Revenue Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.3, type: 'spring', stiffness: 100 }}
        className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6"
      >
        <h3 className="font-semibold text-slate-800 mb-1">Revenue vs Collections</h3>
        <p className="text-sm text-slate-500 mb-5">Last 6 months overview</p>
        <div className="h-56 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_CHART_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Area type="monotone" dataKey="revenue"   name="Billed"    stroke="#3b82f6" strokeWidth={2.5} fill="url(#gRevenue)"   />
              <Area type="monotone" dataKey="collected" name="Collected" stroke="#10b981" strokeWidth={2.5} fill="url(#gCollected)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bar Chart — monthly breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.4, type: 'spring', stiffness: 100 }}
        className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6"
      >
        <h3 className="font-semibold text-slate-800 mb-1">Monthly Collection Rate</h3>
        <p className="text-sm text-slate-500 mb-5">Billed vs collected per month</p>
        <div className="h-48 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_CHART_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue"   name="Billed"    fill="#bfdbfe" radius={[4, 4, 0, 0]} />
              <Bar dataKey="collected" name="Collected" fill="#6ee7b7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default RevenueAnalytics;
