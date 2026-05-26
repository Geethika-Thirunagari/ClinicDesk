import React from 'react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
    outline: 'border border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-500',
    ghost: 'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm rounded-md',
    md: 'h-10 py-2 px-4 rounded-md',
    lg: 'h-11 px-8 rounded-md',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

Button.displayName = 'Button';
