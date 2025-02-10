"use client";

import React from "react";
import { Upload, RefreshCw, CheckCircle } from "lucide-react";
import { UploadStatus } from "../lib/types/upload-status";

interface UploadButtonProps {
  status: UploadStatus;
  onUpload: () => void;
  disabled: boolean;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  status,
  onUpload,
  disabled,
}) => (
  <button
    onClick={onUpload}
    disabled={disabled}
    aria-busy={status === "uploading"}
  >
    {status === "uploading" ? (
      <RefreshCw />
    ) : status === "complete" ? (
      <CheckCircle />
    ) : (
      <Upload />
    )}
    {status === "uploading"
      ? "Uploading..."
      : status === "complete"
      ? "Uploaded"
      : "Upload"}
  </button>
);
