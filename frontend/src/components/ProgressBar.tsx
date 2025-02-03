"use client";

import React from 'react';

interface ProgressBarProps {
  progress: number;
  status: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => (
  <div>
    <progress value={progress} max="100"></progress>
    <div role="status" className="progress-info">
      <span>{Math.round(progress)}%</span>
      <span>{status}</span>
    </div>
  </div>
);
