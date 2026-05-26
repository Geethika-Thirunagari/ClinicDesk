import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Mail, Phone, MapPin, Shield, Save, Camera } from 'lucide-react';
import { cn } from '../../utils/cn';

const PatientProfile = () => {
  const [tab, setTab] = useState('personal');
  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'medical', label: 'Medical Info' },
    { id: 'emergency', label: 'Emergency Contact' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal and medical information.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-300">AJ</div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"><Camera size={14} /></button>
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Alice Johnson</h2>
          <p className="text-sm text-slate-500 font-mono">PT-1024</p>
          <div className="flex flex-wrap gap-3 mt-2 justify-center sm:justify-start">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Mail size={12} /> alice.j@email.com</span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Phone size={12} /> +1 555-1021</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("flex-1 py-2.5 rounded-xl text-sm font-bold transition-all", tab === t.id ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
        {tab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ l: 'Full Name', v: 'Alice Johnson' }, { l: 'Date of Birth', v: '1990-03-15' }, { l: 'Gender', v: 'Female' }, { l: 'Blood Group', v: 'O+' }, { l: 'Phone', v: '+1 555-1021' }, { l: 'Email', v: 'alice.j@email.com' }, { l: 'Address', v: '123 Main St, Brooklyn, NY 10001' }].map(f => (
              <div key={f.l}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{f.l}</label>
                <input type="text" defaultValue={f.v} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>
            ))}
          </div>
        )}
        {tab === 'medical' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ l: 'Allergies', v: 'Penicillin, Shellfish' }, { l: 'Chronic Conditions', v: 'Hypertension, Pre-diabetes' }, { l: 'Current Medications', v: 'Lisinopril, Metformin, Aspirin' }, { l: 'Insurance Provider', v: 'Blue Cross Blue Shield' }, { l: 'Policy Number', v: 'BCBS-9281043' }].map(f => (
              <div key={f.l}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{f.l}</label>
                <input type="text" defaultValue={f.v} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>
            ))}
          </div>
        )}
        {tab === 'emergency' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ l: 'Contact Name', v: 'Robert Johnson' }, { l: 'Relationship', v: 'Spouse' }, { l: 'Phone Number', v: '+1 555-2045' }, { l: 'Email', v: 'robert.j@email.com' }].map(f => (
              <div key={f.l}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{f.l}</label>
                <input type="text" defaultValue={f.v} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 flex justify-end">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default PatientProfile;
