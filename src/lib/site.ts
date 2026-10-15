// Central brand constants — the single place the brand name, domain, and email live.
// NEXT_PUBLIC_SITE_URL still overrides the domain at build time; keep the fallback
// so `npm run build` works without env.

export const SITE_NAME = 'WSDC Prep';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wsdcacademy.com';

export const CONTACT_EMAIL = 'info@wsdcacademy.com';

// Display form for the phone number; the tel:/wa.me forms are digits-only (E.164).
// The phone line is the Twilio sales number; WhatsApp stays on the SleekFlow number.
export const CONTACT_PHONE = '+1 (929) 419-4885';
export const CONTACT_PHONE_TEL = '+19294194885';
export const WHATSAPP_PHONE = '+1 (347) 817-8056';
export const WHATSAPP_URL = 'https://wa.me/13478178056';

// Official social profiles: rendered in the footer and emitted as Organization sameAs.
export const SOCIAL_PROFILES = [
  { name: 'Instagram', url: 'https://www.instagram.com/wsdcprep/' },
  { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61591845010389' },
  { name: 'YouTube', url: 'https://www.youtube.com/@wsdcprep' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/wsdcprep' },
];

// Calendly event for the free initial consultation. Brand params (scarlet primary,
// hidden cookie banner) are appended where it's embedded.
export const CONSULTATION_CALENDLY_URL =
  'https://calendly.com/d/dvn4-c77-rz7/wsdc-academy-initial-consultation-session';

export const SITE_SLOGAN = 'A real training system for World Schools debate.';

export const SITE_DESCRIPTION =
  'WSDC Prep is a year-round training system for World Schools Debate: structured curriculum, judged practice rounds, and written feedback after every session, from coaches who have competed and adjudicated at the top of the format.';
