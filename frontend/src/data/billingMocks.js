// Billing mock data — replace with real API calls in production

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

export const MOCK_INVOICES = [
  { id: 'INV-0041', patient: 'Michael Roberts', patientId: 'P001', doctor: 'Dr. Sarah Smith', date: fmt(addDays(today, -2)),  due: fmt(addDays(today, 13)), services: [{ name: 'Cardiology Consultation', qty: 1, rate: 250 }, { name: 'ECG', qty: 1, rate: 80 }, { name: 'Blood Panel', qty: 1, rate: 120 }], tax: 8, discount: 0,  status: 'unpaid'   },
  { id: 'INV-0040', patient: 'Sarah Connor',    patientId: 'P002', doctor: 'Dr. James Wilson', date: fmt(addDays(today, -5)),  due: fmt(addDays(today, 10)), services: [{ name: 'Neurology Consultation', qty: 1, rate: 300 }, { name: 'MRI Scan', qty: 1, rate: 850 }], tax: 8, discount: 50, status: 'paid'     },
  { id: 'INV-0039', patient: 'William Brown',   patientId: 'P003', doctor: 'Dr. Emily Davis',  date: fmt(addDays(today, -10)), due: fmt(addDays(today, -1)), services: [{ name: 'COPD Management', qty: 1, rate: 200 }, { name: 'Spirometry', qty: 1, rate: 150 }, { name: 'Nebuliser Treatment', qty: 3, rate: 40 }], tax: 8, discount: 0, status: 'overdue'  },
  { id: 'INV-0038', patient: 'Emily Watson',    patientId: 'P004', doctor: 'Dr. Sarah Smith',  date: fmt(addDays(today, -14)), due: fmt(addDays(today, 1)),  services: [{ name: 'General Checkup', qty: 1, rate: 150 }, { name: 'Vaccination', qty: 2, rate: 60 }], tax: 8, discount: 20, status: 'unpaid'   },
  { id: 'INV-0037', patient: 'Jessica Taylor',  patientId: 'P006', doctor: 'Dr. James Wilson', date: fmt(addDays(today, -20)), due: fmt(addDays(today, -5)), services: [{ name: 'Neurology Consultation', qty: 1, rate: 300 }, { name: 'EEG', qty: 1, rate: 200 }], tax: 8, discount: 0,  status: 'overdue'  },
  { id: 'INV-0036', patient: 'James Smith',     patientId: 'P003', doctor: 'Dr. Robert Brown', date: fmt(addDays(today, -22)), due: fmt(addDays(today, -8)), services: [{ name: 'Orthopedic Consultation', qty: 1, rate: 220 }, { name: 'X-Ray', qty: 2, rate: 90 }], tax: 8, discount: 0,  status: 'paid'     },
  { id: 'INV-0035', patient: 'Michael Roberts', patientId: 'P001', doctor: 'Dr. Sarah Smith',  date: fmt(addDays(today, -30)), due: fmt(addDays(today, -16)),services: [{ name: 'Cardiology Follow-up', qty: 1, rate: 180 }, { name: 'Blood Pressure Monitoring', qty: 1, rate: 40 }], tax: 8, discount: 0, status: 'paid' },
];

// Helper: compute totals
export const computeInvoiceTotals = (invoice) => {
  const subtotal = invoice.services.reduce((sum, s) => sum + s.qty * s.rate, 0);
  const taxAmount = Math.round((subtotal * invoice.tax) / 100);
  const total = subtotal + taxAmount - invoice.discount;
  return { subtotal, taxAmount, total };
};

export const STATUS_CONFIG = {
  paid:    { label: 'Paid',    color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  unpaid:  { label: 'Unpaid', color: 'text-blue-700 bg-blue-50 border-blue-200',          dot: 'bg-blue-500'    },
  overdue: { label: 'Overdue',color: 'text-rose-700 bg-rose-50 border-rose-200',          dot: 'bg-rose-500'    },
};

// Revenue chart data (last 6 months)
export const REVENUE_CHART_DATA = [
  { month: 'Dec', revenue: 8200,  collected: 7800  },
  { month: 'Jan', revenue: 9400,  collected: 8900  },
  { month: 'Feb', revenue: 7600,  collected: 6400  },
  { month: 'Mar', revenue: 11200, collected: 10800 },
  { month: 'Apr', revenue: 10500, collected: 9200  },
  { month: 'May', revenue: 12420, collected: 9800  },
];
