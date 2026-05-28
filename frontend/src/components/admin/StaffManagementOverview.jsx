import React from 'react';
import { Users, MoreVertical } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

const staff = [
  { id: 1, name: 'Dr. Sarah Smith', role: 'Cardiologist', status: 'Active', color: 'bg-emerald-500' },
  { id: 2, name: 'Dr. John Doe', role: 'Neurologist', status: 'Active', color: 'bg-emerald-500' },
  { id: 3, name: 'Jane Roe', role: 'Receptionist', status: 'Offline', color: 'bg-slate-400' },
  { id: 4, name: 'Dr. Emily Chen', role: 'Pediatrician', status: 'On Leave', color: 'bg-amber-500' },
];

const StaffManagementOverview = () => {
  return (
    <div className="bg-white border border-[#e2e8e2] rounded-[24px] p-6 h-full shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#0a1a0f] flex items-center gap-2">
          <Users className="text-blue-500" />
          Staff Overview
        </h2>
        <Link to="/admin/staff" className="text-xs font-semibold text-blue-600 hover:text-blue-700 ">View All</Link>
      </div>

      <div className="flex-1 overflow-auto pr-2 -mr-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
              <th className="pb-3 font-bold">Staff Member</th>
              <th className="pb-3 font-bold">Role</th>
              <th className="pb-3 font-bold">Status</th>
              <th className="pb-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 :bg-slate-800/50 transition-colors group">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-xs text-blue-600 shrink-0">
                      {s.name.charAt(0)}{s.name.includes(' ') ? s.name.split(' ')[1].charAt(0) : ''}
                    </div>
                    <span className="font-semibold text-sm text-slate-700 truncate">{s.name}</span>
                  </div>
                </td>
                <td className="py-3 text-xs text-slate-500 ">{s.role}</td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full", s.color)} />
                    <span className="text-xs font-medium text-slate-600 ">{s.status}</span>
                  </div>
                </td>
                <td className="py-3 text-right">
                  <button className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 :bg-slate-800 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffManagementOverview;
