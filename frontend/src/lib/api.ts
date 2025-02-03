import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

export const getPresignedUrl = async (fileName: string, fileType: string) => {
  const response = await api.post("/upload/presigned-url", {
    fileName,
    fileType,
  });
  return response.data.presignedUrl;
};

export const completeUpload = async (uploadId: string): Promise<void> => {
  await api.post(`/upload/${uploadId}/complete`);
};

export const getUploadStatus = async (uploadId: string) => {
  const response = await api.get(`/upload/${uploadId}/status`);
  return response.data;
}


// TODO:Add OAUTH
// OAuth Authentication token integration
