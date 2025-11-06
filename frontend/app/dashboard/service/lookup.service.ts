import { API_BASE_URL, API_PREFIX } from './config';

export type LookupItem = { id: number; name: string; studentCount?: number };

async function getJson<T>(path: string): Promise<T> {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const url = `${base}${prefix}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export function fetchDepartments(): Promise<LookupItem[]> {
  return getJson('/report/departments');
}

export function fetchPrograms(): Promise<LookupItem[]> {
  return getJson('/report/programs');
}


