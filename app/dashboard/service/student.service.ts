import { API_BASE_URL, API_PREFIX } from './config';

export async function getStudentProfile(studentId: string) {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const url = `${base}${prefix}/student/profile/${studentId}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch student profile: ${res.status} ${text}`);
  }
  return res.json();
}