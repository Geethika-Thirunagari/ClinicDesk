import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, CheckCircle, X, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { loadScheduleBlocks, saveScheduleBlocks } from '../../utils/doctorStorage';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const blockTypes = ['Consultation', 'Teleconsult', 'Surgery', 'Admin', 'Break'];

const DoctorSchedule = () => {
  const [blocks, setBlocks] = useState(() => loadScheduleBlocks());
  const [activeDay, setActiveDay] = useState('Mon');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Mon',
    start: '09:00 AM',
    end: '10:00 AM',
    type: 'Consultation',
  });

  useEffect(() => {
    saveScheduleBlocks(blocks);
  }, [blocks]);

  const dayBlocks = blocks.filter((b) => b.day === activeDay);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Consultation': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Teleconsult': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Surgery': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Break': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const openAddModal = () => {
    setFormData({ day: activeDay, start: '09:00 AM', end: '10:00 AM', type: 'Consultation' });
    setShowModal(true);
  };

  const handleSaveBlock = (e) => {
    e.preventDefault();
    if (!formData.start || !formData.end) return;

    const newBlock = {
      id: Date.now(),
      day: formData.day,
      start: formData.start,
      end: formData.end,
      type: formData.type,
      status: 'Active',
    };
    setBlocks((prev) => [...prev, newBlock]);
    setActiveDay(formData.day);
    setShowModal(false);
  };

  const handleDeleteBlock = (id) => {
    if (window.confirm('Remove this schedule block?')) {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 font-['Outfit']">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a1a0f] tracking-tight">Schedule & Availability</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your weekly working hours and block times.</p>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all"
        >
          <Plus size={18} /> Add Block
        </motion.button>
      </div>

      <div className="cd-card p-6">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <button type="button" className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#0a1a0f] flex items-center justify-center gap-2">
              <CalendarIcon size={20} className="text-blue-500" /> Current Week
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">May 17 - May 23, 2026</p>
          </div>
          <button type="button" className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {weekDays.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className={cn(
                'flex-1 min-w-[80px] py-3 rounded-xl text-sm font-bold border transition-all',
                activeDay === day
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {day}
            </button>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#0a1a0f] mb-4 flex items-center gap-2">
            Blocks for {activeDay}
          </h3>

          {dayBlocks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dayBlocks.map((block, i) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn('p-5 rounded-[24px] border flex flex-col justify-between', getTypeColor(block.type))}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 bg-white/50 backdrop-blur-sm rounded-lg text-xs font-bold uppercase tracking-wider">
                      {block.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlock(block.id)}
                      className="p-1.5 rounded-lg hover:bg-white/60 text-slate-500 hover:text-rose-600 transition-colors"
                      aria-label="Delete block"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-bold text-lg mb-1">
                      <Clock size={18} /> {block.start}
                    </div>
                    <div className="flex items-center gap-2 font-bold text-lg opacity-70">
                      <div className="w-4 h-0 border-t border-current ml-[2px]" /> {block.end}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-[24px] border border-slate-100 border-dashed">
              <CheckCircle size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No blocks scheduled for {activeDay}.</p>
              <button
                type="button"
                onClick={openAddModal}
                className="mt-4 text-sm font-bold text-blue-600 hover:underline"
              >
                Add your first block
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleSaveBlock}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-md p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0a1a0f]">Add Schedule Block</h2>
                <button type="button" onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Day</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {weekDays.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Start</label>
                    <input
                      type="text"
                      value={formData.start}
                      onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                      placeholder="09:00 AM"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">End</label>
                    <input
                      type="text"
                      value={formData.end}
                      onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                      placeholder="01:00 PM"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Block type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {blockTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg">
                  Save Block
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DoctorSchedule;
