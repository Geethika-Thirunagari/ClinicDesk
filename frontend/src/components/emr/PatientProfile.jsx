import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, HeartPulse, User, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

const InfoRow = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={14} className="text-blue-500" />
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className={cn('text-sm font-semibold mt-0.5', highlight ? 'text-blue-700' : 'text-slate-800')}>{value}</p>
    </div>
  </div>
);

const PatientProfile = ({ patient, delay = 0 }) => {
  if (!patient) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
      className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Banner */}
      <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,white,transparent)]" />
        <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
          <ShieldCheck size={13} className="text-white" />
          <span className="text-white text-xs font-semibold">Secured Record</span>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Avatar + Name */}
        <div className="flex items-end gap-4 -mt-10 mb-5">
          <div className="relative">
            <img
              src={patient.avatar}
              alt={patient.name}
              className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <div className="pb-1">
            <h2 className="text-xl font-bold text-slate-800">{patient.name}</h2>
            <p className="text-sm text-slate-500">{patient.id} &middot; {patient.gender} &middot; Age {patient.age}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Blood Type', value: patient.blood, color: 'bg-rose-50 text-rose-600 border-rose-100' },
            { label: 'Doctor', value: patient.assignedDoctor.replace('Dr. ', ''), color: 'bg-blue-50 text-blue-600 border-blue-100' },
            { label: 'Conditions', value: patient.conditions.length, color: 'bg-amber-50 text-amber-600 border-amber-100' },
          ].map((s) => (
            <div key={s.label} className={cn('rounded-xl border p-3 text-center', s.color)}>
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-xs opacity-75 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-5">
          <InfoRow icon={Phone} label="Phone" value={patient.phone} />
          <InfoRow icon={Mail} label="Email" value={patient.email} />
          <InfoRow icon={MapPin} label="Address" value={patient.address} />
          <InfoRow icon={User} label="Emergency Contact" value={patient.emergency} />
          <InfoRow icon={ShieldCheck} label="Insurance" value={patient.insurance} />
        </div>

        {/* Allergies */}
        {patient.allergies.length > 0 && (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-rose-500" />
              <p className="text-sm font-semibold text-rose-700">Known Allergies</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((a) => (
                <span key={a} className="text-xs font-medium bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Active Conditions */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <HeartPulse size={12} /> Active Conditions
          </p>
          <div className="flex flex-wrap gap-2">
            {patient.conditions.map((c) => (
              <span key={c} className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientProfile;
