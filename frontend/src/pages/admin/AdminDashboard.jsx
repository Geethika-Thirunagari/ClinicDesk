import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, LogOut, Search, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import TopAnalytics from '../../components/admin/TopAnalytics';
import QuickActions from '../../components/admin/QuickActions';
import LiveSystemMonitor from '../../components/admin/LiveSystemMonitor';
import AppointmentAnalytics from '../../components/admin/AppointmentAnalytics';
import RevenueAnalytics from '../../components/admin/RevenueAnalytics';
import StaffManagementOverview from '../../components/admin/StaffManagementOverview';
import AIInsights from '../../components/admin/AIInsights';
import AIDiagnosisWidget from '../../components/doctor/AIDiagnosisWidget';
import AuditLogs from '../../components/admin/AuditLogs';
import EmergencyManagement from '../../components/admin/EmergencyManagement';

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('clinicdesk-theme') === 'dark');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('clinicdesk-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('clinicdesk-theme', 'light');
    }
  };

  return (
    <div className="w-full h-full p-4 lg:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300 min-h-screen">

      {/* ── HEADER ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Command Center
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.name || 'Admin'}. System running optimally.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search patients, staff..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64 dark:text-white shadow-sm"
            />
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all">
            <Settings size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 font-semibold text-sm hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all shadow-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ── DASHBOARD GRID ── */}
      <div className="space-y-6 max-w-[1600px] mx-auto">

        {/* ROW 1: Top Analytics KPIs */}
        <TopAnalytics />

        {/* ROW 2: Primary Monitoring & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <EmergencyManagement />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
          <div className="lg:col-span-1">
            <LiveSystemMonitor />
          </div>
        </div>

        {/* ROW 3: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppointmentAnalytics />
          <RevenueAnalytics />
        </div>

        {/* ROW 4: Management & Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <AIInsights />
          </div>
          <div className="lg:col-span-1">
            <AIDiagnosisWidget />
          </div>
          <div className="lg:col-span-1">
            <StaffManagementOverview />
          </div>
          <div className="lg:col-span-1">
            <AuditLogs />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
