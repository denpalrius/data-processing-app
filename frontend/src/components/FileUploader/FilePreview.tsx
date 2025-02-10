"use client";

import React, { useState } from "react";

interface FilePreviewProps {
  fileContent: Array<{ [key: string]: any }>;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileContent }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fileContent.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: React.SetStateAction<number>) =>
    setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(fileContent.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <table className="table-auto w-full mb-4">
        <thead className="bg-gray-100">
          <tr>
            {fileContent.length > 0 &&
              Object.keys(fileContent[0]).map((key, index) => (
                <th key={index} className="px-4 py-2">
                  {key}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, index) => (
                <td key={index} className="px-4 py-2">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center space-x-2">
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`px-4 py-1 rounded-md ${
              currentPage === number ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => paginate(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilePreview;
