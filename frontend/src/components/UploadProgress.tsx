import { useWebSocket } from '../hooks/useWebSocket';

export function UploadProgress({ uploadId }: { uploadId: string }) {
  const { progress, status } = useWebSocket(uploadId);

  return (
    <div className="bg-white/80 rounded-xl p-6 border border-gray-100 space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700 capitalize">{status}</span>
          <span className="text-gray-500 font-medium">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}