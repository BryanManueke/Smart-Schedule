import React from 'react';

/**
 * Textarea component dengan dukungan label dan error
 */
export const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-slate-600">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`${baseClasses} ${error ? 'border-rose-500' : ''}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-500">{error}</p>
      )}
    </div>
  );
};


