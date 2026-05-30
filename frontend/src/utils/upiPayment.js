/** Demo clinic UPI merchant details — replace with real VPA from your payment provider */
export const CLINIC_UPI = {
  vpa: 'clinicdesk@oksbi',
  name: 'ClinicDesk Healthcare',
};

const USD_TO_INR = 83;

export const toInr = (usdAmount) =>
  Math.round(Number(usdAmount) * USD_TO_INR * 100) / 100;

export const formatInr = (inr) =>
  `₹${Number(inr).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Standard UPI deep link (works with GPay, PhonePe, Paytm, BHIM, etc.)
 * @see https://www.npci.org.in/what-we-do/upi/product-overview
 */
export function buildUpiPaymentUri({ vpa, payeeName, amountInr, invoiceId, note }) {
  const params = new URLSearchParams({
    pa: vpa,
    pn: payeeName,
    am: String(amountInr),
    cu: 'INR',
    tn: note || invoiceId || 'ClinicDesk payment',
  });
  return `upi://pay?${params.toString()}`;
}

/** Basic UPI ID validation (payer VPA) */
export function isValidUpiId(id) {
  return /^[\w.-]{2,}@[\w.-]{2,}$/i.test(String(id).trim());
}

/** UTR / UPI reference (demo: 8–20 alphanumeric) */
export function isValidUpiReference(ref) {
  const v = String(ref).trim();
  return v.length >= 8 && v.length <= 22 && /^[A-Za-z0-9]+$/.test(v);
}
