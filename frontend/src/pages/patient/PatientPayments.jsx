import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  X,
  Loader2,
  ShieldCheck,
  Wallet,
  Building2,
  QrCode,
  Smartphone,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import UpiQrPanel from '../../components/payments/UpiQrPanel';
import {
  CLINIC_UPI,
  formatInr,
  isValidUpiId,
  isValidUpiReference,
  toInr,
} from '../../utils/upiPayment';

const STORAGE_KEY = 'clinicdesk_patient_payments';

const DEFAULT_PAYMENTS = [
  {
    id: 'INV-4501',
    date: '2026-05-20',
    desc: 'Consultation - Dr. Sarah Smith',
    amount: 75,
    method: 'Credit Card',
    status: 'Paid',
    paidAt: '2026-05-20',
    transactionId: 'TXN-882104',
  },
  {
    id: 'INV-4490',
    date: '2026-04-28',
    desc: 'Follow-up - Dr. Emily Chen',
    amount: 65,
    method: 'Insurance',
    status: 'Paid',
    paidAt: '2026-04-28',
    transactionId: 'TXN-771902',
  },
  {
    id: 'INV-4485',
    date: '2026-04-10',
    desc: 'Lab Panel - Lipid Profile',
    amount: 120,
    method: null,
    status: 'Pending',
  },
  {
    id: 'INV-4472',
    date: '2026-05-18',
    desc: 'Teleconsult - Dr. Sarah Smith',
    amount: 55,
    method: null,
    status: 'Pending',
  },
  {
    id: 'INV-4401',
    date: '2026-03-15',
    desc: 'Emergency - Orthopedics',
    amount: 250,
    method: 'Insurance',
    status: 'Paid',
    paidAt: '2026-03-15',
    transactionId: 'TXN-440188',
  },
];

const PAYMENT_METHODS = [
  { id: 'qr', label: 'Scan QR (UPI)', icon: QrCode },
  { id: 'upi', label: 'UPI ID', icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'wallet', label: 'Digital Wallet', icon: Wallet },
  { id: 'insurance', label: 'Insurance', icon: Building2 },
];

