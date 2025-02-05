"use client";

import React, { useState } from "react";
import { useFileUploader } from "./useFileUploader";
import { ErrorAlert } from "./ErrorAlert";
import { FileDisplay } from "./FileDisplay";
import { UploadZone } from "./UploadZone";
import { Info } from "lucide-react";

const FileUploader: React.FC = () => {
  const { file, progress, status, error, handleFileSelect, handleUpload } =
    useFileUploader();

  const [showAcceptedFileTypes, setShowAcceptedFileTypes] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="space-y-4">
        <UploadZone
          onFileSelect={handleFileSelect}
          disabled={status === "uploading"}
        />

        {file && (
          <FileDisplay
            file={file}
            progress={progress}
            status={status}
            onUpload={handleUpload}
          />
        )}

        <ErrorAlert error={error} />
      </div>
    </div>
  );
};

export default FileUploader;
