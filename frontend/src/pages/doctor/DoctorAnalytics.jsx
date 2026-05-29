import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Award, Calendar, ChevronDown, Download, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const visitData = [
  { name: 'Jan', visits: 120, teleconsults: 30 },
  { name: 'Feb', visits: 140, teleconsults: 45 },
  { name: 'Mar', visits: 180, teleconsults: 65 },
  { name: 'Apr', visits: 160, teleconsults: 50 },
  { name: 'May', visits: 210, teleconsults: 85 },
  { name: 'Jun', visits: 250, teleconsults: 110 }
];

const diagnosisData = [
  { name: 'Hypertension', value: 35, color: '#3b82f6' },
  { name: 'Diabetes (Type-2)', value: 25, color: '#10b981' },
  { name: 'Respiratory Inf.', value: 20, color: '#f59e0b' },
  { name: 'Dermatitis', value: 12, color: '#8b5cf6' },
  { name: 'Post-Op Rehab', value: 8, color: '#ec4899' }
];

const outcomeData = [
  { name: 'Mild Hypertension', improved: 82, stable: 15, worsened: 3 },
  { name: 'Type-2 Diabetes', improved: 68, stable: 24, worsened: 8 },
  { name: 'Contact Dermatitis', improved: 92, stable: 6, worsened: 2 },
  { name: 'Post-Op Recovery', improved: 88, stable: 10, worsened: 2 }
];

const demographicsData = {
  gender: [
    { name: 'Female', value: 58, color: '#ec4899' },
    { name: 'Male', value: 39, color: '#3b82f6' },
    { name: 'Other / Undisclosed', value: 3, color: '#94a3b8' }
  ],
  age: [
    { name: '0-18', value: 15 },
    { name: '19-35', value: 30 },
    { name: '36-50', value: 25 },
    { name: '51-65', value: 20 },
    { name: '65+', value: 10 }
  ]
};

export default function DoctorAnalytics() {
  const [timeRange, setTimeRange] = useState("6 Months");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 font-['Outfit']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a1a0f] tracking-tight flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={24} />
            Clinical Insights
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">Statistical breakdown of your medical practice and patient outcomes.</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={triggerRefresh} className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl transition-all shadow-sm">
            <RefreshCw className={isRefreshing ? "animate-spin" : ""} size={16} />
          </button>

          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 rounded-xl py-2.5 pl-4 pr-10 text-xs font-bold shadow-sm cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Last 30 Days</option>
              <option>6 Months</option>
              <option>Full Year</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-500/10">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div >

      {/* Row 1: KPI Stats Summary */}
      < div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
        {
          [
            { label: "Active Practice Cohort", value: "384 Patients", change: "+12% this month", trendIcon: TrendingUp, trendColor: "text-emerald-500" },
            { label: "Avg. Patient Satisfaction Score", value: "4.92 / 5.0", change: "Based on 142 reviews", trendIcon: Award, trendColor: "text-blue-500" },
            { label: "Clinical Consult Duration", value: "18.4 mins", change: "Optimal scheduling efficiency", trendIcon: Calendar, trendColor: "text-indigo-500" }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="cd-card p-5 hover:shadow-md transition-all">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-extrabold text-[#0a1a0f] mt-2 leading-none">{stat.value}</h3>
              <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-slate-500 ">
                <stat.trendIcon size={14} className={stat.trendColor} />
                <span>{stat.change}</span>
              </div>
            </motion.div>
          ))
        }
      </div >

      {/* Row 2: Visit Trends Area Chart & Diagnoses Donut */}
      < div className="grid grid-cols-1 lg:grid-cols-3 gap-6" >
        {/* Visit trends chart - takes up 2 cols */}
        < div className="lg:col-span-2 cd-card p-6" >
          <h2 className="text-lg font-bold text-[#0a1a0f] flex items-center gap-2 mb-6">
            Consultation Activity Volume
          </h2>
          <div className="h-[300px] w-full font-medium text-xs">
            <ResponsiveContainer width="99%" height="99%">
              <AreaChart data={visitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTele" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" name="In-Person Visits" />
                <Area type="monotone" dataKey="teleconsults" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTele)" name="Teleconsults" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div >

        {/* Diagnosis Distribution Donut */}
        < div className="cd-card p-6" >
          <h2 className="text-lg font-bold text-[#0a1a0f] mb-6">Diagnosis Breakdown</h2>
          <div className="h-[220px] w-full flex items-center justify-center">
            <ResponsiveContainer width="99%" height="99%">
              <PieChart>
                <Pie
                  data={diagnosisData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {diagnosisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-4 text-xs font-semibold text-slate-600 ">
            {diagnosisData.map((d, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.name}</span>
                </div>
                <span className="font-mono">{d.value}%</span>
              </div>
            ))}
          </div>
        </div >
      </div >

      {/* Row 3: Outcomes Analysis Bar Chart & Demographics Overview */}
      < div className="grid grid-cols-1 lg:grid-cols-2 gap-6" >
        {/* Recovery Outcomes Chart */}
        < div className="cd-card p-6" >
          <h2 className="text-lg font-bold text-[#0a1a0f] mb-6">Patient Recovery Outcomes</h2>
          <div className="h-[260px] w-full font-medium text-xs">
            <ResponsiveContainer width="99%" height="99%">
              <BarChart data={outcomeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar dataKey="improved" stackId="a" fill="#10b981" name="Recovered / Improved" radius={[0, 0, 0, 0]} />
                <Bar dataKey="stable" stackId="a" fill="#f59e0b" name="Stable" />
                <Bar dataKey="worsened" stackId="a" fill="#ef4444" name="Unresolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div >

        {/* Demographics Matrix */}
        < div className="cd-card p-6" >
          <h2 className="text-lg font-bold text-[#0a1a0f] mb-6 font-sans">Patient Cohort Demographics</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Age cohort breakdown */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Age Bracket Distribution</h3>
              <div className="space-y-3 font-semibold text-xs text-slate-600 ">
                {demographicsData.age.map((a, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span>Age {a.name}</span>
                      <span className="font-mono">{a.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${a.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender breakdown donut */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Gender Cohort Breakdown</h3>
              <div className="h-[120px] w-full">
                <ResponsiveContainer width="99%" height="99%">
                  <PieChart>
                    <Pie data={demographicsData.gender} cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey="value">
                      {demographicsData.gender.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-500 ">
                {demographicsData.gender.map((g, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                    <span>{g.name} ({g.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div >
      </div >
    </motion.div >
  );
}
