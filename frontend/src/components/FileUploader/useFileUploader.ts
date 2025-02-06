"use client";

import { useCallback, useEffect, useState } from "react";
import useUploadStore from "../../stores/uploadStore";
import {
  getPresignedUrl,
  uploadFile,
  completeFileUpload,
  fetchFilePreview,
} from "../../lib/services/upload.service";
import {
  MAX_RETRIES,
  RETRY_DELAY,
  MAX_FILE_SIZE,
  WEBSOCKET_URL,
} from "../../lib/constants";
import { HttpStatusCode } from "axios";

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

  const [fileContent, setFileContent] = useState<string>("");

  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      console.log("WebSocket event received:", event);
      const data = JSON.parse(event.data);

      if (data.type === "UPLOAD_STATUS") {
        console.log("Upload status event received:", data.status);
        setStatus(data.status);
      } else if (data.type === "FILE_PREVIEW") {
        console.log("File preview event received:", data.content);
        setFileContent(data.content);
      } else {
        console.log("Unknown event type received:", data.type);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
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

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setStatus("uploading");
    setProgress(0);
    setError(null);

    try {
      const fileMagicNumber = await file
        .slice(0, 4)
        .arrayBuffer()
        .then((buffer) => new Uint8Array(buffer)[0]);

      const presignedDataRequest = {
        filename: file.name,
        contentType: file.type,
        size: file.size,
        magicNumber: fileMagicNumber,
      };

      const presignedRes = await getPresignedUrl(presignedDataRequest);
      if (!presignedRes.url) {
        throw new Error("Failed to get presigned URL");
      }

      const formData = new FormData();
      for (const [key, value] of Object.entries(presignedRes.fields || {})) {
        formData.append(key, value);
      }
      formData.append("file", new Blob([file]));

      const responseStatus = await uploadFile(presignedRes.url, formData);

      if (responseStatus !== HttpStatusCode.NoContent) {
        throw new Error(`Upload failed with status: ${responseStatus}`);
      }

      const uploadCompleteResponse = await completeFileUpload(
        presignedRes.fileId
      );
      if (!uploadCompleteResponse) {
        throw new Error("Failed to complete file upload");
      }

      setProgress(100);
      setStatus("complete");

      // Fetch file preview data
      const numRecords = 20; // Fetch jst 20 records for preview
      const previewData = await fetchFilePreview(presignedRes.fileId, numRecords);
      
      console.log("File preview data:", previewData);

      setFileContent(previewData);
    } catch (error) {
      setError((error as Error).message);
      setStatus("error");
    }
  }, [file, ws, setStatus, setProgress, setError]);

  return {
    file,
    progress,
    status,
    error,
    fileContent,
    handleFileSelect,
    handleUpload,
  };
};
