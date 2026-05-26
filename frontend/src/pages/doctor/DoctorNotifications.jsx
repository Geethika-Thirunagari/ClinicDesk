import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle, Clock, Trash2, CheckSquare } from 'lucide-react';
import { cn } from '../../utils/cn';

const initialNotifications = [
  { id: 1, type: 'critical', title: 'Critical Lab Results', message: 'Patient David Lee (PT-4491) lipid panel shows critical values requiring immediate attention.', time: '10 mins ago', read: false },
  { id: 2, type: 'warning', title: 'Consultation Delayed', message: 'The 09:45 AM appointment has been delayed by the patient (running 15 mins late).', time: '1 hour ago', read: false },
  { id: 3, type: 'info', title: 'System Update', message: 'ClinicDesk EHR will be undergoing maintenance tonight at 02:00 AM.', time: '3 hours ago', read: true },
  { id: 4, type: 'success', title: 'Prescription Refill Approved', message: 'Pharmacy confirmed the refill for Alice Johnson.', time: '5 hours ago', read: true },
  { id: 5, type: 'warning', title: 'Schedule Conflict', message: 'You have overlapping blocks on Thursday at 11:00 AM.', time: 'Yesterday', read: true },
];

const getIcon = (type) => {
  switch(type) {
    case 'critical': return <AlertTriangle className="text-rose-500" size={24} />;
    case 'warning': return <Clock className="text-amber-500" size={24} />;
    case 'success': return <CheckCircle className="text-emerald-500" size={24} />;
    default: return <Info className="text-blue-500" size={24} />;
  }
};

const DoctorNotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all'); // all, unread

  const filtered = notifications.filter(n => filter === 'all' || !n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
            Alerts & Notifications
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Stay updated on patients, schedules, and system alerts.</p>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button onClick={() => setFilter('all')} className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all", filter === 'all' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-500")}>All</button>
            <button onClick={() => setFilter('unread')} className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all", filter === 'unread' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-500")}>Unread</button>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10">
              <CheckSquare size={16} /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <AnimatePresence>
            {filtered.map((n) => (
              <motion.div key={n.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                className={cn(
                  "p-5 flex gap-4 transition-colors relative group",
                  n.read ? "bg-white/40 dark:bg-slate-950/40" : "bg-blue-50/30 dark:bg-blue-900/10"
                )}
              >
                {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
                
                <div className="shrink-0 mt-1">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    n.type === 'critical' ? "bg-rose-100 dark:bg-rose-500/20" :
                    n.type === 'warning' ? "bg-amber-100 dark:bg-amber-500/20" :
                    n.type === 'success' ? "bg-emerald-100 dark:bg-emerald-500/20" :
                    "bg-blue-100 dark:bg-blue-500/20"
                  )}>
                    {getIcon(n.type)}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn("font-bold text-base", n.read ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white")}>{n.title}</h3>
                    <span className="text-xs font-semibold text-slate-400">{n.time}</span>
                  </div>
                  <p className={cn("text-sm", n.read ? "text-slate-500 dark:text-slate-400" : "text-slate-700 dark:text-slate-300 font-medium")}>{n.message}</p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center">
                  <button onClick={() => removeNotification(n.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg transition-colors tooltip-trigger" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Bell size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">All caught up! No notifications here.</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default DoctorNotifications;
