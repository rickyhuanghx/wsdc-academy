// IndexNow submission for wsdcacademy.com (Bing/Copilot + other IndexNow
// engines; Google does not use IndexNow). Run AFTER a deploy is live:
//
//   node scripts/indexnow-ping.mjs            # submit every sitemap URL
//   node scripts/indexnow-ping.mjs /debate-topics /motions   # specific paths
//
// The key file public/<KEY>.txt must stay deployed at the site root — that is
// how IndexNow verifies ownership. A 200/202 response means accepted; 429
// means rate-limited (just retry later; seen before on sibling sites).

const HOST = 'wsdcacademy.com';
const KEY = '7d60fc9d105d6ca37b6db76ba0784a96';

async function main() {
  const args = process.argv.slice(2);
  let urls;
  if (args.length > 0) {
    urls = args.map((p) => `https://${HOST}${p.startsWith('/') ? p : `/${p}`}`);
  } else {
    const res = await fetch(`https://${HOST}/sitemap.xml`);
    if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
    const xml = await res.text();
    urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  }
  if (urls.length === 0) throw new Error('no URLs to submit');

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls,
    }),
  });
  console.log(`Submitted ${urls.length} URLs -> HTTP ${res.status} ${res.statusText}`);
  if (!res.ok && res.status !== 202) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
