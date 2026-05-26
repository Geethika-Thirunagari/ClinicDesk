import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

const payments = [
  { id: 'INV-4501', date: '2026-05-20', desc: 'Consultation - Dr. Sarah Smith', amount: '$75.00', method: 'Credit Card', status: 'Paid' },
  { id: 'INV-4490', date: '2026-04-28', desc: 'Follow-up - Dr. Emily Chen', amount: '$65.00', method: 'Insurance', status: 'Paid' },
  { id: 'INV-4485', date: '2026-04-10', desc: 'Lab Panel - Lipid Profile', amount: '$120.00', method: 'Pending', status: 'Pending' },
  { id: 'INV-4401', date: '2026-03-15', desc: 'Emergency - Orthopedics', amount: '$250.00', method: 'Insurance', status: 'Paid' },
];

const PatientPayments = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Payments & Billing</h1>
        <p className="text-sm text-slate-500 mt-1">Track invoices and outstanding balances.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{ label: 'Total Paid', val: '$390.00', icon: CheckCircle, c: 'bg-emerald-500' },
          { label: 'Outstanding', val: '$120.00', icon: Clock, c: 'bg-amber-500' },
          { label: 'Invoices', val: '4', icon: CreditCard, c: 'bg-blue-500' }].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
            className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-5">
            <div className={cn("p-3 rounded-xl w-fit mb-3", s.c)}><s.icon size={22} className="text-white" /></div>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{s.val}</h3>
            <p className="text-sm font-semibold text-slate-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50">
              {['Invoice','Description','Date','Amount','Status',''].map(h => <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{p.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-white">{p.desc}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{p.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-white">{p.amount}</td>
                  <td className="px-6 py-4"><span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase", p.status === 'Paid' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>{p.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    {p.status === 'Pending' ? <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">Pay Now</button>
                    : <button className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"><Download size={16} /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
export default PatientPayments;
