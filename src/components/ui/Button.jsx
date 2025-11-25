import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-600',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
    gradient: 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-800 text-white shadow-lg shadow-indigo-500/40 hover:-translate-y-0.5',
    outline: 'border-2 border-slate-300 bg-transparent text-slate-600 hover:border-slate-400',
    ghost: 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'rounded-xl px-3 py-2 text-sm',
    md: 'rounded-2xl px-4 py-3 text-sm',
    lg: 'rounded-2xl px-5 py-3 text-base',
  };

  const iconElement = icon && (
    <span className={loading ? 'opacity-0' : ''}>{icon}</span>
  );

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {iconPosition === 'left' && iconElement}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
      {iconPosition === 'right' && iconElement}
    </button>
  );
};

export const IconButton = ({ children, className = '', variant = 'outline', ...props }) => {
  const variants = {
    outline: 'rounded-xl border border-slate-200 bg-white hover:border-indigo-200',
    ghost: 'rounded-xl hover:bg-slate-100',
    danger: 'rounded-xl border border-slate-200 bg-white hover:border-rose-200',
  };

  return (
    <button
      className={`flex h-9 w-9 items-center justify-center p-2 transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

