import React from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, Activity, CalendarCheck } from 'lucide-react';
import AnalyticsCard from '../components/dashboard/AnalyticsCard';
import AppointmentTable from '../components/dashboard/AppointmentTable';
import RevenueChart from '../components/dashboard/RevenueChart';
import DoctorActivity from '../components/dashboard/DoctorActivity';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-slate-800"
          >
            Dashboard Overview
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-slate-500 mt-1"
          >
            Welcome back, Dr. Smith. Here is what's happening today.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5">
            + New Appointment
          </button>
        </motion.div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard 
          title="Total Patients" 
          value="2,405" 
          change="+12.5%" 
          trend="up" 
          icon={Users} 
          delay={0.1} 
        />
        <AnalyticsCard 
          title="Appointments" 
          value="84" 
          change="+4.2%" 
          trend="up" 
          icon={CalendarCheck} 
          delay={0.2} 
        />
        <AnalyticsCard 
          title="Cancellations" 
          value="12" 
          change="-2.4%" 
          trend="down" 
          icon={Activity} 
          delay={0.3} 
        />
        <AnalyticsCard 
          title="Revenue" 
          value="$12,420" 
          change="+18.2%" 
          trend="up" 
          icon={CreditCard} 
          delay={0.4} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chart & Table */}
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart delay={0.5} />
          <AppointmentTable delay={0.6} />
        </div>
        
        {/* Right Column: Activity Feed */}
        <div className="lg:col-span-1 space-y-6">
          <DoctorActivity delay={0.7} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
