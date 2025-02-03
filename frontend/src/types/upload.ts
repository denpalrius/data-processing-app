export type UploadStatus =
  | "idle"
  | "ready"
  | "uploading"
  | "complete"
  | "error";

export interface UploadState {
  file: File | null;
  progress: number;
  status: UploadStatus;
  error: string | null;
  retryCount: number;
  ws: WebSocket | null;
  setFile: (file: File | null) => void;
  setProgress: (progress: number) => void;
  setStatus: (status: UploadStatus) => void;
  setError: (error: string | null) => void;
  setRetryCount: (count: number) => void;
  setWs: (ws: WebSocket | null) => void;
  reset: () => void;
}
