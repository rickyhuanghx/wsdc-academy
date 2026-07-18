import {
  HONEYPOT_FIELD,
  isRateLimited,
  getClientIp,
  isValidEmail,
  sendAdminNotification,
  ok,
  badRequest,
  tooManyRequests,
} from '@/lib/leads';

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return badRequest('Invalid JSON');
  }

  // Honeypot: silent success for bots
  if (body[HONEYPOT_FIELD]) return ok();

  if (isRateLimited(getClientIp(req), 'contact')) return tooManyRequests();

  const { name, email, message } = body;

  if (!name?.trim()) return badRequest('Name is required');
  if (!email || !isValidEmail(email)) return badRequest('Valid email is required');
  if (!message?.trim()) return badRequest('Message is required');

  await sendAdminNotification('New contact message: WSDC Academy', {
    Name: name.trim(),
    Email: email.trim(),
    Message: message.trim().slice(0, 5000),
  });

  return ok();
}
