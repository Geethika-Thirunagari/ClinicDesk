import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, Building2, User, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { computeInvoiceTotals, STATUS_CONFIG } from '../../data/billingMocks';

const InvoiceModal = ({ isOpen, invoice, onClose }) => {
  if (!invoice) return null;

  const { subtotal, taxAmount, total } = computeInvoiceTotals(invoice);
  const cfg = STATUS_CONFIG[invoice.status];

  const handlePrint = () => window.print();

  // Simulate PDF download by opening a printable blob
  const handleDownload = () => {
    const content = `
ClinicDesk — Invoice ${invoice.id}
Patient: ${invoice.patient}
Doctor:  ${invoice.doctor}
Date:    ${invoice.date}
Due:     ${invoice.due}

SERVICES
--------
${invoice.services.map((s) => `${s.name.padEnd(35)} ${s.qty}x $${s.rate}`).join('\n')}

Subtotal: $${subtotal}
Tax (${invoice.tax}%): $${taxAmount}
Discount: -$${invoice.discount}
------------------
TOTAL: $${total}

Status: ${invoice.status.toUpperCase()}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.id}-receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const StatusIcon = invoice.status === 'paid' ? CheckCircle2 : invoice.status === 'overdue' ? AlertTriangle : Clock;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-lg bg-white/90 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                    <span className="text-white font-bold text-sm">+</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">ClinicDesk</p>
                    <p className="text-xs text-slate-400">123 Health Ave, Springfield, IL</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Body — scrollable */}
              <div className="overflow-y-auto custom-scrollbar px-6 py-5 space-y-5 flex-1">
                {/* Invoice meta */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Invoice</p>
                    <p className="text-2xl font-bold text-slate-800 font-mono">{invoice.id}</p>
                    <span className={cn('inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold border', cfg.color)}>
                      <StatusIcon size={12} />
                      {cfg.label}
                    </span>
                  </div>
                  <div className="text-right text-sm text-slate-500 space-y-1">
                    <p>Issue Date: <span className="font-medium text-slate-700">{invoice.date}</span></p>
                    <p>Due Date: <span className="font-medium text-slate-700">{invoice.due}</span></p>
                  </div>
                </div>

                {/* Patient / Doctor */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1"><User size={11} /> Bill To</p>
                    <p className="font-semibold text-slate-800 text-sm">{invoice.patient}</p>
                    <p className="text-xs text-slate-500">{invoice.patientId}</p>
                  </div>
                  <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1"><Building2 size={11} /> Provider</p>
                    <p className="font-semibold text-slate-800 text-sm">{invoice.doctor}</p>
                    <p className="text-xs text-slate-500">ClinicDesk Medical</p>
                  </div>
                </div>

                {/* Line Items */}
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Service</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rate</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoice.services.map((s, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 text-slate-700 font-medium">{s.name}</td>
                          <td className="px-4 py-3 text-center text-slate-500">{s.qty}</td>
                          <td className="px-4 py-3 text-right text-slate-500">${s.rate}</td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-800">${(s.qty * s.rate).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-100 rounded-2xl p-5 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-slate-600"><span>Tax ({invoice.tax}%)</span><span>+${taxAmount.toLocaleString()}</span></div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-${invoice.discount.toLocaleString()}</span></div>
                  )}
                  <div className="flex justify-between font-bold text-slate-800 text-lg pt-2 border-t border-blue-200">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                {invoice.status === 'paid' && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-700">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <p>Payment received. Thank you!</p>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/40 shrink-0">
                <button onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                  <Printer size={15} /> Print
                </button>
                <button onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                  <Download size={15} /> Download Receipt
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InvoiceModal;
