import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Clock, Download, Eye, Activity, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const history = [
  { id: 'VIS-001', date: '2026-05-15', doctor: 'Dr. Sarah Smith', type: 'Consultation', department: 'Cardiology', diagnosis: 'Mild Hypertension', followUp: 'May 25, 2026' },
  { id: 'VIS-002', date: '2026-04-28', doctor: 'Dr. Emily Chen', type: 'Follow-up', department: 'Dermatology', diagnosis: 'Contact Dermatitis - Resolved', followUp: 'None' },
  { id: 'VIS-003', date: '2026-04-10', doctor: 'Dr. Sarah Smith', type: 'Lab Review', department: 'Cardiology', diagnosis: 'Lipid Panel - Elevated LDL', followUp: 'May 15, 2026' },
  { id: 'VIS-004', date: '2026-03-15', doctor: 'Dr. Michael Park', type: 'Emergency', department: 'Orthopedics', diagnosis: 'Ankle Sprain (Grade I)', followUp: 'None' },
];

const PatientHistory = () => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = history.filter(h =>
    h.doctor.toLowerCase().includes(search.toLowerCase()) ||
    h.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
    h.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Medical History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review your past visits, diagnoses, and treatment records.</p>
      </div>

      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search by doctor, diagnosis, or department..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((visit, i) => (
          <motion.div key={visit.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all">
            <button onClick={() => setExpandedId(expandedId === visit.id ? null : visit.id)} className="w-full p-5 flex items-center justify-between text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                  <Activity size={22} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">{visit.type} — {visit.department}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{visit.doctor} • {visit.date}</p>
                </div>
              </div>
              <ChevronDown size={20} className={cn("text-slate-400 transition-transform", expandedId === visit.id && "rotate-180")} />
            </button>
            {expandedId === visit.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</p><p className="text-sm font-semibold text-slate-800 dark:text-white">{visit.diagnosis}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Follow-up</p><p className="text-sm font-semibold text-slate-800 dark:text-white">{visit.followUp}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Visit ID</p><p className="text-sm font-mono text-slate-600 dark:text-slate-400">{visit.id}</p></div>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
                    <Eye size={16} /> View Details
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                    <Download size={16} /> Download
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PatientHistory;
