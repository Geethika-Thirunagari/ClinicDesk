import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

const SymptomAnalysisResults = ({ result, className }) => {
  if (!result) return null;

  const severityStyles =
    result.severity === 'CRITICAL'
      ? 'bg-rose-50 border-rose-200 text-rose-700'
      : result.severity === 'HIGH' || result.severity === 'MODERATE'
        ? 'bg-amber-50 border-amber-200 text-amber-700'
        : 'bg-emerald-50 border-emerald-200 text-emerald-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('space-y-4', className)}
    >
      <div className={cn('px-3 py-2 rounded-lg border flex items-center justify-between', severityStyles)}>
        <div className="flex items-center gap-2">
          {result.severity === 'CRITICAL' ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
          <span className="text-xs font-bold uppercase">Severity: {result.severity}</span>
        </div>
        {result.confidence && (
          <span className="text-xs font-extrabold">{result.confidence} confidence</span>
        )}
      </div>

      {result.predictions?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Possible conditions</h4>
          {result.predictions.map((pred, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100"
            >
              <span className="text-sm font-semibold text-slate-700">{pred.condition}</span>
              <span className="text-xs font-mono font-bold text-indigo-600">{pred.probability}%</span>
            </div>
          ))}
        </div>
      )}

      {result.recommendations?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Info size={14} /> Recommended actions
          </h4>
          <ul className="text-sm space-y-1.5 text-slate-600 font-medium">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-indigo-500 shrink-0">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default SymptomAnalysisResults;