const formatMoney = (n) =>
  `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const loadPayments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* use defaults */
  }
  return DEFAULT_PAYMENTS;
};

const downloadReceipt = (payment) => {
  const lines = [
    'ClinicDesk — Payment Receipt',
    '================================',
    `Invoice:     ${payment.id}`,
    `Date:        ${payment.paidAt || payment.date}`,
    `Description: ${payment.desc}`,
    `Amount:      ${formatMoney(payment.amount)}`,
    `Method:      ${payment.method}`,
    `Status:      ${payment.status}`,
    payment.transactionId ? `Transaction: ${payment.transactionId}` : '',
    '',
    'Thank you for your payment.',
  ].filter(Boolean);

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${payment.id}-receipt.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const PatientPayments = () => {
  const [payments, setPayments] = useState(loadPayments);
  const [payTarget, setPayTarget] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [upiPayerId, setUpiPayerId] = useState('');
  const [upiReference, setUpiReference] = useState('');
  const [vpaCopied, setVpaCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  const stats = useMemo(() => {
    const paid = payments.filter((p) => p.status === 'Paid');
    const pending = payments.filter((p) => p.status === 'Pending');
    const totalPaid = paid.reduce((sum, p) => sum + p.amount, 0);
    const outstanding = pending.reduce((sum, p) => sum + p.amount, 0);
    return {
      totalPaid: formatMoney(totalPaid),
      outstanding: formatMoney(outstanding),
      invoiceCount: String(payments.length),
      pendingCount: pending.length,
    };
  }, [payments]);

  const openPayModal = (payment) => {
    setPayTarget(payment);
    setPaymentMethod('qr');
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setUpiPayerId('');
    setUpiReference('');
    setVpaCopied(false);
    setPayError('');
  };

  const copyClinicVpa = async () => {
    try {
      await navigator.clipboard.writeText(CLINIC_UPI.vpa);
      setVpaCopied(true);
      window.setTimeout(() => setVpaCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const closePayModal = () => {
    if (processing) return;
    setPayTarget(null);
    setPayError('');
  };

  const validatePayment = () => {
    if (paymentMethod === 'qr' || paymentMethod === 'upi') {
      if (paymentMethod === 'upi' && !isValidUpiId(upiPayerId)) {
        return 'Enter a valid UPI ID (e.g. name@oksbi).';
      }
      if (!isValidUpiReference(upiReference)) {
        return 'Enter the UPI transaction reference (UTR) from your payment app.';
      }
    }
    if (paymentMethod === 'card') {
      const digits = cardNumber.replace(/\s/g, '');
      if (!cardName.trim()) return 'Enter the name on card.';
      if (digits.length < 15) return 'Enter a valid card number.';
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) return 'Expiry must be MM/YY.';
      if (cardCvc.length < 3) return 'Enter a valid security code.';
    }
    return '';
  };

  const handleConfirmPay = () => {
    if (!payTarget) return;
    const err = validatePayment();
    if (err) {
      setPayError(err);
      return;
    }

    setPayError('');
    setProcessing(true);

    const methodLabel =
      PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label ?? 'Card';
    const txnId =
      paymentMethod === 'qr' || paymentMethod === 'upi'
        ? `UPI-${upiReference.trim().toUpperCase()}`
        : `TXN-${Date.now().toString().slice(-8)}`;

    window.setTimeout(() => {
      const paidAt = new Date().toISOString().split('T')[0];
      const methodDetail =
        paymentMethod === 'qr'
          ? `UPI QR (${formatInr(toInr(payTarget.amount))})`
          : paymentMethod === 'upi'
            ? `UPI (${upiPayerId.trim()})`
            : methodLabel;

      setPayments((prev) =>
        prev.map((p) =>
          p.id === payTarget.id
            ? {
                ...p,
                status: 'Paid',
                method: methodDetail,
                paidAt,
                transactionId: txnId,
              }
            : p
        )
      );

      setProcessing(false);
      setPayTarget(null);
      setSuccessMessage(
        `Payment of ${formatMoney(payTarget.amount)} for ${payTarget.id} was successful.`
      );
      window.setTimeout(() => setSuccessMessage(''), 5000);
    }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 font-['Outfit']"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">
          Payments & Billing
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pay outstanding invoices and download receipts.
        </p>
      </div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800"
          >
            <CheckCircle size={20} className="shrink-0" />
            <p className="text-sm font-semibold">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Paid', val: stats.totalPaid, icon: CheckCircle, c: 'bg-emerald-500' },
          { label: 'Outstanding', val: stats.outstanding, icon: Clock, c: 'bg-amber-500' },
          {
            label: stats.pendingCount > 0 ? `Due (${stats.pendingCount})` : 'Invoices',
            val: stats.invoiceCount,
            icon: CreditCard,
            c: 'bg-blue-500',
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="cd-card p-5"
          >
            <div className={cn('p-3 rounded-xl w-fit mb-3', s.c)}>
              <s.icon size={22} className="text-white" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0a1a0f]">{s.val}</h3>
            <p className="text-sm font-semibold text-slate-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="cd-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                {['Invoice', 'Description', 'Date', 'Amount', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono font-bold text-slate-700">{p.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#0a1a0f]">{p.desc}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{p.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#0a1a0f]">
                    {formatMoney(p.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase',
                        p.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.status === 'Pending' ? (
                      <button
                        type="button"
                        onClick={() => openPayModal(p)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => downloadReceipt(p)}
                        title="Download receipt"
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Download size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {payTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePayModal}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 md:p-8 max-w-xl w-full relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0a1a0f]">Complete Payment</h3>
                  <p className="text-sm text-slate-500 mt-1">{payTarget.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={closePayModal}
                  disabled={processing}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Invoice</span>
                  <span className="font-mono font-bold text-slate-800">{payTarget.id}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-500">Due date</span>
                  <span className="font-semibold text-slate-700">{payTarget.date}</span>
                </div>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-600">Amount due</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-[#0a1a0f] block">
                      {formatMoney(payTarget.amount)}
                    </span>
                    <span className="text-sm font-bold text-emerald-700">
                      ≈ {formatInr(toInr(payTarget.amount))} via UPI
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Payment method
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(id);
                      setPayError('');
                    }}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-xs font-bold transition-all min-h-[72px]',
                      paymentMethod === id
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-semibold text-[10px] leading-tight text-center">
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'qr' && payTarget && (
                <div className="mb-6">
                  <UpiQrPanel invoiceId={payTarget.id} amountUsd={payTarget.amount} />
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4 mb-2">
                    UPI transaction reference (UTR)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 334455667788"
                    value={upiReference}
                    onChange={(e) => setUpiReference(e.target.value.replace(/\s/g, ''))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    After scanning and paying, paste the 12-digit UTR from your UPI app here.
                  </p>
                </div>
              )}

              {paymentMethod === 'upi' && payTarget && (
                <div className="mb-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">
                      Pay to clinic UPI
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-mono font-bold text-emerald-900">{CLINIC_UPI.vpa}</p>
                        <p className="text-xs text-emerald-700">{CLINIC_UPI.name}</p>
                        <p className="text-lg font-extrabold text-[#0a1a0f] mt-2">
                          {formatInr(toInr(payTarget.amount))}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={copyClinicVpa}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-emerald-800"
                      >
                        {vpaCopied ? <Check size={14} /> : <Copy size={14} />}
                        Copy
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Your UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="yourname@oksbi"
                      value={upiPayerId}
                      onChange={(e) => setUpiPayerId(e.target.value.trim())}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Transaction reference (UTR)
                    </label>
                    <input
                      type="text"
                      placeholder="From GPay / PhonePe / Paytm"
                      value={upiReference}
                      onChange={(e) => setUpiReference(e.target.value.replace(/\s/g, ''))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3 mb-6">
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Card number"
                    value={cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                      setCardNumber(v.replace(/(.{4})/g, '$1 ').trim());
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                        setCardExpiry(v);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="CVC"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <p className="text-sm text-slate-600 mb-6 p-3 rounded-xl bg-blue-50 border border-blue-100">
                  You will be redirected to your wallet provider. For this demo, confirm below to
                  complete payment.
                </p>
              )}

              {paymentMethod === 'insurance' && (
                <p className="text-sm text-slate-600 mb-6 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                  Your insurer will be billed. Copay of{' '}
                  <strong>{formatMoney(payTarget.amount)}</strong> will be charged on confirmation.
                </p>
              )}

              {payError && (
                <p className="text-sm text-rose-600 font-semibold mb-4">{payError}</p>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                Payments are simulated locally for demo — no real charges.
              </div>

              <button
                type="button"
                onClick={handleConfirmPay}
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-70"
              >
                {processing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing…
                  </>
                ) : paymentMethod === 'qr' || paymentMethod === 'upi' ? (
                  <>
                    <CheckCircle size={18} />
                    Confirm UPI payment · {formatInr(toInr(payTarget.amount))}
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Pay {formatMoney(payTarget.amount)}
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PatientPayments;
