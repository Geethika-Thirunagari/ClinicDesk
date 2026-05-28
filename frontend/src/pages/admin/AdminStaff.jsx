import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact, Search, Plus, MoreVertical, Briefcase, Clock, Phone, X, Filter } from 'lucide-react';
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
    className="finai-card p-5 relative overflow-hidden group hover:shadow-md transition-all">
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
  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

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
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">Staff Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage hospital staff, roles, and shifts.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all">
          <Plus size={18} /> Add Staff
        </motion.button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value="142" icon={Contact} color="bg-blue-500" delay={0.1} />
        <StatCard title="On Duty" value="48" icon={Clock} color="bg-emerald-500" delay={0.15} />
        <StatCard title="Off Duty" value="89" icon={Briefcase} color="bg-slate-500" delay={0.2} />
        <StatCard title="On Leave" value="5" icon={Filter} color="bg-amber-500" delay={0.25} />
      </div>

      <div className="finai-card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by name, role, or department..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all :text-slate-500" />
          </div>
        </div>
      </div>

      <div className="finai-card overflow-hidden">
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
                    <button className="p-2 rounded-lg text-slate-400 hover:text-slate-700 :text-white hover:bg-slate-100 :bg-slate-700 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminStaff;
