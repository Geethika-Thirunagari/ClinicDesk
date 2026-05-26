// Mock EMR data — replace with real API calls using the service layer

export const MOCK_PATIENTS = [
  {
    id: 'P001',
    name: 'Michael Roberts',
    age: 45,
    dob: '1979-03-12',
    gender: 'Male',
    blood: 'A+',
    phone: '+1 555-0101',
    email: 'michael.roberts@email.com',
    address: '123 Oak Avenue, Springfield, IL 62701',
    emergency: 'Lisa Roberts (+1 555-0199)',
    insurance: 'BlueCross BlueShield — #BC123456',
    avatar: 'https://i.pravatar.cc/128?img=11',
    allergies: ['Penicillin', 'Sulfa drugs'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    assignedDoctor: 'Dr. Sarah Smith',
  },
  {
    id: 'P002',
    name: 'Sarah Connor',
    age: 34,
    dob: '1990-07-22',
    gender: 'Female',
    blood: 'O-',
    phone: '+1 555-0102',
    email: 'sarah.connor@email.com',
    address: '456 Maple Street, Chicago, IL 60601',
    emergency: 'John Connor (+1 555-0198)',
    insurance: 'Aetna — #AE789012',
    avatar: 'https://i.pravatar.cc/128?img=47',
    allergies: ['Aspirin'],
    conditions: ['Migraine', 'Anxiety'],
    assignedDoctor: 'Dr. James Wilson',
  },
  {
    id: 'P003',
    name: 'William Brown',
    age: 67,
    dob: '1957-11-05',
    gender: 'Male',
    blood: 'B+',
    phone: '+1 555-0103',
    email: 'william.brown@email.com',
    address: '789 Pine Road, Rockford, IL 61101',
    emergency: 'Mary Brown (+1 555-0197)',
    insurance: 'Medicare — #MC345678',
    avatar: 'https://i.pravatar.cc/128?img=52',
    allergies: [],
    conditions: ['COPD', 'Arthritis', 'Hypertension'],
    assignedDoctor: 'Dr. Emily Davis',
  },
];

export const MOCK_MEDICAL_HISTORY = {
  P001: [
    { id: 'H1', date: '2024-08-10', diagnosis: 'Hypertensive Crisis', doctor: 'Dr. Sarah Smith', facility: 'ClinicDesk Main', notes: 'BP 180/120. Started Amlodipine 5mg.' },
    { id: 'H2', date: '2024-03-15', diagnosis: 'Type 2 Diabetes Mellitus', doctor: 'Dr. Sarah Smith', facility: 'ClinicDesk Main', notes: 'HbA1c 8.2%. Started Metformin 500mg BD.' },
    { id: 'H3', date: '2023-06-20', diagnosis: 'Community-Acquired Pneumonia', doctor: 'Dr. James Wilson', facility: 'ClinicDesk East', notes: 'Chest X-ray confirmed. Azithromycin 5-day course.' },
  ],
  P002: [
    { id: 'H4', date: '2025-01-14', diagnosis: 'Chronic Migraine', doctor: 'Dr. James Wilson', facility: 'ClinicDesk Main', notes: 'MRI normal. Topiramate 25mg prophylaxis.' },
    { id: 'H5', date: '2024-09-08', diagnosis: 'Generalised Anxiety Disorder', doctor: 'Dr. Emily Davis', facility: 'ClinicDesk West', notes: 'PHQ-9 score 14. Referred to CBT.' },
  ],
  P003: [
    { id: 'H6', date: '2025-02-20', diagnosis: 'COPD Exacerbation', doctor: 'Dr. Emily Davis', facility: 'ClinicDesk Main', notes: 'SpO2 88% on admission. Nebulisers & steroids.' },
    { id: 'H7', date: '2024-07-11', diagnosis: 'Rheumatoid Arthritis', doctor: 'Dr. Robert Brown', facility: 'ClinicDesk Main', notes: 'RF positive. Started Methotrexate.' },
  ],
};

export const MOCK_PRESCRIPTIONS = {
  P001: [
    { id: 'Rx1', date: '2025-04-01', medication: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: 'Ongoing', doctor: 'Dr. Sarah Smith', status: 'active' },
    { id: 'Rx2', date: '2025-04-01', medication: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: 'Ongoing', doctor: 'Dr. Sarah Smith', status: 'active' },
    { id: 'Rx3', date: '2024-06-20', medication: 'Azithromycin', dosage: '500mg', frequency: 'Once daily', duration: '5 days', doctor: 'Dr. James Wilson', status: 'completed' },
  ],
  P002: [
    { id: 'Rx4', date: '2025-01-14', medication: 'Topiramate', dosage: '25mg', frequency: 'Once daily at night', duration: 'Ongoing', doctor: 'Dr. James Wilson', status: 'active' },
    { id: 'Rx5', date: '2024-09-08', medication: 'Sertraline', dosage: '50mg', frequency: 'Once daily', duration: '3 months', doctor: 'Dr. Emily Davis', status: 'completed' },
  ],
  P003: [
    { id: 'Rx6', date: '2025-02-20', medication: 'Salbutamol Inhaler', dosage: '100mcg', frequency: 'PRN', duration: 'Ongoing', doctor: 'Dr. Emily Davis', status: 'active' },
    { id: 'Rx7', date: '2024-07-11', medication: 'Methotrexate', dosage: '7.5mg', frequency: 'Once weekly', duration: 'Ongoing', doctor: 'Dr. Robert Brown', status: 'active' },
  ],
};

export const MOCK_LAB_REPORTS = {
  P001: [
    { id: 'L1', date: '2025-04-10', test: 'HbA1c', result: '7.1%', reference: '< 7.0%', status: 'high', orderedBy: 'Dr. Sarah Smith' },
    { id: 'L2', date: '2025-04-10', test: 'Fasting Blood Glucose', result: '126 mg/dL', reference: '70–99 mg/dL', status: 'high', orderedBy: 'Dr. Sarah Smith' },
    { id: 'L3', date: '2025-04-10', test: 'LDL Cholesterol', result: '98 mg/dL', reference: '< 100 mg/dL', status: 'normal', orderedBy: 'Dr. Sarah Smith' },
    { id: 'L4', date: '2025-04-10', test: 'eGFR', result: '82 mL/min', reference: '> 60 mL/min', status: 'normal', orderedBy: 'Dr. Sarah Smith' },
  ],
  P002: [
    { id: 'L5', date: '2025-01-15', test: 'MRI Brain', result: 'No abnormalities', reference: '—', status: 'normal', orderedBy: 'Dr. James Wilson' },
    { id: 'L6', date: '2025-01-15', test: 'CBC', result: 'WBC 6.2, RBC 4.5, Hb 13.1', reference: 'Within range', status: 'normal', orderedBy: 'Dr. James Wilson' },
  ],
  P003: [
    { id: 'L7', date: '2025-02-21', test: 'Spirometry (FEV1)', result: '52% predicted', reference: '> 80%', status: 'low', orderedBy: 'Dr. Emily Davis' },
    { id: 'L8', date: '2025-02-21', test: 'Chest X-Ray', result: 'Hyperinflation, flattened diaphragm', reference: '—', status: 'high', orderedBy: 'Dr. Emily Davis' },
  ],
};

export const MOCK_TIMELINE = {
  P001: [
    { id: 'T1', date: '2025-04-10', type: 'lab',          icon: 'flask',    label: 'Lab results reviewed',          detail: 'HbA1c improved. Continue current medications.' },
    { id: 'T2', date: '2025-04-01', type: 'prescription', icon: 'pill',     label: 'Prescription renewed',          detail: 'Amlodipine & Metformin refilled for 3 months.' },
    { id: 'T3', date: '2024-12-15', type: 'appointment',  icon: 'calendar', label: 'Quarterly review',              detail: 'BP stable 130/82. Weight 84 kg. Good compliance.' },
    { id: 'T4', date: '2024-08-10', type: 'emergency',    icon: 'alert',    label: 'Emergency visit — Hypertensive Crisis', detail: 'Managed with IV Labetalol. Discharged next day.' },
    { id: 'T5', date: '2024-03-15', type: 'diagnosis',    icon: 'clipboard', label: 'New diagnosis — T2 Diabetes', detail: 'HbA1c 8.2%. Diet counselling initiated.' },
  ],
  P002: [
    { id: 'T6', date: '2025-01-14', type: 'diagnosis',    icon: 'clipboard', label: 'Chronic migraine confirmed',  detail: 'Topiramate prophylaxis started.' },
    { id: 'T7', date: '2024-09-08', type: 'appointment',  icon: 'calendar', label: 'Mental health consult',        detail: 'GAD-7 score 12. Referred for CBT therapy.' },
  ],
  P003: [
    { id: 'T8', date: '2025-02-20', type: 'emergency',    icon: 'alert',    label: 'COPD exacerbation admitted',   detail: 'O2 therapy, Prednisolone 40mg. Discharged D5.' },
    { id: 'T9', date: '2024-07-11', type: 'diagnosis',    icon: 'clipboard', label: 'RA confirmed',                detail: 'RF 64 IU/mL. Rheumatology referral.' },
  ],
};

export const MOCK_AUDIT_LOGS = {
  P001: [
    { id: 'A1', timestamp: '2025-04-10 09:42:11', user: 'Dr. Sarah Smith', role: 'doctor', action: 'Viewed patient record',        ip: '192.168.1.10' },
    { id: 'A2', timestamp: '2025-04-10 09:44:02', user: 'Dr. Sarah Smith', role: 'doctor', action: 'Added lab results',            ip: '192.168.1.10' },
    { id: 'A3', timestamp: '2025-04-01 11:15:33', user: 'Dr. Sarah Smith', role: 'doctor', action: 'Created prescription',         ip: '192.168.1.10' },
    { id: 'A4', timestamp: '2025-03-28 08:30:05', user: 'Admin User',      role: 'admin',  action: 'Exported patient report',      ip: '192.168.1.1'  },
    { id: 'A5', timestamp: '2025-03-20 14:22:17', user: 'Nurse Janet',     role: 'nurse',  action: 'Updated vitals',               ip: '192.168.1.22' },
  ],
  P002: [
    { id: 'A6', timestamp: '2025-01-15 10:10:00', user: 'Dr. James Wilson', role: 'doctor', action: 'Viewed patient record', ip: '192.168.1.11' },
    { id: 'A7', timestamp: '2025-01-15 10:15:44', user: 'Dr. James Wilson', role: 'doctor', action: 'Added diagnosis',       ip: '192.168.1.11' },
  ],
  P003: [
    { id: 'A8', timestamp: '2025-02-21 07:58:33', user: 'Dr. Emily Davis', role: 'doctor', action: 'Viewed patient record',  ip: '192.168.1.12' },
    { id: 'A9', timestamp: '2025-02-21 08:05:19', user: 'Dr. Emily Davis', role: 'doctor', action: 'Updated medical history', ip: '192.168.1.12' },
  ],
};
