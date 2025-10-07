
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
export const API_PREFIX = (process.env.NEXT_PUBLIC_API_PREFIX ?? 'api').replace(/^\/+|\/+$/g, '');

