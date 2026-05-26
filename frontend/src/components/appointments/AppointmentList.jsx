import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreHorizontal, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { cn } from '../../utils/cn';
import { STATUS_CONFIG } from '../../data/appointmentMocks';

const AppointmentList = ({ appointments, onReschedule, onCancel, onBook }) => {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [activeMenu, setActiveMenu] = React.useState(null);

  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.patient.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-white/40 bg-white/30 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <h3 className="font-semibold text-slate-800 text-lg shrink-0">Appointments</h3>
        <div className="flex flex-col sm:flex-row gap-2 flex-1 sm:justify-end">
          {/* Search */}
          <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, doctor..."
              className="pl-9 pr-4 h-9 w-full sm:w-60 rounded-xl border border-slate-200 bg-white/60 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
            />
          </div>
          {/* Status Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-8 pr-4 h-9 rounded-xl border border-slate-200 bg-white/60 text-sm text-slate-700 outline-none focus:border-blue-400 transition-all appearance-none"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              {['Patient', 'Doctor', 'Type', 'Date & Time', 'Status', ''].map((h) => (
                <th key={h} className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">No appointments found.</td></tr>
            ) : filtered.map((apt, i) => {
              const cfg = STATUS_CONFIG[apt.status];
              return (
                <motion.tr
                  key={apt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/40 transition-colors relative"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0">
                        <User size={14} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{apt.patient}</p>
                        <p className="text-xs text-slate-400">ID #{String(apt.patientId).padStart(5, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{apt.doctor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{apt.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm text-slate-700">
                      <Calendar size={13} className="text-slate-400" />{apt.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Clock size={12} />{apt.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', cfg?.color)}>
                      <div className={cn('w-1.5 h-1.5 rounded-full', cfg?.dot)} />
                      {cfg?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setActiveMenu(activeMenu === apt.id ? null : apt.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {activeMenu === apt.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-0 top-8 z-20 w-44 bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl shadow-lg overflow-hidden"
                          >
                            {apt.status === 'upcoming' || apt.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => { setActiveMenu(null); onReschedule(apt); }}
                                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                  <Calendar size={14} /> Reschedule
                                </button>
                                <button
                                  onClick={() => { setActiveMenu(null); onCancel(apt); }}
                                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  ✕ Cancel
                                </button>
                              </>
                            ) : (
                              <div className="px-4 py-2.5 text-sm text-slate-400">No actions available</div>
                            )}
                          </motion.div>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Card layout — mobile */}
      <div className="md:hidden divide-y divide-white/40">
        {filtered.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">No appointments found.</p>
        ) : filtered.map((apt) => {
          const cfg = STATUS_CONFIG[apt.status];
          return (
            <div key={apt.id} className="p-4 hover:bg-white/40 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{apt.patient}</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Stethoscope size={11} /> {apt.doctor}</p>
                </div>
                <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium shrink-0', cfg?.color)}>
                  <div className={cn('w-1.5 h-1.5 rounded-full', cfg?.dot)} />{cfg?.label}
                </span>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={11} />{apt.date}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{apt.time}</span>
              </div>
              {(apt.status === 'upcoming' || apt.status === 'pending') && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => onReschedule(apt)} className="flex-1 text-xs font-medium py-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 transition-colors">
                    Reschedule
                  </button>
                  <button onClick={() => onCancel(apt)} className="flex-1 text-xs font-medium py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-colors">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AppointmentList;
