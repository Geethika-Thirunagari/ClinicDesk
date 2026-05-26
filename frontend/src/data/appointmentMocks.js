// Mock data for the appointment module
export const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Sarah Smith',   specialty: 'Cardiologist',   avatar: 'https://i.pravatar.cc/64?img=47' },
  { id: 2, name: 'Dr. James Wilson',  specialty: 'Neurologist',    avatar: 'https://i.pravatar.cc/64?img=51' },
  { id: 3, name: 'Dr. Emily Davis',   specialty: 'Orthopedics',    avatar: 'https://i.pravatar.cc/64?img=45' },
  { id: 4, name: 'Dr. Robert Brown',  specialty: 'Pediatrician',   avatar: 'https://i.pravatar.cc/64?img=52' },
];

export const MOCK_PATIENTS = [
  { id: 101, name: 'Michael Roberts', age: 45, phone: '+1 555-0101' },
  { id: 102, name: 'Sarah Connor',    age: 34, phone: '+1 555-0102' },
  { id: 103, name: 'James Smith',     age: 28, phone: '+1 555-0103' },
  { id: 104, name: 'Emily Watson',    age: 52, phone: '+1 555-0104' },
  { id: 105, name: 'William Brown',   age: 67, phone: '+1 555-0105' },
  { id: 106, name: 'Jessica Taylor',  age: 31, phone: '+1 555-0106' },
];

export const APPOINTMENT_TYPES = [
  'General Checkup', 'Cardiology', 'Neurology', 'Orthopedics',
  'Pediatrics', 'Dental', 'Dermatology', 'Mental Health',
];

export const STATUS_CONFIG = {
  upcoming:  { label: 'Upcoming',  color: 'text-blue-700 bg-blue-100',     dot: 'bg-blue-500'    },
  completed: { label: 'Completed', color: 'text-emerald-700 bg-emerald-100', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', color: 'text-rose-700 bg-rose-100',     dot: 'bg-rose-500'    },
  pending:   { label: 'Pending',   color: 'text-amber-700 bg-amber-100',   dot: 'bg-amber-500'   },
};

// Generate mock appointments spread across the current month
const today = new Date();
const y = today.getFullYear();
const m = String(today.getMonth() + 1).padStart(2, '0');

export const MOCK_APPOINTMENTS = [
  { id: '1', patientId: 101, patient: 'Michael Roberts', doctorId: 1, doctor: 'Dr. Sarah Smith', type: 'Cardiology',      date: `${y}-${m}-18`, time: '09:00 AM', status: 'upcoming',  notes: 'Follow-up for hypertension' },
  { id: '2', patientId: 102, patient: 'Sarah Connor',    doctorId: 2, doctor: 'Dr. James Wilson',  type: 'Neurology',      date: `${y}-${m}-18`, time: '10:30 AM', status: 'completed', notes: 'MRI review' },
  { id: '3', patientId: 103, patient: 'James Smith',     doctorId: 3, doctor: 'Dr. Emily Davis',   type: 'Orthopedics',    date: `${y}-${m}-18`, time: '11:45 AM', status: 'cancelled', notes: 'Knee pain' },
  { id: '4', patientId: 104, patient: 'Emily Watson',    doctorId: 1, doctor: 'Dr. Sarah Smith',   type: 'General Checkup',date: `${y}-${m}-19`, time: '02:00 PM', status: 'upcoming',  notes: '' },
  { id: '5', patientId: 105, patient: 'William Brown',   doctorId: 4, doctor: 'Dr. Robert Brown',  type: 'Pediatrics',     date: `${y}-${m}-20`, time: '09:30 AM', status: 'upcoming',  notes: 'Annual wellness' },
  { id: '6', patientId: 106, patient: 'Jessica Taylor',  doctorId: 2, doctor: 'Dr. James Wilson',  type: 'Neurology',      date: `${y}-${m}-20`, time: '03:00 PM', status: 'pending',   notes: 'New patient intake' },
  { id: '7', patientId: 101, patient: 'Michael Roberts', doctorId: 3, doctor: 'Dr. Emily Davis',   type: 'General Checkup',date: `${y}-${m}-22`, time: '11:00 AM', status: 'upcoming',  notes: '' },
  { id: '8', patientId: 102, patient: 'Sarah Connor',    doctorId: 4, doctor: 'Dr. Robert Brown',  type: 'Dental',         date: `${y}-${m}-22`, time: '01:30 PM', status: 'upcoming',  notes: 'Routine cleaning' },
];
