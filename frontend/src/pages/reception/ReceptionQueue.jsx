import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowUp, ArrowDown, CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const initialQueue = [
  { id: 1, token: 'T-010', patient: 'David Lee', doctor: 'Dr. Smith', time: '08:30 AM', status: 'Completed' },
  { id: 2, token: 'T-011', patient: 'Emma Brown', doctor: 'Dr. Chen', time: '08:45 AM', status: 'Completed' },
  { id: 3, token: 'T-012', patient: 'Alice Johnson', doctor: 'Dr. Smith', time: '09:00 AM', status: 'In Progress' },
  { id: 4, token: 'T-013', patient: 'Robert Williams', doctor: 'Dr. Smith', time: '09:45 AM', status: 'Waiting' },
  { id: 5, token: 'T-014', patient: 'Maria Garcia', doctor: 'Dr. Chen', time: '10:00 AM', status: 'Waiting' },
  { id: 6, token: 'T-015', patient: 'James Taylor', doctor: 'Dr. Doe', time: '10:30 AM', status: 'Waiting' },
  { id: 7, token: 'T-016', patient: 'Sophia Martinez', doctor: 'Dr. Smith', time: '11:00 AM', status: 'Checked In' },
];

const ReceptionQueue = () => {
  const [queue, setQueue] = useState(initialQueue);

  const statusColor = (s) => {
    switch(s) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Waiting': return 'bg-amber-100 text-amber-700';
      case 'Checked In': return 'bg-indigo-100 text-indigo-700';
      case 'Cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const callNext = () => {
    setQueue(q => q.map(item => {
      if (item.status === 'In Progress') return { ...item, status: 'Completed' };
      return item;
    }).map((item, _, arr) => {
      if (item.status === 'Waiting' && !arr.some(a => a.status === 'In Progress')) return { ...item, status: 'In Progress' };
      return item;
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Patient Queue</h1>
          <p className="text-sm text-slate-500 mt-1">Manage the live patient queue and call flow.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={callNext}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/30">
          <CheckCircle size={18} /> Call Next Patient
        </motion.button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ l: 'Total', v: queue.length, c: 'bg-blue-500', i: Users },
          { l: 'Waiting', v: queue.filter(q => q.status === 'Waiting').length, c: 'bg-amber-500', i: Clock },
          { l: 'In Progress', v: queue.filter(q => q.status === 'In Progress').length, c: 'bg-indigo-500', i: Users },
          { l: 'Completed', v: queue.filter(q => q.status === 'Completed').length, c: 'bg-emerald-500', i: CheckCircle }].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
            className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5">
            <div className={cn("p-3 rounded-xl w-fit mb-3", s.c)}><s.i size={22} className="text-white" /></div>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{s.v}</h3>
            <p className="text-sm font-semibold text-slate-500 mt-1">{s.l}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50">
              {['Token','Patient','Doctor','Scheduled','Status','Actions'].map(h => <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody>
              {queue.map((q, i) => (
                <motion.tr key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className={cn("border-b border-slate-100 dark:border-slate-800 transition-colors",
                    q.status === 'In Progress' ? "bg-blue-50/50 dark:bg-blue-500/5" : "hover:bg-slate-50/50")}>
                  <td className="px-6 py-4 text-sm font-mono font-bold text-blue-600 dark:text-blue-400">{q.token}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-white">{q.patient}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{q.doctor}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{q.time}</td>
                  <td className="px-6 py-4"><span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider", statusColor(q.status))}>{q.status}</span></td>
                  <td className="px-6 py-4">
                    {q.status === 'Waiting' && (
                      <button onClick={() => setQueue(queue.map(x => x.id === q.id ? { ...x, status: 'Cancelled' } : x))}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700">Cancel</button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
export default ReceptionQueue;
