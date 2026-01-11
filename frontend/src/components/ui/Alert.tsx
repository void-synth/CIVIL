/**
 * Alert Component
 * 
 * Reusable alert for messages, warnings, errors
 */

import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  className?: string;
}

export function Alert({ children, variant = 'info', title, className = '' }: AlertProps) {
  const baseClasses = 'p-4 rounded-lg border-l-4';
  
  const variantClasses = {
    info: 'bg-blue-50 border-blue-500 text-blue-800',
    success: 'bg-green-50 border-green-500 text-green-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    error: 'bg-red-50 border-red-500 text-red-800',
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {title && (
        <h4 className="font-semibold mb-1">{title}</h4>
      )}
      <div>{children}</div>
    </div>
  );
}
