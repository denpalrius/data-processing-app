"use client";

import { useCallback, useEffect } from "react";
import useUploadStore from "../../stores/uploadStore";
import { getPresignedUrl, uploadChunk } from "../../lib/upload";
import {
  MAX_RETRIES,
  RETRY_DELAY,
  CHUNK_SIZE,
  MAX_FILE_SIZE,
  WEBSOCKET_URL,
} from "../../lib/constants";

export const useFileUploader = () => {
  const {
    file,
    progress,
    status,
    error,
    retryCount,
    ws,
    setFile,
    setProgress,
    setStatus,
    setError,
    setRetryCount,
    setWs,
  } = useUploadStore();

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "UPLOAD_STATUS") {
        setStatus(data.status);
      }
    };

    setWs(socket);

    return () => {
      socket.close();
      setWs(null);
    };
  }, [setStatus, setWs]);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        if (selectedFile.size > MAX_FILE_SIZE) {
          setError("File too large. Maximum size is 100MB.");
          return;
        }
        setFile(selectedFile);
        setStatus("ready");
        setError(null);
      }
    },
    [setFile, setStatus, setError]
  );

  const attemptChunkUpload = async (
    chunk: Blob,
    fileName: string,
    chunkIndex: number
  ) => {
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const { url } = await getPresignedUrl(fileName, chunkIndex);
        if (!url) {
          throw new Error("Failed to get presigned URL");
        }

        const response = await uploadChunk(chunk, url);
        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }

        return response; // Successful upload
      } catch (error) {
        retries++;

        // If it's a 404, fail immediately
        if ((error as any).response?.status === 404) {
          throw new Error("Upload endpoint not found");
        }

        // If we've exhausted retries, throw the error
        if (retries === MAX_RETRIES) {
          throw new Error(
            `Failed after ${MAX_RETRIES} attempts: ${(error as Error).message}`
          );
        }

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * retries)
        ); // Exponential backoff
        continue;
      }
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setStatus("uploading");
    setProgress(0);
    setError(null);

    try {
      const chunks = Math.ceil(file.size / CHUNK_SIZE);

      for (let i = 0; i < chunks; i++) {
        const chunk = file.slice(
          i * CHUNK_SIZE,
          Math.min((i + 1) * CHUNK_SIZE, file.size)
        );

        try {
          await attemptChunkUpload(chunk, file.name, i);

          const progress = ((i + 1) / chunks) * 100;
          setProgress(progress);

          ws?.send(
            JSON.stringify({
              type: "CHUNK_UPLOADED",
              fileName: file.name,
              chunkIndex: i,
              progress,
            })
          );
        } catch (error) {
          setError((error as Error).message);
          setStatus("error");
          return; // Stop uploading remaining chunks on failure
        }
      }

      setStatus("complete");
    } catch (error) {
      setError("Upload failed. Please try again.");
      setStatus("error");
    }
  }, [file, ws, setStatus, setProgress, setError]);

  return {
    file,
    progress,
    status,
    error,
    handleFileSelect,
    handleUpload,
  };
};
