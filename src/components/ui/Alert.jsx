import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

/**
 * Alert component untuk menampilkan pesan error, success, warning, atau info
 */
export const Alert = ({
  children,
  variant = 'info',
  icon: customIcon,
  onClose,
  className = '',
  ...props
}) => {
  const variants = {
    error: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
    info: 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white',
  };

  const icons = {
    error: <XCircle className="h-5 w-5" />,
    success: <CheckCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  const icon = customIcon || icons[variant];

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-lg ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span className="flex-1">{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 rounded-full p-1 hover:bg-white/20 transition"
          aria-label="Close"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};


