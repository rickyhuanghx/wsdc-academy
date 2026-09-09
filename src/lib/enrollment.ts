// Client helpers for the enrollment form (/enroll?ref=<token>).
//
// The backend is the shared "Course Enrollments — All Brands" Google Sheet's
// Apps Script web app (see /Users/macbook/enrollment-hub). The token in the
// form link both identifies and authorizes exactly one enrollment row, so no
// secret is needed browser-side. POSTs use text/plain to avoid a CORS
// preflight, which Apps Script cannot answer.

const BRAND_SLUG = 'wsdc';
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
  invoiceUrl?: string; // hosted invoice page (pay / receipt) for staff-invoice rows
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

// The sheet's Apps Script answers in 3–15 s and occasionally hangs or returns
// an HTML error page instead of JSON (Google-side throttling). Every call
// therefore gets a hard timeout and up to three attempts; a submit is
// idempotent (same token, same fields) so retrying it is safe. The brand
// slug lets the script search the right tab first.
const REQUEST_TIMEOUT_MS = 25000;
const ATTEMPTS = 3;

async function request<T>(input: string, init: RequestInit | undefined, label: string): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(input, { ...init, redirect: 'follow', signal: controller.signal });
      const text = await res.text();
      if (!res.ok) throw new Error(`${label} failed: ${res.status}`);
      try {
        return JSON.parse(text) as T;
      } catch {
        throw new Error(`${label}: non-JSON response`);
      }
    } catch (err) {
      lastError = err;
      if (attempt < ATTEMPTS) await new Promise((r) => setTimeout(r, 1500 * attempt));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`${label} failed`);
}

export async function fetchEnrollmentPrefill(token: string): Promise<EnrollmentPrefill> {
  return request<EnrollmentPrefill>(
    `${ENROLLMENT_API}?token=${encodeURIComponent(token)}&brand=${BRAND_SLUG}`,
    undefined,
    'prefill'
  );
}

export async function submitEnrollment(
  token: string,
  fields: EnrollmentFields
): Promise<{ ok: boolean; error?: string }> {
  return request<{ ok: boolean; error?: string }>(
    ENROLLMENT_API,
    {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type: 'enrollment', token, brand: BRAND_SLUG, fields }),
    },
    'submit'
  );
}
