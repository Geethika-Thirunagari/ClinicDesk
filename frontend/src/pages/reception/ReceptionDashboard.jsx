import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, CreditCard, Clock, UserPlus, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

const queue = [
  { id: 1, token: 'T-012', patient: 'Alice Johnson', doctor: 'Dr. Smith', time: '09:00 AM', status: 'In Progress' },
  { id: 2, token: 'T-013', patient: 'Robert Williams', doctor: 'Dr. Smith', time: '09:45 AM', status: 'Waiting' },
  { id: 3, token: 'T-014', patient: 'Maria Garcia', doctor: 'Dr. Chen', time: '10:00 AM', status: 'Waiting' },
];

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5 hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-3">
      <div className={cn("p-3 rounded-xl", color)}><Icon size={22} className="text-white" /></div>
    </div>
    <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{value}</h3>
    <p className="text-sm font-semibold text-slate-500 mt-1">{title}</p>
  </motion.div>
);

const ReceptionDashboard = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Reception Desk</h1>
          <p className="text-sm text-slate-500 mt-1">Manage walk-ins, bookings, and patient flow.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/reception/registration')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/30">
          <UserPlus size={18} /> Register Patient
        </motion.button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Appointments" value="48" icon={Calendar} color="bg-blue-500" delay={0.1} />
        <StatCard title="In Queue" value="12" icon={Clock} color="bg-amber-500" delay={0.15} />
        <StatCard title="Checked In" value="31" icon={CheckCircle} color="bg-emerald-500" delay={0.2} />
        <StatCard title="Pending Payments" value="5" icon={CreditCard} color="bg-rose-500" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Queue */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Users size={20} className="text-blue-500" /> Live Queue</h2>
            <button onClick={() => navigate('/reception/queue')} className="text-sm font-semibold text-blue-600">View Full Queue</button>
          </div>
          <div className="space-y-3">
            {queue.map((q, i) => (
              <motion.div key={q.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={cn("flex items-center justify-between p-4 rounded-xl border transition-all",
                  q.status === 'In Progress' ? "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20" : "bg-slate-50/50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700")}>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 w-12">{q.token}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">{q.patient}</h4>
                    <p className="text-xs text-slate-500">{q.doctor} • {q.time}</p>
                  </div>
                </div>
                <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider",
                  q.status === 'In Progress' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700")}>{q.status}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[{ label: 'Book Appointment', icon: Calendar, path: '/reception/booking' },
              { label: 'Patient Registration', icon: UserPlus, path: '/reception/registration' },
              { label: 'Generate Bill', icon: CreditCard, path: '/reception/billing' },
              { label: 'Manage Queue', icon: Users, path: '/reception/queue' }].map(a => (
              <button key={a.label} onClick={() => navigate(a.path)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left">
                <div className="flex items-center gap-3">
                  <a.icon size={18} className="text-blue-500" />
                  <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">{a.label}</span>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default ReceptionDashboard;
