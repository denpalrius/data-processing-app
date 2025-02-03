"use client";

import React from 'react';
import { ProgressBar } from '../ProgressBar';
import { UploadButton } from '../UploadButton';
import { UploadStatus } from '../../types/upload';

interface FileDisplayProps {
  file: File;
  progress: number;
  status: UploadStatus;
  onUpload: () => void;
}

export const FileDisplay: React.FC<FileDisplayProps> = ({
  file,
  progress,
  status,
  onUpload,
}) => (
  <div className="space-y-2">
    <p className="text-sm text-gray-500">
      Selected file: {file.name}
    </p>
    
    <ProgressBar progress={progress} status={status} />
    
    <UploadButton
      status={status}
      onUpload={onUpload}
      disabled={status === 'uploading' || status === 'complete'}
    />
  </div>
);