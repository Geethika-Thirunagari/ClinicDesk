import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, UserRound, Users, Stethoscope, Eye, EyeOff, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../utils/cn';
import { authService } from '../services/auth.service';

const ROLES_TABS = [
  { id: 'admin', label: 'Admin', icon: ShieldCheck, email: 'admin@clinicdesk.com' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, email: 'doctor@clinicdesk.com' },
  { id: 'reception', label: 'Desk', icon: Users, email: 'desk@clinicdesk.com' },
  { id: 'patient', label: 'Patient', icon: UserRound, email: 'patient@clinicdesk.com' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [activeRole, setActiveRole] = useState(ROLES_TABS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: ROLES_TABS[0].email, password: 'ClinicDesk@2025!' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    // BUG FIX: Ensure the correct password is automatically populated when switching roles
    setFormData({ email: role.email, password: 'ClinicDesk@2025!' });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    try {
      const response = await authService.login(formData);

      if (response.user && response.token) {
        login(response.user, response.token);
        navigate(useAuthStore.getState().getHome(), { replace: true });
      } else {
        setErrors({ form: 'Invalid response from server.' });
      }
    } catch (error) {
      setErrors({ form: error.response?.data?.error || 'Authentication failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black tracking-tight mb-2 text-[#0a1a0f]">
          Welcome Back
        </h2>
        <p className="text-sm font-medium text-slate-500">
          Sign in to access your secure workspace.
        </p>
      </div>

      <div className="flex p-1.5 rounded-[16px] mb-8 relative border shadow-sm bg-slate-50 border-[#e2e8e2]">
        {ROLES_TABS.map((role) => {
          const isActive = activeRole.id === role.id;
          return (
            <button
              type="button"
              key={role.id}
              onClick={() => handleRoleChange(role)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-all duration-300 relative z-10 outline-none",
                isActive ? "text-white" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <role.icon className={cn("w-5 h-5 mb-1 transition-transform", isActive && "scale-110")} />
              {role.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl -z-10 shadow-lg bg-[#0a1a0f]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence>
          {errors.form && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold border border-rose-100 flex items-center gap-2 mb-2">
                <ShieldCheck size={16} />
                {errors.form}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={cn(
                "w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-sm outline-none transition-all font-bold text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)]",
                errors.email ? "border-rose-300 focus:border-rose-500" : "border-[#e2e8e2] focus:border-emerald-500"
              )}
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={cn(
                "w-full pl-11 pr-12 py-3 bg-white border rounded-xl text-sm outline-none transition-all font-bold text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)]",
                errors.password ? "border-rose-300 focus:border-rose-500" : "border-[#e2e8e2] focus:border-emerald-500"
              )}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1 pt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className={cn(
              "w-4 h-4 rounded border flex items-center justify-center transition-all",
              rememberMe ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300 group-hover:border-emerald-400"
            )}>
              {rememberMe && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <input type="checkbox" className="hidden" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
            Recover password
          </Link>
        </div>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center py-3.5 rounded-xl text-white font-black text-sm transition-all mt-8",
            isLoading ? "bg-[#0a1a0f]/80" : "bg-[#0a1a0f] hover:bg-[#112a18] shadow-lg shadow-emerald-900/20"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Authenticating...</div>
          ) : (
            <div className="flex items-center gap-2">Continue to Dashboard <ArrowRight size={18} /></div>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default Login;
