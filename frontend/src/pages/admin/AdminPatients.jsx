import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, MoreVertical, Calendar, Activity, Clock, Heart, X, Phone, Mail, Fingerprint } from 'lucide-react';
import { cn } from '../../utils/cn';

const initialPatients = [
  { id: 'PT-1001', name: 'Alice Johnson', age: 34, gender: 'Female', phone: '+1 555-2001', email: 'alice@mail.com', bloodGroup: 'A+', lastVisit: '2026-05-18', status: 'Active', doctor: 'Dr. Sarah Smith' },
  { id: 'PT-1002', name: 'Robert Williams', age: 58, gender: 'Male', phone: '+1 555-2002', email: 'robert@mail.com', bloodGroup: 'O-', lastVisit: '2026-05-15', status: 'Active', doctor: 'Dr. John Doe' },
  { id: 'PT-1003', name: 'Maria Garcia', age: 27, gender: 'Female', phone: '+1 555-2003', email: 'maria@mail.com', bloodGroup: 'B+', lastVisit: '2026-05-10', status: 'Discharged', doctor: 'Dr. Emily Chen' },
  { id: 'PT-1004', name: 'David Lee', age: 45, gender: 'Male', phone: '+1 555-2004', email: 'david@mail.com', bloodGroup: 'AB+', lastVisit: '2026-05-20', status: 'Critical', doctor: 'Dr. Sarah Smith' },
  { id: 'PT-1005', name: 'Emma Brown', age: 12, gender: 'Female', phone: '+1 555-2005', email: 'emma.parent@mail.com', bloodGroup: 'A-', lastVisit: '2026-05-19', status: 'Active', doctor: 'Dr. Emily Chen' },
  { id: 'PT-1006', name: 'James Taylor', age: 67, gender: 'Male', phone: '+1 555-2006', email: 'james.t@mail.com', bloodGroup: 'O+', lastVisit: '2026-04-28', status: 'Inactive', doctor: 'Dr. Michael Brown' },
];

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
    className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-800">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-xl", color)}><Icon size={22} className="text-white" /></div>
    </div>
  </motion.div>
);

const AdminPatients = () => {
  const [patientsList, setPatientsList] = useState(initialPatients);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  
  const generateId = () => `PT-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const [formData, setFormData] = useState({ id: '', name: '', email: '', phone: '', dob: '', gender: 'Male', bloodGroup: 'A+', address: '' });

  const statusOptions = ['All', 'Active', 'Critical', 'Discharged', 'Inactive'];
  const filtered = patientsList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColor = (s) => {
    if (s === 'Active') return 'bg-emerald-100 text-emerald-700';
    if (s === 'Critical') return 'bg-rose-100 text-rose-700';
    if (s === 'Discharged') return 'bg-blue-100 text-blue-700';
    return 'bg-slate-100 text-slate-500';
  };

  const handleOpenModal = () => {
    setFormData({ id: generateId(), name: '', email: '', phone: '', dob: '', gender: 'Male', bloodGroup: 'A+', address: '' });
    setShowModal(true);
  };

  const handleRegisterPatient = () => {
    const age = formData.dob ? new Date().getFullYear() - new Date(formData.dob).getFullYear() : 0;
    const newPatient = {
      id: formData.id,
      name: formData.name || 'Unknown Patient',
      age: age || '-',
      gender: formData.gender,
      phone: formData.phone || '-',
      email: formData.email || '-',
      bloodGroup: formData.bloodGroup,
      lastVisit: 'New Registration',
      status: 'Active',
      doctor: 'Unassigned',
    };
    
    setPatientsList([newPatient, ...patientsList]);
    setShowModal(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">Patient Management</h1>
          <p className="text-sm text-slate-500 mt-1">View, register, and manage all patient records.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleOpenModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all">
          <Plus size={18} /> Register Patient
        </motion.button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value={patientsList.length.toLocaleString()} icon={Users} color="bg-blue-500" delay={0.1} />
        <StatCard title="New This Month" value="148" icon={Plus} color="bg-emerald-500" delay={0.15} />
        <StatCard title="Critical Cases" value={patientsList.filter(p => p.status === 'Critical').length} icon={Heart} color="bg-rose-500" delay={0.2} />
        <StatCard title="Avg Wait Time" value="14m" icon={Clock} color="bg-amber-500" delay={0.25} />
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by name or patient ID..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500">
            {statusOptions.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age / Gender</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blood</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Doctor</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pt, i) => (
                <motion.tr key={pt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center font-bold text-sm text-indigo-600 shrink-0">
                        {pt.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800">{pt.name}</p>
                        <p className="text-xs text-slate-400">{pt.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-slate-600">{pt.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{pt.age} / {pt.gender}</td>
                  <td className="px-6 py-4"><span className="text-xs font-bold px-2 py-1 rounded-lg bg-red-50 text-red-600">{pt.bloodGroup}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-500">{pt.lastVisit}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{pt.doctor}</td>
                  <td className="px-6 py-4"><span className={cn("text-xs font-bold px-2.5 py-1 rounded-lg", statusColor(pt.status))}>{pt.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
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
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No patients found.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Register New Patient</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><X size={20} /></button>
              </div>
              
              <div className="space-y-5">
                
                {/* Auto-generated ID Field */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Generated Patient ID</p>
                    <p className="text-lg font-mono font-bold text-blue-700 flex items-center gap-2">
                      <Fingerprint size={18} className="text-blue-500" />
                      {formData.id}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg">Auto-assigned</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input type="text" placeholder="Patient full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Email</label>
                    <input type="email" placeholder="patient@mail.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Phone</label>
                    <input type="tel" placeholder="+1 555-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Date of Birth</label>
                    <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Gender</label>
                    <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Blood Group</label>
                    <select value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Address</label>
                  <textarea placeholder="Full address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 custom-scrollbar" />
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleRegisterPatient} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2">
                  <Plus size={18} /> Register Patient
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminPatients;
