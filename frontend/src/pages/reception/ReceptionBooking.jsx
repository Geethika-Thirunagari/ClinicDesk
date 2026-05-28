import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Plus, Star, Video, User, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

const doctors = [
  { id: 1, name: 'Dr. Sarah Smith', dept: 'Cardiology', slots: ['09:00', '10:00', '11:00', '14:00'] },
  { id: 2, name: 'Dr. John Doe', dept: 'Neurology', slots: ['09:30', '10:30', '15:00'] },
  { id: 3, name: 'Dr. Emily Chen', dept: 'Dermatology', slots: ['09:00', '11:30', '14:30'] },
];

const ReceptionBooking = () => {
  const [patient, setPatient] = useState('');
  const [selDoc, setSelDoc] = useState(null);
  const [selSlot, setSelSlot] = useState(null);
  const [booked, setBooked] = useState(false);

  const handleBook = () => { if (patient && selDoc && selSlot) setBooked(true); };

  if (booked) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center p-8 min-h-screen">
        <div className="bg-white border-[#e2e8e2] shadow-lg rounded-[24px] p-10 text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6"><Calendar size={36} className="text-emerald-600" /></div>
          <h2 className="text-2xl font-extrabold text-[#0a1a0f] mb-2">Appointment Booked! 🎉</h2>
          <p className="text-slate-500 mb-6">Patient: <strong>{patient}</strong> • {selDoc.name} at {selSlot}</p>
          <button onClick={() => { setBooked(false); setPatient(''); setSelDoc(null); setSelSlot(null); }}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">Book Another</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">Book Appointment</h1>
        <p className="text-sm text-slate-500 mt-1">Schedule a patient visit with an available doctor.</p>
      </div>

      <div className="finai-card p-6 space-y-6">
        {/* Patient Search */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Patient Name or ID</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search patient..." value={patient} onChange={e => setPatient(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 " />
          </div>
        </div>

        {/* Doctor Selection */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Select Doctor</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doctors.map(doc => (
              <button key={doc.id} onClick={() => { setSelDoc(doc); setSelSlot(null); }}
                className={cn("p-4 rounded-xl border text-left transition-all",
                  selDoc?.id === doc.id ? "bg-blue-50 border-blue-300 shadow-sm" : "bg-white border-slate-200 hover:bg-slate-50")}>
                <h4 className="font-bold text-sm text-[#0a1a0f] ">{doc.name}</h4>
                <p className="text-xs text-slate-500">{doc.dept}</p>
                <p className="text-xs text-emerald-600 font-semibold mt-2">{doc.slots.length} slots available</p>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        {selDoc && (
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Available Slots — {selDoc.name}</label>
            <div className="flex flex-wrap gap-3">
              {selDoc.slots.map(slot => (
                <button key={slot} onClick={() => setSelSlot(slot)}
                  className={cn("px-5 py-2.5 rounded-xl text-sm font-bold border transition-all",
                    selSlot === slot ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white border-slate-200 text-slate-700 ")}>
                  <Clock size={14} className="inline mr-1.5" />{slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {patient && selDoc && selSlot && (
          <button onClick={handleBook}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all">
            Confirm Booking
          </button>
        )}
      </div>
    </motion.div>
  );
};
export default ReceptionBooking;
