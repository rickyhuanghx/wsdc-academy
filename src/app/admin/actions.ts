'use server';

// Server Function for the coach desk (/admin/*): save a coach's marks on a
// midterm check-in. The desk has no login by the owner's decision; the
// unlisted URL is the gate.

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { CORE_SKILLS, MOTION_PROMPTS } from '@/lib/self-report';
import { SELF_REPORT_STATUSES, isUuid, updateSelfReportMarks, type SelfReportStatus } from '@/lib/self-reports-admin';

const DESK = '/admin/self-reports';

function mark(v: FormDataEntryValue | null): number | undefined {
  const s = String(v ?? '');
  if (s === '') return undefined;
  const n = Number(s);
  return n === 0 || n === 1 || n === 2 ? n : undefined;
}

export async function saveMarks(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '');
  if (!isUuid(id)) redirect(DESK);

  const explain_marks: Record<string, number> = {};
  for (const s of CORE_SKILLS) {
    const m = mark(formData.get(`explain_${s.id}`));
    if (m !== undefined) explain_marks[s.id] = m;
  }
  const motion_marks: Record<string, number> = {};
  for (const p of MOTION_PROMPTS) {
    const m = mark(formData.get(`motion_${p.id}`));
    if (m !== undefined) motion_marks[p.id] = m;
  }
  const notes = String(formData.get('coach_notes') ?? '').trim().slice(0, 5000);
  const statusRaw = String(formData.get('status') ?? 'new');
  const status = (SELF_REPORT_STATUSES as readonly string[]).includes(statusRaw) ? (statusRaw as SelfReportStatus) : 'new';

  await updateSelfReportMarks(id, { explain_marks, motion_marks, coach_notes: notes || null, status });
  revalidatePath(DESK);
  revalidatePath(`${DESK}/${id}`);
  redirect(`${DESK}/${id}?saved=1`);
}
