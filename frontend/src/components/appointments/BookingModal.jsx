import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Stethoscope, Calendar, Clock, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';
import {
  MOCK_DOCTORS,
  MOCK_PATIENTS,
  APPOINTMENT_TYPES,
} from '../../data/appointmentMocks';
import { appointmentService } from '../../services/appointment.service';

const AVAILABLE_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

const BookingModal = ({ isOpen, onClose, onBook, prefillData = null }) => {
  const [step, setStep] = React.useState(1); // 1: patient, 2: doctor+time, 3: confirm
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [patientSearch, setPatientSearch] = React.useState('');
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const [selectedDoctor, setSelectedDoctor] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [selectedType, setSelectedType] = React.useState(APPOINTMENT_TYPES[0]);
  const [notes, setNotes] = React.useState('');
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (isOpen) {
      setStep(1); setIsSuccess(false); setIsLoading(false);
      setPatientSearch(''); setErrors({});
      if (prefillData) {
        setSelectedPatient(prefillData.patient || null);
        setSelectedDoctor(prefillData.doctor || null);
        setSelectedDate(prefillData.date || '');
        setSelectedTime(prefillData.time || '');
        setSelectedType(prefillData.type || APPOINTMENT_TYPES[0]);
        setNotes(prefillData.notes || '');
      } else {
        setSelectedPatient(null); setSelectedDoctor(null);
        setSelectedDate(''); setSelectedTime('');
        setSelectedType(APPOINTMENT_TYPES[0]); setNotes('');
      }
    }
  }, [isOpen, prefillData]);

  const filteredPatients = MOCK_PATIENTS.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !selectedPatient) newErrors.patient = 'Please select a patient';
    if (step === 2) {
      if (!selectedDoctor) newErrors.doctor = 'Please select a doctor';
      if (!selectedDate) newErrors.date = 'Please select a date';
      if (!selectedTime) newErrors.time = 'Please select a time slot';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep()) setStep((s) => s + 1); };
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        patientId: selectedPatient.id,
        patient: selectedPatient.name,
        doctorId: selectedDoctor.id,
        doctor: selectedDoctor.name,
        date: selectedDate,
        time: selectedTime,
        type: selectedType,
        notes,
        status: 'upcoming',
      };
      const result = await appointmentService.book(payload);
      if (result.success) {
        setIsSuccess(true);
        onBook && onBook(result.data);
        setTimeout(() => { onClose(); }, 2000);
      }
    } catch {
      setErrors({ form: 'Booking failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-xl bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl shadow-slate-300/30 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100/60 bg-gradient-to-r from-blue-600/5 to-indigo-600/5">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Book Appointment</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Step {step} of 3</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Step Progress */}
              <div className="flex gap-1 px-6 pt-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={cn('h-1.5 flex-1 rounded-full transition-all duration-500', s <= step ? 'bg-blue-500' : 'bg-slate-200')} />
                ))}
              </div>

              <div className="p-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Appointment Booked!</h3>
                    <p className="text-slate-500 mt-2">The appointment has been successfully scheduled.</p>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="wait">
                    {/* --- STEP 1: Patient --- */}
                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><User size={16} /> Select Patient</h3>
                          <Input placeholder="Search patients..." value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} className="mb-3" />
                          <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar">
                            {filteredPatients.map((p) => (
                              <button key={p.id} onClick={() => { setSelectedPatient(p); setErrors({}); }}
                                className={cn('w-full text-left p-3 rounded-xl border transition-all',
                                  selectedPatient?.id === p.id
                                    ? 'border-blue-400 bg-blue-50 shadow-sm'
                                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                                )}>
                                <p className="font-medium text-slate-800 text-sm">{p.name}</p>
                                <p className="text-xs text-slate-400">{p.phone} · Age {p.age}</p>
                              </button>
                            ))}
                          </div>
                          {errors.patient && <p className="text-sm text-rose-500 mt-2">{errors.patient}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Appointment Type</label>
                          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white/50 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all">
                            {APPOINTMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                      </motion.div>
                    )}

                    {/* --- STEP 2: Doctor & Time --- */}
                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                        <div>
                          <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><Stethoscope size={16} /> Select Doctor</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {MOCK_DOCTORS.map((doc) => (
                              <button key={doc.id} onClick={() => { setSelectedDoctor(doc); setErrors({}); }}
                                className={cn('flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                                  selectedDoctor?.id === doc.id
                                    ? 'border-blue-400 bg-blue-50 shadow-sm'
                                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                                )}>
                                <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-white shadow-sm" />
                                <div>
                                  <p className="font-medium text-slate-800 text-sm">{doc.name}</p>
                                  <p className="text-xs text-slate-400">{doc.specialty}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                          {errors.doctor && <p className="text-sm text-rose-500 mt-2">{errors.doctor}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><Calendar size={14} /> Date</label>
                          <input type="date" min={today} value={selectedDate}
                            onChange={(e) => { setSelectedDate(e.target.value); setErrors({}); }}
                            className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white/50 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                          {errors.date && <p className="text-sm text-rose-500 mt-1">{errors.date}</p>}
                        </div>

                        {selectedDate && (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><Clock size={14} /> Available Slots</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                              {AVAILABLE_SLOTS.map((slot) => (
                                <button key={slot} onClick={() => { setSelectedTime(slot); setErrors({}); }}
                                  className={cn('py-2 text-sm rounded-xl border font-medium transition-all',
                                    selectedTime === slot
                                      ? 'border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/30'
                                      : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/30'
                                  )}>
                                  {slot}
                                </button>
                              ))}
                            </div>
                            {errors.time && <p className="text-sm text-rose-500 mt-2">{errors.time}</p>}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* --- STEP 3: Review --- */}
                    {step === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2"><FileText size={16} /> Review & Confirm</h3>
                        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-100 rounded-2xl p-5 space-y-3 text-sm">
                          <Row label="Patient" value={selectedPatient?.name} />
                          <Row label="Doctor" value={selectedDoctor?.name} />
                          <Row label="Specialty" value={selectedDoctor?.specialty} />
                          <Row label="Type" value={selectedType} />
                          <Row label="Date" value={selectedDate} />
                          <Row label="Time" value={selectedTime} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Notes (optional)</label>
                          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Add any additional notes..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm text-slate-700 resize-none outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400" />
                        </div>
                        {errors.form && <p className="text-sm text-rose-500">{errors.form}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {!isSuccess && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100/60 bg-slate-50/40">
                  <Button variant="ghost" onClick={step === 1 ? onClose : handleBack} className="text-slate-500">
                    {step === 1 ? 'Cancel' : '← Back'}
                  </Button>
                  {step < 3 ? (
                    <Button onClick={handleNext}>Continue →</Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700 px-6">
                      {isLoading ? <><Loader2 size={16} className="animate-spin mr-2" />Booking...</> : 'Confirm Booking'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-slate-500">{label}</span>
    <span className="font-semibold text-slate-800">{value}</span>
  </div>
);

export default BookingModal;
