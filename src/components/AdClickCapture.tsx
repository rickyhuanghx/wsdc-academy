import Script from 'next/script';

// Captures the Google Ads click id (gclid / gbraid / wbraid) from the landing
// URL into sessionStorage so the callback-request form can attach it to the
// lead. Google's own tag stores the same value in the first-party _gcl_aw
// cookie, but only when a tag is configured; this works tracker-free too and
// survives client-side navigation to the booking page. Read it back with
// getAdClickId() in the analytics helper.
const CAPTURE = "(function(){try{var p=new URLSearchParams(location.search),k=['gclid','gbraid','wbraid'];for(var i=0;i<k.length;i++){var v=p.get(k[i]);if(v){sessionStorage.setItem('ad_click',JSON.stringify({k:k[i],v:v,t:Date.now()}));break;}}}catch(e){}})();";

export function AdClickCapture() {
  return (
    <Script
      id='ad-click-capture'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: CAPTURE }}
    />
  );
}
