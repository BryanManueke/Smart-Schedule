import React from 'react';

/**
 * NavItem component untuk navigation items di sidebar
 */
export const NavItem = ({
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
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? 'bg-white text-slate-900 shadow-lg shadow-slate-900/20'
          : 'text-slate-400 hover:bg-white/5'
      } ${className}`}
      onClick={() => onClick?.(id)}
      {...props}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {label}
    </button>
  );
};

/**
 * NavGroup component untuk mengelola group navigation items
 */
export const NavGroup = ({
  items = [],
  activeItem,
  onItemClick,
  className = '',
  ...props
}) => {
  return (
    <nav className={`flex flex-1 flex-col gap-2 ${className}`} {...props}>
      {items.map((item) => (
        <NavItem
          key={item.id}
          id={item.id}
          label={item.label}
          icon={item.icon}
          active={activeItem === item.id}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
};


