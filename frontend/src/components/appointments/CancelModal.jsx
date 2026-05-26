import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';
import { appointmentService } from '../../services/appointment.service';

const CancelModal = ({ isOpen, onClose, appointment, onCancel }) => {
  const [reason, setReason] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (isOpen) { setReason(''); setIsSuccess(false); setError(''); }
  }, [isOpen]);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const result = await appointmentService.cancel(appointment.id, reason);
      if (result.success) {
        setIsSuccess(true);
        onCancel && onCancel(appointment.id);
        setTimeout(() => onClose(), 2000);
      }
    } catch {
      setError('Cancellation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100/60 bg-rose-50/40">
                <h2 className="text-xl font-bold text-slate-800">Cancel Appointment</h2>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-5">
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 size={28} className="text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Appointment Cancelled</h3>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-4">
                      <AlertTriangle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-rose-800">Are you sure?</p>
                        <p className="text-rose-700 mt-1">
                          This will cancel the appointment for <strong>{appointment?.patient}</strong> with <strong>{appointment?.doctor}</strong> on {appointment?.date} at {appointment?.time}.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Reason (optional)</label>
                      <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
                        placeholder="Enter reason for cancellation..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm text-slate-700 resize-none outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 transition-all placeholder:text-slate-400" />
                    </div>
                    {error && <p className="text-sm text-rose-500">{error}</p>}
                  </>
                )}
              </div>
              {!isSuccess && (
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100/60 bg-slate-50/40">
                  <Button variant="ghost" onClick={onClose} className="text-slate-500">Keep Appointment</Button>
                  <Button onClick={handleCancel} disabled={isLoading} className="bg-rose-500 text-white hover:bg-rose-600 px-5">
                    {isLoading ? <><Loader2 size={16} className="animate-spin mr-2" />Cancelling...</> : 'Yes, Cancel'}
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

export default CancelModal;
