import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Filter, Calendar, Users, Activity, 
  Settings, Banknote, ShieldCheck, X, RefreshCw 
} from 'lucide-react';
import { cn } from '../../utils/cn';

const reportTypes = [
  { id: 'fin', title: 'Financial Summary', icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Revenue, expenses, and pending payments.' },
  { id: 'apt', title: 'Appointment Stats', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Booking trends, cancellations, and no-shows.' },
  { id: 'pt', title: 'Patient Demographics', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Age, gender, and regional distribution.' },
  { id: 'stf', title: 'Staff Performance', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'Doctor ratings, active hours, and efficiency.' },
  { id: 'adt', title: 'Audit Logs', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'System access, configuration changes, and alerts.' },
  { id: 'sys', title: 'System Usage', icon: Settings, color: 'text-slate-600', bg: 'bg-slate-100', desc: 'Storage, API requests, and uptime stats.' },
];

const recentReports = [
  { id: 'REP-101', name: 'Q1 Financial Report', type: 'Financial', generatedBy: 'Admin', date: '2026-05-18', size: '2.4 MB' },
  { id: 'REP-102', name: 'Weekly Staff Performance', type: 'Staff', generatedBy: 'System (Auto)', date: '2026-05-15', size: '1.1 MB' },
  { id: 'REP-103', name: 'Patient Demographics 2025', type: 'Patient', generatedBy: 'Dr. Sarah', date: '2026-05-10', size: '3.8 MB' },
  { id: 'REP-104', name: 'Security Audit May', type: 'Audit', generatedBy: 'Admin', date: '2026-05-01', size: '840 KB' },
];

const AdminReports = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(reportTypes[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowModal(false);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 font-['Outfit']">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">System Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Generate, schedule, and export clinic data reports.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all">
          <FileText size={18} /> Generate New Report
        </motion.button>
      </div>

      {/* Report Types Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Report Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((type) => (
            <motion.div key={type.id} whileHover={{ y: -2 }} onClick={() => { setSelectedType(type); setShowModal(true); }}
              className="bg-white border border-[#e2e8e2] shadow-sm hover:shadow-md rounded-[24px] p-5 cursor-pointer transition-all flex items-start gap-4">
              <div className={cn("p-3 rounded-xl shrink-0", type.bg, type.color)}>
                <type.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#0a1a0f] mb-1">{type.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{type.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="cd-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#0a1a0f] ">Recent Reports</h2>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 :bg-slate-700 rounded-lg transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 ">
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report Name</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Generated By</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Size</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50/50 :bg-slate-800/50 transition-colors group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-slate-400 " />
                      <div>
                        <p className="text-sm font-bold text-[#0a1a0f] ">{report.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{report.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-600 ">{report.type}</td>
                  <td className="py-4 text-sm text-slate-600 ">{report.generatedBy}</td>
                  <td className="py-4 text-sm text-slate-600 ">{report.date}</td>
                  <td className="py-4 text-sm text-slate-500 ">{report.size}</td>
                  <td className="py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 :bg-blue-500/20 rounded-lg transition-colors">
                      <Download size={14} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !isGenerating && setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-[24px] shadow-2xl w-full max-w-md p-8 border border-slate-200 ">
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0a1a0f] ">Generate Report</h2>
                <button onClick={() => !isGenerating && setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100 :bg-slate-800 text-slate-400 disabled:opacity-50" disabled={isGenerating}>
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Report Type</label>
                  <select value={selectedType.id} onChange={(e) => setSelectedType(reportTypes.find(t => t.id === e.target.value))} disabled={isGenerating}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 bg-white text-[#0a1a0f] ">
                    {reportTypes.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">From Date</label>
                    <input type="date" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 bg-white text-[#0a1a0f] " disabled={isGenerating} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">To Date</label>
                    <input type="date" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 bg-white text-[#0a1a0f] " disabled={isGenerating} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Format</label>
                  <div className="flex gap-3">
                    {['PDF', 'CSV', 'Excel'].map(format => (
                      <label key={format} className="flex-1 flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 :bg-slate-800 transition-colors bg-white ">
                        <input type="radio" name="format" value={format} defaultChecked={format === 'PDF'} disabled={isGenerating} />
                        <span className="text-sm font-semibold text-slate-700 ">{format}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button onClick={handleGenerate} disabled={isGenerating}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed">
                  {isGenerating ? (
                    <><RefreshCw size={18} className="animate-spin" /> Generating...</>
                  ) : (
                    'Generate & Download'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default AdminReports;
