import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Download, Eye, Clock, Activity, FileDigit } from 'lucide-react';
import { cn } from '../../utils/cn';

const records = [
  { id: 'REC-001', patient: 'Alice Johnson', pid: 'PT-1024', type: 'Lab Report', name: 'Complete Blood Count', date: '2026-05-19', status: 'Final', file: 'CBC_Report.pdf' },
  { id: 'REC-002', patient: 'Robert Williams', pid: 'PT-2910', type: 'Imaging', name: 'Chest X-Ray', date: '2026-05-18', status: 'Final', file: 'XRay_Chest.dcm' },
  { id: 'REC-003', patient: 'Maria Garcia', pid: 'PT-8821', type: 'Clinical Note', name: 'Initial Consultation', date: '2026-05-15', status: 'Draft', file: 'Consult_Note.docx' },
  { id: 'REC-004', patient: 'David Lee', pid: 'PT-4491', type: 'Lab Report', name: 'Lipid Panel', date: '2026-05-14', status: 'Final', file: 'Lipid_Panel.pdf' },
  { id: 'REC-005', patient: 'Emma Brown', pid: 'PT-1122', type: 'Discharge', name: 'Discharge Summary', date: '2026-05-10', status: 'Final', file: 'Discharge.pdf' },
];

const TypeIcon = ({ type }) => {
  switch(type) {
    case 'Lab Report': return <Activity size={16} className="text-rose-500" />;
    case 'Imaging': return <FileDigit size={16} className="text-blue-500" />;
    case 'Clinical Note': return <FileText size={16} className="text-amber-500" />;
    case 'Discharge': return <FileText size={16} className="text-emerald-500" />;
    default: return <FileText size={16} className="text-slate-500" />;
  }
};

const DoctorRecords = () => {
  const [search, setSearch] = useState('');

  const filtered = records.filter(r => 
    r.patient.toLowerCase().includes(search.toLowerCase()) || 
    r.pid.toLowerCase().includes(search.toLowerCase()) ||
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">Medical Records</h1>
          <p className="text-sm text-slate-500 mt-1">Access and review patient EMR, lab results, and clinical notes.</p>
        </div>
      </div>

      <div className="finai-card p-6">
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by patient name, ID, or report name..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all " />
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 :bg-slate-700 transition-all">
            <Filter size={18} /> Advanced Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 ">
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Record Details</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record, i) => (
                <motion.tr key={record.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 hover:bg-slate-50/50 :bg-slate-800/50 transition-colors">
                  <td className="py-4">
                    <p className="text-sm font-bold text-[#0a1a0f] ">{record.patient}</p>
                    <p className="text-xs text-slate-500 font-mono">{record.pid}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm font-semibold text-slate-700 ">{record.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{record.id}</p>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <TypeIcon type={record.type} />
                      <span className="text-sm font-medium text-slate-600 ">{record.type}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-600 flex items-center gap-1.5 mt-1">
                    <Clock size={14} className="text-slate-400" /> {record.date}
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                      record.status === 'Final' ? "bg-emerald-100 text-emerald-700 " : "bg-amber-100 text-amber-700 "
                    )}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 text-right space-x-2">
                    <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 :bg-blue-500/10 transition-colors tooltip-trigger" title="View Document">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 :bg-slate-800 transition-colors tooltip-trigger" title="Download">
                      <Download size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorRecords;
