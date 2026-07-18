'use client';

import Script from 'next/script';

// Calendly inline widget. The external widget.js finds any `.calendly-inline-widget`
// element on the page and mounts the scheduler iframe into it. The data-url carries
// brand styling params (scarlet primary) and hides the cookie banner for a cleaner embed.
export function CalendlyEmbed({ url }: { url: string }) {
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
