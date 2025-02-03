"use client";

import React from 'react';
import { Upload } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, disabled }) => (
  <div className="flex items-center justify-center w-full">
    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Upload className="w-8 h-8 mb-3 text-gray-500" />
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
      </div>
      <input
        type="file"
        className="hidden"
        onChange={onFileSelect}
        disabled={disabled}
      />
    </label>
  </div>
);