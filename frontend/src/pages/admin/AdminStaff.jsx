import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact, Search, Plus, MoreVertical, Briefcase, Clock, Phone, X, Filter, Trash2, Edit2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const initialStaff = [
  { id: 'ST-201', name: 'James Wilson', role: 'Nurse', shift: 'Morning (08:00 - 16:00)', department: 'ICU', status: 'On Duty', phone: '+1 555-1234' },
  { id: 'ST-202', name: 'Lisa Ray', role: 'Head Nurse', shift: 'Morning (08:00 - 16:00)', department: 'Cardiology', status: 'On Duty', phone: '+1 555-1235' },
  { id: 'ST-203', name: 'Mark Taylor', role: 'Technician', shift: 'Evening (16:00 - 00:00)', department: 'Radiology', status: 'Off Duty', phone: '+1 555-1236' },
  { id: 'ST-204', name: 'Emma Brown', role: 'Receptionist', shift: 'Morning (08:00 - 16:00)', department: 'Front Desk', status: 'On Duty', phone: '+1 555-1237' },
  { id: 'ST-205', name: 'Tom Hardy', role: 'Janitor', shift: 'Night (00:00 - 08:00)', department: 'Maintenance', status: 'Leave', phone: '+1 555-1238' },
];

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
    className="cd-card p-5 relative overflow-hidden group hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-2xl font-extrabold text-[#0a1a0f] ">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-xl", color)}><Icon size={22} className="text-white" /></div>
    </div>
  </motion.div>
);

const AdminStaff = () => {
  const location = useLocation();
  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('clinicdesk_staff');
    return saved ? JSON.parse(saved) : initialStaff;
  });

  useEffect(() => {
    localStorage.setItem('clinicdesk_staff', JSON.stringify(staff));
  }, [staff]);

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (location.state?.search) {
      setSearch(location.state.search);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', role: 'Nurse', shift: 'Morning (08:00 - 16:00)', department: 'ICU', phone: '' });

  const handleSaveStaff = () => {
    if (formData.id) {
      setStaff(staff.map(s => s.id === formData.id ? { ...s, ...formData } : s));
    } else {
      const newId = `ST-${200 + staff.length + 1}`;
      const newStaff = {
        id: newId,
        name: formData.name || 'Unknown',
        role: formData.role,
        shift: formData.shift,
        department: formData.department,
        status: 'On Duty',
        phone: formData.phone || 'N/A'
      };
      setStaff([newStaff, ...staff]);
    }
    setFormData({ id: null, name: '', role: 'Nurse', shift: 'Morning (08:00 - 16:00)', department: 'ICU', phone: '' });
    setShowModal(false);
  };

  const handleEditStaff = (s) => {
    setFormData({ id: s.id, name: s.name, role: s.role, shift: s.shift, department: s.department, phone: s.phone });
    setShowModal(true);
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm("Remove this staff member?")) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s) => {
    if (s === 'On Duty') return 'bg-emerald-100 text-emerald-700 ';
    if (s === 'Off Duty') return 'bg-slate-100 text-slate-600 ';
    if (s === 'Leave') return 'bg-amber-100 text-amber-700 ';
    return 'bg-slate-100 text-slate-500 ';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 font-['Outfit']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">Staff Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage hospital staff, roles, and shifts.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setFormData({ id: null, name: '', role: 'Nurse', shift: 'Morning (08:00 - 16:00)', department: 'ICU', phone: '' }); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all">
          <Plus size={18} /> Add Staff
        </motion.button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={staff.length} icon={Contact} color="bg-blue-500" delay={0.1} />
        <StatCard title="On Duty" value={staff.filter(s => s.status === 'On Duty').length} icon={Clock} color="bg-emerald-500" delay={0.15} />
        <StatCard title="Off Duty" value={staff.filter(s => s.status === 'Off Duty').length} icon={Briefcase} color="bg-slate-500" delay={0.2} />
        <StatCard title="On Leave" value={staff.filter(s => s.status === 'Leave').length} icon={Filter} color="bg-amber-500" delay={0.25} />
      </div>

      <div className="cd-card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by name, role, or department..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all :text-slate-500" />
          </div>
        </div>
      </div>

      <div className="cd-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 ">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role &amp; Dept</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shift</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 hover:bg-blue-50/30 :bg-blue-900/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-600 ">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#0a1a0f] ">{s.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-700 ">{s.role}</p>
                    <p className="text-xs text-slate-500 ">{s.department}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 ">{s.shift}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 ">{s.phone}</td>
                  <td className="px-6 py-4"><span className={cn("text-xs font-bold px-2.5 py-1 rounded-lg", statusColor(s.status))}>{s.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); handleEditStaff(s); }} className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteStaff(s.id); }} className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0a1a0f] ">{formData.id ? "Edit Staff" : "Add New Staff"}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><X size={20} /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input type="text" placeholder="Staff Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Role</label>
                    <input type="text" placeholder="e.g. Nurse" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Department</label>
                    <input type="text" placeholder="e.g. Cardiology" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Shift</label>
                    <select value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Morning (08:00 - 16:00)</option><option>Evening (16:00 - 00:00)</option><option>Night (00:00 - 08:00)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Phone Number</label>
                    <input type="tel" placeholder="+1 555-0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleSaveStaff} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2">
                  <Plus size={18} /> {formData.id ? "Save Changes" : "Save Staff"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminStaff;
