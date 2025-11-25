import React from 'react';
import { X } from 'lucide-react';

/**
 * Modal component untuk menampilkan modal dialog
 */
export const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
  closeOnOverlayClick = true,
  ...props
}) => {
  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4"
      onClick={handleOverlayClick}
      {...props}
    >
      <div
        className={`w-full ${sizes[size]} rounded-3xl bg-white p-6 shadow-2xl ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || onClose) && (
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
            {title && <h2 className="text-xl font-semibold text-slate-900">{title}</h2>}
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-full bg-slate-100 p-2 hover:bg-slate-200 transition"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            )}
          </div>
        )}
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  );
};

/**
 * ModalFooter component untuk menampilkan footer actions di modal
 */
export const ModalFooter = ({ children, className = '' }) => {
  return (
    <div className={`mt-6 flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
};


