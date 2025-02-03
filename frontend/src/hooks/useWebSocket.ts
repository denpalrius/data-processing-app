import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import type { UploadStatus } from '../types/upload';

export const useWebSocket = (uploadId?: string) => {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<UploadStatus>('idle');

  useEffect(() => {
    if (!uploadId) return;

    const handleProgress = (progress: number) => {
      setProgress(progress);
    };

    const handleStatus = (status: UploadStatus) => {
      setStatus(status);
    };

    socket.connect();

    socket.on(`upload:progress:${uploadId}`, handleProgress);
    socket.on(`upload:status:${uploadId}`, handleStatus);

    return () => {
      socket.off(`upload:progress:${uploadId}`, handleProgress);
      socket.off(`upload:status:${uploadId}`, handleStatus);
      socket.disconnect();
    };
  }, [uploadId]);

  return { progress, status };
};
