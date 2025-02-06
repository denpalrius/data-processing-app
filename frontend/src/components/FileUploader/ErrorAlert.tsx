"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert } from '../alert';

interface ErrorAlertProps {
  error: string | null;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Alert variant="error">
      <AlertCircle className="h-4 w-4" />
      <div className="text-sm">{error}</div>
    </Alert>
  );
};