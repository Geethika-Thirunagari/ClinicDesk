import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const mockAppointments = [
  { id: '1', patient: 'Michael Roberts', type: 'General Checkup', date: 'Oct 24, 2026', time: '09:00 AM', status: 'upcoming' },
  { id: '2', patient: 'Sarah Connor', type: 'Cardiology', date: 'Oct 24, 2026', time: '10:30 AM', status: 'completed' },
  { id: '3', patient: 'James Smith', type: 'Dental', date: 'Oct 24, 2026', time: '11:45 AM', status: 'cancelled' },
  { id: '4', patient: 'Emily Davis', type: 'Neurology', date: 'Oct 24, 2026', time: '02:15 PM', status: 'upcoming' },
  { id: '5', patient: 'William Brown', type: 'Orthopedics', date: 'Oct 25, 2026', time: '09:30 AM', status: 'upcoming' },
];

const statusConfig = {
  upcoming: { color: 'text-blue-700 bg-blue-100/80', icon: Clock },
  completed: { color: 'text-emerald-700 bg-emerald-100/80', icon: CheckCircle },
  cancelled: { color: 'text-rose-700 bg-rose-100/80', icon: XCircle },
};

const AppointmentTable = ({ delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
      className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-white/40 flex items-center justify-between bg-white/30">
        <h3 className="font-semibold text-slate-800 text-lg">Upcoming Appointments</h3>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {mockAppointments.map((apt, index) => {
              const StatusIcon = statusConfig[apt.status].icon;
              return (
                <motion.tr 
                  key={apt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + (index * 0.1) }}
                  className="hover:bg-white/40 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{apt.patient}</div>
                    <div className="text-xs text-slate-400">ID: #{apt.id.padStart(5, '0')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {apt.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-800">{apt.date}</div>
                    <div className="text-xs text-slate-500">{apt.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-white/40",
                      statusConfig[apt.status].color
                    )}>
                      <StatusIcon size={12} className="mr-1.5" />
                      <span className="capitalize">{apt.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-white/50">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AppointmentTable;
