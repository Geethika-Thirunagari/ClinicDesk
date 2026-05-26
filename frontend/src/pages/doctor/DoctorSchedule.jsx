import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const initialBlocks = [
  { id: 1, day: 'Mon', start: '09:00 AM', end: '01:00 PM', type: 'Consultation', status: 'Active' },
  { id: 2, day: 'Mon', start: '02:00 PM', end: '05:00 PM', type: 'Teleconsult', status: 'Active' },
  { id: 3, day: 'Tue', start: '09:00 AM', end: '01:00 PM', type: 'Consultation', status: 'Active' },
  { id: 4, day: 'Wed', start: '09:00 AM', end: '05:00 PM', type: 'Surgery', status: 'Active' },
  { id: 5, day: 'Thu', start: '10:00 AM', end: '03:00 PM', type: 'Consultation', status: 'Active' },
  { id: 6, day: 'Fri', start: '09:00 AM', end: '12:00 PM', type: 'Teleconsult', status: 'Active' },
];

const DoctorSchedule = () => {
  const [activeDay, setActiveDay] = useState('Mon');
  const [showModal, setShowModal] = useState(false);

  const dayBlocks = initialBlocks.filter(b => b.day === activeDay);

  const getTypeColor = (type) => {
    switch(type) {
      case 'Consultation': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30';
      case 'Teleconsult': return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30';
      case 'Surgery': return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30';
      default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8 min-h-screen">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Schedule & Availability</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your weekly working hours and block times.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all">
          <Plus size={18} /> Add Block
        </motion.button>
      </div>

      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-sm rounded-2xl p-6">
        
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
              <CalendarIcon size={20} className="text-blue-500" /> Current Week
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">May 17 - May 23, 2026</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day Selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {weekDays.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={cn(
                "flex-1 min-w-[80px] py-3 rounded-xl text-sm font-bold border transition-all",
                activeDay === day 
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20" 
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule Blocks for selected day */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            Blocks for {activeDay}
          </h3>
          
          {dayBlocks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dayBlocks.map((block, i) => (
                <motion.div key={block.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className={cn("p-5 rounded-2xl border flex flex-col justify-between", getTypeColor(block.type))}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg text-xs font-bold uppercase tracking-wider">
                      {block.type}
                    </span>
                    <button className="text-xs font-bold underline opacity-70 hover:opacity-100 transition-opacity">Edit</button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-bold text-lg mb-1">
                      <Clock size={18} /> {block.start}
                    </div>
                    <div className="flex items-center gap-2 font-bold text-lg opacity-70">
                      <div className="w-4 h-0 border-t border-current ml-[2px]"></div> {block.end}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">
              <CheckCircle size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No blocks scheduled for {activeDay}. Enjoy your day off!</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default DoctorSchedule;
