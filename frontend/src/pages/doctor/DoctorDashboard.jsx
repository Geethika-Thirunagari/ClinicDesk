import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, Clock, Activity, Star, ChevronRight,
  Video, FileText, CheckCircle, Quote
} from 'lucide-react';
import { cn } from '../../utils/cn';
import AIDiagnosisWidget from '../../components/doctor/AIDiagnosisWidget';

const patientVoices = [
  { id: 1, patient: 'Alice J.', rating: 5, text: 'Dr. Smith was incredibly attentive and explained my diagnosis clearly. Best cardiologist in town!', date: 'Today' },
  { id: 2, patient: 'Robert W.', rating: 5, text: 'Very short wait time and excellent bedside manner. Highly recommend.', date: 'Yesterday' },
  { id: 3, patient: 'Maria G.', rating: 5, text: 'Thank you for taking the time to listen to my concerns. I feel much better now.', date: '2 days ago' },
];

const schedule = [
  { id: 1, time: '09:00 AM', patient: 'Alice Johnson', type: 'Consultation', status: 'Completed' },
  { id: 2, time: '09:45 AM', patient: 'Robert Williams', type: 'Follow-up', status: 'In Progress' },
  { id: 3, time: '11:00 AM', patient: 'Maria Garcia', type: 'Teleconsult', status: 'Upcoming' },
  { id: 4, time: '11:30 AM', patient: 'David Lee', type: 'Test Review', status: 'Upcoming' },
  { id: 5, time: '02:00 PM', patient: 'Emma Brown', type: 'Consultation', status: 'Upcoming' },
];

const StatCard = ({ title, value, subtext, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
    className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5 group hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-3 rounded-xl", color)}><Icon size={22} className="text-white" /></div>
      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">{subtext}</span>
    </div>
    <div>
      <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">{value}</h3>
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">{title}</p>
    </div>
  </motion.div>
);

const DoctorDashboard = () => {
  const [activeVoice, setActiveVoice] = useState(0);

  // Simple auto-rotate for voices widget
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveVoice((prev) => (prev + 1) % patientVoices.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Doctor Workspace</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here is your summary for today, Dr. Smith.</p>
        </div>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all">
            <Video size={18} /> Start Teleconsult
          </motion.button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Patients" value="12" subtext="4 remaining" icon={Users} color="bg-blue-500" delay={0.1} />
        <StatCard title="Upcoming Teleconsults" value="3" subtext="Next in 1hr" icon={Video} color="bg-indigo-500" delay={0.15} />
        <StatCard title="Pending Reports" value="5" subtext="2 critical" icon={FileText} color="bg-amber-500" delay={0.2} />
        <StatCard title="Patient Satisfaction" value="4.9" subtext="+0.2 this week" icon={Star} color="bg-emerald-500" delay={0.25} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Schedule (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" />
              Today's Schedule
            </h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View Full Schedule</button>
          </div>

          <div className="space-y-4">
            {schedule.map((apt, i) => (
              <motion.div key={apt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all",
                  apt.status === 'In Progress' ? "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 shadow-sm" :
                    "bg-slate-50/50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 text-center">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{apt.time.split(' ')[0]}</p>
                    <p className="text-xs font-semibold text-slate-500">{apt.time.split(' ')[1]}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">{apt.patient}</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{apt.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider",
                    apt.status === 'Completed' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                      apt.status === 'In Progress' ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 animate-pulse" :
                        "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  )}>
                    {apt.status}
                  </span>
                  <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets (Takes up 1 column) */}
        <div className="space-y-6">

          {/* 🌟 Innovative Feature: Patient Voices Widget */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

            <h2 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 opacity-90">
              <Quote size={16} />
              Patient Voices
            </h2>

            <div className="relative h-40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVoice}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(patientVoices[activeVoice].rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-lg font-medium leading-snug mb-4">"{patientVoices[activeVoice].text}"</p>
                  <div className="flex items-center justify-between text-xs opacity-80 font-medium">
                    <span>— {patientVoices[activeVoice].patient}</span>
                    <span>{patientVoices[activeVoice].date}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex gap-1 mt-2">
              {patientVoices.map((_, i) => (
                <div key={i} className={cn("h-1 rounded-full transition-all duration-300", i === activeVoice ? "w-4 bg-white" : "w-1.5 bg-white/30")} />
              ))}
            </div>
          </div>

          {/* AI Symptom Analyzer */}
          <AIDiagnosisWidget />

          {/* Quick Tasks */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              Action Items
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 accent-emerald-500 w-4 h-4" />
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Review MRI results for D. Lee</p>
                  <p className="text-xs text-slate-500">Urgent • 2 hours ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 accent-emerald-500 w-4 h-4" />
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sign off on 3 prescriptions</p>
                  <p className="text-xs text-slate-500">Pharmacy request</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 accent-emerald-500 w-4 h-4" />
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Update availability for next week</p>
                  <p className="text-xs text-slate-500">Admin request</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default DoctorDashboard;
