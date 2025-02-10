/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import useUploadStore from "../stores/uploadStore";
import {
  getPresignedUrl,
  uploadFile,
  completeFileUpload,
  fetchFilePreview,
} from "../lib/services/upload.service";
import { MAX_FILE_SIZE, SSE_EVENTS_URL } from "../lib/constants";
import { HttpStatusCode } from "axios";
import { FilePreviewData } from "@/lib/types/file-preview-data";

export const useFileUploader = () => {
  const {
    file,
    progress,
    status,
    error,
    setFile,
    setProgress,
    setStatus,
    setError,
  } = useUploadStore();

  const [fileContent, setFileContent] = useState<FilePreviewData>([]);
  const [, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    // Create new EventSource connection
    const sse = new EventSource(SSE_EVENTS_URL);

    // Connection opened
    sse.onopen = () => {
      console.log("SSE connection opened");
    };

    // Listen for messages
    sse.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "fileUpload" && data.status === "processed") {
          const numRecords = 50; // Fetch just 50 records for preview
          const previewData = await fetchFilePreview(data.fileId, numRecords);

          setFileContent(previewData);
        }
      } catch (error) {
        console.error("Error processing SSE message:", error);
      }
    };

    sse.onerror = (error) => {
      console.error("SSE error:", error);

      if (sse.readyState === EventSource.CLOSED) {
        console.log("SSE connection closed. Attempting to reconnect...");

        setTimeout(() => {
          const newSse = new EventSource(SSE_EVENTS_URL);
          newSse.onopen = sse.onopen;
          newSse.onmessage = sse.onmessage;
          newSse.onerror = sse.onerror;
          setEventSource(newSse);
        }, 5000); // Reconnect after 5 seconds
      }
    };

    setEventSource(sse);

    // Cleanup on unmount
    return () => {
      if (sse) {
        sse.close();
        setEventSource(null);
      }
    };
  }, [setStatus]);

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
        setFileContent([]);
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
        .then((buffer: any) => new Uint8Array(buffer)[0]);

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
    } catch (error) {
      setError((error as Error).message);
      setStatus("error");
    }
  }, [file, setStatus, setProgress, setError]);

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
