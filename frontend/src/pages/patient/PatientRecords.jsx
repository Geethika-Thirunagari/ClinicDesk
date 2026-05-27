import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Download, Eye, Clock, Activity, 
  FileDigit, Stethoscope, ShieldCheck, Filter, X
} from 'lucide-react';
import { cn } from '../../utils/cn';

const mockRecords = [
  { id: 'REC-001', doctor: 'Dr. Sarah Smith', type: 'Lab Report', name: 'Complete Blood Count (CBC)', date: '2026-05-19', status: 'Final', notes: 'All values within normal thresholds. Red blood cell count shows healthy progress.', file: 'CBC_Report.pdf' },
  { id: 'REC-002', doctor: 'Dr. Sarah Smith', type: 'Imaging', name: 'Chest X-Ray (PA View)', date: '2026-05-18', status: 'Final', notes: 'Clear lung fields. No cardiomegaly or active disease noted.', file: 'XRay_Chest.pdf' },
  { id: 'REC-003', doctor: 'Dr. Emily Chen', type: 'Clinical Note', name: 'Follow-up Consultation', date: '2026-05-15', status: 'Final', notes: 'Patient reports complete resolution of contact dermatitis rash. Advised to continue moisturizing regimen.', file: 'Consult_Note.docx' },
  { id: 'REC-004', doctor: 'Dr. Sarah Smith', type: 'Lab Report', name: 'Lipid Panel Test', date: '2026-04-10', status: 'Final', notes: 'Slightly elevated LDL cholesterol. Recommended dietary changes and follow-up in 3 months.', file: 'Lipid_Panel.pdf' },
  { id: 'REC-005', doctor: 'Dr. Michael Park', type: 'Clinical Note', name: 'Orthopedic Diagnostics', date: '2026-03-15', status: 'Final', notes: 'Grade I ankle sprain. Prescribed rest, ice, compression, and elevation (RICE protocol).', file: 'Discharge.pdf' },
];

const TypeIcon = ({ type }) => {
  switch(type) {
    case 'Lab Report': return <Activity size={18} className="text-rose-500" />;
    case 'Imaging': return <FileDigit size={18} className="text-blue-500" />;
    case 'Clinical Note': return <FileText size={18} className="text-amber-500" />;
    case 'Prescription': return <Stethoscope size={18} className="text-emerald-500" />;
    default: return <FileText size={18} className="text-slate-500" />;
  }
};

const PatientRecords = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredRecords = mockRecords.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                          r.doctor.toLowerCase().includes(search.toLowerCase()) || 
                          r.id.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || r.type === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-4 lg:p-8 min-h-screen"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">My Medical Records</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review lab tests, radiology reports, clinical summaries, and diagnostics.</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search records by name, ID, or physician..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap items-center">
          <Filter size={15} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
          {['All', 'Lab Report', 'Imaging', 'Clinical Note'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all",
                activeCategory === cat 
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
              )}
            >
              {cat === 'All' ? 'All Records' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Records Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record, i) => (
            <motion.div 
              key={record.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm hover:shadow-md rounded-2xl p-5 flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Upper line */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <TypeIcon type={record.type} />
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{record.type}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={12} /> {record.status}
                  </span>
                </div>

                {/* Content info */}
                <h3 className="font-extrabold text-slate-800 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {record.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Prescribed by: <span className="font-semibold">{record.doctor}</span></p>

                {/* Short notes preview */}
                <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mt-4 line-clamp-2 leading-relaxed">
                  {record.notes}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 font-medium font-mono text-slate-500 dark:text-slate-400">
                  <Clock size={14} className="text-slate-400" />
                  {record.date}
                </span>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedRecord(record)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye size={15} /> View Notes
                  </button>
                  <button 
                    onClick={() => alert(`Downloaded file: ${record.file} (Mock)`)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-md shadow-blue-500/10"
                  >
                    <Download size={15} /> Download
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            No medical records found. Try adjusting your search query.
          </div>
        )}
      </div>

      {/* Record Details Modal Overlay */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedRecord(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 md:p-8 max-w-lg w-full relative z-10 space-y-6 text-left"
            >
              {/* Close Icon */}
              <button 
                onClick={() => setSelectedRecord(null)}
                className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <TypeIcon type={selectedRecord.type} />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{selectedRecord.type}</span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white leading-snug">
                  {selectedRecord.name}
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Doctor</span>
                    <span className="text-slate-800 dark:text-white font-extrabold mt-0.5 block">{selectedRecord.doctor}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Record Date</span>
                    <span className="text-slate-800 dark:text-white font-extrabold mt-0.5 block font-mono">{selectedRecord.date}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Record ID</span>
                    <span className="text-slate-600 dark:text-slate-400 font-mono mt-0.5 block">{selectedRecord.id}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Verification</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 block uppercase tracking-wide text-[10px]">Verified Final</span>
                  </div>
                </div>

                {/* Details Notes */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Notes & Assessments</span>
                  <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-blue-50/20 dark:bg-blue-500/5 border border-blue-50/50 dark:border-blue-500/10 p-4 rounded-2xl">
                    {selectedRecord.notes}
                  </div>
                </div>

                {/* Download call-to-action */}
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setSelectedRecord(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition-all"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      alert(`Downloaded file: ${selectedRecord.file} (Mock)`);
                    }}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
                  >
                    <Download size={16} /> Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PatientRecords;
