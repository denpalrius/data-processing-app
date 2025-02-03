import { create } from 'zustand';
import { UploadState, UploadStatus } from '../types/upload';

const useUploadStore = create<UploadState>((set) => ({
  file: null,
  progress: 0,
  status: 'idle',
  error: null,
  retryCount: 0,
  ws: null,
  setFile: (file) => set({ file }),
  setProgress: (progress) => set({ progress }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setRetryCount: (count) => set({ retryCount: count }),
  setWs: (ws) => set({ ws }),
  reset: () => set({
    file: null,
    progress: 0,
    status: 'idle',
    error: null,
    retryCount: 0
  })
}));

export default useUploadStore;