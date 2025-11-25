import React from 'react';

/**
 * Card component sebagai container dengan berbagai variant
 */
export const Card = ({
  children,
  variant = 'default',
  className = '',
  padding = true,
  ...props
}) => {
  const variants = {
    default: 'rounded-3xl border border-slate-200 bg-white shadow-sm',
    elevated: 'rounded-3xl border border-slate-200 bg-white shadow-lg',
    outlined: 'rounded-3xl border-2 border-slate-200 bg-white',
    filled: 'rounded-3xl border border-slate-200 bg-slate-50/70',
    gradient: 'rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 text-white',
  };

  const paddingClasses = padding ? 'p-6' : '';

  return (
    <div className={`${variants[variant]} ${paddingClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Card Header component
 */
export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

/**
 * Card Title component
 */
export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-slate-900 ${className}`}>
    {children}
  </h3>
);

/**
 * Card Description component
 */
export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-500 ${className}`}>
    {children}
  </p>
);

/**
 * Card Content component
 */
export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

/**
 * Card Footer component
 */
export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 ${className}`}>
    {children}
  </div>
);


