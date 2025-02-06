"use client";

import React from "react";

interface FilePreviewProps {
  fileContent: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileContent }) => {
  return (
    <div className="file-preview">
      <h3>File Preview</h3>
      <pre>{fileContent}</pre>
    </div>
  );
};

export default FilePreview;