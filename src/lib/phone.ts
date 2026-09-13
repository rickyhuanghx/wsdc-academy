// Phone-number clean-up shared by the enrollment, trial and checkout forms.
//
// Parents paste numbers from WhatsApp or iPhone Contacts, which wrap them in
// invisible direction marks (U+202A … U+202C) and non-breaking spaces. On
// screen the number reads "+971 50 123 4567", but the string starts with a
// hidden character, so a plain "starts with +" check rejects it and the
// parent sees "Please include the country code" for a number that has one.
// Others type "00971…", "(+971) 50…", full-width or Arabic-Indic digits, or
// a local number with no code at all. This module makes all of that
// predictable before validation.

const INVISIBLE = /[​-‏‪-‮⁠-⁤⁦-⁩﻿­᠎]/g;
const ODD_SPACES = /[   -   　\t]/g;
const UNICODE_DASHES = /[‐-―−⁃﹣－]/g;

// Dial codes we see most often across the five brands. Order matters: the
// list is rendered as tap-to-add buttons under the phone field.
export const DIAL_CODES: ReadonlyArray<{ code: string; label: string }> = [
  { code: '+971', label: 'UAE' },
  { code: '+1', label: 'US / Canada' },
  { code: '+44', label: 'UK' },
  { code: '+91', label: 'India' },
  { code: '+852', label: 'Hong Kong' },
  { code: '+65', label: 'Singapore' },
  { code: '+966', label: 'Saudi Arabia' },
  { code: '+92', label: 'Pakistan' },
];

// Country codes a bare number may start with when the "+" was left off,
// e.g. "971501234567". Only used when the digit count also fits (11–15).
const KNOWN_CODES = [
  '971', '966', '974', '973', '968', '965', '962', '961', '972', '852', '853', '886',
  '880', '977', '880', '855', '856', '960', '234', '254', '255', '256', '233', '212', '216', '213',
  '20', '27', '30', '31', '32', '33', '34', '36', '39', '40', '41', '43', '44', '45', '46', '47', '48', '49',
  '51', '52', '54', '55', '56', '57', '60', '61', '62', '63', '64', '65', '66', '81', '82', '84', '86',
  '90', '91', '92', '93', '94', '95', '98',
];

function asciiDigits(s: string): string {
  return s
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[０-９]/g, (d) => String(d.charCodeAt(0) - 0xff10));
}

/** Clean a phone string without changing what it means. Safe on any input. */
export function normalizePhone(raw: unknown): string {
  if (raw === null || raw === undefined) return '';
  let s = asciiDigits(String(raw))
    .replace(INVISIBLE, '')
    .replace(ODD_SPACES, ' ')
    .replace(UNICODE_DASHES, '-')
    .replace(/[＋➕]/g, '+')
    .trim()
    .replace(/\s+/g, ' ');
  // "(+971) 50…" or "( +971 ) 50…"
  s = s.replace(/^\(\s*\+\s*(\d+)\s*\)\s*/, '+$1 ');
  // "+ 971 50…" → "+971 50…"
  s = s.replace(/^\+\s+/, '+');
  // International prefix written the old way: "00971…" or "011 971…" (US).
  if (/^00\s?\d/.test(s)) s = '+' + s.replace(/^00\s?/, '');
  else if (/^011\s?\d/.test(s) && s.replace(/\D/g, '').length >= 13) s = '+' + s.replace(/^011\s?/, '');
  // A bare number that already starts with a known country code and is long
  // enough to include one: "971501234567" → "+971501234567".
  if (/^\d/.test(s)) {
    const digits = s.replace(/\D/g, '');
    if (digits.length >= 11 && digits.length <= 15) {
      const code = KNOWN_CODES.find((c) => digits.startsWith(c));
      const usLike = digits.length === 11 && digits.startsWith('1');
      if (code || usLike) s = '+' + s;
    }
  }
  return s;
}

/** True when the number starts with "+" and has a plausible digit count. */
export function isValidPhone(raw: unknown): boolean {
  const s = normalizePhone(raw);
  if (!/^\+\d[\d\s().-]*$/.test(s)) return false;
  const digits = s.replace(/\D/g, '').length;
  return digits >= 7 && digits <= 15;
}

/** The number has digits but no country code yet: offer the tap-to-add buttons. */
export function needsDialCode(raw: unknown): boolean {
  const s = normalizePhone(raw);
  return s !== '' && !s.startsWith('+') && /\d/.test(s);
}

/** Empty string when fine, otherwise the message to show under the field. */
export function phoneProblem(raw: unknown): string {
  const s = normalizePhone(raw);
  if (!s) return 'Please enter a phone number, starting with your country code.';
  if (!s.startsWith('+')) {
    return 'Please start with your country code, e.g. +971 50 123 4567. Tap one below to add it.';
  }
  if (!isValidPhone(s)) return 'Please check the number, e.g. +971 50 123 4567.';
  return '';
}

/** Put a country code in front of a local number: "050 123 4567" + "+971" → "+971 50 123 4567". */
export function withDialCode(raw: unknown, code: string): string {
  let s = normalizePhone(raw);
  // Replace an existing code rather than stacking two.
  s = s.replace(/^\+\d+\s*/, '');
  // Drop the trunk zero most countries use for domestic dialling.
  s = s.replace(/^[\s().-]*0+(?=\d)/, '');
  return `${code} ${s}`.trim();
}
