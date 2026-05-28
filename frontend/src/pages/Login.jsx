import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, UserRound, Users, Stethoscope, Eye, EyeOff, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../utils/cn';
import { authService } from '../services/auth.service';

// Minimal Floating Label Input for the Premium Feel
const FloatingInput = ({ label, icon: Icon, type, error, isDarkMode, rightElement, ...props }) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value);

  const handleBlur = (e) => {
    setFocused(false);
    setHasValue(!!e.target.value);
  };

  return (
    <div className="relative w-full">
      <div className={cn(
        "relative flex items-center w-full rounded-xl border transition-all duration-300 overflow-hidden group",
        isDarkMode
          ? "bg-slate-900/50 border-slate-700/50 hover:border-slate-600"
          : "bg-slate-50 border-slate-200 hover:border-slate-300",
        focused && (isDarkMode
          ? "border-blue-500/80 bg-slate-900 ring-4 ring-blue-500/10"
          : "border-blue-500 bg-white ring-4 ring-blue-500/10"),
        error && (isDarkMode
          ? "border-rose-500/80 ring-4 ring-rose-500/10"
          : "border-rose-500 ring-4 ring-rose-500/10")
      )}>
        <div className="pl-4 pr-3 flex items-center justify-center text-slate-400 z-10 transition-colors">
          <Icon className={cn(
            "w-5 h-5 transition-colors duration-300",
            focused && "text-blue-500",
            error && "text-rose-500",
            !focused && !error && (isDarkMode ? "group-hover:text-slate-300" : "group-hover:text-slate-500")
          )} />
        </div>
        <input
          {...props}
          type={type}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          onChange={(e) => {
            setHasValue(!!e.target.value);
            if (props.onChange) props.onChange(e);
          }}
          className={cn(
            "w-full pt-7 pb-3 pr-4 bg-transparent outline-none text-base font-medium transition-colors relative z-10",
            isDarkMode ? "text-white" : "text-slate-900",
            rightElement ? "pr-12" : ""
          )}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
            {rightElement}
          </div>
        )}
        <label
          className={cn(
            "absolute left-[3.25rem] transition-all duration-300 pointer-events-none z-0",
            (focused || hasValue)
              ? "text-[11px] top-2 font-semibold tracking-wide uppercase " + (error ? "text-rose-500" : "text-blue-500")
              : "text-[15px] top-1/2 -translate-y-1/2 text-slate-400"
          )}
        >
          {label}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="text-[13px] text-rose-500 mt-2 ml-1 font-medium flex items-center gap-1.5"
          >
            <ShieldCheck size={14} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const ROLES_TABS = [
  { id: 'admin', label: 'Admin', icon: ShieldCheck, email: 'admin@clinicdesk.com' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, email: 'doctor@clinicdesk.com' },
  { id: 'reception', label: 'Desk', icon: Users, email: 'desk@clinicdesk.com' },
  { id: 'patient', label: 'Patient', icon: UserRound, email: 'patient@clinicdesk.com' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { isDarkMode } = useOutletContext() || { isDarkMode: false };

  const [activeRole, setActiveRole] = useState(ROLES_TABS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: ROLES_TABS[0].email, password: 'password' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setFormData({ email: role.email, password: 'password' });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
<<<<<<< HEAD
=======
    
    try {
      // Mocking network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let user = null;
      if (activeRole.id === 'admin') {
        user = { id: 1, name: 'Admin User', role: 'admin' };
      } else if (activeRole.id === 'doctor') {
        user = { id: 2, name: 'Dr. Sarah Smith', role: 'doctor' };
      } else if (activeRole.id === 'reception') {
        user = { id: 4, name: 'Receptionist Jane', role: 'receptionist' }; 
      } else if (activeRole.id === 'patient') {
        user = { id: 3, name: 'John Doe', role: 'patient' };
      }
>>>>>>> 822c505efce474b36751a959a31f2aca31330464

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
        <h2 className={cn("text-3xl font-extrabold tracking-tight mb-2", isDarkMode ? "text-white" : "text-slate-900")}>
          Welcome Back
        </h2>
        <p className={cn("text-sm font-medium", isDarkMode ? "text-slate-400" : "text-slate-500")}>
          Sign in to access your secure workspace.
        </p>
      </div>

      {/* Role Tabs */}
      <div
        role="tablist"
        aria-label="Login roles"
        className={cn(
          "flex p-1.5 rounded-2xl mb-8 relative border shadow-sm",
          isDarkMode ? "bg-slate-900/60 border-slate-700/50" : "bg-slate-100/80 border-slate-200"
        )}>
        {ROLES_TABS.map((role) => {
          const isActive = activeRole.id === role.id;
          return (
            <button
              key={role.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => handleRoleChange(role)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRoleChange(role);
                }
              }}
              className={cn(
                "flex-1 flex flex-col items-center gap-1.5 py-3.5 xl:py-4 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-300 relative z-10 outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                isActive
                  ? "text-white"
                  : (isDarkMode ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700")
              )}
            >
              <role.icon className={cn("w-5 h-5 mb-1 transition-transform duration-300", isActive && "scale-110 drop-shadow-md")} strokeWidth={isActive ? 2.5 : 2} />
              {role.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl -z-10 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
                  <div className="absolute -inset-1 bg-blue-500/30 blur-lg -z-10 rounded-2xl" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence>
          {errors.form && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-semibold border border-rose-500/20 flex items-center gap-3">
                <div className="p-1 rounded-full bg-rose-500/20">
                  <ShieldCheck size={16} className="text-rose-600 dark:text-rose-400" />
                </div>
                {errors.form}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <FloatingInput
          label="Email Address"
          type="email"
          icon={Mail}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          isDarkMode={isDarkMode}
          placeholder="Enter your email"
        />

        <div className="space-y-5">
          <FloatingInput
            label="Password"
            type={showPassword ? "text" : "password"}
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            isDarkMode={isDarkMode}
            placeholder="Enter your password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={showPassword ? 'eyeOff' : 'eye'}
                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            }
          />

          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={cn(
                "w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-300 relative",
                rememberMe
                  ? "bg-blue-500 border-blue-500 shadow-md shadow-blue-500/20"
                  : (isDarkMode ? "bg-slate-900/50 border-slate-600 group-hover:border-blue-500/50" : "bg-slate-50 border-slate-300 group-hover:border-blue-400")
              )}>
                <AnimatePresence>
                  {rememberMe && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className={cn(
                "text-sm font-medium transition-colors select-none",
                isDarkMode ? "text-slate-300 group-hover:text-slate-200" : "text-slate-600 group-hover:text-slate-900"
              )}>
                Remember me
              </span>
            </label>
            <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors focus-visible:outline-none focus-visible:underline">
              Recover password
            </Link>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center py-4 rounded-xl text-white font-bold text-base transition-all overflow-hidden relative group mt-8",
            isLoading
              ? "bg-blue-600/80 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40"
          )}
        >
          {/* Shimmer effect */}
          {!isLoading && (
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
          )}

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex items-center gap-2 relative z-10"
              >
                <Loader2 className="animate-spin" size={20} />
                <span>Authenticating...</span>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex items-center gap-2 relative z-10"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </div>
  );
};

export default Login;
