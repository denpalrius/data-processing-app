"use client";

import React from 'react';

interface AlertProps {
  variant?: 'default' | 'error';
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ 
  variant = 'default', 
  children
}) => {
  return (
    <article aria-label={variant === 'error' ? 'Error message' : 'Alert message'}>
      <div className={variant === 'error' ? 'error' : ''}>
        {children}
      </div>
    </article>
  );
};