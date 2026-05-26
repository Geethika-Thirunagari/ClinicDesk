import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Plus, Search, FileSignature, Save, Printer, History } from 'lucide-react';
import { cn } from '../../utils/cn';

const recentPrescriptions = [
  { id: 'RX-9821', patient: 'Alice Johnson', date: '2026-05-20', medications: 3 },
  { id: 'RX-9820', patient: 'Robert Williams', date: '2026-05-19', medications: 1 },
];

const DoctorPrescriptions = () => {
  const [medications, setMedications] = useState([
    { id: 1, drug: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);

  const addMedication = () => {
    setMedications([...medications, { id: Date.now(), drug: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedication = (id) => {
    if (medications.length > 1) {
      setMedications(medications.filter(m => m.id !== id));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">e-Prescription</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Write and issue digital prescriptions.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 dark:hover:bg-slate-600 transition-all">
            <History size={16} /> View History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* E-Prescription Pad (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6 relative">
          {/* Pad Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <FileSignature className="text-blue-600" /> Rx Pad
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-1">Dr. Sarah Smith, MD • Cardiology</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">RX-ID: AUTO-GEN</p>
            </div>
          </div>

          {/* Patient Selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Patient</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search patient name or ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white" />
            </div>
          </div>

          {/* Medications Form */}
          <div className="space-y-4 mb-6">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Medications</label>
            {medications.map((med, index) => (
              <div key={med.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl relative group">
                <div className="absolute -left-2 -top-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                  {index + 1}
                </div>
                {medications.length > 1 && (
                  <button onClick={() => removeMedication(med.id)} className="absolute top-3 right-3 text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold">Remove</span>
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Drug Name</label>
                    <input type="text" placeholder="e.g. Amoxicillin" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-white" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dosage</label>
                      <input type="text" placeholder="e.g. 500mg" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Freq.</label>
                      <input type="text" placeholder="e.g. 1x / day" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</label>
                      <input type="text" placeholder="e.g. 7 days" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-white" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Instructions (Optional)</label>
                    <input type="text" placeholder="e.g. Take after meals" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={addMedication} className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors mb-8">
            <Plus size={16} /> Add Another Medication
          </button>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
              <FileSignature size={18} /> Issue Prescription
            </button>
            <button className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              <Printer size={18} />
            </button>
            <button className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              <Save size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Pill size={16} className="text-blue-500" />
              Drug Templates
            </h2>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all">
                <p className="font-bold text-sm text-slate-700 dark:text-slate-200">Standard Antibiotic Regimen</p>
                <p className="text-xs text-slate-500 mt-1">Amoxicillin 500mg • 3x/day • 7 days</p>
              </button>
              <button className="w-full text-left p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all">
                <p className="font-bold text-sm text-slate-700 dark:text-slate-200">Pain Management (Mild)</p>
                <p className="text-xs text-slate-500 mt-1">Ibuprofen 400mg • PRN • 5 days</p>
              </button>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <History size={16} className="text-indigo-500" />
              Recent Issues
            </h2>
            <div className="space-y-3">
              {recentPrescriptions.map(rx => (
                <div key={rx.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div>
                    <p className="font-bold text-sm text-slate-700 dark:text-slate-200">{rx.patient}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{rx.id} • {rx.date}</p>
                  </div>
                  <span className="text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 px-2 py-1 rounded-md">{rx.medications} Meds</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorPrescriptions;
