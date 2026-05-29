import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, Clock, Activity, Star, ChevronRight,
  Video, FileText, CheckCircle, Quote, Sparkles, BarChart3, ClipboardList
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/useAuthStore';
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
    className="cd-card p-6 group hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-3 rounded-xl", color)}><Icon size={20} className="text-white" /></div>
      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 uppercase tracking-wider">{subtext}</span>
    </div>
    <div>
      <h3 className="text-3xl font-black text-[#0a1a0f] tracking-tight">{value}</h3>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{title}</p>
    </div>
  </motion.div>
);

const DoctorDashboard = () => {
  const [activeVoice, setActiveVoice] = useState(0);
  const { user } = useAuthStore();

  // Auto-rotate for voices widget
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveVoice((prev) => (prev + 1) % patientVoices.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 font-['Outfit']">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0a1a0f] tracking-tight text-shadow-sm">Doctor Workspace</h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">Welcome back, {user?.name || 'Doctor'}. Here is your overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0a1a0f] text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-900/10 transition-all uppercase tracking-widest">
            <Video size={16} /> Start Teleconsult
          </motion.button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Patients Today" value="12" subtext="4 remaining" icon={Users} color="bg-blue-600" delay={0.1} />
        <StatCard title="Teleconsults" value="03" subtext="In 1 hr" icon={Video} color="bg-indigo-600" delay={0.15} />
        <StatCard title="Pending Reports" value="05" subtext="2 critical" icon={FileText} color="bg-rose-600" delay={0.2} />
        <StatCard title="Satisfaction" value="4.9" subtext="+0.2 wk" icon={Star} color="bg-emerald-600" delay={0.25} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Schedule */}
        <div className="lg:col-span-2 cd-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-[#0a1a0f] uppercase tracking-widest flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              Today's Schedule
            </h2>
            <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#0a1a0f] transition-colors">View All</button>
          </div>

          <div className="space-y-3 flex-1">
            {schedule.map((apt, i) => (
              <motion.div key={apt.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all group cursor-pointer",
                  apt.status === 'In Progress'
                    ? "bg-blue-50 border-blue-100 shadow-sm"
                    : "bg-white border-[#e2e8e2] hover:border-emerald-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 text-center">
                    <p className="text-xs font-black text-[#0a1a0f]">{apt.time.split(' ')[0]}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{apt.time.split(' ')[1]}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-100 group-hover:bg-emerald-100 transition-colors"></div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0a1a0f] group-hover:text-emerald-700 transition-colors">{apt.patient}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{apt.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border",
                    apt.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      apt.status === 'In Progress' ? "bg-blue-600 text-white border-blue-600 animate-pulse" :
                        "bg-slate-50 text-slate-400 border-slate-100"
                  )}>
                    {apt.status}
                  </span>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">

          {/* Patient Voices */}
          <div className="bg-[#0a1a0f] rounded-[24px] p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>

            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-emerald-400">
              <Quote size={14} />
              Voices
            </h2>

            <div className="relative h-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVoice}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <p className="text-sm font-bold leading-relaxed mb-4 text-slate-200">"{patientVoices[activeVoice].text}"</p>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-500">
                    <span>— {patientVoices[activeVoice].patient}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className="fill-emerald-500 text-emerald-500" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex gap-1.5 mt-2">
              {patientVoices.map((_, i) => (
                <div key={i} className={cn("h-1 rounded-full transition-all duration-300", i === activeVoice ? "w-4 bg-emerald-500" : "w-1 bg-white/10")} />
              ))}
            </div>
          </div>

          {/* AI Symptom Analyzer */}
          <AIDiagnosisWidget />

          {/* Action Items */}
          <div className="cd-card p-6">
            <h2 className="text-[10px] font-bold text-[#0a1a0f] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-500" />
              Tasks
            </h2>
            <ul className="space-y-4">
              {[
                { label: 'Review MRI - D. Lee', sub: 'Urgent • 2h ago' },
                { label: 'Prescription Sign-off', sub: '3 requests' },
                { label: 'Update Availability', sub: 'Admin request' }
              ].map((task, idx) => (
                <li key={idx} className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-4 h-4 rounded border border-slate-200 mt-0.5 group-hover:border-emerald-500 transition-colors flex items-center justify-center">
                    <div className="w-2 h-2 rounded-sm bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0a1a0f] group-hover:text-emerald-700 transition-colors">{task.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{task.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default DoctorDashboard;
