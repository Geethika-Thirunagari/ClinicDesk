import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'appointment', text: 'New appointment booked by Sarah Connor', time: '5m ago', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 2, type: 'alert', text: 'Lab results ready for John Doe', time: '1h ago', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 3, type: 'success', text: 'Daily backup completed successfully', time: '2h ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

const NotificationPanel = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100/50 bg-white/50">
              <h3 className="font-semibold text-slate-800">Notifications</h3>
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">3 New</span>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {MOCK_NOTIFICATIONS.map((item) => (
                <div key={item.id} className="group flex gap-4 p-4 border-b border-slate-50 hover:bg-white/60 transition-colors cursor-pointer">
                  <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
                    <item.icon size={18} className={item.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{item.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-slate-50/50 border-t border-slate-100/50 text-center">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
