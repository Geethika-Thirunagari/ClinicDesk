import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarPlus, LayoutList, CalendarDays } from 'lucide-react';
import { Button } from '../components/common/Button';
import { cn } from '../utils/cn';
import { MOCK_APPOINTMENTS, STATUS_CONFIG } from '../data/appointmentMocks';
import AppointmentList from '../components/appointments/AppointmentList';
import CalendarView from '../components/appointments/CalendarView';
import BookingModal from '../components/appointments/BookingModal';
import RescheduleModal from '../components/appointments/RescheduleModal';
import CancelModal from '../components/appointments/CancelModal';

const STATS = [
  { label: 'Total',     key: null,        color: 'from-blue-500 to-indigo-500',   bg: 'bg-blue-50'    },
  { label: 'Upcoming',  key: 'upcoming',   color: 'from-sky-400 to-blue-500',     bg: 'bg-sky-50'     },
  { label: 'Completed', key: 'completed',  color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50' },
  { label: 'Cancelled', key: 'cancelled',  color: 'from-rose-400 to-rose-500',    bg: 'bg-rose-50'    },
];

const Appointments = () => {
  const [view, setView] = useState('list'); // 'list' | 'calendar'
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [calendarDayDetail, setCalendarDayDetail] = useState(null); // { date, apts }

  const stats = useMemo(() => STATS.map((s) => ({
    ...s,
    count: s.key ? appointments.filter((a) => a.status === s.key).length : appointments.length,
  })), [appointments]);

  const handleBook = (newApt) => {
    setAppointments((prev) => [{ ...newApt, id: String(Date.now()) }, ...prev]);
  };

  const handleReschedule = (updated) => {
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)));
  };

  const handleCancel = (id) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-slate-800">Appointment Management</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-sm text-slate-500 mt-1">Schedule, track, and manage all patient appointments.</motion.p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-2 flex-shrink-0">
          {/* View Toggle */}
          <div className="flex bg-white/60 border border-slate-200 rounded-xl p-1 shadow-sm backdrop-blur-sm">
            <button onClick={() => setView('list')}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                view === 'list' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
              <LayoutList size={15} /> List
            </button>
            <button onClick={() => setView('calendar')}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                view === 'calendar' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
              <CalendarDays size={15} /> Calendar
            </button>
          </div>
          <Button
            onClick={() => setIsBookingOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 rounded-xl px-4 py-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
          >
            <CalendarPlus size={16} /> New Appointment
          </Button>
        </motion.div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
            <p className={cn('text-3xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-br', s.color)}>{s.count}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      {view === 'list' ? (
        <AppointmentList
          appointments={appointments}
          onReschedule={setRescheduleTarget}
          onCancel={setCancelTarget}
          onBook={() => setIsBookingOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarView appointments={appointments} onDayClick={(date, apts) => setCalendarDayDetail({ date, apts })} />
          </div>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-5 h-full"
            >
              <h4 className="font-semibold text-slate-800 mb-4">
                {calendarDayDetail ? `Appointments on ${calendarDayDetail.date}` : 'Select a day to view appointments'}
              </h4>
              {calendarDayDetail?.apts?.length > 0 ? (
                <div className="space-y-3">
                  {calendarDayDetail.apts.map((a) => {
                    const cfg = STATUS_CONFIG[a.status];
                    return (
                      <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                        <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', cfg?.dot)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{a.patient}</p>
                          <p className="text-xs text-slate-500">{a.time} · {a.doctor}</p>
                          <span className={cn('inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full', cfg?.color)}>{cfg?.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : calendarDayDetail ? (
                <p className="text-sm text-slate-400">No appointments on this day.</p>
              ) : (
                <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-sm text-slate-400 text-center">Click a day on the calendar<br />to see appointments</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* Modals */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} onBook={handleBook} />
      <RescheduleModal isOpen={!!rescheduleTarget} appointment={rescheduleTarget} onClose={() => setRescheduleTarget(null)} onReschedule={handleReschedule} />
      <CancelModal isOpen={!!cancelTarget} appointment={cancelTarget} onClose={() => setCancelTarget(null)} onCancel={handleCancel} />
    </div>
  );
};

export default Appointments;
