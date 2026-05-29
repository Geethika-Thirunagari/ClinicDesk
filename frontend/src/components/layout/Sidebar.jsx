import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Calendar, FileText, Settings, CreditCard,
  ChevronLeft, ChevronRight, Activity, Clock, ShieldPlus, Stethoscope, BriefcaseMedical, ClipboardList, Wallet, BellRing, UserCircle,
  BedDouble, Pill, Contact, Star, Video, Bot, BarChart3, HeartPulse, SearchCheck, ScanLine, MessageSquareHeart, ShieldCheck, Package,
  Sparkles, HelpCircle, LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore, ROLES } from '../../store/useAuthStore';
import { ROUTES } from '../../routes/routes.constants';

const SidebarSection = ({ title, children, isCollapsed }) => (
  <div className="mb-6">
    {!isCollapsed && (
      <h3 className="px-4 mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
        {title}
      </h3>
    )}
    <div className="space-y-1">{children}</div>
  </div>
);

const Sidebar = ({ isMobileOpen, setIsMobileOpen, onAIClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { getRole, user, logout } = useAuthStore();
  const currentRole = getRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItem = (Icon, label, path) => (
    <NavLink
      key={path}
      to={path}
      onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative mx-2",
        isActive
          ? "bg-[#0a1a0f] text-white shadow-lg shadow-emerald-900/10"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon size={18} className="shrink-0" />
      {!isCollapsed && <span className="font-medium text-sm">{label}</span>}
    </NavLink>
  );

  const getNavGroups = () => {
    switch (currentRole) {
      case ROLES.ADMIN:
        return [
          {
            title: 'Main',
            items: [
              { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
              { icon: Activity, label: 'Revenue', path: '/admin/revenue' },
              { icon: FileText, label: 'Reports', path: '/admin/reports' },
            ]
          },
          {
            title: 'Management',
            items: [
              { icon: Users, label: 'Patients', path: '/admin/patients' },
              { icon: Stethoscope, label: 'Doctors', path: '/admin/doctors' },
              { icon: Contact, label: 'Staff', path: '/admin/staff' },
              { icon: Pill, label: 'Pharmacy', path: '/admin/pharmacy' },
            ]
          },
          {
            title: 'Utilities',
            items: [
              { icon: Settings, label: 'Settings', path: '/admin/settings' },
              { icon: ShieldCheck, label: 'Audit Trail', path: '/admin/audit' },
            ]
          }
        ];
      case ROLES.DOCTOR:
        return [
          {
            title: 'Clinical',
            items: [
              { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor/dashboard' },
              { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
              { icon: ClipboardList, label: 'EMR Records', path: '/doctor/records' },
              { icon: Pill, label: 'Prescriptions', path: '/doctor/prescriptions' },
            ]
          },
          {
            title: 'Planning',
            items: [
              { icon: Clock, label: 'Schedule', path: '/doctor/schedule' },
              { icon: BarChart3, label: 'Analytics', path: '/doctor/analytics' },
              { icon: Video, label: 'Teleconsult', path: '/doctor/teleconsult' },
            ]
          },
          {
            title: 'Intelligence',
            items: [
              { icon: Sparkles, label: 'AI Assistant', path: '/doctor/ai-assistant' },
            ]
          }
        ];
      case ROLES.RECEPTIONIST:
        return [
          {
            title: 'Front Office',
            items: [
              { icon: LayoutDashboard, label: 'Desk Overview', path: '/reception/dashboard' },
              { icon: Calendar, label: 'Booking', path: '/reception/booking' },
              { icon: Users, label: 'Registration', path: '/reception/registration' },
              { icon: Clock, label: 'Queue', path: '/reception/queue' },
            ]
          },
          {
            title: 'Admin Desk',
            items: [
              { icon: Wallet, label: 'Billing', path: '/reception/billing' },
              { icon: ScanLine, label: 'Check-in', path: '/reception/checkin' },
              { icon: MessageSquareHeart, label: 'Feedback', path: '/reception/feedback' },
            ]
          }
        ];
      case ROLES.PATIENT:
        return [
          {
            title: 'My Health',
            items: [
              { icon: LayoutDashboard, label: 'Health Hub', path: '/patient/dashboard' },
              { icon: HeartPulse, label: 'Health Tracker', path: '/patient/health-tracker' },
              { icon: SearchCheck, label: 'Symptom Checker', path: '/patient/symptom-checker' },
            ]
          },
          {
            title: 'Care',
            items: [
              { icon: Calendar, label: 'Book Appointment', path: '/patient/book' },
              { icon: ClipboardList, label: 'Medical History', path: '/patient/history' },
              { icon: Pill, label: 'Prescriptions', path: '/patient/prescriptions' },
            ]
          },
          {
            title: 'Account',
            items: [
              { icon: CreditCard, label: 'Payments', path: '/patient/payments' },
              { icon: UserCircle, label: 'My Profile', path: '/patient/profile' },
            ]
          }
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        layout
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex-shrink-0 md:static flex flex-col transition-all",
          "bg-transparent border-r border-transparent",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 h-20 px-6 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#0a1a0f] flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-900/10">
            <Stethoscope size={18} />
          </div>
          {!isCollapsed && (
            <span className="font-black text-lg tracking-tight text-[#0a1a0f] uppercase">ClinicDesk</span>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
          {getNavGroups().map((group, idx) => (
            <SidebarSection key={idx} title={group.title} isCollapsed={isCollapsed}>
              {group.items.map(item => navItem(item.icon, item.label, item.path))}
            </SidebarSection>
          ))}
        </div>

        {/* AI Assistant Widget — Admin only */}
        {!isCollapsed && currentRole === ROLES.ADMIN && (
          <div
            onClick={onAIClick}
            className="p-4 mx-4 mb-4 bg-emerald-50 rounded-2xl border border-emerald-100 cursor-pointer transition-all hover:bg-emerald-100/50 group"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bot size={16} className="text-emerald-600 transition-transform group-hover:scale-110" />
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-tighter">AI Assistant</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="bg-white rounded-lg p-2 text-[10px] text-emerald-800 border border-emerald-100/50 group-hover:border-emerald-200">
              Ask me anything about clinic stats...
            </div>
          </div>
        )}

        {/* Logout bottom */}
        <div className="p-4 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 mx-2"
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Log out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
