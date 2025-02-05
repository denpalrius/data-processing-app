export interface PresignedUploadUrlResponse {
  url: string;
  expires?: Date;
  fileId: string;
  objectName: string;
  fields?: Record<string, string>;
}
