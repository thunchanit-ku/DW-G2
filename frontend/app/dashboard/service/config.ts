// Use environment variable for production, fallback to localhost for development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';
export const API_BASE_URL_OTHER = 'http://158.108.207.232:8087/v1';
export const API_PREFIX = 'api';