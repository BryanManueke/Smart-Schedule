import React from 'react';

/**
 * Input component dengan dukungan icon dan berbagai variant
 */
export const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  icon,
  iconPosition = 'left',
  error,
  disabled = false,
  className = '',
  onFocus,
  onBlur,
  ...props
}) => {
  const baseClasses = 'w-full rounded-2xl border-2 border-slate-200/70 bg-white/70 px-4 py-3 text-[15px] text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60';
  
  const iconClasses = 'pointer-events-none absolute top-1/2 -translate-y-1/2 h-5 w-5 transition-colors';
  const iconLeftClasses = `${iconClasses} left-4 text-slate-400`;
  const iconRightClasses = `${iconClasses} right-4 text-slate-400`;

  const hasIconLeft = icon && iconPosition === 'left';
  const hasIconRight = icon && iconPosition === 'right';
  
  const paddingLeft = hasIconLeft ? 'pl-12' : '';
  const paddingRight = hasIconRight ? 'pr-12' : '';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-slate-600">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {hasIconLeft && (
          <div className={iconLeftClasses}>
            {icon}
          </div>
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`${baseClasses} ${paddingLeft} ${paddingRight} ${error ? 'border-rose-500' : ''}`}
          {...props}
        />
        {hasIconRight && (
          <div className={iconRightClasses}>
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-rose-500">{error}</p>
      )}
    </div>
  );
};


