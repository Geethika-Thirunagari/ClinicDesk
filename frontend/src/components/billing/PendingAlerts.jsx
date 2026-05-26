import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { computeInvoiceTotals } from '../../data/billingMocks';

const PendingAlerts = ({ invoices = [], onView, delay = 0 }) => {
  const alerts = invoices.filter((inv) => inv.status === 'overdue' || inv.status === 'unpaid');

  if (alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <AlertTriangle size={16} className="text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-amber-900 text-sm">Pending Payment Alerts</h3>
          <p className="text-xs text-amber-600">{alerts.length} invoice{alerts.length > 1 ? 's' : ''} require attention</p>
        </div>
      </div>

      <div className="space-y-2">
        {alerts.map((inv) => {
          const { total } = computeInvoiceTotals(inv);
          const isOverdue = inv.status === 'overdue';
          return (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl border gap-3',
                isOverdue
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-white/60 border-amber-100'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Clock size={14} className={isOverdue ? 'text-rose-500 shrink-0' : 'text-amber-500 shrink-0'} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{inv.patient}</p>
                  <p className="text-xs text-slate-500">{inv.id} &middot; Due {inv.due}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={cn('text-sm font-bold', isOverdue ? 'text-rose-600' : 'text-amber-700')}>
                  ${total.toLocaleString()}
                </span>
                <button
                  onClick={() => onView && onView(inv)}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    isOverdue ? 'hover:bg-rose-100 text-rose-400 hover:text-rose-600' : 'hover:bg-amber-100 text-amber-400 hover:text-amber-600'
                  )}
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PendingAlerts;
