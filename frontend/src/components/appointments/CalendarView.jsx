import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { STATUS_CONFIG } from '../../data/appointmentMocks';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const CalendarView = ({ appointments, onDayClick }) => {
  const today = new Date();
  const [viewDate, setViewDate] = React.useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  // Build map: 'YYYY-MM-DD' -> [appointments]
  const aptMap = React.useMemo(() => {
    const map = {};
    appointments.forEach((a) => {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });
    return map;
  }, [appointments]);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayApts = aptMap[dateStr] || [];
          const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

          return (
            <button
              key={dateStr}
              onClick={() => onDayClick && onDayClick(dateStr, dayApts)}
              className={cn(
                'relative flex flex-col items-center p-1.5 rounded-xl transition-all min-h-[52px] group',
                isToday ? 'bg-blue-500 shadow-md shadow-blue-500/30' : 'hover:bg-blue-50/50',
                dayApts.length > 0 && !isToday && 'bg-slate-50'
              )}
            >
              <span className={cn('text-sm font-medium', isToday ? 'text-white' : 'text-slate-700')}>
                {day}
              </span>
              {dayApts.length > 0 && (
                <div className="flex gap-0.5 flex-wrap justify-center mt-1">
                  {dayApts.slice(0, 3).map((a, i) => (
                    <div
                      key={i}
                      className={cn('w-1.5 h-1.5 rounded-full', STATUS_CONFIG[a.status]?.dot)}
                    />
                  ))}
                  {dayApts.length > 3 && (
                    <span className="text-[8px] text-slate-400">+{dayApts.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-slate-100">
        {Object.entries(STATUS_CONFIG).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className={cn('w-2 h-2 rounded-full', val.dot)} />
            {val.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CalendarView;
