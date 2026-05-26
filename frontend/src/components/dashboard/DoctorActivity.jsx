import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, FileText, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

const activities = [
  {
    id: 1,
    doctor: 'Dr. Sarah Smith',
    action: 'completed appointment with',
    target: 'Michael Roberts',
    time: '10 min ago',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    id: 2,
    doctor: 'Dr. James Wilson',
    action: 'added new medical record for',
    target: 'Emma Watson',
    time: '45 min ago',
    icon: FileText,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    id: 3,
    doctor: 'Dr. Emily Davis',
    action: 'started surgery for',
    target: 'John Doe',
    time: '2 hours ago',
    icon: Stethoscope,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    id: 4,
    doctor: 'Dr. Robert Brown',
    action: 'is currently',
    target: 'on break',
    time: '3 hours ago',
    icon: Clock,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
];

const DoctorActivity = ({ delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
      className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-slate-800 text-lg">Doctor Activity</h3>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
          View All
        </button>
      </div>

      <div className="relative border-l-2 border-slate-100 ml-4 space-y-6">
        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + (index * 0.1) }}
            className="relative pl-6"
          >
            <div className={cn(
              "absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm",
              activity.bg
            )}>
              <activity.icon size={14} className={activity.color} />
            </div>
            
            <div className="flex flex-col">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{activity.doctor}</span>{' '}
                {activity.action}{' '}
                <span className="font-medium text-slate-700">{activity.target}</span>
              </p>
              <span className="text-xs text-slate-400 mt-1">{activity.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DoctorActivity;
