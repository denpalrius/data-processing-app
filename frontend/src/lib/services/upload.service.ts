import { HttpStatusCode } from "axios";
import {
  URL_PART_COMPLETE_UPLOAD,
  URL_PART_PRESIGNED_URL,
  URL_PART_UPLOAD,
} from "../constants";
import { PresignedUrlRequest } from "../models/presigned-url-request";
import { PresignedUrlResponse } from "../models/presigned-url-response";
import { ApiService } from "./api.service";
import axios from "axios";

const allowedFileTypes = [
  "text/csv",
  "application/sql",
  "application/json",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const apiService = new ApiService();

export async function getPresignedUrl(
  request: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  if (!allowedFileTypes.includes(request.contentType)) {
    throw new Error(
      "Unsupported file type (Supported file types: CSV, JSON, XLSX)"
    );
  }

  try {
    const response = await apiService.post<
      PresignedUrlRequest,
      PresignedUrlResponse
    >(URL_PART_PRESIGNED_URL, request);

    return response.data;
  } catch (error: any) {
    throw new Error("Failed to get presigned URL");
  }
}

export async function uploadFile(
  url: string,
  formData: FormData
): Promise<HttpStatusCode> {
  try {
    const response = await apiService.post<FormData, Response>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status !== HttpStatusCode.NoContent) {
      throw new Error("File upload failed");
    }

    return response.status;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
}

export async function completeFileUpload(fileId: string): Promise<boolean> {
  try {
    const response = await apiService.post<void, Response>(
      `${URL_PART_COMPLETE_UPLOAD}?fileId=${fileId}`
    );

    if (response.status !== HttpStatusCode.Created) {
      throw new Error("Failed to complete file upload");
    }

    return true;
  } catch (error) {
    console.error("Error completing file upload:", error);
    throw new Error("Failed to complete file upload");
  }
}

export const fetchFilePreview = async (fileId: string, numRecords: number) => {  
  const response = await apiService.get(
    `${URL_PART_UPLOAD}?fileId=${fileId}&numRecords=${numRecords}`
  );

  if (response.status !== HttpStatusCode.Ok) {
    throw new Error("Failed to fetch file preview");
  }
  return response.data; 
};  
