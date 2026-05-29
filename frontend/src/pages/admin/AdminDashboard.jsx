import React from "react";
import { motion } from "framer-motion";
import { Settings, LogOut, Search } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import TopAnalytics from "../../components/admin/TopAnalytics";
import QuickActions from "../../components/admin/QuickActions";
import LiveSystemMonitor from "../../components/admin/LiveSystemMonitor";
import AppointmentAnalytics from "../../components/admin/AppointmentAnalytics";
import RevenueAnalytics from "../../components/admin/RevenueAnalytics";
import StaffManagementOverview from "../../components/admin/StaffManagementOverview";
import AIInsights from "../../components/admin/AIInsights";
import AIDiagnosisWidget from "../../components/doctor/AIDiagnosisWidget";
import AuditLogs from "../../components/admin/AuditLogs";
import EmergencyManagement from "../../components/admin/EmergencyManagement";
const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="w-full space-y-8 font-['Outfit']">
      {" "}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {" "}
        <div>
          {" "}
          <h1 className="text-2xl font-black tracking-tight text-[#0a1a0f]">
            {" "}
            Command Center{" "}
          </h1>{" "}
          <p className="text-sm font-medium mt-0.5 text-slate-400">
            {" "}
            Welcome back, {user?.name || "Admin"} 👋{" "}
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          <div className="relative hidden md:block group">
            {" "}
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"
              size={16}
            />{" "}
            <input
              type="text"
              placeholder="Search patients, staff..."
              className="pl-11 pr-4 py-3 rounded-xl text-sm outline-none w-64 bg-white border border-[#e2e8e2] placeholder-slate-400 focus:border-emerald-200 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] font-bold text-[#0a1a0f]"
            />{" "}
          </div>{" "}
          <button className="p-3 bg-white border border-[#e2e8e2] rounded-xl hover:border-emerald-200 text-slate-400 hover:text-emerald-500 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            {" "}
            <Settings size={18} />{" "}
          </button>{" "}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-3 bg-white border border-[#e2e8e2] rounded-xl font-bold text-xs hover:border-rose-200 text-slate-400 hover:text-rose-500 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] uppercase tracking-widest"
          >
            {" "}
            <LogOut size={16} />{" "}
          </button>{" "}
        </div>{" "}
      </header>{" "}
      {/* ── DASHBOARD GRID ── */}{" "}
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {" "}
        <TopAnalytics /> {/* Action Row */}{" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {" "}
          <div className="lg:col-span-1">
            {" "}
            <EmergencyManagement />{" "}
          </div>{" "}
          <div className="lg:col-span-1">
            {" "}
            <QuickActions />{" "}
          </div>{" "}
          <div className="lg:col-span-1">
            {" "}
            <LiveSystemMonitor />{" "}
          </div>{" "}
        </div>{" "}
        {/* Analytics Row */}{" "}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {" "}
          <AppointmentAnalytics /> <RevenueAnalytics />{" "}
        </div>{" "}
        {/* Management & Logs Row */}{" "}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {" "}
          <div className="lg:col-span-1">
            {" "}
            <AIInsights />{" "}
          </div>{" "}
          <div className="lg:col-span-1">
            {" "}
            <AIDiagnosisWidget />{" "}
          </div>{" "}
          <div className="lg:col-span-1">
            {" "}
            <StaffManagementOverview />{" "}
          </div>{" "}
          <div className="lg:col-span-1">
            {" "}
            <AuditLogs />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default AdminDashboard;
