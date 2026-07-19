'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { trackEvent } from '@/lib/analytics';

// Calendly inline widget. The external widget.js finds any `.calendly-inline-widget`
// element on the page and mounts the scheduler iframe into it. The data-url carries
// brand styling params (scarlet primary) and hides the cookie banner for a cleaner embed.
export function CalendlyEmbed({ url }: { url: string }) {
  // The embed posts lifecycle messages to the parent page; a completed booking
  // arrives as calendly.event_scheduled. This is the primary ads conversion.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin === 'https://calendly.com' && e.data?.event === 'calendly.event_scheduled') {
        trackEvent('consultation_booked');
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <>
      <div
        className="calendly-inline-widget w-full"
        data-url={url}
        style={{ minWidth: '320px', height: '720px' }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
      <noscript>
        <p className="text-navy-600">
          Scheduling needs JavaScript.{' '}
          <a href={url} className="font-semibold text-signal-500 underline">
            Open the booking page in a new tab
          </a>
          .
        </p>
      </noscript>
    </>
  );
}
