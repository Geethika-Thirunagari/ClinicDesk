import { ROUTES } from '../routes/routes.constants';

const DEFAULT_PATIENTS = [
  { id: 'PT-1001', name: 'Alice Johnson', email: 'alice@mail.com', phone: '+1 555-2001', status: 'Active', doctor: 'Dr. Sarah Smith' },
  { id: 'PT-1002', name: 'Robert Williams', email: 'robert@mail.com', phone: '+1 555-2002', status: 'Active', doctor: 'Dr. John Doe' },
  { id: 'PT-1003', name: 'Maria Garcia', email: 'maria@mail.com', phone: '+1 555-2003', status: 'Discharged', doctor: 'Dr. Emily Chen' },
  { id: 'PT-1004', name: 'David Lee', email: 'david@mail.com', phone: '+1 555-2004', status: 'Critical', doctor: 'Dr. Sarah Smith' },
  { id: 'PT-1005', name: 'Emma Brown', email: 'emma.parent@mail.com', phone: '+1 555-2005', status: 'Active', doctor: 'Dr. Emily Chen' },
  { id: 'PT-1006', name: 'James Taylor', email: 'james.t@mail.com', phone: '+1 555-2006', status: 'Inactive', doctor: 'Dr. Michael Brown' },
];

const DEFAULT_STAFF = [
  { id: 'ST-201', name: 'James Wilson', role: 'Nurse', department: 'ICU', status: 'On Duty', phone: '+1 555-1234' },
  { id: 'ST-202', name: 'Lisa Ray', role: 'Head Nurse', department: 'Cardiology', status: 'On Duty', phone: '+1 555-1235' },
  { id: 'ST-203', name: 'Mark Taylor', role: 'Technician', department: 'Radiology', status: 'Off Duty', phone: '+1 555-1236' },
  { id: 'ST-204', name: 'Emma Brown', role: 'Receptionist', department: 'Front Desk', status: 'On Duty', phone: '+1 555-1237' },
  { id: 'ST-205', name: 'Tom Hardy', role: 'Janitor', department: 'Maintenance', status: 'Leave', phone: '+1 555-1238' },
];

const DEFAULT_DOCTORS = [
  { id: 1, name: 'Dr. Sarah Smith', specialty: 'Cardiologist', status: 'Active', email: 'sarah@clinicdesk.com', phone: '+1 555-0101' },
  { id: 2, name: 'Dr. John Doe', specialty: 'Neurologist', status: 'Active', email: 'john@clinicdesk.com', phone: '+1 555-0102' },
  { id: 3, name: 'Dr. Emily Chen', specialty: 'Pediatrician', status: 'On Leave', email: 'emily@clinicdesk.com', phone: '+1 555-0103' },
  { id: 4, name: 'Dr. Michael Brown', specialty: 'Orthopedic', status: 'Active', email: 'michael@clinicdesk.com', phone: '+1 555-0104' },
  { id: 5, name: 'Dr. Lisa Wang', specialty: 'Dermatologist', status: 'Active', email: 'lisa@clinicdesk.com', phone: '+1 555-0105' },
  { id: 6, name: 'Dr. James Wilson', specialty: 'General', status: 'Inactive', email: 'james@clinicdesk.com', phone: '+1 555-0106' },
];

function loadList(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function matchesQuery(fields, query) {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return fields.some((f) => String(f ?? '').toLowerCase().includes(q));
}

/**
 * Search patients, staff, and doctors from localStorage (with defaults).
 * @returns {{ type, id, title, subtitle, path, highlight }[]}
 */
export function searchAdminDirectory(query, limit = 10) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const patients = loadList('clinicdesk_patients', DEFAULT_PATIENTS);
  const staff = loadList('clinicdesk_staff', DEFAULT_STAFF);
  const doctors = loadList('clinicdesk_doctors', DEFAULT_DOCTORS);

  const results = [];

  patients.forEach((p) => {
    if (matchesQuery([p.name, p.id, p.email, p.phone, p.doctor, p.status], q)) {
      results.push({
        type: 'patient',
        id: p.id,
        title: p.name,
        subtitle: `${p.id} · ${p.status}`,
        path: ROUTES.ADMIN.PATIENTS,
        highlight: p.name,
      });
    }
  });

  staff.forEach((s) => {
    if (matchesQuery([s.name, s.id, s.role, s.department, s.phone, s.status], q)) {
      results.push({
        type: 'staff',
        id: s.id,
        title: s.name,
        subtitle: `${s.role} · ${s.department}`,
        path: ROUTES.ADMIN.STAFF,
        highlight: s.name,
      });
    }
  });

  doctors.forEach((d) => {
    if (matchesQuery([d.name, d.specialty, d.email, d.phone, d.status, String(d.id)], q)) {
      results.push({
        type: 'doctor',
        id: String(d.id),
        title: d.name,
        subtitle: `${d.specialty} · ${d.status}`,
        path: ROUTES.ADMIN.DOCTORS,
        highlight: d.name,
      });
    }
  });

  return results.slice(0, limit);
}
