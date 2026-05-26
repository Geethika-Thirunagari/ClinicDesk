import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

const RESULT_CONFIG = {
  normal: { label: 'Normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-100', icon: Minus,        iconColor: 'text-emerald-500' },
  high:   { label: 'High',   color: 'text-rose-700 bg-rose-50 border-rose-100',          icon: TrendingUp,   iconColor: 'text-rose-500'    },
  low:    { label: 'Low',    color: 'text-amber-700 bg-amber-50 border-amber-100',        icon: TrendingDown, iconColor: 'text-amber-500'   },
};

const LabReports = ({ reports = [], delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
    className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm overflow-hidden"
  >
    <div className="px-6 py-4 border-b border-white/40 bg-white/30 flex items-center justify-between">
      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
        <FlaskConical size={16} className="text-teal-500" /> Lab Reports
      </h3>
      <span className="text-xs font-medium bg-teal-50 text-teal-600 px-2.5 py-1 rounded-full border border-teal-100">
        {reports.length} tests
      </span>
    </div>

    {reports.length === 0 ? (
      <div className="px-6 py-10 text-center text-sm text-slate-400">No lab reports found.</div>
    ) : (
      <>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                {['Test', 'Result', 'Reference', 'Status', 'Ordered By', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {reports.map((r, i) => {
                const cfg = RESULT_CONFIG[r.status];
                const Icon = cfg.icon;
                return (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + i * 0.06 }}
                    className="hover:bg-white/40 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-slate-800 text-sm">{r.test}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-slate-700">{r.result}</td>
                    <td className="px-5 py-3 text-sm text-slate-400">{r.reference}</td>
                    <td className="px-5 py-3">
                      <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border', cfg.color)}>
                        <Icon size={11} className={cfg.iconColor} />{cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500">{r.orderedBy}</td>
                    <td className="px-5 py-3 text-xs text-slate-400">{r.date}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/40">
          {reports.map((r) => {
            const cfg = RESULT_CONFIG[r.status];
            const Icon = cfg.icon;
            return (
              <div key={r.id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800 text-sm">{r.test}</p>
                  <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border', cfg.color)}>
                    <Icon size={11} className={cfg.iconColor} />{cfg.label}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-700 mt-1">{r.result}</p>
                <p className="text-xs text-slate-400 mt-0.5">Ref: {r.reference} &middot; {r.date}</p>
              </div>
            );
          })}
        </div>
      </>
    )}
  </motion.div>
);

export default LabReports;
