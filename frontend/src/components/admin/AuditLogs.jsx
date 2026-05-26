import React from 'react';
import { History, UserPlus, Key, Settings, FileEdit } from 'lucide-react';
import { cn } from '../../utils/cn';

const logs = [
  { id: 1, action: 'User Created', target: 'Dr. Emily Chen', user: 'Admin User', time: '10 mins ago', icon: UserPlus, color: 'text-emerald-500' },
  { id: 2, action: 'System Config Updated', target: 'Billing Rate', user: 'System', time: '1 hour ago', icon: Settings, color: 'text-blue-500' },
  { id: 3, action: 'Failed Login Attempt', target: 'admin@clinicdesk.com', user: 'Unknown IP', time: '3 hours ago', icon: Key, color: 'text-rose-500' },
  { id: 4, action: 'Record Modified', target: 'Patient #8492', user: 'Receptionist Jane', time: '4 hours ago', icon: FileEdit, color: 'text-indigo-500' },
];

const AuditLogs = () => {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-2xl p-6 h-full shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <History className="text-slate-500" />
          Audit Logs
        </h2>
        <button className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">Export</button>
      </div>

      <div className="flex-1 overflow-auto pr-2 -mr-2 relative">
        <div className="absolute left-4 top-2 bottom-0 w-px bg-slate-200 dark:bg-slate-800 z-0" />
        <div className="space-y-4 relative z-10">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 z-10 mt-1 shadow-sm">
                <log.icon size={14} className={log.color} />
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {log.action} <span className="text-slate-500 font-normal">on {log.target}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">by {log.user}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-400">{log.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
