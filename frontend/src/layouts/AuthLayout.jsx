import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { 
  Stethoscope, HeartPulse, Activity, ShieldPlus, Moon, Sun, 
  Pill, Dna, Syringe, Users, Calendar, TrendingUp, Lock, ShieldCheck, Headphones, Cpu 
} from 'lucide-react';
import { cn } from '../utils/cn';

const ECGLine = () => (
  <motion.svg
    className="absolute w-full h-32 text-blue-400/20 opacity-40 z-0 top-[35%]"
    viewBox="0 0 1000 100"
    preserveAspectRatio="none"
    initial={{ x: -1000 }}
    animate={{ x: 1000 }}
    transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
  >
    <path
      d="M 0 50 L 300 50 L 320 20 L 340 80 L 360 10 L 380 90 L 400 50 L 1000 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      vectorEffect="non-scaling-stroke"
    />
  </motion.svg>
);

const FloatingIcon = ({ Icon, className, delay, yOffset }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [0, yOffset, 0] }}
    transition={{ repeat: Infinity, duration: 4, delay, ease: 'easeInOut' }}
    className={cn(
      "absolute flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl z-10",
      className
    )}
  >
    <Icon className="text-white/80" size={28} />
  </motion.div>
);

const Particle = ({ delay, duration, style }) => (
  <motion.div
    className="absolute w-1 h-1 bg-blue-300 rounded-full"
    style={style}
    initial={{ opacity: 0, scale: 0, y: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5], y: -50 }}
    transition={{ repeat: Infinity, duration, delay, ease: 'easeOut' }}
  />
);

const AnalyticsCard = ({ title, value, subtitle, icon: Icon, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay }}
    className={cn(
      "bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 xl:p-4 flex items-center gap-3 xl:gap-4 hover:bg-white/15 transition-colors shadow-2xl",
      className
    )}
  >
    <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shrink-0">
      <Icon className="text-blue-300 w-5 h-5 xl:w-6 xl:h-6" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] xl:text-xs text-blue-200 font-medium mb-1 uppercase tracking-wider truncate">{title}</p>
      <div className="flex items-end gap-1.5 xl:gap-2 flex-wrap">
        <h4 className="text-lg xl:text-xl font-bold text-white leading-none">{value}</h4>
        <span className="text-[10px] xl:text-xs text-green-400 font-medium mb-0.5 whitespace-nowrap">{subtitle}</span>
      </div>
    </div>
  </motion.div>
);

const AuthLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('clinicdesk-theme') === 'dark');
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: { repeat: Infinity, duration: 20, ease: 'linear', repeatType: 'reverse' }
    });
  }, [controls]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('clinicdesk-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('clinicdesk-theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className={cn(
      "h-screen w-full flex relative overflow-hidden transition-colors duration-700 font-sans",
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      {/* ── Left Side: Futuristic Branding (55% Width) ── */}
      <div className="hidden lg:flex w-[55%] relative z-10 flex-col overflow-hidden bg-slate-950 border-r border-white/10 shadow-2xl h-full">
        
        {/* Dynamic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1c] via-[#1e1b4b] to-[#0f172a] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent z-0" />
        
        {/* Subtle Grid Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {/* Glow Effects & Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-[120px] pointer-events-none z-0 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/30 blur-[120px] pointer-events-none z-0 mix-blend-screen" />

        {/* Floating Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <Particle 
              key={i} 
              delay={Math.random() * 5} 
              duration={3 + Math.random() * 4} 
              style={{ left: `${Math.random() * 100}%`, top: `${60 + Math.random() * 40}%` }} 
            />
          ))}
        </div>

        {/* ECG Animation */}
        <ECGLine />

        <div className="relative z-10 flex flex-col h-full px-8 py-9 xl:px-12 xl:py-10">
          
          {/* Header Branding */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 xl:gap-4 mb-6 xl:mb-8 shrink-0"
          >
            <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/40 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Stethoscope className="text-white relative z-10 w-6 h-6 xl:w-7 xl:h-7" />
            </div>
            <span className="text-2xl xl:text-3xl font-bold tracking-tight text-white">
              Clinic<span className="text-blue-400">Desk</span>
            </span>
          </motion.div>

          {/* Main Hero Content */}
          <div className="flex-1 flex flex-col justify-start pt-4 xl:pt-6 relative z-10 max-w-xl mx-auto lg:mx-0 min-h-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="shrink-0"
            >
                <div className="inline-flex items-center gap-2 xl:gap-3 px-3 py-1.5 xl:px-4 xl:py-2 rounded-full bg-white/5 border border-white/10 mb-4 xl:mb-5 backdrop-blur-md">
                <span className="flex h-2 w-2 xl:h-2.5 xl:w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
                </span>
                <span className="text-xs xl:text-sm font-medium text-blue-200 tracking-wide uppercase">All Systems Operational</span>
              </div>
              
              <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-3 xl:mb-4 leading-[1.1] xl:leading-tight">
                Healthcare,<br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Intelligently Unified.</span>
              </h1>
              <p className="text-sm xl:text-base text-slate-300 max-w-md font-light leading-relaxed mb-4 xl:mb-6">
                Experience the enterprise standard in clinical management. Streamline scheduling, automate billing, and elevate patient care.
              </p>
            </motion.div>

            {/* Analytics Stats Cards Grid */}
            <div className="grid grid-cols-2 gap-3 xl:gap-4 relative shrink-0 auto-rows-fr">
              <AnalyticsCard title="Active Providers" value="12+" subtitle="Online now" icon={Stethoscope} delay={0.4} />
              <AnalyticsCard title="Patients Managed" value="1,248+" subtitle="+5% this week" icon={Users} delay={0.5} />
              <AnalyticsCard title="Efficiency Rate" value="98%" subtitle="Optimal" icon={TrendingUp} delay={0.6} />
              <AnalyticsCard title="Appointments" value="Live" subtitle="Tracking active" icon={Calendar} delay={0.7} />
              
              {/* Decorative Floating Elements around cards */}
              <FloatingIcon Icon={HeartPulse} className="w-10 h-10 xl:w-12 xl:h-12 -top-4 -right-4 xl:-top-6 xl:-right-6" delay={0} yOffset={-10} />
              <FloatingIcon Icon={ShieldPlus} className="w-12 h-12 xl:w-14 xl:h-14 -bottom-6 -left-3 xl:-bottom-8 xl:-left-4" delay={1.5} yOffset={15} />
            </div>
          </div>

          {/* Footer Trust Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-auto pt-6 xl:pt-8 border-t border-white/10 shrink-0"
          >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 xl:gap-4 overflow-hidden">
              {[
                { icon: Lock, label: "Secure & Encrypted" },
                { icon: ShieldCheck, label: "HIPAA Compliant" },
                { icon: Headphones, label: "24/7 Support" },
                { icon: Cpu, label: "AI-Powered Insights" },
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-1.5 xl:gap-2 group cursor-default min-w-0 justify-start">
                  <div className="p-1.5 xl:p-2 rounded-lg bg-white/5 group-hover:bg-blue-500/20 transition-colors border border-white/5 shrink-0">
                    <badge.icon className="text-slate-400 group-hover:text-blue-400 transition-colors w-3.5 h-3.5 xl:w-4 xl:h-4" />
                  </div>
                  <span className="text-[10px] xl:text-xs text-slate-400 group-hover:text-slate-200 transition-colors font-medium truncate">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right Side: Form Container (45% Width) ── */}
      <div className={cn(
        "flex-1 lg:w-[45%] lg:flex-none flex flex-col justify-center items-center p-6 sm:p-8 xl:p-12 z-20 relative transition-colors duration-700 h-full",
        isDarkMode ? "bg-slate-950" : "bg-slate-50"
      )}>
        {/* Mesh Background for Right Side */}
        <div className={cn(
          "absolute inset-0 opacity-40 z-0 pointer-events-none",
          isDarkMode 
            ? "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" 
            : "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/50 via-slate-50 to-slate-50"
        )} />

        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={cn(
            "absolute top-6 right-6 xl:top-8 xl:right-8 p-3 rounded-full transition-all duration-300 backdrop-blur-md border shadow-sm z-30",
            isDarkMode 
              ? "bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-yellow-400" 
              : "bg-white/80 border-slate-200 hover:bg-slate-100 text-slate-700 hover:shadow-md"
          )}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="w-full max-w-[480px] relative z-10 mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Mobile Branding (Only visible on small screens) */}
            <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/40">
                <Stethoscope className="text-white w-6 h-6" />
              </div>
              <span className={cn(
                "text-2xl font-bold tracking-tight",
                isDarkMode ? "text-white" : "bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700"
              )}>
                ClinicDesk
              </span>
            </div>
            
            {/* Form Outlet */}
            <div className="relative">
              {/* Glassmorphism Glow Behind Form */}
              <div className={cn(
                "absolute -inset-1 rounded-[2.5rem] blur-xl opacity-50 z-0 transition-colors duration-700",
                isDarkMode ? "bg-gradient-to-br from-blue-900/50 to-purple-900/50" : "bg-blue-100/60"
              )} />
              
              <div className={cn(
                "relative backdrop-blur-2xl border rounded-[2rem] p-8 sm:p-10 shadow-2xl transition-all duration-500 z-10",
                isDarkMode 
                  ? "bg-[#0b1120]/90 border-slate-800 shadow-black/50" 
                  : "bg-white/90 border-white shadow-slate-200/50"
              )}>
                <Outlet context={{ isDarkMode }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
