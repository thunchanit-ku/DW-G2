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


