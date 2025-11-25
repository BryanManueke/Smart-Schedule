import React from 'react';

/**
 * LoadingSpinner component untuk menampilkan loading state
 */
export const LoadingSpinner = ({
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-slate-200 border-t-indigo-500 ${sizes[size]} ${className}`}
      {...props}
    />
  );
};

/**
 * LoadingOverlay component untuk menampilkan loading overlay dengan pesan
 */
export const LoadingOverlay = ({
  message,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 ${className}`}
      {...props}
    >
      <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-2xl">
        <LoadingSpinner size="md" className="mx-auto mb-4" />
        {message && <p className="font-semibold text-slate-700">{message}</p>}
      </div>
    </div>
  );
};

/**
 * LoadingScreen component untuk menampilkan loading screen full page
 */
export const LoadingScreen = ({
  message = 'Memuat...',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex min-h-[50vh] flex-col items-center justify-center gap-4 text-slate-500 ${className}`}
      {...props}
    >
      <LoadingSpinner size="md" />
      {message && <p>{message}</p>}
    </div>
  );
};


