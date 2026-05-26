import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Building2, FileText } from 'lucide-react';

const MedicalHistory = ({ records = [], delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
    className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm overflow-hidden"
  >
    <div className="px-6 py-4 border-b border-white/40 bg-white/30 flex items-center justify-between">
      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
        <Stethoscope size={16} className="text-blue-500" /> Medical History
      </h3>
      <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
        {records.length} records
      </span>
    </div>

    {records.length === 0 ? (
      <div className="px-6 py-10 text-center text-sm text-slate-400">No medical history found.</div>
    ) : (
      <div className="divide-y divide-white/40">
        {records.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.07 }}
            className="px-6 py-4 hover:bg-white/40 transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {r.date}
                  </span>
                </div>
                <p className="font-semibold text-slate-800">{r.diagnosis}</p>
                {r.notes && (
                  <div className="flex items-start gap-1.5 mt-1.5">
                    <FileText size={12} className="text-slate-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-500">{r.notes}</p>
                  </div>
                )}
              </div>
              <div className="text-right shrink-0 text-xs text-slate-400 space-y-1">
                <p className="flex items-center gap-1 justify-end"><Stethoscope size={11} />{r.doctor}</p>
                <p className="flex items-center gap-1 justify-end"><Building2 size={11} />{r.facility}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </motion.div>
);

export default MedicalHistory;
