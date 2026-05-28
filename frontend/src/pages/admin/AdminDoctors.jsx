import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, Search, Plus, MoreVertical, Star, Calendar, Users, 
  Activity, X, Phone, Mail, Clock, Filter, ChevronDown 
} from 'lucide-react';
import { cn } from '../../utils/cn';

const doctors = [
  { id: 1, name: 'Dr. Sarah Smith', specialty: 'Cardiologist', status: 'Active', patients: 248, rating: 4.9, exp: '12 yrs', phone: '+1 555-0101', email: 'sarah@clinicdesk.com', schedule: 'Mon-Fri' },
  { id: 2, name: 'Dr. John Doe', specialty: 'Neurologist', status: 'Active', patients: 192, rating: 4.7, exp: '8 yrs', phone: '+1 555-0102', email: 'john@clinicdesk.com', schedule: 'Mon-Sat' },
  { id: 3, name: 'Dr. Emily Chen', specialty: 'Pediatrician', status: 'On Leave', patients: 310, rating: 4.8, exp: '15 yrs', phone: '+1 555-0103', email: 'emily@clinicdesk.com', schedule: 'Tue-Sat' },
  { id: 4, name: 'Dr. Michael Brown', specialty: 'Orthopedic', status: 'Active', patients: 175, rating: 4.6, exp: '10 yrs', phone: '+1 555-0104', email: 'michael@clinicdesk.com', schedule: 'Mon-Fri' },
  { id: 5, name: 'Dr. Lisa Wang', specialty: 'Dermatologist', status: 'Active', patients: 220, rating: 4.9, exp: '7 yrs', phone: '+1 555-0105', email: 'lisa@clinicdesk.com', schedule: 'Wed-Sun' },
  { id: 6, name: 'Dr. James Wilson', specialty: 'General', status: 'Inactive', patients: 89, rating: 4.3, exp: '5 yrs', phone: '+1 555-0106', email: 'james@clinicdesk.com', schedule: 'Mon-Thu' },
];

const specialties = ['All', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic', 'Dermatologist', 'General'];
const statuses = ['All', 'Active', 'On Leave', 'Inactive'];

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700 shadow-sm rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-all"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
  </motion.div>
);

const AdminDoctors = () => {
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', specialty: 'Cardiologist', experience: '' });

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialtyFilter === 'All' || d.specialty === specialtyFilter;
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchSearch && matchSpecialty && matchStatus;
  });

  const statusColor = (s) => {
    if (s === 'Active') return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    if (s === 'On Leave') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Doctor Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage doctor profiles, schedules, and assignments.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all">
          <Plus size={18} /> Add Doctor
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Doctors" value="48" icon={Stethoscope} color="bg-blue-500" delay={0.1} />
        <StatCard title="Active Today" value="32" icon={Activity} color="bg-emerald-500" delay={0.15} />
        <StatCard title="On Leave" value="4" icon={Clock} color="bg-amber-500" delay={0.2} />
        <StatCard title="Avg Rating" value="4.7" icon={Star} color="bg-purple-500" delay={0.25} />
      </div>

      {/* Search & Filters */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700 shadow-sm rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search doctors by name or specialty..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>
          <div className="flex gap-3">
            <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500">
              {specialties.map(s => <option key={s} value={s}>{s === 'All' ? 'All Specialties' : s}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500">
              {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Table */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patients</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-sm text-blue-600 shrink-0">
                        {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800 dark:text-white">{doc.name}</p>
                        <p className="text-xs text-slate-400">{doc.exp} experience</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{doc.specialty}</td>
                  <td className="px-6 py-4"><span className={cn("text-xs font-bold px-2.5 py-1 rounded-lg", statusColor(doc.status))}>{doc.status}</span></td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{doc.patients}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{doc.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><Calendar size={14} />{doc.schedule}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-400">
            <Stethoscope size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No doctors found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Doctor</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input type="text" placeholder="Dr. Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Email</label>
                    <input type="email" placeholder="doctor@clinic.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Phone</label>
                    <input type="tel" placeholder="+1 555-0100" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Specialty</label>
                    <select value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                      {specialties.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Experience</label>
                    <input type="text" placeholder="e.g. 10 yrs" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all">Save Doctor</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDoctors;
