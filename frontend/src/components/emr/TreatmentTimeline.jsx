import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Pill, FlaskConical, AlertTriangle, ClipboardList, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

const TYPE_CONFIG = {
  appointment:  { icon: Calendar,       bg: 'bg-blue-100',   color: 'text-blue-600',   border: 'border-blue-200'   },
  prescription: { icon: Pill,           bg: 'bg-purple-100', color: 'text-purple-600', border: 'border-purple-200' },
  lab:          { icon: FlaskConical,   bg: 'bg-teal-100',   color: 'text-teal-600',   border: 'border-teal-200'   },
  emergency:    { icon: AlertTriangle,  bg: 'bg-rose-100',   color: 'text-rose-600',   border: 'border-rose-200'   },
  diagnosis:    { icon: ClipboardList,  bg: 'bg-amber-100',  color: 'text-amber-600',  border: 'border-amber-200'  },
};

const TreatmentTimeline = ({ events = [], delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
    className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6"
  >
    <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-6">
      <Clock size={16} className="text-indigo-500" /> Treatment Timeline
    </h3>

    {events.length === 0 ? (
      <p className="text-sm text-slate-400 text-center py-8">No timeline events found.</p>
    ) : (
      <div className="relative border-l-2 border-slate-100 ml-4 space-y-6">
        {events.map((ev, i) => {
          const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.appointment;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + i * 0.09 }}
              className="relative pl-7"
            >
              {/* dot */}
              <div className={cn(
                'absolute -left-[21px] top-0.5 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm',
                cfg.bg
              )}>
                <Icon size={14} className={cfg.color} />
              </div>

              <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 hover:bg-white/70 transition-colors group">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{ev.label}</p>
                  <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">{ev.date}</span>
                </div>
                {ev.detail && <p className="text-sm text-slate-500 mt-1">{ev.detail}</p>}
                <span className={cn(
                  'inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full capitalize border',
                  cfg.bg, cfg.color, cfg.border
                )}>
                  {ev.type}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    )}
  </motion.div>
);

export default TreatmentTimeline;
