import React from 'react';
import { motion } from 'framer-motion';
import { Pill, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

const STATUS = {
  active:    { label: 'Active',    color: 'text-emerald-700 bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500' },
  completed: { label: 'Completed', color: 'text-slate-500 bg-slate-50 border-slate-200',       dot: 'bg-slate-400'   },
};

const Prescriptions = ({ prescriptions = [], delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
    className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm overflow-hidden"
  >
    <div className="px-6 py-4 border-b border-white/40 bg-white/30 flex items-center justify-between">
      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
        <Pill size={16} className="text-purple-500" /> Prescriptions
      </h3>
      <span className="text-xs font-medium bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full border border-purple-100">
        {prescriptions.filter((p) => p.status === 'active').length} active
      </span>
    </div>

    {prescriptions.length === 0 ? (
      <div className="px-6 py-10 text-center text-sm text-slate-400">No prescriptions found.</div>
    ) : (
      <div className="divide-y divide-white/40">
        {prescriptions.map((rx, i) => {
          const cfg = STATUS[rx.status];
          return (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + i * 0.07 }}
              className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-white/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                  rx.status === 'active' ? 'bg-purple-50' : 'bg-slate-50'
                )}>
                  <Pill size={16} className={rx.status === 'active' ? 'text-purple-500' : 'text-slate-400'} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{rx.medication}</p>
                  <p className="text-sm text-slate-500">{rx.dosage} &middot; {rx.frequency}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border', cfg.color)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                      {cfg.label}
                    </span>
                    <span className="text-xs text-slate-400">{rx.duration}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-400">{rx.date}</p>
                <p className="text-xs text-slate-500 mt-1">{rx.doctor}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    )}
  </motion.div>
);

export default Prescriptions;
