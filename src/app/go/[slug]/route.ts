import { AD_CAMPAIGNS, buildCampaignUrl } from '@/lib/ad-campaigns';
import { getClientIp } from '@/lib/leads';
import { SITE_URL } from '@/lib/site';
import { getSupabaseAdmin } from '@/lib/supabase';

// Vanity ad redirect: /go/<slug> → the campaign landing page with UTMs attached.
// See src/lib/ad-campaigns.ts for the slug registry.
//
// Always dynamic: a cached response would serve the redirect without ever
// reaching the click counter.
export const dynamic = 'force-dynamic';

// Crawlers and preview-card fetchers hit ad links constantly (Slack/WhatsApp
// unfurls, uptime checks, SEO bots). They must not land in the click count, or
// the conversion rate reads far lower than it really is.
const BOT_UA = /bot|crawl|spider|slurp|preview|fetch|monitor|headless|curl|wget|python-requests/i;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const destination = buildCampaignUrl(slug, SITE_URL);
  if (!destination) {
    // Unknown slug: send them to the homepage rather than showing a 404 to
    // someone who just clicked an ad. A typo in the artwork shouldn't cost
    // the visit — it only costs the attribution.
    return Response.redirect(SITE_URL, 302);
  }

  const target = new URL(destination);

  // Forward anything the ad platform appended to the click URL — gclid, fbclid,
  // msclkid and friends. Dropping these breaks Google/Meta conversion import,
  // which is a much worse failure than a messy query string. Incoming params
  // win over the registry defaults, so one slug can serve several creatives
  // via ?utm_content=.
  const incoming = new URL(req.url).searchParams;
  for (const [key, value] of incoming) {
    target.searchParams.set(key, value);
  }

  const userAgent = req.headers.get('user-agent') ?? '';
  if (!BOT_UA.test(userAgent)) {
    await recordClick(slug, req, userAgent);
  }

  // 302, not 301: browsers and CDNs cache a permanent redirect indefinitely,
  // which would both freeze the destination and hide every repeat click from
  // the counter below.
  return Response.redirect(target.toString(), 302);
}

/**
 * Best-effort click log. Never blocks the redirect: if Supabase is unreachable
 * or unconfigured (local dev, preview builds), the visitor still gets through
 * and GA4 remains the source of truth.
 */
async function recordClick(slug: string, req: Request, userAgent: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  const campaign = AD_CAMPAIGNS[slug];

  try {
    await getSupabaseAdmin()
      .from('ad_clicks')
      .insert({
        slug,
        utm_source: campaign.utm_source,
        utm_campaign: campaign.utm_campaign,
        utm_content: campaign.utm_content ?? null,
        referrer: req.headers.get('referer'),
        user_agent: userAgent.slice(0, 500),
        ip: getClientIp(req),
      });
  } catch (err) {
    console.error(`[go/${slug}] click log failed:`, err);
  }
}
