import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, Bell, Shield, CreditCard, Layers, 
  Save, Smartphone, Mail, Globe, Lock, Key, Check 
} from 'lucide-react';
import { cn } from '../../utils/cn';

const tabs = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing & Tax', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: Layers },
];

const Toggle = ({ enabled, onChange }) => (
  <button 
    onClick={onChange}
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
      enabled ? "bg-blue-600" : "bg-slate-200"
    )}
  >
    <span className={cn(
      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
      enabled ? "translate-x-6" : "translate-x-1"
    )} />
  </button>
);

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock State for Toggles
  const [toggles, setToggles] = useState({
    emailNotif: true,
    smsNotif: true,
    pushNotif: false,
    mfa: true,
    autoLogout: true,
    autoInvoice: true,
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'general':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Clinic Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Clinic Name</label>
                <input type="text" defaultValue="ClinicDesk General Hospital" className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Support Email</label>
                <input type="email" defaultValue="support@clinicdesk.com" className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Address</label>
                <input type="text" defaultValue="123 Medical Center Blvd, Health City, NY 10001" className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Timezone</label>
                <select className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  <option>Eastern Time (ET)</option>
                  <option>Pacific Time (PT)</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Communication Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Mail size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Email Notifications</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Send appointment reminders and billing updates via email.</p>
                  </div>
                </div>
                <Toggle enabled={toggles.emailNotif} onChange={() => handleToggle('emailNotif')} />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Smartphone size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">SMS Reminders</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Send text messages to patients 24h before appointments.</p>
                  </div>
                </div>
                <Toggle enabled={toggles.smsNotif} onChange={() => handleToggle('smsNotif')} />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Globe size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Push Notifications</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Enable browser push notifications for staff emergencies.</p>
                  </div>
                </div>
                <Toggle enabled={toggles.pushNotif} onChange={() => handleToggle('pushNotif')} />
              </div>
            </div>
          </motion.div>
        );
      case 'security':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Security & Access</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Lock size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Require 2FA for all staff and admin accounts.</p>
                  </div>
                </div>
                <Toggle enabled={toggles.mfa} onChange={() => handleToggle('mfa')} />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Clock size={20} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Auto Logout</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Automatically log out inactive users after 30 minutes.</p>
                  </div>
                </div>
                <Toggle enabled={toggles.autoLogout} onChange={() => handleToggle('autoLogout')} />
              </div>
              <div className="mt-6">
                <button className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-200 transition-colors">
                  Change Master Password
                </button>
              </div>
            </div>
          </motion.div>
        );
      case 'billing':
      case 'integrations':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="py-12 flex flex-col items-center justify-center text-slate-400">
            <Layers size={48} className="mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-slate-600 mb-1">Coming Soon</h3>
            <p className="text-sm">Advanced configuration for this module is under development.</p>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 p-4 lg:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure global clinic settings, security, and preferences.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all disabled:opacity-75">
          {isSaving ? <><Check size={18} /> Saved</> : <><Save size={18} /> Save Changes</>}
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0 bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl p-3 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                  activeTab === tab.id 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <tab.icon size={18} className={activeTab === tab.id ? "text-blue-600" : "text-slate-400"} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl p-6 min-h-[500px] overflow-hidden">
          <AnimatePresence mode="wait">
            <React.Fragment key={activeTab}>
              {renderContent()}
            </React.Fragment>
          </AnimatePresence>
        </div>

      </div>

    </motion.div>
  );
};

export default AdminSettings;
