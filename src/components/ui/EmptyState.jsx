import React from 'react';

/**
 * EmptyState component untuk menampilkan state kosong dengan ikon, judul, deskripsi, dan action button
 */
export const EmptyState = ({
  icon = '📭',
  title = 'Tidak ada data',
  description,
  action,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 p-10 text-center ${className}`}
      {...props}
    >
      {icon && <div className="text-4xl">{icon}</div>}
      {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
      {description && <p className="text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};


