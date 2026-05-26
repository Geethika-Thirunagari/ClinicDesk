import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Calendar, FileText, Settings, CreditCard,
  ChevronLeft, ChevronRight, Activity, Clock, ShieldPlus, Stethoscope, BriefcaseMedical, ClipboardList, Wallet, BellRing, UserCircle,
  BedDouble, Pill, Contact, Star, Video, Bot, BarChart3, HeartPulse, SearchCheck, ScanLine, MessageSquareHeart, ShieldCheck, Package
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore, ROLES } from '../../store/useAuthStore';
import { ROUTES } from '../../routes/routes.constants';

const roleBasedNav = {
  [ROLES.ADMIN]: [
    { icon: LayoutDashboard, label: 'Dashboard',    path: ROUTES.ADMIN.DASHBOARD },
    { icon: Stethoscope,     label: 'Doctors',      path: ROUTES.ADMIN.DOCTORS },
    { icon: Users,           label: 'Patients',     path: ROUTES.ADMIN.PATIENTS },
    { icon: Contact,         label: 'Staff',        path: ROUTES.ADMIN.STAFF },
    { icon: BedDouble,       label: 'Beds & Wards', path: ROUTES.ADMIN.BEDS },
    { icon: Pill,            label: 'Pharmacy',     path: ROUTES.ADMIN.PHARMACY },
    { icon: Activity,        label: 'Revenue',      path: ROUTES.ADMIN.REVENUE },
    { icon: ClipboardList,   label: 'Reports',      path: ROUTES.ADMIN.REPORTS },
    { icon: ShieldCheck,     label: 'Audit Trail',  path: ROUTES.ADMIN.AUDIT },
    { icon: Package,         label: 'Inventory',    path: ROUTES.ADMIN.INVENTORY },
    { icon: Settings,        label: 'Settings',     path: ROUTES.ADMIN.SETTINGS },
  ],
  [ROLES.DOCTOR]: [
    { icon: LayoutDashboard, label: 'Dashboard',    path: ROUTES.DOCTOR.DASHBOARD },
    { icon: Calendar,        label: 'Appointments', path: ROUTES.DOCTOR.APPOINTMENTS },
    { icon: FileText,        label: 'Records',      path: ROUTES.DOCTOR.RECORDS },
    { icon: BriefcaseMedical,label: 'Prescriptions',path: ROUTES.DOCTOR.PRESCRIPTIONS },
    { icon: Clock,           label: 'Schedule',     path: ROUTES.DOCTOR.SCHEDULE },
    { icon: Video,           label: 'Teleconsult',  path: ROUTES.DOCTOR.TELECONSULT },
    { icon: Bot,             label: 'AI Assistant',  path: ROUTES.DOCTOR.AI_ASSISTANT },
    { icon: BarChart3,       label: 'Analytics',     path: ROUTES.DOCTOR.ANALYTICS },
    { icon: Star,            label: 'Reviews',      path: ROUTES.DOCTOR.REVIEWS },
    { icon: BellRing,        label: 'Alerts',       path: ROUTES.DOCTOR.NOTIFICATIONS },
  ],
  [ROLES.RECEPTIONIST]: [
    { icon: LayoutDashboard, label: 'Dashboard',    path: ROUTES.RECEPTIONIST.DASHBOARD },
    { icon: Calendar,        label: 'Booking',      path: ROUTES.RECEPTIONIST.BOOKING },
    { icon: Users,           label: 'Queue',        path: ROUTES.RECEPTIONIST.QUEUE },
    { icon: CreditCard,      label: 'Billing',      path: ROUTES.RECEPTIONIST.BILLING },
    { icon: ShieldPlus,      label: 'Registration', path: ROUTES.RECEPTIONIST.REGISTRATION },
    { icon: ScanLine,        label: 'Check-In',      path: ROUTES.RECEPTIONIST.CHECKIN },
    { icon: MessageSquareHeart, label: 'Feedback',   path: ROUTES.RECEPTIONIST.FEEDBACK },
  ],
  [ROLES.PATIENT]: [
    { icon: LayoutDashboard, label: 'Dashboard',    path: ROUTES.PATIENT.DASHBOARD },
    { icon: Calendar,        label: 'Book Appt',    path: ROUTES.PATIENT.BOOK },
    { icon: FileText,        label: 'History',      path: ROUTES.PATIENT.HISTORY },
    { icon: BriefcaseMedical,label: 'Prescriptions',path: ROUTES.PATIENT.PRESCRIPTIONS },
    { icon: Wallet,          label: 'Payments',     path: ROUTES.PATIENT.PAYMENTS },
    { icon: HeartPulse,      label: 'Health Tracker', path: ROUTES.PATIENT.HEALTH_TRACKER },
    { icon: SearchCheck,     label: 'Symptom Check',  path: ROUTES.PATIENT.SYMPTOM_CHECKER },
    { icon: UserCircle,      label: 'Profile',      path: ROUTES.PATIENT.PROFILE },
  ]
};

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { getRole } = useAuthStore();
  const currentRole = getRole();
  const navItems = currentRole ? roleBasedNav[currentRole] : [];

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-lg leading-none">+</span>
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              ClinicDesk
            </motion.span>
          )}
        </div>
        
        {/* Desktop Collapse Toggle */}
        <button 
          onClick={toggleCollapse}
          className="hidden md:flex p-1.5 rounded-md hover:bg-black/5 text-slate-500 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems?.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative",
              isActive 
                ? "bg-white/60 text-blue-700 shadow-sm shadow-blue-500/5 backdrop-blur-md" 
                : "text-slate-500 hover:bg-white/40 hover:text-slate-800"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-white/60 rounded-xl border border-white/80 shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={20} className={cn("relative z-10 transition-colors", isActive ? "text-blue-600" : "group-hover:text-blue-500")} />
                {!isCollapsed && (
                  <span className="relative z-10 font-medium whitespace-nowrap">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        layout
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex-shrink-0 md:static",
          "bg-white/40 backdrop-blur-xl border-r border-white/40 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
};

export default Sidebar;
