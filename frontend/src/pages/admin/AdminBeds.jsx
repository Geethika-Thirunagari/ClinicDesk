import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BedDouble, Activity, CheckCircle, AlertCircle, Plus, Search } from 'lucide-react';
import { cn } from '../../utils/cn';

const wards = [
  { id: 'W-ICU', name: 'Intensive Care Unit (ICU)', total: 20, occupied: 18, maintenance: 0 },
  { id: 'W-GEN', name: 'General Ward', total: 50, occupied: 35, maintenance: 5 },
  { id: 'W-MAT', name: 'Maternity Ward', total: 30, occupied: 22, maintenance: 2 },
  { id: 'W-PED', name: 'Pediatrics', total: 25, occupied: 15, maintenance: 1 },
];

const beds = [
  { id: 'ICU-01', ward: 'Intensive Care Unit (ICU)', patient: 'Alice Johnson', status: 'Occupied', lastCleaned: '2 hours ago' },
  { id: 'ICU-02', ward: 'Intensive Care Unit (ICU)', patient: 'David Lee', status: 'Occupied', lastCleaned: '1 hour ago' },
  { id: 'ICU-03', ward: 'Intensive Care Unit (ICU)', patient: null, status: 'Available', lastCleaned: '10 mins ago' },
  { id: 'GEN-15', ward: 'General Ward', patient: null, status: 'Maintenance', lastCleaned: '1 day ago' },
  { id: 'GEN-16', ward: 'General Ward', patient: 'Robert Williams', status: 'Occupied', lastCleaned: '4 hours ago' },
  { id: 'MAT-05', ward: 'Maternity Ward', patient: 'Maria Garcia', status: 'Occupied', lastCleaned: '30 mins ago' },
];

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
    className="finai-card p-5 relative overflow-hidden group hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-2xl font-extrabold text-[#0a1a0f] ">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-xl", color)}><Icon size={22} className="text-white" /></div>
    </div>
  </motion.div>
);

const AdminBeds = () => {
  const [search, setSearch] = useState('');
  
  const filteredBeds = beds.filter(b => 
    b.id.toLowerCase().includes(search.toLowerCase()) || 
    b.ward.toLowerCase().includes(search.toLowerCase()) ||
    (b.patient && b.patient.toLowerCase().includes(search.toLowerCase()))
  );

  const statusColor = (s) => {
    if (s === 'Available') return 'bg-emerald-100 text-emerald-700 ';
    if (s === 'Occupied') return 'bg-rose-100 text-rose-700 ';
    if (s === 'Maintenance') return 'bg-amber-100 text-amber-700 ';
    return 'bg-slate-100 text-slate-500 ';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">Bed & Ward Management</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time tracking of hospital capacity and bed assignments.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all">
          <Plus size={18} /> Assign Bed
        </motion.button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Capacity" value="125" icon={BedDouble} color="bg-blue-500" delay={0.1} />
        <StatCard title="Available Beds" value="27" icon={CheckCircle} color="bg-emerald-500" delay={0.15} />
        <StatCard title="Occupied" value="90" icon={Activity} color="bg-rose-500" delay={0.2} />
        <StatCard title="Under Maintenance" value="8" icon={AlertCircle} color="bg-amber-500" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wards Overview */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-[#0a1a0f] ">Ward Overview</h2>
          {wards.map((ward, i) => {
            const occPercent = Math.round((ward.occupied / ward.total) * 100);
            return (
              <motion.div key={ward.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                className="finai-card p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-[#0a1a0f] ">{ward.name}</h3>
                  <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", occPercent > 85 ? "bg-rose-100 text-rose-700 " : "bg-emerald-100 text-emerald-700 ")}>
                    {occPercent}% Full
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                  <div className={cn("h-2 rounded-full", occPercent > 85 ? "bg-rose-500" : "bg-emerald-500")} style={{ width: `${occPercent}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>{ward.occupied} Occupied</span>
                  <span>{ward.total - ward.occupied - ward.maintenance} Available</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Beds Table */}
        <div className="lg:col-span-2 finai-card p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-lg font-bold text-[#0a1a0f] ">Bed Status Details</h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search beds..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 :text-slate-500" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 ">
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bed ID</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ward</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Cleaned</th>
                </tr>
              </thead>
              <tbody>
                {filteredBeds.map(bed => (
                  <tr key={bed.id} className="border-b border-slate-100 hover:bg-slate-50/50 :bg-slate-800/50 transition-colors">
                    <td className="py-4 text-sm font-mono font-bold text-slate-700 ">{bed.id}</td>
                    <td className="py-4 text-sm text-slate-600 ">{bed.ward}</td>
                    <td className="py-4 text-sm font-semibold text-[#0a1a0f] ">{bed.patient || '-'}</td>
                    <td className="py-4"><span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider", statusColor(bed.status))}>{bed.status}</span></td>
                    <td className="py-4 text-sm text-slate-500 ">{bed.lastCleaned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminBeds;
