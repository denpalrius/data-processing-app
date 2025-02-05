import { HttpStatusCode } from "axios";
import { URL_PART_PRESIGNED_URL } from "../constants";
import { PresignedUrlRequest } from "../models/presigned-url-request";
import { PresignedUrlResponse } from "../models/presigned-url-response";
import { ApiService } from "./api.service";

const apiService = new ApiService();

export async function getPresignedUrl(
  request: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  try {
    const response = await apiService.post<
      PresignedUrlRequest,
      PresignedUrlResponse
    >(URL_PART_PRESIGNED_URL, request);

    return response.data;
  } catch (error) {
    console.error("Error fetching presigned URL:", error);
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