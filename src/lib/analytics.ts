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
