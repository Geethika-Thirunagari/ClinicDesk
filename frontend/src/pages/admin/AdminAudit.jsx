import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Filter, ShieldAlert, Download, RefreshCw, FileSpreadsheet, Lock, AlertTriangle, Eye } from 'lucide-react';
import { cn } from '../../utils/cn';

const initialAuditLogs = [
  { id: "LOG-9281", timestamp: "2026-05-22 21:40:12", actor: "Dr. Sarah Smith", role: "Doctor", event: "EMR Record Modified", description: "Modified medical record prescription log for patient PT-1024", severity: "medium", category: "Clinical" },
  { id: "LOG-9280", timestamp: "2026-05-22 21:38:05", actor: "System Daemon", role: "Automated", event: "Database Backup Completed", description: "Standard automated system backup executed. 1.2 GB stored to secure cloud", severity: "low", category: "System" },
  { id: "LOG-9279", timestamp: "2026-05-22 21:35:50", actor: "Reception Desk 1", role: "Receptionist", event: "Patient Checkout & Bill generated", description: "Generated bill ID INV-4810 of $145.00 for client PT-2910", severity: "low", category: "Billing" },
  { id: "LOG-9278", timestamp: "2026-05-22 21:12:18", actor: "Unknown IP", role: "Guest", event: "Failed Login Attempt", description: "Multiple (3) failed authorization attempts registered under user admin_test", severity: "high", category: "Security" },
  { id: "LOG-9277", timestamp: "2026-05-22 20:55:04", actor: "Dr. Sarah Smith", role: "Doctor", event: "Prescription Signed", description: "Signed digital prescription Lisinopril 10mg for client PT-1024", severity: "low", category: "Clinical" },
  { id: "LOG-9276", timestamp: "2026-05-22 20:30:11", actor: "Admin Controller", role: "Admin", event: "System Parameter Changed", description: "Modified billing tax settings from 5.0% to 5.5%", severity: "medium", category: "Configuration" }
];

export default function AdminAudit() {
  const [logs, setLogs] = useState(initialAuditLogs);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Simulate adding a new audit log
      const newLog = {
        id: `LOG-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: "Admin Controller",
        role: "Admin",
        event: "Audit Query Compiled",
        description: "Generated real-time system audit logs extraction profile",
        severity: "low",
        category: "Security"
      };
      setLogs(prev => [newLog, ...prev]);
    }, 850);
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.actor.toLowerCase().includes(search.toLowerCase()) || 
                          l.event.toLowerCase().includes(search.toLowerCase()) ||
                          l.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || l.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-blue-500" size={32} />
            System Audit & Security Console
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time security auditing logs, clinical HIPAA compliance assessments, and data integrity checks.
          </p>
        </div>
        
        {/* Top actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleRefresh} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 rounded-xl transition-all shadow-sm">
            <RefreshCw className={isRefreshing ? "animate-spin" : ""} size={16} />
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-500/10 cursor-pointer">
            <FileSpreadsheet size={14} /> Export CSV logs
          </button>
        </div>
      </div>

      {/* Security Compliance Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "HIPAA Clinical Integrity Score", value: "98%", desc: "High clinical data isolation", status: "Optimal", color: "text-emerald-500" },
          { label: "Access Token Cryptography", value: "AES-256", desc: "Digital signature verification active", status: "Secured", color: "text-blue-500" },
          { label: "Threat Mitigation Alarms", value: "1 Warning", desc: "Failed auth challenge recorded", status: "Query Active", color: "text-amber-500" }
        ].map((score, idx) => (
          <div key={idx} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{score.label}</p>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2 leading-none">{score.value}</h3>
              <p className="text-xs font-semibold text-slate-400 mt-2">{score.desc}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className={cn("w-2 h-2 rounded-full", 
                score.color === 'text-emerald-500' ? "bg-emerald-500" :
                score.color === 'text-blue-500' ? "bg-blue-500" : "bg-amber-500"
              )} />
              <span>{score.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search logs by actor, event, EMR codes, description details..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 items-center overflow-x-auto custom-scrollbar whitespace-nowrap py-1">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Group:</span>
          {["All", "Clinical", "Security", "Billing", "System"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-[10px] font-extrabold transition-all border uppercase tracking-wider cursor-pointer",
                selectedCategory === cat 
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Audit timeline table */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6 overflow-hidden">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Real-Time Event Stream</h2>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs font-semibold text-slate-500 dark:text-slate-400 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="pb-3.5 pl-2">Security ID</th>
                <th className="pb-3.5">Timestamp</th>
                <th className="pb-3.5">Category</th>
                <th className="pb-3.5">Event Type</th>
                <th className="pb-3.5">System Actor</th>
                <th className="pb-3.5">Description details</th>
                <th className="pb-3.5 text-center">Threat Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 pl-2 font-mono font-bold text-blue-600 dark:text-blue-400">{log.id}</td>
                    <td className="py-4 font-mono font-medium text-slate-500">{log.timestamp}</td>
                    <td className="py-4">
                      <span className="text-[10px] font-extrabold bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-4 font-extrabold text-slate-800 dark:text-white">{log.event}</td>
                    <td className="py-4">
                      <div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">{log.actor}</div>
                        <div className="text-[9px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">{log.role}</div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-500 dark:text-slate-400 font-medium max-w-[280px] truncate" title={log.description}>{log.description}</td>
                    <td className="py-4 text-center">
                      <span className={cn("text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest", 
                        log.severity === 'high' ? "bg-rose-500 text-white shadow-sm shadow-rose-500/10 animate-pulse" :
                        log.severity === 'medium' ? "bg-amber-500 text-white shadow-sm shadow-amber-500/10" :
                        "bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                      )}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No matching audit parameters logged in event stream.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
