import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Activity, FileText, CreditCard, Star, Bell, Clock, 
  ChevronRight, Pill, Heart, TrendingUp, Moon, Sun 
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
  { label: 'Blood Pressure', value: '128/82', unit: 'mmHg', trend: 'stable', icon: Heart, color: 'text-rose-500' },
  { label: 'Heart Rate', value: '72', unit: 'bpm', trend: 'down', icon: Activity, color: 'text-blue-500' },
  { label: 'Weight', value: '74.5', unit: 'kg', trend: 'stable', icon: TrendingUp, color: 'text-emerald-500' },
];

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('clinicdesk-theme') === 'dark');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('clinicdesk-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('clinicdesk-theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Welcome back, Alice 👋</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here's your health summary for today.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Book Appointment', icon: Calendar, color: 'bg-blue-500', path: '/patient/book' },
          { label: 'My Prescriptions', icon: Pill, color: 'bg-emerald-500', path: '/patient/prescriptions' },
          { label: 'Payment History', icon: CreditCard, color: 'bg-indigo-500', path: '/patient/payments' },
          { label: 'Medical History', icon: FileText, color: 'bg-amber-500', path: '/patient/history' },
        ].map((action, i) => (
          <motion.button key={action.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate(action.path)}
            className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5 text-left hover:shadow-md transition-all group">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3", action.color)}>
              <action.icon size={22} className="text-white" />
            </div>
            <p className="font-bold text-sm text-slate-800 dark:text-white">{action.label}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" /> Upcoming Appointments
            </h2>
            <button onClick={() => navigate('/patient/book')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Book New</button>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((apt, i) => (
              <motion.div key={apt.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center font-bold text-blue-600 dark:text-blue-300">
                    {apt.doctor.charAt(4)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">{apt.doctor}</h4>
                    <p className="text-xs text-slate-500">{apt.specialty} • {apt.mode}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{apt.date}</p>
                  <p className="text-xs text-slate-500">{apt.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vitals Snapshot */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Heart size={20} className="text-rose-500" /> My Vitals
          </h2>
          <div className="space-y-5">
            {vitals.map((v, i) => (
              <div key={v.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <v.icon size={20} className={v.color} />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{v.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-slate-800 dark:text-white">{v.value}</span>
                  <span className="text-xs text-slate-500 ml-1">{v.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Medications */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Pill size={20} className="text-emerald-500" /> Current Medications
          </h2>
          <button onClick={() => navigate('/patient/prescriptions')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map(med => (
            <div key={med.id} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">{med.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{med.instruction}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-2">Refill by: {med.refillDate}</p>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};

export default PatientDashboard;
