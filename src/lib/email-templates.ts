// Order confirmation emails, sent by the Stripe webhook after a successful
// payment. Plain HTML (no React Email dependency), branded to the varsity
// editorial identity: navy #0d2240, scarlet #c8102e, serif headings.

import { SITE_NAME, CONTACT_EMAIL } from '@/lib/site';

export interface OrderEmailItem {
  programName: string;
  unitLabel: string;
  studentName: string;
  studentGrade: string;
  studentSchool: string;
}

export interface OrderEmailData {
  email: string;
  parentName: string;
  amountTotal: number; // minor units
  currency: string; // lowercase ISO
  paymentIntentId: string;
  items: OrderEmailItem[];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatMoney(minor: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(minor / 100);
}

function shell(preheader: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#faf9f6;">
<span style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6;padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e2e5eb;">
<tr><td style="background:#0d2240;padding:20px 32px;">
  <span style="font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#ffffff;">${escapeHtml(SITE_NAME)}<span style="color:#c8102e;">.</span></span>
</td></tr>
<tr><td style="padding:32px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">${body}</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #e2e5eb;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;color:#8a93a6;">
  ${escapeHtml(SITE_NAME)}: a real training system for World Schools debate.
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function detailsTable(rows: [string, string][]): string {
  const tr = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#0d2240;white-space:nowrap;">${escapeHtml(k)}</td><td style="padding:6px 0;color:#3d4a63;">${escapeHtml(v)}</td></tr>`,
    )
    .join('');
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse;">${tr}</table>`;
}

function itemsBlock(items: OrderEmailItem[]): string {
  return items
    .map(
      (it) => `<div style="border-left:3px solid #c8102e;padding:10px 16px;margin:0 0 12px;background:#faf9f6;">
  <div style="font-weight:600;color:#0d2240;font-size:15px;">${escapeHtml(it.programName)}</div>
  <div style="color:#3d4a63;font-size:13px;margin-top:2px;">${escapeHtml(it.unitLabel)}</div>
  <div style="color:#3d4a63;font-size:13px;margin-top:6px;">Student: ${escapeHtml(it.studentName)} · ${escapeHtml(it.studentGrade)} · ${escapeHtml(it.studentSchool)}</div>
</div>`,
    )
    .join('');
}

export function orderUserEmail(d: OrderEmailData) {
  const firstName = d.parentName.split(' ')[0];
  const html = shell(
    'Enrollment confirmed',
    `<h2 style="font-family:Georgia,serif;font-size:22px;color:#0d2240;margin:0 0 8px;">Thanks ${escapeHtml(firstName)}, your enrollment is confirmed</h2>
     <p style="margin:0 0 16px;color:#3d4a63;font-size:15px;line-height:1.6;">We've received your payment and saved your enrollment. A coach will reach out within 24–48 hours to welcome you, place each student, and confirm scheduling.</p>
     ${detailsTable([
       ['Amount paid', formatMoney(d.amountTotal, d.currency)],
       ['Payment reference', d.paymentIntentId],
     ])}
     <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#8a93a6;margin:24px 0 12px;">Enrollment details</h3>
     ${itemsBlock(d.items)}
     <p style="margin:24px 0 0;color:#3d4a63;font-size:14px;">Questions? Reply to this email or write to <a href="mailto:${CONTACT_EMAIL}" style="color:#0d2240;font-weight:600;">${CONTACT_EMAIL}</a>.</p>`,
  );
  const itemsText = d.items
    .map(
      (it) => `- ${it.programName} (${it.unitLabel})
  Student: ${it.studentName}
  Grade: ${it.studentGrade}
  School: ${it.studentSchool}`,
    )
    .join('\n\n');
  const text = `Thanks ${firstName}, your enrollment is confirmed.

Amount paid: ${formatMoney(d.amountTotal, d.currency)}
Payment reference: ${d.paymentIntentId}

Enrollment details:
${itemsText}

A coach will reach out within 24-48 hours to welcome you and confirm scheduling.

Questions? Reply to this email or write to ${CONTACT_EMAIL}.

— ${SITE_NAME}`;
  return {
    subject: `Enrollment confirmed: ${formatMoney(d.amountTotal, d.currency)}`,
    html,
    text,
  };
}

export function orderAdminEmail(d: OrderEmailData) {
  const html = shell(
    'New paid enrollment',
    `<h2 style="font-family:Georgia,serif;font-size:22px;color:#0d2240;margin:0 0 8px;">New paid enrollment: ${formatMoney(d.amountTotal, d.currency)}</h2>
     <p style="margin:0 0 16px;color:#3d4a63;font-size:14px;">Stripe payment cleared. Send the welcome touch within 24–48 hours.</p>
     ${detailsTable([
       ['Parent', d.parentName],
       ['Email', d.email],
       ['Amount', formatMoney(d.amountTotal, d.currency)],
       ['Items', String(d.items.length)],
       ['Payment intent', d.paymentIntentId],
     ])}
     <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#8a93a6;margin:16px 0 12px;">Items</h3>
     ${itemsBlock(d.items)}`,
  );
  const text = `New paid enrollment: ${formatMoney(d.amountTotal, d.currency)}

Parent: ${d.parentName}
Email: ${d.email}
Payment intent: ${d.paymentIntentId}

${d.items
  .map(
    (it) =>
      `- ${it.programName} (${it.unitLabel}): ${it.studentName}, ${it.studentGrade}, ${it.studentSchool}`,
  )
  .join('\n')}`;
  return {
    subject: `New enrollment: ${formatMoney(d.amountTotal, d.currency)} (${d.parentName})`,
    html,
    text,
  };
}
