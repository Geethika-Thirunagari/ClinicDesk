import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Download, MoreHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';
import { STATUS_CONFIG, computeInvoiceTotals } from '../../data/billingMocks';

const PaymentTracker = ({ invoices = [], onView, onDownload, delay = 0 }) => {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.patient.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.doctor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
      className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-white/40 bg-white/30 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h3 className="font-semibold text-slate-800 text-lg shrink-0">Payment Tracker</h3>
        <div className="flex flex-col sm:flex-row gap-2 flex-1 sm:justify-end">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="pl-9 pr-3 h-9 w-full sm:w-56 rounded-xl border border-slate-200 bg-white/60 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="relative">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-8 pr-4 h-9 rounded-xl border border-slate-200 bg-white/60 text-sm text-slate-700 outline-none focus:border-blue-400 transition-all appearance-none"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              {['Invoice', 'Patient', 'Doctor', 'Date', 'Due', 'Amount', 'Status', ''].map((h) => (
                <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-400">No invoices found.</td>
              </tr>
            ) : filtered.map((inv, i) => {
              const { total } = computeInvoiceTotals(inv);
              const cfg = STATUS_CONFIG[inv.status];
              return (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/40 transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-sm font-semibold text-blue-600">{inv.id}</td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-slate-800">{inv.patient}</p>
                    <p className="text-xs text-slate-400">{inv.patientId}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{inv.doctor}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{inv.date}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{inv.due}</td>
                  <td className="px-5 py-3 text-sm font-bold text-slate-800">${total.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', cfg.color)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onView && onView(inv)} title="View Invoice"
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => onDownload && onDownload(inv)} title="Download Receipt"
                        className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 transition-colors">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-white/40">
        {filtered.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">No invoices found.</p>
        ) : filtered.map((inv) => {
          const { total } = computeInvoiceTotals(inv);
          const cfg = STATUS_CONFIG[inv.status];
          return (
            <div key={inv.id} className="p-4 hover:bg-white/40 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-blue-600">{inv.id}</span>
                <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border', cfg.color)}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />{cfg.label}
                </span>
              </div>
              <p className="font-semibold text-slate-800 mt-1 text-sm">{inv.patient}</p>
              <p className="text-xs text-slate-500">{inv.doctor} &middot; Due {inv.due}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-lg font-bold text-slate-800">${total.toLocaleString()}</p>
                <div className="flex gap-2">
                  <button onClick={() => onView && onView(inv)} className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"><Eye size={15} /></button>
                  <button onClick={() => onDownload && onDownload(inv)} className="p-2 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-100 transition-colors"><Download size={15} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PaymentTracker;
