
import { API_BASE_URL, API_PREFIX } from './config';

export async function getStudent(stu: any) {
  const base = API_BASE_URL.replace(/\/+$/, ''); 
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const url = `${base}${prefix}/student/profile/${stu}`;
  console.log("urllllllll" , url);

 
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch student ${stu}: ${res.status} ${text}`);
  }
  return res.json();
}
