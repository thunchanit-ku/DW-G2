
import { API_BASE_URL, API_PREFIX , API_BASE_URL_OTHER } from './config';

export async function fetchCategoryDataService(stu: string) {
  const base = API_BASE_URL.replace(/\/+$/, ''); 
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const url = `${base}${prefix}/student/category-subject/${stu}`;
  console.log("urllllllll" , url);

 
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch student ${stu}: ${res.status} ${text}`);
  }
  return res.json();
}

  export async function getStudent_coursePlan(id: string) {
  const base = API_BASE_URL.replace(/\/+$/, ''); 
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const url = `${API_BASE_URL_OTHER}/student-plans/${id}`;
  console.log("url" , url);

 
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch student ${id}: ${res.status} ${text}`);
  }
  return res.json();
}