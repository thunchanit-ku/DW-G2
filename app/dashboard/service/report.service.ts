
import { API_BASE_URL, API_PREFIX } from './config';

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

export async function getCoursePlanRes(stu: string) {
    const base = API_BASE_URL.replace(/\/+$/, ''); 
    const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
    const url = `${base}${prefix}/student/courseplan-checking/${stu}`;
    console.log("urllllllll" , url);
  
   
    const res = await fetch(url);
  
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Failed to fetch student ${stu}: ${res.status} ${text}`);
    }
    return res.json();
  }
