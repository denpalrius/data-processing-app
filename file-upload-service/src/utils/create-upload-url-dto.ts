export interface CreateUploadUrlDto {
  filename: string;
  contentType: string;
  size?: number;
  magicNumber?: number;
}
