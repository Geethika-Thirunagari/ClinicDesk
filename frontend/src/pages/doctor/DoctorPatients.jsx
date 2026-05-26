import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, User, Calendar, FileText, CheckCircle, 
  ChevronRight, Stethoscope, Mail, Phone, Heart, Activity
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

const mockPatients = [
  { id: 'PT-1024', name: 'Alice Johnson', age: 28, gender: 'Female', email: 'alice@example.com', phone: '+1 555-0192', lastVisit: '2026-05-19', condition: 'Mild Hypertension', bloodGroup: 'O+' },
  { id: 'PT-2910', name: 'Robert Williams', age: 45, gender: 'Male', email: 'robert@example.com', phone: '+1 555-0348', lastVisit: '2026-05-18', condition: 'Type-2 Diabetes', bloodGroup: 'A+' },
  { id: 'PT-8821', name: 'Maria Garcia', age: 34, gender: 'Female', email: 'maria@example.com', phone: '+1 555-0811', lastVisit: '2026-05-15', condition: 'Contact Dermatitis', bloodGroup: 'B-' },
  { id: 'PT-4491', name: 'David Lee', age: 52, gender: 'Male', email: 'david@example.com', phone: '+1 555-0239', lastVisit: '2026-05-14', condition: 'Lipid Management', bloodGroup: 'AB+' },
  { id: 'PT-1122', name: 'Emma Brown', age: 19, gender: 'Female', email: 'emma@example.com', phone: '+1 555-0672', lastVisit: '2026-05-10', condition: 'Post-Op Recovery', bloodGroup: 'O-' },
];

const DoctorPatients = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedGender, setSelectedGender] = useState('All');

  const filteredPatients = mockPatients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.id.toLowerCase().includes(search.toLowerCase()) ||
                          p.condition.toLowerCase().includes(search.toLowerCase());
    const matchesGender = selectedGender === 'All' || p.gender === selectedGender;
    return matchesSearch && matchesGender;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-4 lg:p-8 min-h-screen"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Patient Directory</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and view details for all patients assigned under your care.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, ID, or condition..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
          />
        </div>

        {/* Gender Filter */}
        <div className="flex gap-2 items-center">
          <Filter size={16} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender:</span>
          {['All', 'Male', 'Female'].map(g => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                selectedGender === g 
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((p, i) => (
            <motion.div 
              key={p.id} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm hover:shadow-md rounded-2xl p-6 flex flex-col justify-between transition-all relative overflow-hidden group"
            >
              {/* Blood Group indicator tag */}
              <div className="absolute right-4 top-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-lg">
                BG: {p.bloodGroup}
              </div>

              {/* Bio Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/15">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 dark:text-white leading-tight">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-mono">{p.id} • {p.gender}, {p.age} yrs</p>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-slate-400" />
                    <span>Primary Diagnosis: <strong className="text-slate-700 dark:text-slate-350">{p.condition}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span>Last Consulted: <span className="font-mono text-slate-600 dark:text-slate-450">{p.lastVisit}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span>{p.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    <span>{p.phone}</span>
                  </div>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-2 gap-2 mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <button
                  onClick={() => navigate('/doctor/records')}
                  className="py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-150 dark:border-slate-850 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText size={14} /> EMR History
                </button>
                <button
                  onClick={() => navigate('/doctor/prescriptions')}
                  className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
                >
                  <Stethoscope size={14} /> Prescribe
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-850 rounded-2xl">
            No patients match your search criteria.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DoctorPatients;
