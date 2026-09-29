// Meta Pixel (dataset "wsdcprep"). Loaded only in production builds so local
// dev stays tracker-free; set NEXT_PUBLIC_META_PIXEL_ID to override the id.
export const META_PIXEL_ID =
  process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '931334656079740')
    : '';

/**
 * Fire a Meta standard event. No-ops on the server and when the pixel isn't
 * loaded. `eventId` is passed as Meta's eventID so a future server-side
 * Conversions API send of the same event can be deduplicated against it.
 */
export function metaTrack(event: string, params: Record<string, unknown> = {}, eventId?: string) {
  if (typeof window === 'undefined') return;
  const fbq = (window as typeof window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== 'function') return;
  if (eventId) fbq('track', event, params, { eventID: eventId });
  else fbq('track', event, params);
}
