import React from 'react';
import { Search } from 'lucide-react';

/**
 * SearchInput component untuk pencarian dengan icon
 */
export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Cari...',
  className = '',
  onFocus,
  onBlur,
  ...props
}) => {
  return (
    <div className={`relative flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 ${className}`}>
      <Search className="h-5 w-5 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        {...props}
      />
    </div>
  );
};


