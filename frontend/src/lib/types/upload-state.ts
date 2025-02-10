import { UploadStatus } from "./upload-status";
import { FilePreviewData } from "./file-preview-data";

export interface UploadState {
  file: File | null;
  progress: number;
  status: UploadStatus;
  error: string | null;
  retryCount: number;
  previewData: FilePreviewData;

  setFile: (file: File | null) => void;
  setProgress: (progress: number) => void;
  setStatus: (status: UploadStatus) => void;
  setError: (error: string | null) => void;
  setRetryCount: (count: number) => void;
  setPreviewData: (previewData: FilePreviewData) => void;
  reset: () => void;
}
