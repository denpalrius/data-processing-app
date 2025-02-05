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

        <br />
        <br />
        <div className="absolute top-24 right-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 text-xs italic text-gray-700">
          Accepted file types: .csv, .json, .xls, .xlsx
        </div>

        <ErrorAlert error={error} />
      </div>
    </div>
  );
};

export default FileUploader;
