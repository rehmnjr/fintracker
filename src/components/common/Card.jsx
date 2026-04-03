import React from 'react';

/**
 * Glassmorphism card wrapper.
 */
export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`glass-card p-6 ${hover ? '' : 'hover:transform-none'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
