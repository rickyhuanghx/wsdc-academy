// Thin dataLayer helper for Google Tag Manager. Safe to call anywhere:
// no-ops on the server, and if GTM isn't loaded the pushes sit harmlessly
// in the array until (unless) it is.
export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const w = window as typeof window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}
