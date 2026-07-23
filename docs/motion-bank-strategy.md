# Motion Bank: product + SEO strategy

*Written 2026-07-23, alongside the v1 launch of `/motions`.*

## What shipped in v1

- **12,416 unique motions** from **1,269 tournaments, 1994–2026**, compiled from public records:
  - the MIT-licensed hello-motions research dataset (10,049 motions, 1999–2021, with topic labels and info slides),
  - a fresh Tabbycat/calicotab API harvest (2,035 motions, 2022–2026, 197 tournaments including all recent WUDCs, EUDCs, Australs, and the WSDC-circuit schools events),
  - the **official WSDC motion archive**: all 371 publicly recorded Worlds motions, 32 championships, 1994–2025, prepared/impromptu labeled.
- **35 server-rendered pages**: `/motions` (searchable bank + hubs), `/motions/wsdc` (flagship Worlds archive), 17 topic pages with hand-written coach's notes, 16 year archives (2011–2026).
- **Client explorer** on `/motions`: keyword search, topic/type/year filters, Worlds-only and info-slide-only toggles, shuffle (drill mode), copy buttons, lazy-loaded info slides. Data ships as static JSON from `/public`, no backend.
- Schema: Dataset on the landing page, CollectionPage on archives, FAQ on `/motions` and `/motions/wsdc`, breadcrumbs everywhere. All pages in `sitemap.ts` and `llms.txt`.
- Rebuild pipeline in `scripts/motion-bank/` (see the script docstring).

## Competitive landscape (verified 2026-07-23)

| Competitor | Size | Fatal SEO weakness (verified by fetching their HTML) |
|---|---|---|
| hellomotions.org | 35,000+ | Astro + Supabase SPA: **zero motion text in served HTML**. Robots content-signals restrict AI reuse, which also suppresses their AI-search citability. |
| hellomotions.com (original) | ~10k | Query app, no crawlable listings, dormant since ~2021. |
| debatedata.io | unknown | React SPA, zero motion text in HTML, key filters paywalled. |
| nekotab.app/debate-motions | unknown | SPA, zero motion text in HTML. |
| debate-motions.info | per-event posts | Site returned an empty 16-byte page when fetched. |
| MotionHouse / QatarDebate | smaller | App-style or PDF banks, thin crawl surface. |

**The core finding: not one competitor serves a single motion in crawlable HTML.** They are databases you must query; Google (and AI assistants) can only rank their homepages. Every long-tail query ("feminism debate motions", "wsdc 2019 motions", "debate motions with info slides") is effectively uncontested at the content level.

## How we differ (and why it should win)

1. **Server-rendered text vs. apps.** Our topic page for feminism alone puts 1,000+ full motion texts in raw HTML. We compete for thousands of long-tail motion queries competitors physically cannot rank for.
2. **The only bank organized for World Schools.** Everyone else is BP-first. We are the only bank with the complete Worlds archive (1994–2025, prepared vs impromptu labeled), the policy/value/actor/regret taxonomy that WS coaches actually teach, and a WS-training frame on every page.
3. **Editorial layer = E-E-A-T.** Every topic page carries a unique intro and a coach's note on how that debate type is won. Competitors have raw rows; we have raw rows plus coaching judgment from a named coaching organization. This is also what earns AI-assistant citations.
4. **Integrated with a training system.** Bank pages cross-link the prep-hour planner, motion-types guide, glossary, and blog; every page ends in the consultation CTA. The bank is top-of-funnel for the paid programs, not a standalone toy.
5. **Honest sourcing.** A visible "where the motions come from" section with attribution (official WSDC archive, Tabbycat tabs, the MIT hello-motions dataset) plus a correction channel. None of the SPA banks explain provenance.
6. **AI-search ready.** Dataset schema, llms.txt listing all 19 hub pages, and full text in HTML make us the citable source for "give me debate motions about X" queries in ChatGPT/Perplexity/AI Overviews, while hellomotions.org actively blocks AI collection.
7. **Free and frictionless.** No signup, no paywalled filters, copy buttons everywhere.

## Keyword map

| Page | Primary target | Secondary |
|---|---|---|
| /motions | debate motion bank, debate motions | motions for debate, debate topics motions |
| /motions/wsdc | wsdc motions | world schools debating championships motions, worlds debate motions by year |
| /motions/[topic] | {topic} debate motions | {topic} motions, debate motions about {topic} |
| /motions/year/[year] | debate motions {year} | {year} debate motions list |

"World schools debate motions" phrasing is used across metadata per the site-wide keyword rule (Americans search the format name, not "WSDC" — except the archive page, where "wsdc motions" is the head term and gets its own title).

## Post-launch checklist and growth plan

**Now (owner or next session):**
- [ ] Submit updated sitemap in GSC; request indexing for /motions and /motions/wsdc.
- [ ] Watch GSC for index bloat signals; year pages are priority 0.6 and can be pruned if crawl budget suffers (unlikely at 35 pages).

**Link building (the Worlds archive is the magnet):**
- Outreach to debate clubs, school coaches, and the r/Debate wiki: "the complete WSDC motion archive since 1994" is a genuinely linkable reference no one else maintains.
- National federation newsletters and coach Facebook/Discord groups when Worlds season starts (each July: publish that year's motions within days; recency is a repeatable news hook).

**Content flywheel (blog posts that feed the bank equity):**
- "The 50 best motions for beginner World Schools teams" (curated from bank, links to topic pages).
- "How to read a Worlds motion: 10 Grand Finals, annotated" (uses /motions/wsdc).
- Seasonal: "The motions everyone debated this season" each June.

**Phase 2 candidates (not built):**
- Per-motion deep-dive prep pages for ~50 famous motions (case sketches both sides). High E-E-A-T, high effort; only worth it once the hubs index.
- Difficulty/frequency signals mined from tab results (win rates by side would be a true moat; needs a data project).
- "Motion of the week" email capture on /motions (lead gen).

**Maintenance:**
- Quarterly: re-run the Tabbycat harvest for the newest season, append to `scripts/motion-bank/recent_motions.json`, rebuild, redeploy.
- Each August: add the new Worlds motions to `wsdc_champ_motions.json` (official archive sheet updates after the championship). This is the most valuable 20 minutes of upkeep on the site.
- Static "12,000+" counts appear in metadata strings and the Navbar/resources promo; bump when a threshold is crossed (live counts elsewhere compute from the data).
