import { CHUNK_SIZE } from './constants';

export const getPresignedUrl = async (fileName: string, chunkIndex: number) => {
  try {
    const response = await fetch('/api/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        chunkIndex,
      }),
    });
    
    if (!response.ok) throw new Error('Failed to get presigned URL');
    
    return await response.json();
  } catch (error) {
    throw new Error('Failed to get presigned URL');
  }
};

export const uploadChunk = async (
  chunk: Blob,
  url: string,
  headers: Record<string, string> = {}
) => {
  const response = await fetch(url, {
    method: 'PUT',
    body: chunk,
    headers: {
      'Content-Type': 'application/octet-stream',
      ...headers,
    },
  });

  if (!response.ok) throw new Error('Chunk upload failed');
  return response;
};
