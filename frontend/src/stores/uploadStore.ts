import { UploadState } from "@/lib/types/upload-state";
import { create } from "zustand";

const useUploadStore = create<UploadState>((set) => ({
  file: null,
  progress: 0,
  status: "idle",
  error: null,
  retryCount: 0,
  previewData: [],

  setFile: (file) => set({ file }),
  setProgress: (progress) => set({ progress }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setRetryCount: (count) => set({ retryCount: count }),
  setPreviewData: (previewData) => set({ previewData }),
  reset: () =>
    set({
      file: null,
      progress: 0,
      status: "idle",
      error: null,
      retryCount: 0,
      previewData: [],
    }),
}));

export default useUploadStore;
