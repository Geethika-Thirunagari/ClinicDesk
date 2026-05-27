import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, Video, User, AlertCircle, XCircle, 
  CheckCircle2, ChevronRight, PlusCircle, ArrowLeft, RefreshCw
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

const initialAppointments = [
  { id: 'APT-9921', doctor: 'Dr. Sarah Smith', specialty: 'Cardiology', date: '2026-05-25', time: '11:00 AM', type: 'Teleconsult', status: 'Confirmed' },
  { id: 'APT-1082', doctor: 'Dr. Emily Chen', specialty: 'Dermatology', date: '2026-06-02', time: '02:30 PM', type: 'In-Person', status: 'Pending Verification' },
  { id: 'APT-4821', doctor: 'Dr. John Doe', specialty: 'Neurology', date: '2026-04-12', time: '10:00 AM', type: 'In-Person', status: 'Completed' },
  { id: 'APT-0391', doctor: 'Dr. Sarah Smith', specialty: 'Cardiology', date: '2026-03-15', time: '09:00 AM', type: 'Teleconsult', status: 'Completed' },
];

const PatientAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedApt, setSelectedApt] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const upcoming = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending Verification');
  const past = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  const handleCancelClick = (apt) => {
    setSelectedApt(apt);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setAppointments(appointments.map(a => 
      a.id === selectedApt.id ? { ...a, status: 'Cancelled' } : a
    ));
    setShowCancelModal(false);
    setSelectedApt(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-4 lg:p-8 min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">My Appointments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Book, reschedule, or cancel your appointments with medical specialists.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/patient/book')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20"
        >
          <PlusCircle size={18} /> Book New Visit
        </motion.button>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 gap-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            "pb-3 text-sm font-bold transition-all relative outline-none",
            activeTab === 'upcoming' 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-slate-400 hover:text-slate-600"
          )}
        >
          Upcoming Visits ({upcoming.length})
          {activeTab === 'upcoming' && (
            <motion.div layoutId="aptTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={cn(
            "pb-3 text-sm font-bold transition-all relative outline-none",
            activeTab === 'past' 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-slate-400 hover:text-slate-600"
          )}
        >
          Past & Cancelled ({past.length})
          {activeTab === 'past' && (
            <motion.div layoutId="aptTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* List content */}
      <div className="space-y-4">
        {activeTab === 'upcoming' ? (
          upcoming.length > 0 ? (
            upcoming.map((apt, i) => (
              <motion.div 
                key={apt.id} 
                initial={{ opacity: 0, y: 12 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5 hover:shadow-md transition-all flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {apt.type === 'Teleconsult' ? <Video size={22} /> : <Calendar size={22} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      {apt.doctor}
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold px-2 py-0.5 rounded">
                        {apt.specialty}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                      <Clock size={13} className="text-slate-400" />
                      {apt.date} at <span className="font-semibold text-slate-700 dark:text-slate-300">{apt.time}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3.5 mt-2 md:mt-0">
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider",
                    apt.status === 'Confirmed' 
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                  )}>
                    {apt.status}
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCancelClick(apt)}
                      className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-200 dark:hover:border-rose-500/20 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold transition-all"
                    >
                      Cancel Visit
                    </button>
                    <button 
                      onClick={() => alert(`Requested rescheduling for ${apt.id} (Mock)`)}
                      className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
              You have no upcoming appointments. Click "Book New Visit" to schedule one.
            </div>
          )
        ) : (
          past.length > 0 ? (
            past.map((apt, i) => (
              <motion.div 
                key={apt.id} 
                initial={{ opacity: 0, y: 12 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }}
                className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-sm rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                    {apt.type === 'Teleconsult' ? <Video size={22} /> : <Calendar size={22} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      {apt.doctor}
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold px-2 py-0.5 rounded">
                        {apt.specialty}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      {apt.date} at {apt.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3.5">
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider",
                    apt.status === 'Completed' 
                      ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                  )}>
                    {apt.status}
                  </span>
                  
                  {apt.status === 'Completed' && (
                    <button 
                      onClick={() => navigate('/patient/book')}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <RefreshCw size={12} /> Book Again
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
              No past visit history found.
            </div>
          )
        )}
      </div>

      {/* Cancel Confirmation Modal Overlay */}
      <AnimatePresence>
        {showCancelModal && selectedApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowCancelModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 md:p-8 max-w-md w-full relative z-10 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-600">
                <AlertCircle size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Cancel Appointment?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Are you sure you want to cancel your appointment with <strong>{selectedApt.doctor}</strong> on <strong>{selectedApt.date}</strong> at {selectedApt.time}? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition-all"
                >
                  No, Keep It
                </button>
                <button 
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-all"
                >
                  Yes, Cancel Visit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PatientAppointments;
