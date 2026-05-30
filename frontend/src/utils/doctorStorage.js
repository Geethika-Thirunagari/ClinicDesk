const PRESCRIPTIONS_KEY = 'clinicdesk_prescriptions';
const SCHEDULE_KEY = 'clinicdesk_doctor_schedule';

export const DEFAULT_PRESCRIPTION_HISTORY = [
  {
    id: 'RX-9821',
    patient: 'Alice Johnson',
    patientId: 'PT-1024',
    date: '2026-05-20',
    medications: [
      { drug: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days' },
      { drug: 'Atorvastatin', dosage: '20mg', frequency: 'At night', duration: '90 days' },
      { drug: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily', duration: '30 days' },
    ],
  },
  {
    id: 'RX-9820',
    patient: 'Robert Williams',
    patientId: 'PT-2910',
    date: '2026-05-19',
    medications: [{ drug: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '90 days' }],
  },
  {
    id: 'RX-9819',
    patient: 'Maria Garcia',
    patientId: 'PT-8821',
    date: '2026-05-15',
    medications: [
      { drug: 'Hydrocortisone cream', dosage: '1%', frequency: 'Apply BID', duration: '14 days' },
      { drug: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '7 days' },
    ],
  },
];

export const DEFAULT_SCHEDULE_BLOCKS = [
  { id: 1, day: 'Mon', start: '09:00 AM', end: '01:00 PM', type: 'Consultation', status: 'Active' },
  { id: 2, day: 'Mon', start: '02:00 PM', end: '05:00 PM', type: 'Teleconsult', status: 'Active' },
  { id: 3, day: 'Tue', start: '09:00 AM', end: '01:00 PM', type: 'Consultation', status: 'Active' },
  { id: 4, day: 'Wed', start: '09:00 AM', end: '05:00 PM', type: 'Surgery', status: 'Active' },
  { id: 5, day: 'Thu', start: '10:00 AM', end: '03:00 PM', type: 'Consultation', status: 'Active' },
  { id: 6, day: 'Fri', start: '09:00 AM', end: '12:00 PM', type: 'Teleconsult', status: 'Active' },
];

function loadJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function loadPrescriptionHistory() {
  return loadJson(PRESCRIPTIONS_KEY, DEFAULT_PRESCRIPTION_HISTORY);
}

export function savePrescriptionHistory(list) {
  localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(list));
}

export function loadScheduleBlocks() {
  return loadJson(SCHEDULE_KEY, DEFAULT_SCHEDULE_BLOCKS);
}

export function saveScheduleBlocks(blocks) {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(blocks));
}

export function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
