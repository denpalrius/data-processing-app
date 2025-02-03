import { useState } from 'react';
import { getPresignedUrl, completeUpload } from '../lib/api';

export const useUpload = () => {
  const [uploadId, setUploadId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const startUpload = async (file: File) => {
    try {
      setError('');
      const { url, uploadId } = await getPresignedUrl(file.name, file.type);
      setUploadId(uploadId);

      await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      await completeUpload(uploadId);
      return uploadId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    }
  };

  return { uploadId, error, startUpload };
};