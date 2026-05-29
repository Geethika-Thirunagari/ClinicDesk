import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Activity, FileText, CreditCard, Clock,
  ChevronRight, Pill, Heart, TrendingUp, SearchCheck, UserCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

const upcomingAppointments = [
  { id: 1, doctor: 'Dr. Sarah Smith', specialty: 'Cardiology', date: 'May 21, 2026', time: '10:00 AM', mode: 'In-Person' },
  { id: 2, doctor: 'Dr. Emily Chen', specialty: 'Dermatology', date: 'May 25, 2026', time: '02:30 PM', mode: 'Teleconsult' },
];

const medications = [
  { id: 1, name: 'Lisinopril 10mg', instruction: '1 tablet daily, morning', refillDate: 'Jun 15' },
  { id: 2, name: 'Metformin 500mg', instruction: '1 tablet twice daily, with meals', refillDate: 'Jun 02' },
];

const vitals = [
  { label: 'Blood Pressure', value: '128/82', unit: 'mmHg', icon: Heart, color: 'text-rose-500' },
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Activity, color: 'text-blue-500' },
  { label: 'Weight Tracker', value: '74.5', unit: 'kg', icon: TrendingUp, color: 'text-emerald-500' },
];

const PatientDashboard = () => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 font-['Outfit']">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a1a0f] tracking-tight text-shadow-sm">Health Hub</h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">Your personal clinical overview and wellness metrics.</p>
        </div>
        <motion.button
          whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/patient/book')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0a1a0f] text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-900/10 transition-all uppercase tracking-widest">
          <Calendar size={16} /> New Appointment
        </motion.button>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Health Tracker', icon: Activity, color: 'bg-rose-600', path: '/patient/health-tracker' },
          { label: 'Symptom Checker', icon: SearchCheck, color: 'bg-emerald-600', path: '/patient/symptom-checker' },
          { label: 'Payments', icon: CreditCard, color: 'bg-amber-600', path: '/patient/payments' },
          { label: 'Medical History', icon: FileText, color: 'bg-indigo-600', path: '/patient/history' },
        ].map((action, i) => (
          <motion.button key={action.label}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            onClick={() => navigate(action.path)}
            className="finai-card p-6 flex flex-col items-start gap-4 hover:shadow-md transition-all group">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/5 transition-transform group-hover:scale-110", action.color)}>
              <action.icon size={22} className="text-white" />
            </div>
            <p className="font-bold text-xs text-slate-400 uppercase tracking-widest group-hover:text-[#0a1a0f] transition-colors">{action.label}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Appointments Section */}
        <div className="lg:col-span-2 finai-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-bold text-[#0a1a0f] uppercase tracking-[0.2em] flex items-center gap-2">
              <Calendar size={14} className="text-blue-600" />
              Upcoming Care
            </h2>
            <button onClick={() => navigate('/patient/book')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#0a1a0f]">Schedule</button>
          </div>

          <div className="space-y-3 flex-1">
            {upcomingAppointments.map((apt, i) => (
              <motion.div key={apt.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                className="flex items-center justify-between p-4 rounded-xl border border-[#e2e8e2] hover:border-emerald-200 bg-white group cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-[#e2e8e2] flex items-center justify-center font-bold text-emerald-600 text-xs">
                    {apt.doctor.split(' ')[1][0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0a1a0f] group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{apt.doctor}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{apt.specialty} • {apt.mode}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[#0a1a0f]">{apt.date}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{apt.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vital KPIs */}
        <div className="finai-card p-6">
          <h2 className="text-[10px] font-bold text-[#0a1a0f] uppercase tracking-[0.2em] mb-8">Vital Metrics</h2>
          <div className="space-y-6">
            {vitals.map((v, i) => (
              <div key={v.label} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-slate-50 border border-slate-100 transition-colors group-hover:bg-white group-hover:border-emerald-100", v.color)}>
                    <v.icon size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-[#0a1a0f] transition-colors">{v.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-[#0a1a0f]">{v.value}</span>
                  <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-tighter">{v.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Script Section: Medications */}
      <div className="finai-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[10px] font-bold text-[#0a1a0f] uppercase tracking-[0.2em] flex items-center gap-2">
            <Pill size={14} className="text-emerald-500" />
            Active Prescriptions
          </h2>
          <button onClick={() => navigate('/patient/prescriptions')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#0a1a0f]">Store</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map(med => (
            <div key={med.id} className="p-5 rounded-[24px] bg-slate-50 border border-[#e2e8e2] hover:bg-white hover:border-emerald-200 transition-all cursor-pointer group">
              <h4 className="font-bold text-sm text-[#0a1a0f] group-hover:text-emerald-700 transition-colors">{med.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">{med.instruction}</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em]">Refill by: {med.refillDate}</span>
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};

export default PatientDashboard;
