const API_BASE_URL = 'https://attendance-system-be-ten.vercel.app';


let authToken: string | null = null;

export function setToken(token: string | null) {
  authToken = token;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (authToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  // Handle empty responses
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return undefined as unknown as T;
  }

  return await res.json();
}

// Auth
export async function signIn(payload: { email: string; password: string }): Promise<{ token: string }> {
  return apiFetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// Sections
export interface ApiSection {
  _id: string;
  name: string;
  branch: string;
  year: number;
}

export async function getSections(): Promise<ApiSection[]> {
  return apiFetch('/api/sections', { method: 'GET' });
}

// Students
export interface ApiStudent {
  _id: string;
  name: string;
  studentId: string;
}

export async function getStudentsBySection(sectionId: string): Promise<ApiStudent[]> {
  return apiFetch(`/api/sections/${sectionId}/students`, { method: 'GET' });
}

// Attendance
export interface CreateAttendancePayload {
  sectionId: string;
  date: string; // ISO string
  markedBy: string;
  records: Array<{ student: string; status: 'Present' | 'Absent' }>;
}

export async function markAttendance(payload: CreateAttendancePayload) {
  return apiFetch('/api/attendance/mark', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function getAttendanceForReview(sectionId: string, dateISO: string) {
  return apiFetch(`/api/attendance/review/${sectionId}/${encodeURIComponent(dateISO)}`, { method: 'GET' });
}

export async function correctAttendance(recordId: string, body: { studentId: string; newStatus: 'Present' }) {
  return apiFetch(`/api/attendance/correct/${recordId}`, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

export async function submitAttendance(recordId: string) {
  return apiFetch(`/api/attendance/submit/${recordId}`, { method: 'POST' });
}


