import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, Pill, CreditCard, CheckSquare, Trash2, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

const initial = [
  { id: 1, type: 'appointment', title: 'Appointment Reminder', message: 'Your appointment with Dr. Sarah Smith is tomorrow at 10:00 AM.', time: '2 hours ago', read: false },
  { id: 2, type: 'medication', title: 'Medication Refill Due', message: 'Your Metformin 500mg prescription needs refilling by Jun 02.', time: '1 day ago', read: false },
  { id: 3, type: 'billing', title: 'Invoice Pending', message: 'You have an outstanding balance of $120.00 for Lab Panel.', time: '3 days ago', read: true },
  { id: 4, type: 'info', title: 'Lab Results Ready', message: 'Your CBC results from May 18 are now available.', time: '4 days ago', read: true },
];

const iconMap = { appointment: Calendar, medication: Pill, billing: CreditCard, info: Info };
const colorMap = { appointment: 'bg-blue-100 text-blue-600', medication: 'bg-emerald-100 text-emerald-600', billing: 'bg-amber-100 text-amber-600', info: 'bg-indigo-100 text-indigo-600' };

const PatientNotifications = () => {
  const [notifs, setNotifs] = useState(initial);
  const unread = notifs.filter(n => !n.read).length;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 font-['Outfit']">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight flex items-center gap-3">
            Notifications {unread > 0 && <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{unread}</span>}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated on appointments, medications, and billing.</p>
        </div>
        {unread > 0 && (
          <button onClick={() => setNotifs(notifs.map(n => ({ ...n, read: true })))}
            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
            <CheckSquare size={16} /> Mark all read
          </button>
        )}
      </div>
      <div className="cd-card divide-y divide-slate-100 overflow-hidden">
        <AnimatePresence>
          {notifs.map(n => {
            const Icon = iconMap[n.type];
            return (
              <motion.div key={n.id} layout exit={{ opacity: 0, height: 0 }}
                className={cn("p-5 flex gap-4 relative group transition-colors", n.read ? "bg-white/40" : "bg-blue-50/30")}>
                {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
                <div className={cn("w-11 h-11 rounded-full flex items-center justify-center shrink-0", colorMap[n.type])}><Icon size={20} /></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn("font-bold text-sm", n.read ? "text-slate-700" : "text-[#0a1a0f]")}>{n.title}</h3>
                    <span className="text-xs text-slate-400 font-semibold">{n.time}</span>
                  </div>
                  <p className={cn("text-sm", n.read ? "text-slate-500" : "text-slate-700")}>{n.message}</p>
                </div>
                <button onClick={() => setNotifs(notifs.filter(x => x.id !== n.id))}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-all self-center"><Trash2 size={16} /></button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {notifs.length === 0 && <div className="py-16 text-center text-slate-400"><Bell size={40} className="mx-auto mb-3 opacity-30" /><p>All caught up!</p></div>}
      </div>
    </motion.div>
  );
};
export default PatientNotifications;
