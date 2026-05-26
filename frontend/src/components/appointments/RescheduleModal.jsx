import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';
import { appointmentService } from '../../services/appointment.service';

const AVAILABLE_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

const RescheduleModal = ({ isOpen, onClose, appointment, onReschedule }) => {
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (isOpen) {
      setSelectedDate(appointment?.date || '');
      setSelectedTime(appointment?.time || '');
      setIsSuccess(false);
      setErrors({});
    }
  }, [isOpen, appointment]);

  const handleSubmit = async () => {
    const newErrors = {};
    if (!selectedDate) newErrors.date = 'Please select a new date';
    if (!selectedTime) newErrors.time = 'Please select a time slot';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setIsLoading(true);
    try {
      const result = await appointmentService.reschedule(appointment.id, {
        date: selectedDate,
        time: selectedTime,
      });
      if (result.success) {
        setIsSuccess(true);
        onReschedule && onReschedule({ ...appointment, date: selectedDate, time: selectedTime });
        setTimeout(() => onClose(), 2000);
      }
    } catch {
      setErrors({ form: 'Rescheduling failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl shadow-slate-300/30 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100/60 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Reschedule Appointment</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {appointment?.patient} &middot; {appointment?.type}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 size={28} className="text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Rescheduled!</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      New date: {selectedDate} at {selectedTime}
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Current schedule info */}
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm">
                      <p className="text-amber-800 font-semibold">Current Schedule</p>
                      <p className="text-amber-700 mt-1">
                        {appointment?.date} at {appointment?.time} &mdash; {appointment?.doctor}
                      </p>
                    </div>

                    {/* New Date */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <Calendar size={14} /> New Date
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedTime('');
                          setErrors({});
                        }}
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white/50 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      {errors.date && (
                        <p className="text-sm text-rose-500 mt-1">{errors.date}</p>
                      )}
                    </div>

                    {/* Time Slots */}
                    {selectedDate && (
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                          <Clock size={14} /> New Time Slot
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {AVAILABLE_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => { setSelectedTime(slot); setErrors({}); }}
                              className={cn(
                                'py-2 text-sm rounded-xl border font-medium transition-all',
                                selectedTime === slot
                                  ? 'border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/30'
                                  : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/40'
                              )}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                        {errors.time && (
                          <p className="text-sm text-rose-500 mt-2">{errors.time}</p>
                        )}
                      </div>
                    )}

                    {errors.form && (
                      <p className="text-sm text-rose-500">{errors.form}</p>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {!isSuccess && (
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100/60 bg-slate-50/40">
                  <Button variant="ghost" onClick={onClose} className="text-slate-500">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-amber-500 text-white hover:bg-amber-600 px-5"
                  >
                    {isLoading
                      ? <><Loader2 size={16} className="animate-spin mr-2" />Saving...</>
                      : 'Confirm Reschedule'
                    }
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RescheduleModal;
