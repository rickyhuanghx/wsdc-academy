// Thin event helper for Google tags. Safe to call anywhere: no-ops on the
// server. Prefers gtag() (direct GA4 tag, which ignores plain object pushes);
// falls back to a GTM-style dataLayer push so a future GTM container still
// sees the same events.
export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const w = window as typeof window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  };
  if (typeof w.gtag === 'function') {
    w.gtag('event', event, params);
    return;
  }
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}

/**
 * Google Ads click id for offline-conversion matching. Prefers the value the
 * AdClickCapture script stored from the landing URL; falls back to Google's
 * first-party _gcl_aw cookie (GCL.<ts>.<gclid>). Returns '' when the visit did
 * not come from an ad. gbraid/wbraid values are prefixed with their key so the
 * sheet column stays a single field.
 */
export function getAdClickId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const raw = window.sessionStorage.getItem('ad_click');
    if (raw) {
      const { k, v } = JSON.parse(raw) as { k?: string; v?: string };
      if (v && /^[A-Za-z0-9_.-]{1,200}$/.test(v)) return k === 'gclid' ? v : `${k}:${v}`;
    }
  } catch {
    /* ignore */
  }
  const m = document.cookie.match(/(?:^|;\s*)_gcl_aw=GCL\.\d+\.([A-Za-z0-9_.-]+)/);
  return m ? m[1] : '';
}
