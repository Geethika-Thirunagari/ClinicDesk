import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ReceiptText, BarChart3, ListChecks } from 'lucide-react';
import { cn } from '../utils/cn';
import { MOCK_INVOICES, computeInvoiceTotals } from '../data/billingMocks';
import PendingAlerts from '../components/billing/PendingAlerts';
import RevenueAnalytics from '../components/billing/RevenueAnalytics';
import PaymentTracker from '../components/billing/PaymentTracker';
import InvoiceModal from '../components/billing/InvoiceModal';

const TABS = [
  { id: 'overview',  label: 'Overview',    icon: BarChart3   },
  { id: 'invoices',  label: 'Invoices',    icon: ListChecks  },
];

const Billing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleDownload = (inv) => {
    const { subtotal, taxAmount, total } = computeInvoiceTotals(inv);
    const content = [
      `ClinicDesk — Receipt for ${inv.id}`,
      `Patient: ${inv.patient} (${inv.patientId})`,
      `Doctor:  ${inv.doctor}`,
      `Date:    ${inv.date}  |  Due: ${inv.due}`,
      '',
      'SERVICES',
      '--------',
      ...inv.services.map((s) => `${s.name.padEnd(35)} ${s.qty}x $${s.rate}  = $${s.qty * s.rate}`),
      '',
      `Subtotal : $${subtotal}`,
      `Tax (${inv.tax}%): $${taxAmount}`,
      inv.discount ? `Discount : -$${inv.discount}` : null,
      `─────────────────────`,
      `TOTAL    : $${total}`,
      '',
      `Status: ${inv.status.toUpperCase()}`,
    ].filter(Boolean).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.id}-receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-slate-800"
          >
            Billing & Payments
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-sm text-slate-500 mt-1"
          >
            Manage invoices, track payments, and view revenue analytics.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-1 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                  )}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('invoices')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
          >
            <ReceiptText size={15} /> New Invoice
          </button>
        </motion.div>
      </div>

      {/* Pending Alerts — always visible */}
      <PendingAlerts
        invoices={invoices}
        onView={(inv) => setSelectedInvoice(inv)}
        delay={0.1}
      />

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <RevenueAnalytics delay={0.2} />
        )}

        {activeTab === 'invoices' && (
          <PaymentTracker
            invoices={invoices}
            onView={(inv) => setSelectedInvoice(inv)}
            onDownload={handleDownload}
            delay={0.2}
          />
        )}
      </motion.div>

      {/* Invoice Detail Modal */}
      <InvoiceModal
        isOpen={!!selectedInvoice}
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};

export default Billing;
