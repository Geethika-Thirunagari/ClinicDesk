import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

const prescriptions = [
  { id: 'RX-9821', doctor: 'Dr. Sarah Smith', date: '2026-05-20', status: 'Active', medications: [
    { name: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily (morning)', duration: 'Ongoing', instructions: 'Take on empty stomach' },
    { name: 'Aspirin 81mg', dosage: '1 tablet', frequency: 'Once daily', duration: 'Ongoing', instructions: 'Take with food' },
  ]},
  { id: 'RX-9820', doctor: 'Dr. Emily Chen', date: '2026-04-28', status: 'Completed', medications: [
    { name: 'Hydrocortisone Cream 1%', dosage: 'Thin layer', frequency: 'Twice daily', duration: '14 days', instructions: 'Apply to affected area only' },
  ]},
  { id: 'RX-9815', doctor: 'Dr. Sarah Smith', date: '2026-04-10', status: 'Active', medications: [
    { name: 'Metformin 500mg', dosage: '1 tablet', frequency: 'Twice daily', duration: 'Ongoing', instructions: 'Take with meals' },
  ]},
];

const PatientPrescriptions = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">My Prescriptions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View all your prescribed medications and dosage instructions.</p>
      </div>

      <div className="space-y-6">
        {prescriptions.map((rx, i) => (
          <motion.div key={rx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", rx.status === 'Active' ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-slate-100 dark:bg-slate-800")}>
                  <Pill size={20} className={rx.status === 'Active' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">{rx.doctor}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> {rx.date} • <span className="font-mono">{rx.id}</span></p>
                </div>
              </div>
              <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider",
                rx.status === 'Active' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              )}>{rx.status}</span>
            </div>
            {/* Medications */}
            <div className="p-5 space-y-4">
              {rx.medications.map((med, j) => (
                <div key={j} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">{med.name}</h4>
                    {med.duration === 'Ongoing' && (
                      <button className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700">
                        <RefreshCw size={12} /> Request Refill
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div><span className="text-slate-400 block mb-0.5">Dosage</span><span className="font-semibold text-slate-700 dark:text-slate-300">{med.dosage}</span></div>
                    <div><span className="text-slate-400 block mb-0.5">Frequency</span><span className="font-semibold text-slate-700 dark:text-slate-300">{med.frequency}</span></div>
                    <div><span className="text-slate-400 block mb-0.5">Duration</span><span className="font-semibold text-slate-700 dark:text-slate-300">{med.duration}</span></div>
                    <div><span className="text-slate-400 block mb-0.5">Instructions</span><span className="font-semibold text-slate-700 dark:text-slate-300">{med.instructions}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PatientPrescriptions;
