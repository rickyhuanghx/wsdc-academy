// Client helpers for the enrollment form (/enroll?ref=<token>).
//
// The backend is the shared "Course Enrollments — All Brands" Google Sheet's
// Apps Script web app (see /Users/macbook/enrollment-hub). The token in the
// form link both identifies and authorizes exactly one enrollment row, so no
// secret is needed browser-side. POSTs use text/plain to avoid a CORS
// preflight, which Apps Script cannot answer.

const ENROLLMENT_API =
  'https://script.google.com/macros/s/AKfycbzvq4RNmTyUPfd9tAeRc0aO9xl8KJRikTe6eOkuUEIWqUJ_MHyyjbG9taR8HoFDWZyO/exec';

export interface EnrollmentPrefill {
  found: boolean;
  brand?: string;
  courseName?: string;
  timing?: string;
  location?: string;
  studentName?: string;
  age?: string;
  grade?: string;
  school?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  experience?: string;
  parentNotes?: string;
  skills?: string;
  heardAbout?: string;
  paid?: boolean; // undefined on older Apps Script deployments
  paymentStatus?: string;
  submitted?: boolean;
}

export interface EnrollmentFields {
  studentName: string;
  age: string;
  grade: string;
  school: string;
  experience: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  notes: string;
  skills: string;
  heardAbout: string;
}

export async function fetchEnrollmentPrefill(token: string): Promise<EnrollmentPrefill> {
  const res = await fetch(`${ENROLLMENT_API}?token=${encodeURIComponent(token)}`, {
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`prefill failed: ${res.status}`);
  return res.json();
}

export async function submitEnrollment(
  token: string,
  fields: EnrollmentFields
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(ENROLLMENT_API, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ type: 'enrollment', token, fields }),
  });
  if (!res.ok) throw new Error(`submit failed: ${res.status}`);
  return res.json();
}
