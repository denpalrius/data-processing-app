export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

export interface UploadProgress {
  progress: number;
  status: UploadStatus;
}

export interface PresignedUrlResponse {
  uploadId: string;
  url: string;
}