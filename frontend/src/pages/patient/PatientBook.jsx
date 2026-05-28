import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search, Video, User, MapPin, Star, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const departments = ['All', 'Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Neurology', 'General'];

const doctors = [
  { id: 1, name: 'Dr. Sarah Smith', specialty: 'Cardiology', rating: 4.9, reviews: 142, available: ['May 21', 'May 23', 'May 26'], modes: ['In-Person', 'Video'], fee: '$75' },
  { id: 2, name: 'Dr. John Doe', specialty: 'Neurology', rating: 4.7, reviews: 98, available: ['May 22', 'May 24'], modes: ['In-Person'], fee: '$90' },
  { id: 3, name: 'Dr. Emily Chen', specialty: 'Dermatology', rating: 4.8, reviews: 115, available: ['May 21', 'May 25'], modes: ['In-Person', 'Video'], fee: '$65' },
  { id: 4, name: 'Dr. Michael Park', specialty: 'Orthopedics', rating: 4.6, reviews: 87, available: ['May 22', 'May 23', 'May 27'], modes: ['In-Person'], fee: '$85' },
];

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'];

const PatientBook = () => {
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Slot, 3: Confirm
  const [selectedDept, setSelectedDept] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMode, setSelectedMode] = useState('In-Person');

  const filteredDoctors = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchDept = selectedDept === 'All' || d.specialty === selectedDept;
    return matchSearch && matchDept;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">Book Appointment</h1>
        <p className="text-sm text-slate-500 mt-1">Find a doctor and schedule your visit.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 finai-card p-4">
        {['Select Doctor', 'Choose Slot', 'Confirm'].map((label, i) => (
          <React.Fragment key={label}>
            <div className={cn("flex items-center gap-2", step > i + 1 ? "text-emerald-600" : step === i + 1 ? "text-blue-600" : "text-slate-400")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2",
                step > i + 1 ? "bg-emerald-500 border-emerald-500 text-white" : step === i + 1 ? "border-blue-500 text-blue-600 " : "border-slate-300 ")}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-sm font-semibold hidden sm:block">{label}</span>
            </div>
            {i < 2 && <div className={cn("flex-1 h-0.5 rounded-full", step > i + 1 ? "bg-emerald-500" : "bg-slate-200 ")} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Select Doctor */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="finai-card p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search doctor by name..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 " />
            </div>
            <div className="flex flex-wrap gap-2">
              {departments.map(dept => (
                <button key={dept} onClick={() => setSelectedDept(dept)}
                  className={cn("px-3 py-1.5 rounded-full text-xs font-bold border transition-all",
                    selectedDept === dept ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}>
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map((doc, i) => (
              <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="finai-card p-5 hover:shadow-md transition-all">
                <div className="flex gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-xl text-blue-600 shrink-0">
                    {doc.name.charAt(4)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#0a1a0f] ">{doc.name}</h3>
                    <p className="text-xs text-slate-500">{doc.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-700 ">{doc.rating}</span>
                      <span className="text-xs text-slate-400">({doc.reviews})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-[#0a1a0f] ">{doc.fee}</p>
                    <p className="text-[10px] text-slate-400 uppercase">per visit</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {doc.modes.map(m => (
                    <span key={m} className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-600 flex items-center gap-1">
                      {m === 'Video' ? <Video size={10} /> : <User size={10} />} {m}
                    </span>
                  ))}
                </div>
                <button onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                  Select & Book <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 2: Choose Slot */}
      {step === 2 && selectedDoctor && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="finai-card p-6">
            <button onClick={() => setStep(1)} className="text-sm font-semibold text-blue-600 mb-4">← Back to Doctors</button>
            <h2 className="text-lg font-bold text-[#0a1a0f] mb-1">Booking with {selectedDoctor.name}</h2>
            <p className="text-sm text-slate-500 mb-6">{selectedDoctor.specialty} • {selectedDoctor.fee}/visit</p>

            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Mode</label>
              <div className="flex gap-3">
                {selectedDoctor.modes.map(m => (
                  <button key={m} onClick={() => setSelectedMode(m)}
                    className={cn("px-5 py-2.5 rounded-xl text-sm font-bold border transition-all flex items-center gap-2",
                      selectedMode === m ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 text-slate-600 ")}>
                    {m === 'Video' ? <Video size={16} /> : <MapPin size={16} />} {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Select Date</label>
              <div className="flex flex-wrap gap-3">
                {selectedDoctor.available.map(date => (
                  <button key={date} onClick={() => setSelectedDate(date)}
                    className={cn("px-5 py-3 rounded-xl text-sm font-bold border transition-all",
                      selectedDate === date ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50")}>
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Select Time</label>
                <div className="grid grid-cols-4 gap-3">
                  {timeSlots.map(time => (
                    <button key={time} onClick={() => setSelectedTime(time)}
                      className={cn("py-2.5 rounded-xl text-sm font-bold border transition-all",
                        selectedTime === time ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50")}>
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && (
              <button onClick={() => setStep(3)}
                className="w-full mt-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2">
                Confirm Booking <ChevronRight size={18} />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && selectedDoctor && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center py-12">
          <div className="bg-white border-[#e2e8e2] shadow-lg rounded-[24px] p-10 text-center max-w-md">
            <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Calendar size={36} className="text-emerald-600 " />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0a1a0f] mb-2">Booking Confirmed! 🎉</h2>
            <p className="text-slate-500 mb-6">Your appointment has been scheduled.</p>
            <div className="bg-slate-50 rounded-xl p-5 text-left space-y-3 mb-8">
              <div className="flex justify-between"><span className="text-sm text-slate-500">Doctor</span><span className="text-sm font-bold text-[#0a1a0f] ">{selectedDoctor.name}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Date</span><span className="text-sm font-bold text-[#0a1a0f] ">{selectedDate}, 2026</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Time</span><span className="text-sm font-bold text-[#0a1a0f] ">{selectedTime}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Mode</span><span className="text-sm font-bold text-[#0a1a0f] ">{selectedMode}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Fee</span><span className="text-sm font-bold text-[#0a1a0f] ">{selectedDoctor.fee}</span></div>
            </div>
            <button onClick={() => { setStep(1); setSelectedDoctor(null); setSelectedDate(null); setSelectedTime(null); }}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
              Book Another
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PatientBook;
