const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend', 'src', 'pages');

const filesToCreate = [
  'admin/AdminDashboard.jsx',
  'admin/AdminDoctors.jsx',
  'admin/AdminPatients.jsx',
  'doctor/DoctorDashboard.jsx',
  'doctor/DoctorSchedule.jsx',
  'doctor/DoctorPatients.jsx',
  'patient/PatientDashboard.jsx',
  'patient/PatientAppointments.jsx',
  'patient/PatientRecords.jsx',
  'Unauthorized.jsx',
  'NotFound.jsx',
];

filesToCreate.forEach(file => {
  const fullPath = path.join(baseDir, file);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const componentName = path.basename(file, '.jsx');
  const content = `import React from 'react';

const ${componentName} = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800">${componentName}</h1>
      <p className="text-slate-500 mt-2">This page is under construction.</p>
    </div>
  );
};

export default ${componentName};
`;

  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content);
    console.log(`Created ${file}`);
  } else {
    console.log(`Skipped ${file} (already exists)`);
  }
});
