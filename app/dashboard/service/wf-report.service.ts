import { API_BASE_URL, API_PREFIX } from './config';

export type WFCategoryRow = {
  category: string;
  total: number;
  percentW: number;
  percentF: number;
};

export async function fetchWFByCategory(params: {
  yearStart: number;
  yearEnd: number;
  departmentId?: number;
  programId?: number;
}): Promise<WFCategoryRow[]> {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const search = new URLSearchParams();
  search.set('yearStart', String(params.yearStart));
  search.set('yearEnd', String(params.yearEnd));
  if (params.departmentId != null) search.set('departmentId', String(params.departmentId));
  if (params.programId != null) search.set('programId', String(params.programId));
  const url = `${base}${prefix}/report/wf-category?${search.toString()}`;
  // Debug URL for troubleshooting
  console.log('[WF API] GET', url);

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch WF report: ${res.status} ${text}`);
  }
  const json = await res.json();
  console.log('[WF API] rows:', Array.isArray(json) ? json.length : json);
  return json;
}

export type BoxStats = { min: number; q1: number; median: number; q3: number; max: number };
export type WFBoxplotRow = { category: string; W: BoxStats; F: BoxStats };

export async function fetchWFBoxplotByCategory(params: {
  yearStart: number;
  yearEnd: number;
  departmentId?: number;
  programId?: number;
}): Promise<WFBoxplotRow[]> {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const search = new URLSearchParams();
  search.set('yearStart', String(params.yearStart));
  search.set('yearEnd', String(params.yearEnd));
  if (params.departmentId != null) search.set('departmentId', String(params.departmentId));
  if (params.programId != null) search.set('programId', String(params.programId));
  const url = `${base}${prefix}/report/wf-category-boxplot?${search.toString()}`;
  console.log('[WF BOX API] GET', url);
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch WF boxplot: ${res.status} ${text}`);
  }
  return res.json();
}

export type AvgGpaCategoryRow = { category: string; avgGpa: number | null; count: number };

export async function fetchAvgGpaByCategory(params: {
  yearStart: number;
  yearEnd: number;
  departmentId?: number;
  programId?: number;
}): Promise<AvgGpaCategoryRow[]> {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const search = new URLSearchParams();
  search.set('yearStart', String(params.yearStart));
  search.set('yearEnd', String(params.yearEnd));
  if (params.departmentId != null) search.set('departmentId', String(params.departmentId));
  if (params.programId != null) search.set('programId', String(params.programId));
  const url = `${base}${prefix}/report/avg-gpa-category?${search.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch Avg GPA: ${res.status} ${text}`);
  }
  return res.json();
}

export type GpaBoxplotRow = { category: string; GPA: BoxStats };

export async function fetchGpaBoxplotByCategory(params: {
  yearStart: number;
  yearEnd: number;
  departmentId?: number;
  programId?: number;
}): Promise<GpaBoxplotRow[]> {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const search = new URLSearchParams();
  search.set('yearStart', String(params.yearStart));
  search.set('yearEnd', String(params.yearEnd));
  if (params.departmentId != null) search.set('departmentId', String(params.departmentId));
  if (params.programId != null) search.set('programId', String(params.programId));
  const url = `${base}${prefix}/report/gpa-category-boxplot?${search.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch GPA boxplot: ${res.status} ${text}`);
  }
  return res.json();
}

export type SubjectGpaRow = {
  category: string;
  type: string;
  subjectCode: string;
  subjectName: string;
  year: number;
  avgGpa: number | null;
  studentCount: number;
};

export async function fetchSubjectGpaTable(params: {
  yearStart: number;
  yearEnd: number;
  departmentIds?: number[];
  programIds?: number[];
  departmentId?: number;
  programId?: number;
}): Promise<SubjectGpaRow[]> {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const search = new URLSearchParams();
  search.set('yearStart', String(params.yearStart));
  search.set('yearEnd', String(params.yearEnd));
  if (params.departmentIds?.length) search.set('departmentIds', params.departmentIds.join(','));
  else if (params.departmentId != null) search.set('departmentId', String(params.departmentId));
  if (params.programIds?.length) search.set('programIds', params.programIds.join(','));
  else if (params.programId != null) search.set('programId', String(params.programId));
  const url = `${base}${prefix}/report/subject-gpa-table?${search.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch Subject GPA table: ${res.status} ${text}`);
  }
  return res.json();
}

export type CategoryTeachingHeatmapRow = {
  category: string;
  mode: 'ภาคบรรยาย' | 'ปฏิบัติ' | 'บรรยายและปฏิบัติ' | 'อื่นๆ';
  avgGpa: number | null;
  studentCount: number;
};

export async function fetchCategoryTeachingHeatmap(params: {
  yearStart: number;
  yearEnd: number;
  departmentIds?: number[];
  programIds?: number[];
  departmentId?: number;
  programId?: number;
}): Promise<CategoryTeachingHeatmapRow[]> {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const search = new URLSearchParams();
  search.set('yearStart', String(params.yearStart));
  search.set('yearEnd', String(params.yearEnd));
  if (params.departmentIds?.length) search.set('departmentIds', params.departmentIds.join(','));
  else if (params.departmentId != null) search.set('departmentId', String(params.departmentId));
  if (params.programIds?.length) search.set('programIds', params.programIds.join(','));
  else if (params.programId != null) search.set('programId', String(params.programId));
  const url = `${base}${prefix}/report/heatmap-category-teaching?${search.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch category teaching heatmap: ${res.status} ${text}`);
  }
  return res.json();
}

export type GpaScatterPoint = {
  subjectCode: string;
  year: number;
  semesterPart: 0 | 1 | 2;
  classId: number | null;
  avgGpa: number | null;
  periodTime?: string | null; // optional legacy
  meanHour?: number | null;   // computed on server
};

export async function fetchAvgGpaScatter(params: {
  yearStart: number;
  yearEnd: number;
  departmentId?: number;
  programId?: number;
  semesterParts?: (0 | 1 | 2)[];
}): Promise<GpaScatterPoint[]> {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const search = new URLSearchParams();
  search.set('yearStart', String(params.yearStart));
  search.set('yearEnd', String(params.yearEnd));
  if (params.departmentId != null) search.set('departmentId', String(params.departmentId));
  if (params.programId != null) search.set('programId', String(params.programId));
  if (params.semesterParts?.length) search.set('semesterParts', params.semesterParts.join(','));
  const url = `${base}${prefix}/report/avg-gpa-scatter?${search.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch GPA scatter: ${res.status} ${text}`);
  }
  return res.json();
}

export type SubjectGradeCount = {
  subjectCode: string;
  year: number;
  semesterPart: 0 | 1 | 2;
  total: number;
  countF: number;
  countW: number;
  countP: number;
};

export async function fetchSubjectGradeCounts(params: {
  yearStart: number;
  yearEnd: number;
  departmentId?: number;
  programId?: number;
  semesterParts?: (0 | 1 | 2)[];
}): Promise<SubjectGradeCount[]> {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const prefix = API_PREFIX ? `/${API_PREFIX}` : '';
  const search = new URLSearchParams();
  search.set('yearStart', String(params.yearStart));
  search.set('yearEnd', String(params.yearEnd));
  if (params.departmentId != null) search.set('departmentId', String(params.departmentId));
  if (params.programId != null) search.set('programId', String(params.programId));
  if (params.semesterParts?.length) search.set('semesterParts', params.semesterParts.join(','));
  const url = `${base}${prefix}/report/subject-grade-counts?${search.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch subject grade counts: ${res.status} ${text}`);
  }
  return res.json();
}


