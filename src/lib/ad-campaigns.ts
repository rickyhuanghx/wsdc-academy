// Vanity ad links: /go/<slug> redirects to a landing page with UTM params attached.
//
// Why the indirection rather than putting the UTM URL straight on the banner:
//   - the artwork ships with a short, clean URL that fits in an ad slot;
//   - the destination and the tagging can change later without re-cutting the
//     creative or asking the publisher to swap the click-through URL;
//   - the redirect runs server-side, so we get a click count that survives ad
//     blockers and instant back-outs — cases where GA4 never fires at all.
//
// To add a placement: copy a block, give it a new slug, set utm_source to the
// site or network serving the banner. Keep slugs short and lowercase — they get
// typed by hand into ad platforms and read aloud in emails.

export type AdCampaign = {
  /** Path on this site the click lands on. Must start with '/'. */
  destination: string;
  /** Where the banner runs: the publisher, network, or platform. */
  utm_source: string;
  /** How it reached them: 'banner', 'email', 'cpc', 'social'. */
  utm_medium: string;
  /** The buy, usually dated so reports stay readable a year from now. */
  utm_campaign: string;
  /** Distinguishes creatives within one campaign — set this to the artwork. */
  utm_content?: string;
};

export const AD_CAMPAIGNS: Record<string, AdCampaign> = {
  // Banner buy on tabroom.com, the tournament registration platform US debaters
  // and coaches already live in. utm_medium 'banner' is deliberate: GA4's
  // default channel grouping reads it as Display, so these sessions land in a
  // named channel instead of Unassigned.
  tabroom: {
    destination: '/',
    utm_source: 'tabroom.com',
    utm_medium: 'banner',
    utm_campaign: 'aug2026-banner',
    utm_content: 'finals-1200x628',
  },
};

/**
 * Absolute click-through URL for a campaign slug, UTM params attached.
 * Returns null for an unknown slug so callers can 404 rather than guess.
 */
export function buildCampaignUrl(slug: string, baseUrl: string): string | null {
  const campaign = AD_CAMPAIGNS[slug];
  if (!campaign) return null;

  const url = new URL(campaign.destination, baseUrl);
  url.searchParams.set('utm_source', campaign.utm_source);
  url.searchParams.set('utm_medium', campaign.utm_medium);
  url.searchParams.set('utm_campaign', campaign.utm_campaign);
  if (campaign.utm_content) url.searchParams.set('utm_content', campaign.utm_content);

  return url.toString();
}
