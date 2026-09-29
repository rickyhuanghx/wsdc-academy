'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { META_PIXEL_ID, metaTrack } from '@/lib/meta-pixel';

// Meta's base code: defines the fbq queue, loads fbevents.js, and sends the
// first PageView. Client-side navigations don't reload the page, so later
// PageViews are sent from the pathname effect below.
export function MetaPixel() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    metaTrack('PageView');
  }, [pathname]);

  if (!META_PIXEL_ID) return null;
  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

// Course-page view. Rendered by the (server) program page so Meta learns
// which program a visitor looked at.
export function MetaViewContent({ id, name, value }: { id: string; name: string; value?: number }) {
  useEffect(() => {
    metaTrack('ViewContent', {
      content_ids: [id],
      content_name: name,
      content_type: 'product',
      ...(value ? { value, currency: 'USD' } : {}),
    });
  }, [id, name, value]);
  return null;
}
