import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';

const MainLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden relative"
      style={{ background: 'var(--finai-bg)', color: 'var(--finai-text-main)' }}>

      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0 z-10 px-4 py-4 lg:px-6 lg:py-6 overflow-hidden">
        <div className="flex-1 flex flex-col finai-card overflow-hidden shadow-sm">
          <TopNavbar onMenuClick={() => setIsMobileOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 relative custom-scrollbar">
            <div className="max-w-[1400px] mx-auto space-y-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
