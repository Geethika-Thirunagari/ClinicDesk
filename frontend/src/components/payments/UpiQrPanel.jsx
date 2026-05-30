import React, { useMemo, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Check, QrCode, Smartphone } from 'lucide-react';
import { cn } from '../../utils/cn';
import {
  CLINIC_UPI,
  buildUpiPaymentUri,
  formatInr,
  toInr,
} from '../../utils/upiPayment';

/**
 * QR scan + clinic VPA display for UPI payments.
 */
const UpiQrPanel = ({ invoiceId, amountUsd, className }) => {
  const [copied, setCopied] = useState(false);
  const amountInr = useMemo(() => toInr(amountUsd), [amountUsd]);

  const upiUri = useMemo(
    () =>
      buildUpiPaymentUri({
        vpa: CLINIC_UPI.vpa,
        payeeName: CLINIC_UPI.name,
        amountInr,
        invoiceId,
        note: `ClinicDesk ${invoiceId}`,
      }),
    [amountInr, invoiceId]
  );

  const copyVpa = async () => {
    try {
      await navigator.clipboard.writeText(CLINIC_UPI.vpa);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col items-center p-5 rounded-2xl bg-white border-2 border-slate-100 shadow-inner">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <QRCodeCanvas
            value={upiUri}
            size={200}
            level="M"
            includeMargin
            bgColor="#ffffff"
            fgColor="#0a1a0f"
          />
        </div>
        <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <QrCode size={14} /> Scan with any UPI app
        </p>
        <p className="text-2xl font-extrabold text-[#0a1a0f] mt-1">{formatInr(amountInr)}</p>
        <p className="text-[10px] text-slate-400 mt-1 font-mono">{invoiceId}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
          <span
            key={app}
            className="px-2.5 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600"
          >
            {app}
          </span>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
        <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">
          Or pay manually to
        </p>
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-mono font-bold text-emerald-900 text-sm">{CLINIC_UPI.vpa}</p>
            <p className="text-xs text-emerald-700 mt-0.5">{CLINIC_UPI.name}</p>
          </div>
          <button
            type="button"
            onClick={copyVpa}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy UPI'}
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 flex items-start gap-2">
        <Smartphone size={14} className="shrink-0 mt-0.5 text-slate-400" />
        Open your UPI app, scan the QR or enter the UPI ID, pay {formatInr(amountInr)}, then enter
        the transaction reference below.
      </p>
    </div>
  );
};

export default UpiQrPanel;
