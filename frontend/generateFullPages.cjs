const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'pages');

const pages = [
  // Admin
  { path: 'admin/AdminDashboard.jsx', title: 'Admin Dashboard', desc: 'Overview of system metrics.' },
  { path: 'admin/AdminDoctors.jsx', title: 'Doctor Management', desc: 'Manage doctor profiles and schedules.' },
  { path: 'admin/AdminPatients.jsx', title: 'Patient Management', desc: 'View and manage all registered patients.' },
  { path: 'admin/AdminRevenue.jsx', title: 'Revenue Analytics', desc: 'Financial reports and revenue charts.' },
  { path: 'admin/AdminReports.jsx', title: 'System Reports', desc: 'Generate system usage and operational reports.' },
  { path: 'admin/AdminSettings.jsx', title: 'System Settings', desc: 'Configure global clinic settings.' },

  // Doctor
  { path: 'doctor/DoctorDashboard.jsx', title: 'Doctor Dashboard', desc: 'Your schedule and recent updates.' },
  { path: 'doctor/DoctorAppointments.jsx', title: "Today's Appointments", desc: 'View and manage your appointments.' },
  { path: 'doctor/DoctorRecords.jsx', title: 'Patient Records', desc: 'Access medical histories and EMR.' },
  { path: 'doctor/DoctorPrescriptions.jsx', title: 'Prescriptions', desc: 'Write and renew prescriptions.' },
  { path: 'doctor/DoctorSchedule.jsx', title: 'Schedule Management', desc: 'Manage your availability and shifts.' },
  { path: 'doctor/DoctorNotifications.jsx', title: 'Notifications', desc: 'Alerts and messages.' },

  // Receptionist
  { path: 'reception/ReceptionDashboard.jsx', title: 'Reception Dashboard', desc: 'Overview of front desk operations.' },
  { path: 'reception/ReceptionBooking.jsx', title: 'Appointment Booking', desc: 'Book new appointments.' },
  { path: 'reception/ReceptionQueue.jsx', title: 'Queue Management', desc: 'Manage the live patient queue.' },
  { path: 'reception/ReceptionBilling.jsx', title: 'Billing', desc: 'Process payments and invoices.' },
  { path: 'reception/ReceptionRegistration.jsx', title: 'Patient Registration', desc: 'Register new patients to the system.' },

  // Patient
  { path: 'patient/PatientDashboard.jsx', title: 'Patient Dashboard', desc: 'Welcome back. Here is your health overview.' },
  { path: 'patient/PatientBook.jsx', title: 'Book Appointment', desc: 'Schedule a visit with a doctor.' },
  { path: 'patient/PatientHistory.jsx', title: 'Medical History', desc: 'View your past visits and records.' },
  { path: 'patient/PatientPrescriptions.jsx', title: 'My Prescriptions', desc: 'Active and past prescriptions.' },
  { path: 'patient/PatientPayments.jsx', title: 'Payments', desc: 'View invoices and make payments.' },
  { path: 'patient/PatientNotifications.jsx', title: 'Notifications', desc: 'Important alerts from your clinic.' },
  { path: 'patient/PatientProfile.jsx', title: 'Profile Settings', desc: 'Update your personal information.' },
];

pages.forEach(page => {
  const fullPath = path.join(baseDir, page.path);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const componentName = path.basename(page.path, '.jsx');
  const content = `import React from 'react';
import { motion } from 'framer-motion';

const ${componentName} = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">${page.title}</h1>
        <p className="text-slate-500">${page.desc}</p>
        
        <div className="mt-8 p-12 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
          <p>Under Construction</p>
          <span className="text-xs mt-2">Premium UI coming soon</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ${componentName};
`;

  // Always overwrite to ensure uniform framer-motion stubs for this architecture pass
  fs.writeFileSync(fullPath, content);
  console.log(`Created ${page.path}`);
});
