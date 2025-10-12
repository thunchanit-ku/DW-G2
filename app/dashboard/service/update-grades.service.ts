import { API_BASE_URL, API_PREFIX } from './config';

export async function getStudentInfo(studentUsername: string) {
  const base = API_BASE_URL.replace(/\/+$/, ''); 
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const url = `${base}${prefix}/fd/student/${studentUsername}`;
  console.log("getStudentInfo url:", url);

  const res = await fetch(url);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`Failed to fetch student info for ${studentUsername}: ${res.status} ${errorData.message || ''}`);
  }
  return res.json();
}

export async function getCompletedSemesters(studentUsername: string) {
  const base = API_BASE_URL.replace(/\/+$/, ''); 
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const url = `${base}${prefix}/fd/completed-semesters/${studentUsername}`;
  console.log("getCompletedSemesters url:", url);

  const res = await fetch(url);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`Failed to fetch completed semesters for ${studentUsername}: ${res.status} ${errorData.message || ''}`);
  }
  return res.json();
}

export async function getCourses(student: string, year: number, semester: number) {
  const base = API_BASE_URL.replace(/\/+$/, ''); 
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const url = `${base}${prefix}/fd/courses/${student}?year=${year}&semester=${semester}`;
  console.log("getCourses url:", url);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`Failed to fetch courses for ${student}: ${res.status} ${errorData.message || ''}`);
  }
  return res.json();
}
