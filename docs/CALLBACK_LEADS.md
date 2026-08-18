# Callback leads → shared Google Sheet

The consultation page (`/consultation`) runs a dual-path booking widget
(`src/components/BookingChoice.tsx`): visitors either book a Zoom meeting through the
existing Calendly embed, or request a callback. Callback requests POST to
`src/app/api/callback/route.ts`, which appends a row to a **shared Google Sheet used by
all 5 brands** (via an Apps Script web app) and emails the admin through Resend.

Both sinks are best-effort: a sheet or email failure is logged server-side and never
shown to the visitor.

## Sheet columns (header row, in order)

| Timestamp | Brand | Type | Parent name | Phone | Child name | Child age | School/Area | Experience | Notes | Days | Windows | Timezone | Page URL | Status | GCLID |
| --------- | ----- | ---- | ----------- | ----- | ---------- | --------- | ----------- | ---------- | ----- | ---- | ------- | -------- | -------- | ------ |

`GCLID` (column P, added 2026-08-17) is the Google Ads click id captured on the
landing page (`gclid`, or `gbraid:…` / `wbraid:…`); blank when the visit did
not come from an ad. It exists so qualified leads (`Status` = `Booked` /
`Enrolled`) can be fed back to Google Ads as offline conversions via a scheduled
Google Sheets import — see the 5-brand Google Ads runbook. **Migration:** add the
`GCLID` header in P1 and re-paste the script below (Manage deployments → Edit →
New version; same URL). Older script versions simply ignore the extra field.

- **Timestamp** is written by the Apps Script (`new Date()`), so it lands in the sheet's
  timezone. The API also sends `submittedAt` (ISO, UTC) but the script does not store it.
- **Brand** is hard-coded per site (`WSDC Prep` here, via `SITE_NAME`), so one sheet
  serves all brands and stays filterable.
- **Timezone** is the visitor's IANA zone; the Days/Windows columns are in *their* local
  time. Convert before calling.
- **Status** starts blank. It is the team workflow column: fill in `Called`, `No answer`,
  `Booked`, etc. by hand.

## Environment variables (set in Netlify env, per site)

| Variable | Purpose |
| -------- | ------- |
| `SHEETS_WEBHOOK_URL` | The Apps Script web-app URL (`https://script.google.com/macros/s/…/exec`). Unset = sheet write skipped. |
| `SHEETS_WEBHOOK_SECRET` | Shared secret; must match `SECRET` inside the Apps Script. Sent in the POST body and checked before appending. |

The admin email uses the existing Resend variables (`RESEND_API_KEY`,
`RESEND_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL`). If neither the sheet webhook nor
Resend is configured, the route logs the full lead with `console.error` and still
returns success to the visitor.

## Apps Script (paste into the sheet's script editor)

```
const SHEET_ID = 'PASTE_SHEET_ID';
const SECRET = 'PASTE_SHARED_SECRET';
// Sheets parses appended values like typed input: a leading =, +, - or @ starts a
// formula, so real phone numbers ("+1 ...") render as #ERROR! and visitor-typed text
// could inject formulas. Prefix those with ' to force literal text.
function clean(v) {
  const s = String(v == null ? '' : v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.secret !== SECRET) return ContentService.createTextOutput('forbidden');
  const s = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  s.appendRow([new Date(), clean(d.brand), clean(d.type), clean(d.parentName), clean(d.phone), clean(d.childName), clean(d.childAge), clean(d.school), clean(d.experience), clean(d.notes), clean((d.days||[]).join(', ')), clean((d.windows||[]).join(', ')), clean(d.timezone), clean(d.pageUrl), '', clean(d.gclid)]);
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}
```

## Setup steps (once, for the shared sheet)

1. Create a Google Sheet and put the header row above in row 1 of the first tab.
   The sheet ID is the long token in its URL: `docs.google.com/spreadsheets/d/<SHEET_ID>/edit`.
2. In the sheet: **Extensions → Apps Script**, delete the stub code, paste the script
   above, and fill in `SHEET_ID` and a random shared secret for `SECRET`.
3. **Deploy → New deployment → Web app**, with:
   - Execute as: **Me**
   - Who has access: **Anyone**
   (The URL is unguessable and the secret check rejects strangers; "Anyone" is required
   so the serverless function can POST without Google auth.)
4. Copy the web-app URL ending in `/exec`.
5. In each brand site's Netlify env, set `SHEETS_WEBHOOK_URL` to that URL and
   `SHEETS_WEBHOOK_SECRET` to the secret, then redeploy.

Re-deploying the Apps Script after edits: **Deploy → Manage deployments → edit →
New version**. Creating a brand-new deployment changes the URL, which then has to be
updated in every site's env.

## Testing

```bash
curl -X POST https://wsdcacademy.com/api/callback \
  -H 'Content-Type: application/json' \
  -d '{"parentName":"Test Parent","phone":"+1 555 000 1111","childName":"Test","childAge":"12","school":"Test School, NYC","days":["Mon","Tue"],"windows":["Evening"],"timezone":"America/New_York","pageUrl":"https://wsdcacademy.com/consultation"}'
```

Expect `{"success":true}`, a new sheet row, and an admin email. A request with a
non-empty `website` field (the honeypot) also returns success but writes nothing.
