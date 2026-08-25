// Client helpers for the trial form (/trial-form?ref=<token>).
//
// The backend is the "Trial Desk — All Brands" Google Sheet's Apps Script web
// app (see /Users/macbook/trial-desk), shared by every brand. Only staff can
// create a trial; the token in the link both identifies and authorizes exactly
// one trial row, so no secret is needed browser-side. POSTs use text/plain to
// avoid a CORS preflight, which Apps Script cannot answer.

const TRIAL_API =
  'https://script.google.com/macros/s/AKfycbyfnfBF6juPm3TjRKIVFR1Bktrk4fOZHnYneLhBo1D0bc082c3O3efZL8dLuBPTvkR3wg/exec';

export interface TrialPrefill {
  found: boolean;
  brand?: string;
  status?: string;
  trialTime?: string; // "YYYY-MM-DD HH:MM" in `timezone`, or '' when not fixed yet
  timezone?: string;
  courseName?: string;
  studentName?: string;
  age?: string;
  grade?: string;
  school?: string;
  experience?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  goals?: string;
  preferredDays?: string;
  preferredWindows?: string;
  heardAbout?: string;
  notes?: string;
  submitted?: boolean;
}

export interface TrialFields {
  studentName: string;
  age: string;
  grade: string;
  school: string;
  experience: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  goals: string;
  preferredDays: string;
  preferredWindows: string;
  heardAbout: string;
  notes: string;
}

export async function fetchTrialPrefill(token: string): Promise<TrialPrefill> {
  const res = await fetch(`${TRIAL_API}?token=${encodeURIComponent(token)}`, { redirect: 'follow' });
  if (!res.ok) throw new Error(`prefill failed: ${res.status}`);
  return res.json();
}

export async function submitTrial(token: string, fields: TrialFields): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(TRIAL_API, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ type: 'trial', token, fields }),
  });
  if (!res.ok) throw new Error(`submit failed: ${res.status}`);
  return res.json();
}
