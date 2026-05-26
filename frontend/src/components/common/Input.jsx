import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({ 
  className, 
  label, 
  error, 
  icon: Icon,
  id,
  ...props 
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-xl border bg-white/50 px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pl-10",
            error 
              ? "border-rose-300 focus-visible:ring-rose-500/30 focus-visible:border-rose-500" 
              : "border-slate-200 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 hover:border-slate-300",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-rose-500 font-medium animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
