import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, FileText, ShieldAlert } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuthStore } from '../store/useAuthStore';
import {
  MOCK_PATIENTS,
  MOCK_MEDICAL_HISTORY,
  MOCK_PRESCRIPTIONS,
  MOCK_LAB_REPORTS,
  MOCK_TIMELINE,
  MOCK_AUDIT_LOGS,
} from '../data/emrMocks';
import PatientProfile from '../components/emr/PatientProfile';
import MedicalHistory from '../components/emr/MedicalHistory';
import Prescriptions from '../components/emr/Prescriptions';
import LabReports from '../components/emr/LabReports';
import TreatmentTimeline from '../components/emr/TreatmentTimeline';
import AuditLog from '../components/emr/AuditLog';

const TABS = ['Medical History', 'Prescriptions', 'Lab Reports', 'Timeline', 'Audit Log'];

// Role-based tab visibility
const ROLE_TABS = {
  admin:   ['Medical History', 'Prescriptions', 'Lab Reports', 'Timeline', 'Audit Log'],
  doctor:  ['Medical History', 'Prescriptions', 'Lab Reports', 'Timeline'],
  patient: ['Medical History', 'Prescriptions', 'Lab Reports'],
  nurse:   ['Medical History', 'Lab Reports'],
};

const MedicalRecords = () => {
  const { user } = useAuthStore();
  const role = user?.role || 'doctor'; // default to doctor for dev

  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(MOCK_PATIENTS[0]);
  const [activeTab, setActiveTab] = useState('Medical History');

  const allowedTabs = ROLE_TABS[role] || ROLE_TABS.doctor;

  const filteredPatients = useMemo(() =>
    MOCK_PATIENTS.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const pid = selectedPatient?.id;

  const renderTab = () => {
    switch (activeTab) {
      case 'Medical History':
        return <MedicalHistory records={MOCK_MEDICAL_HISTORY[pid] || []} delay={0.1} />;
      case 'Prescriptions':
        return <Prescriptions prescriptions={MOCK_PRESCRIPTIONS[pid] || []} delay={0.1} />;
      case 'Lab Reports':
        return <LabReports reports={MOCK_LAB_REPORTS[pid] || []} delay={0.1} />;
      case 'Timeline':
        return <TreatmentTimeline events={MOCK_TIMELINE[pid] || []} delay={0.1} />;
      case 'Audit Log':
        return role === 'admin'
          ? <AuditLog logs={MOCK_AUDIT_LOGS[pid] || []} delay={0.1} />
          : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <ShieldAlert size={40} className="text-rose-300" />
              <p className="font-semibold text-slate-500">Access Restricted</p>
              <p className="text-sm">Audit logs are only available to administrators.</p>
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-slate-800"
          >
            Electronic Medical Records
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-sm text-slate-500 mt-1"
          >
            Securely view and manage patient health records.
          </motion.p>
        </div>
        {/* Role badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold shrink-0',
            role === 'admin' ? 'bg-purple-50 border-purple-200 text-purple-700'
              : role === 'doctor' ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          )}
        >
          <FileText size={14} />
          Access: {role.charAt(0).toUpperCase() + role.slice(1)}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          className="lg:col-span-1 space-y-3"
        >
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-4">
            <div className="relative mb-3">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patients..."
                className="pl-9 pr-3 h-9 w-full rounded-xl border border-slate-200 bg-white/60 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-1.5 max-h-[calc(100vh-360px)] overflow-y-auto custom-scrollbar">
              {filteredPatients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPatient(p); setActiveTab('Medical History'); }}
                  className={cn(
                    'w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all',
                    selectedPatient?.id === p.id
                      ? 'bg-blue-500 shadow-md shadow-blue-500/20'
                      : 'hover:bg-white/60'
                  )}
                >
                  <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover shrink-0 border-2 border-white shadow-sm" />
                  <div className="min-w-0">
                    <p className={cn('text-sm font-semibold truncate', selectedPatient?.id === p.id ? 'text-white' : 'text-slate-800')}>
                      {p.name}
                    </p>
                    <p className={cn('text-xs truncate', selectedPatient?.id === p.id ? 'text-blue-100' : 'text-slate-400')}>
                      {p.id} &middot; {p.age}y
                    </p>
                  </div>
                  <ChevronRight size={14} className={cn('ml-auto shrink-0', selectedPatient?.id === p.id ? 'text-white' : 'text-slate-300')} />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <div className="lg:col-span-3 space-y-5">
          {/* Profile Card */}
          <PatientProfile patient={selectedPatient} delay={0.1} />

          {/* Tabs */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-1.5 flex gap-1 flex-wrap">
            {TABS.filter((t) => allowedTabs.includes(t)).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 min-w-fit px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                  activeTab === tab
                    ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div key={`${pid}-${activeTab}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {renderTab()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
