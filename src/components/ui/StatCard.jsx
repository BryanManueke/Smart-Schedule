import React from 'react';

/**
 * StatCard component untuk menampilkan statistik dengan icon, label, dan value
 */
export const StatCard = ({
  icon,
  label,
  value,
  helper,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-white border-slate-200',
    primary: 'bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-200',
    success: 'bg-emerald-100 text-emerald-800 border-slate-200',
    warning: 'bg-amber-100 text-amber-800 border-slate-200',
    info: 'bg-indigo-100 text-indigo-800 border-slate-200',
  };

  const iconVariants = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-white/10 text-white',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    info: 'bg-indigo-100 text-indigo-800',
  };

  const textVariants = {
    default: { label: 'text-slate-500', value: 'text-slate-900', helper: 'text-slate-500' },
    primary: { label: 'text-white/70', value: 'text-white', helper: 'text-white/70' },
    success: { label: 'text-slate-500', value: 'text-slate-900', helper: 'text-emerald-900' },
    warning: { label: 'text-slate-500', value: 'text-slate-900', helper: 'text-amber-900' },
    info: { label: 'text-slate-500', value: 'text-slate-900', helper: 'text-indigo-900' },
  };

  const colors = textVariants[variant] || textVariants.default;

  return (
    <div
      className={`rounded-3xl border bg-white p-6 shadow-sm ${variants[variant]} ${className}`}
      {...props}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${iconVariants[variant]}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-semibold ${colors.label}`}>{label}</p>
          <p className={`text-3xl font-bold ${colors.value}`}>{value}</p>
          {helper && (
            <p className={`text-xs ${colors.helper}`}>{helper}</p>
          )}
        </div>
      </div>
    </div>
  );
};


