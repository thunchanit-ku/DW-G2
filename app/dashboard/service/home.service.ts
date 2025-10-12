
import { json } from 'stream/consumers';
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

export async function getcategory_require(id: string) {
  const base = API_BASE_URL.replace(/\/+$/, ''); 
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const url = `${base}${prefix}/student/category-require/${id}`;
  console.log("url" , url);

 
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch student ${id}: ${res.status} ${text}`);
  }
  return res.json();
}
  export async function getGrade_progress(id: string) {
  const base = API_BASE_URL.replace(/\/+$/, ''); 
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const url = `${base}${prefix}/student/grade-progress/${id}`;
  console.log("url" , url);

 
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch student ${id}: ${res.status} ${text}`);
  }
  return res.json();
  
}