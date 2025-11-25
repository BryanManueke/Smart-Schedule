import React from 'react';

/**
 * TabButton component untuk navigasi tab
 */
export const TabButton = ({
  id,
  label,
  icon,
  active = false,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? 'bg-indigo-600 text-white shadow-lg'
          : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-200'
      } ${className}`}
      onClick={() => onClick?.(id)}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
};

/**
 * TabGroup component untuk mengelola group tab buttons
 */
export const TabGroup = ({
  tabs = [],
  activeTab,
  onTabChange,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`} {...props}>
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          id={tab.id}
          label={tab.label}
          icon={tab.icon}
          active={activeTab === tab.id}
          onClick={onTabChange}
        />
      ))}
    </div>
  );
};


