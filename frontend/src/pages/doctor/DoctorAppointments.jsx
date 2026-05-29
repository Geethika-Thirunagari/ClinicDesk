import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Phone, Video, Search, Filter, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const appointments = [
  { id: 'APT-901', time: '09:00 AM', date: 'Today', patient: 'Alice Johnson', type: 'Consultation', mode: 'In-Person', status: 'Completed', contact: '+1 555-1021' },
  { id: 'APT-902', time: '09:45 AM', date: 'Today', patient: 'Robert Williams', type: 'Follow-up', mode: 'In-Person', status: 'In Progress', contact: '+1 555-1022' },
  { id: 'APT-903', time: '11:00 AM', date: 'Today', patient: 'Maria Garcia', type: 'Teleconsult', mode: 'Video', status: 'Upcoming', contact: '+1 555-1023' },
  { id: 'APT-904', time: '11:30 AM', date: 'Today', patient: 'David Lee', type: 'Test Review', mode: 'In-Person', status: 'Upcoming', contact: '+1 555-1024' },
  { id: 'APT-905', time: '02:00 PM', date: 'Today', patient: 'Emma Brown', type: 'Consultation', mode: 'In-Person', status: 'Upcoming', contact: '+1 555-1025' },
  { id: 'APT-906', time: '03:30 PM', date: 'Today', patient: 'James Taylor', type: 'Teleconsult', mode: 'Video', status: 'Cancelled', contact: '+1 555-1026' },
  { id: 'APT-907', time: '09:00 AM', date: 'Tomorrow', patient: 'Sophia Martinez', type: 'Consultation', mode: 'In-Person', status: 'Upcoming', contact: '+1 555-1027' },
];

const DoctorAppointments = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Today');
  const [view, setView] = useState('list'); // 'list' | 'grid'

  const filtered = appointments.filter(a => {
    const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || a.date === filter || a.status === filter;
    return matchSearch && matchFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 ';
      case 'In Progress': return 'bg-blue-100 text-blue-700 ';
      case 'Upcoming': return 'bg-indigo-100 text-indigo-700 ';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 ';
      default: return 'bg-slate-100 text-slate-600 ';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 font-['Outfit']">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your daily schedule and patient visits.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="cd-card p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search patients or ID..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all " />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>Today</option>
            <option>Tomorrow</option>
            <option>Upcoming</option>
            <option>Completed</option>
            <option>All</option>
          </select>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          <button onClick={() => setView('list')} className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all", view === 'list' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 ")}>List</button>
          <button onClick={() => setView('grid')} className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all", view === 'grid' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 ")}>Grid</button>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="cd-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 ">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type & Mode</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((apt, i) => (
                    <motion.tr key={apt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50/50 :bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-[#0a1a0f] ">{apt.time}</p>
                        <p className="text-xs font-semibold text-slate-500 ">{apt.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-xs text-blue-600 ">
                            {apt.patient.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0a1a0f] ">{apt.patient}</p>
                            <p className="text-xs text-slate-500 font-mono">{apt.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-700 ">{apt.type}</p>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 ">
                          {apt.mode === 'Video' ? <Video size={12} className="text-indigo-500" /> : <User size={12} className="text-emerald-500" />}
                          {apt.mode}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                        <Phone size={14} /> {apt.contact}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider", getStatusColor(apt.status))}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {apt.mode === 'Video' && apt.status === 'Upcoming' && (
                          <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 :bg-indigo-500/20 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5">
                            <Video size={14} /> Join
                          </button>
                        )}
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 :text-white hover:bg-slate-100 :bg-slate-800 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center text-slate-400">
                  <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No appointments found.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((apt, i) => (
              <motion.div key={apt.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="cd-card p-5 hover:shadow-md transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#0a1a0f] ">{apt.patient}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{apt.id}</p>
                  </div>
                  <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider", getStatusColor(apt.status))}>
                    {apt.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <Clock size={16} className="text-slate-400" /> {apt.time} • {apt.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <Activity size={16} className="text-slate-400" /> {apt.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    {apt.mode === 'Video' ? <Video size={16} className="text-indigo-500" /> : <User size={16} className="text-emerald-500" />}
                    {apt.mode}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-3">
                  <button className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 :bg-slate-800 transition-colors">
                    View Chart
                  </button>
                  {apt.mode === 'Video' && apt.status !== 'Completed' && apt.status !== 'Cancelled' ? (
                    <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-colors flex items-center justify-center gap-2">
                      <Video size={16} /> Join Call
                    </button>
                  ) : (
                    <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 transition-colors">
                      Start Visit
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default DoctorAppointments;
