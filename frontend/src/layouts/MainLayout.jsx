import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';

const MainLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden selection:bg-blue-100 selection:text-blue-900 relative transition-colors duration-300">
      {/* Decorative Background for Glassmorphism Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0 z-10">
        <TopNavbar onMenuClick={() => setIsMobileOpen(true)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
