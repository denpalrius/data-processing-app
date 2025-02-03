import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useUpload } from '../hooks/useUpload';
import { UploadProgress } from './UploadProgress';

export function FileUpload() {
  const { uploadId, error, startUpload } = useUpload();

  const onDrop = useCallback(async (files: File[]) => {
    if (files[0]) await startUpload(files[0]);
  }, [startUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false,
    maxSize: 100 * 1024 * 1024
  });

  return (
    <div className="w-full space-y-6">
      <div
        {...getRootProps()}
        className={`
          group
          w-full rounded-xl p-10
          transition-all duration-300 ease-in-out
          border-2 border-dashed cursor-pointer
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50/50' 
            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`
            p-4 rounded-full
            transition-all duration-300
            ${isDragActive 
              ? 'bg-blue-100' 
              : 'bg-gray-100 group-hover:bg-blue-100'
            }
          `}>
            <CloudArrowUpIcon 
              className={`
                w-10 h-10
                transition-colors duration-300
                ${isDragActive 
                  ? 'text-blue-600' 
                  : 'text-gray-400 group-hover:text-blue-500'
                }
              `}
            />
          </div>
          <div className="text-center space-y-2">
            <p className={`
              text-lg font-medium
              transition-colors duration-300
              ${isDragActive 
                ? 'text-blue-600' 
                : 'text-gray-700'
              }
            `}>
              {isDragActive ? 'Drop to upload' : 'Drop your file here'}
            </p>
            <p className="text-sm text-gray-500">
              or click to browse from your computer
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {uploadId && <UploadProgress uploadId={uploadId} />}
    </div>
  );
}