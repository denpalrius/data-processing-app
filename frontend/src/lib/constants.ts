import 'dotenv/config';

export const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // 1 second

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3002';
export const URL_PART_PRESIGNED_URL = "/storage/presigned-url";
export const URL_PART_UPLOAD = "/storage/preview";
export const URL_PART_COMPLETE_UPLOAD = "/storage/complete-upload";

export const SSE_EVENTS_URL = process.env.SSE_EVENTS_URL || 'http://localhost:8081/events';
