import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, CreditCard, Clock, UserPlus, ChevronRight, CheckCircle, Wallet, ScanLine, MessageSquareHeart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const queue = [
  { id: 1, token: 'T-902', patient: 'Alice Johnson', doctor: 'Dr. Smith', time: '09:00 AM', status: 'Active' },
  { id: 2, token: 'T-903', patient: 'Robert Williams', doctor: 'Dr. Smith', time: '09:45 AM', status: 'Waiting' },
  { id: 3, token: 'T-904', patient: 'Maria Garcia', doctor: 'Dr. Chen', time: '10:00 AM', status: 'Waiting' },
];

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
    className="cd-card p-6 flex flex-col justify-between h-[150px] hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div className={cn("p-2.5 rounded-xl shadow-sm", color)}><Icon size={18} className="text-white" /></div>
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
    </div>
    <div>
      <h3 className="text-3xl font-black text-[#0a1a0f] tracking-tight">{value}</h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{title}</p>
    </div>
  </motion.div>
);

const ReceptionDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 font-['Outfit']">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a1a0f] tracking-tight">Front Office • {user?.name || 'Receptionist'}</h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">Manage the medical flow and front-desk operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/reception/registration')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0a1a0f] text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-900/10 transition-all uppercase tracking-widest">
            <UserPlus size={16} /> New Registration
          </motion.button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Bookings" value="48" icon={Calendar} color="bg-blue-600" delay={0.1} />
        <StatCard title="Waiting Queue" value="12" icon={Clock} color="bg-amber-600" delay={0.15} />
        <StatCard title="Checked In" value="31" icon={CheckCircle} color="bg-emerald-600" delay={0.2} />
        <StatCard title="Due Payments" value="05" icon={CreditCard} color="bg-rose-600" delay={0.25} />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Live Queue Table */}
        <div className="lg:col-span-2 cd-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-bold text-[#0a1a0f] uppercase tracking-[0.2em] flex items-center gap-2">
              <Users size={14} className="text-blue-600" />
              Current Traffic
            </h2>
            <button onClick={() => navigate('/reception/queue')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#0a1a0f]">Live Feed</button>
          </div>

          <div className="space-y-3 flex-1">
            {queue.map((q, i) => (
              <motion.div key={q.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={cn("flex items-center justify-between p-4 rounded-xl border transition-all group cursor-pointer",
                  q.status === 'Active' ? "bg-blue-50 border-blue-100 shadow-sm" : "bg-white border-[#e2e8e2] hover:border-emerald-200")}>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-blue-600 w-10">{q.token}</span>
                  <div className="w-px h-6 bg-slate-100 group-hover:bg-emerald-100 transition-colors"></div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0a1a0f] group-hover:text-emerald-700 transition-colors">{q.patient}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{q.doctor} • {q.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border",
                    q.status === 'Active' ? "bg-blue-600 text-white border-blue-600" : "bg-amber-50 text-amber-600 border-amber-100")}>{q.status}</span>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="cd-card p-6">
          <h2 className="text-[10px] font-bold text-[#0a1a0f] uppercase tracking-[0.2em] mb-6">Operations</h2>
          <div className="space-y-3">
            {[
              { label: 'Appointment Booking', icon: Calendar, path: '/reception/booking', color: 'text-blue-600' },
              { label: 'Patient Onboarding', icon: UserPlus, path: '/reception/registration', color: 'text-emerald-600' },
              { label: 'Billing & Invoicing', icon: Wallet, path: '/reception/billing', color: 'text-amber-600' },
              { label: 'Queue Logistics', icon: Users, path: '/reception/queue', color: 'text-indigo-600' },
              { label: 'Patient Check-in', icon: ScanLine, path: '/reception/checkin', color: 'text-rose-600' },
              { label: 'Review Feedback', icon: MessageSquareHeart, path: '/reception/feedback', color: 'text-purple-600' }
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.path)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-[#e2e8e2] hover:bg-slate-50 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <a.icon size={16} className={cn("transition-colors", a.color)} />
                  <span className="font-bold text-xs text-slate-600 group-hover:text-[#0a1a0f] transition-colors">{a.label}</span>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReceptionDashboard;
