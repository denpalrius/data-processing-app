export interface PresignedUrlResponse {
  url: string;
  expires: string;
  fileId: string;
  objectName: string;
  fields?: Record<string, string>;
  // fields: {
  //   key: string;
  //   bucket: string;
  //   "x-amz-meta-Content-Type": string;
  //   "x-amz-meta-Original-Name": string;
  //   "x-amz-meta-File-Id": string;
  //   "x-amz-date": string;
  //   "x-amz-algorithm": string;
  //   "x-amz-credential": string;
  //   policy: string;
  //   "x-amz-signature": string;
  // };
}
