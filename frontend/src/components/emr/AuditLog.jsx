import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Monitor } from 'lucide-react';
import { cn } from '../../utils/cn';

const ROLE_CONFIG = {
  admin:  { color: 'text-purple-700 bg-purple-50 border-purple-100' },
  doctor: { color: 'text-blue-700 bg-blue-50 border-blue-100'       },
  nurse:  { color: 'text-teal-700 bg-teal-50 border-teal-100'       },
};

const AuditLog = ({ logs = [], delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
    className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm overflow-hidden"
  >
    <div className="px-6 py-4 border-b border-white/40 bg-gradient-to-r from-slate-50/60 to-white/30 flex items-center justify-between">
      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
        <ShieldCheck size={16} className="text-slate-500" /> Audit Log
      </h3>
      <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full border border-slate-200">
        {logs.length} entries
      </span>
    </div>

    {logs.length === 0 ? (
      <div className="px-6 py-10 text-center text-sm text-slate-400">No audit entries found.</div>
    ) : (
      <div className="divide-y divide-white/40 font-mono text-xs">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
          <span className="col-span-4">Timestamp</span>
          <span className="col-span-3">User</span>
          <span className="col-span-2">Role</span>
          <span className="col-span-2">Action</span>
          <span className="col-span-1 text-right">IP</span>
        </div>
        {logs.map((log, i) => {
          const roleCfg = ROLE_CONFIG[log.role] || ROLE_CONFIG.admin;
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + i * 0.05 }}
              className="grid grid-cols-12 gap-2 items-center px-5 py-3 hover:bg-white/50 transition-colors"
            >
              <span className="col-span-4 text-slate-500 flex items-center gap-1.5">
                <Monitor size={10} className="text-slate-400 shrink-0" />
                {log.timestamp}
              </span>
              <span className="col-span-3 font-medium text-slate-700 truncate">{log.user}</span>
              <span className="col-span-2">
                <span className={cn('px-1.5 py-0.5 rounded-md font-bold text-[10px] border capitalize', roleCfg.color)}>
                  {log.role}
                </span>
              </span>
              <span className="col-span-2 text-slate-500 truncate">{log.action}</span>
              <span className="col-span-1 text-right text-slate-400">{log.ip}</span>
            </motion.div>
          );
        })}
      </div>
    )}
  </motion.div>
);

export default AuditLog;
