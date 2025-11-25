import React from 'react';

/**
 * Badge component untuk menampilkan status, priority, atau label
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-indigo-100 text-indigo-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-sky-100 text-sky-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * StatusBadge khusus untuk status jadwal/kegiatan
 */
export const StatusBadge = ({ status, className = '' }) => {
  const statusMap = {
    'Selesai': { variant: 'success', text: '✅ Selesai' },
    'Sedang Berlangsung': { variant: 'primary', text: '⚡ Sedang Berlangsung' },
    'Belum Dilaksanakan': { variant: 'warning', text: '⏳ Belum Dilaksanakan' },
  };

  const config = statusMap[status] || { variant: 'default', text: status };

  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  );
};

/**
 * PriorityBadge khusus untuk prioritas jadwal
 */
export const PriorityBadge = ({ priority, className = '' }) => {
  const priorityMap = {
    'Tinggi': { variant: 'danger', text: '🔴 Tinggi' },
    'Sedang': { variant: 'warning', text: '🟡 Sedang' },
    'Rendah': { variant: 'success', text: '🟢 Rendah' },
  };

  const normalizedPriority = priority || 'Sedang';
  const config = priorityMap[normalizedPriority] || priorityMap['Sedang'];

  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  );
};


