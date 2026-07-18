# Content plan: Resources vs Blog — built from "WSDC Guide w/ Cheatsheets.docx"

Source: `/Users/macbook/Downloads/WSDC Guide w_ Cheatsheets.docx` (extracted text: scratchpad `guide.txt`).
The doc contains: a WSDC format primer, the "ordinary intelligent voter" judge model + 40/40/20,
four motion types with examples, a minute-by-minute 1-hour prep timeline, full playbooks for
speakers 1–3, "they say / however" rebuttal frames, clash-based whip structure, a short note on
reply speeches, and printable per-speaker cheat sheets.

## The split (owner-directed 2026-07-09)

- **Resources** (`/resources/*`) = reference material and tools: things a student *uses* —
  printable templates, quick references, motion banks, glossaries. Evergreen, revisited, linkable.
  Modeled on wscprep.com's resource library, but server-rendered and in the varsity-editorial
  identity (no icon-card/expander UI).
- **Blog** (`/blog/*`) = editorial teaching: things a student *reads* — role deep-dives,
  technique essays, USA Debate pathway content. Article-shaped, dated, expandable over time.
- Rule of thumb: if it prints or gets bookmarked for tournament day → resource;
  if it explains, argues, or narrates → blog post.

## Resources section — BUILT 2026-07-09

Live at `/resources` (hub) + 8 sub-pages, driven by `src/data/resources.ts` (registry feeds hub,
sitemap, footer). Print support: `PrintButton` client component + `@media print` rules in
globals.css (chrome stripped, `.cheat-sheet` prints clean). Shared fill-in-sheet primitives in
`src/components/CheatSheet.tsx`. All pages ship Article + Breadcrumb schema (FAQ where natural).
Navbar has "Resources"; footer Learn column links hub + cheat sheets + motions.

1. `/resources` — hub, grouped by category, plus deep-dive guide links
2. `/resources/first-speaker-cheat-sheet` — printable (set-up, split, metric, 2 args × 3 mechanisms)
3. `/resources/second-speaker-cheat-sheet` — printable (rebuttal/rebuilding "they say/however" ×4, extension)
4. `/resources/third-speaker-cheat-sheet` — printable (3 clashes, internal/external weighing, metrics)
5. `/resources/prep-hour-planner` — printable minute-by-minute prep schedule + checklist + FAQs
6. `/resources/practice-motions` — 40 motions, 10 per type
7. `/resources/wsdc-format-quick-reference` — speech order/times table, replies, prep rules, POIs, 40/40/20
8. `/resources/motion-types` — the 4 families: burden, where it's won, examples + FAQs
9. `/resources/glossary` — 34 terms

Later upgrade: email-gate the printables once Resend/Supabase are wired (lead magnet).

## Web-research pass (2026-07-10)

Three parallel research agents verified the WSDC/US-circuit ecosystem (sources fetched, not
just snippets). Findings folded into CLAUDE.md's accuracy rules. Big wins: TOC runs a World
Schools division with a ~30-tournament bid list (ci.uky.edu/debate/toc/bids/bid-tournaments);
USWSDI manual fetched (district route: up to 2 teams of 3–5); verified state WS: TX/IN/FL +
WA trial; WSDC champions 2023–25 verified (USA/Scotland/India), Nairobi 2026; open
internationals for US school teams: WHO Zagreb, ESDC Istanbul, Oldham Cup, EurOpen (soft),
Bluebonnet, Doxbridge (soft). Improved with external links: /usa-debate-team,
/what-is-world-schools-debate, /world-schools-debate-judging, /resources/wsdc-format-quick-reference,
blog application-guide + pathway posts. New post #13: /blog/world-schools-debate-tournaments
(month-by-month US calendar + internationals table, heavy external linking).

## Second verification pass (2026-07-10, later)

Two more research agents: (1) full TOC bid-list transcription + state expansion (WI confirmed,
AR partial, 9 states negative) + Penn WS online + Springboard; (2) international deep-dive
(Prague Debate Spring, Heart of Europe, WS Debate Academy Slovenia confirmed open; ESDC Jan
2027; rejection list of BP/AP look-alikes). Tournaments post expanded (full-season calendar,
online-circuit callout, 6-state section); **post #14 added: /blog/international-world-schools-tournaments**
("Taking a bench abroad") with new 'International' blog category. All findings in CLAUDE.md
accuracy rules.

## Blog posts (12 + tournaments post = 13, + international = 14) — BUILT 2026-07-10

All 12 posts live under `/blog` + index. Registry in `src/data/blog.ts` (drives index, sitemap
0.7, per-post metadata via `postMetadata()`); shared chrome in `src/components/BlogPostShell.tsx`
(Article + Breadcrumb + optional FAQ schema, header, FAQ block, CTA band). Each role post links
its matching cheat-sheet resource; USA Debate posts use only the safe-facts list (won 2023,
small roster, season-specific application window with re-verify note). Footer Learn column
links `/blog`; resources hub cross-links it.

### P1 — role deep-dives (unique material, low competition)
1. **`/blog/first-speaker-world-schools-debate`** — the role explained: framing devices, why set-up wins rounds, worked examples of taglines/mechanisms/metrics. KW: "first speaker debate role". → links /resources/first-speaker-cheat-sheet.
2. **`/blog/second-speaker-world-schools-debate`** — steel-manning, rebuttal vs rebuilding, time budgeting, extension choice. KW: "second speaker debate role". → links its cheat sheet.
3. **`/blog/third-speaker-world-schools-debate`** — clash selection, flowing the round, weighing, strategic concession. KW: "third speaker debate", "whip speech debate". → links its cheat sheet.

### P2 — technique essays (broader keywords)
4. **`/blog/how-to-build-a-debate-argument`** — tagline → mechanisms → impact → weighing, worked example front to back. KW: "how to build a debate argument".
5. **`/blog/debate-rebuttal-guide`** — "they say / however", best-version principle, rebuttal ladders. KW: "how to rebut in debate".
6. **`/blog/weighing-in-debate`** — internal vs external weighing, metrics, worst-case-beats-best-case. KW: "weighing in debate".

### P3 — thinner in the doc; needs coach expertise
7. **`/blog/reply-speech-world-schools-debate`** — the 4-minute biased adjudication; who, when, what belongs. KW: "reply speech debate".
8. **`/blog/world-schools-case-files`** — what goes in a printed case file; season-long build plan. KW: "debate case file".
9. **`/blog/points-of-information-debate`** — offering/answering/how many to take. ⚠️ verify current WSDC POI conventions beyond the protected-minute basics already on the format reference.

### P4 — USA Debate cluster (SEO asset layer; brand story stays results-&-rigor)
(Numbering below kept from the original 15-post plan; posts 10–12 in the current ordering.)
These extend the existing `/usa-debate-team` pillar. They live in the blog and footer only —
not the navbar — and frame USA Debate as *one pathway* our training serves, per the owner's
"not national-team heavy" direction. High search intent, near-zero competition from other
coaching sites.
13. **`/blog/usa-debate-team-application-guide`** — "Applying to USA Debate: Timeline, Stages, and How to Prepare" — application window (re-verify each season against speechanddebate.org/usa-debate; 2026–27 was April 1 – June 25), what the video/essay stages reward, how WS fundamentals map to what selectors watch for. KW: "usa debate team application", "how to join usa debate team".
14. **`/blog/usa-debate-team-skills`** — "What USA Debate Selectors Are Actually Looking For" — content/style/strategy through a tryout lens: caselines, weighing, POI handling under pressure. Mostly coach expertise; safe factual spine only. KW: "usa debate team tryouts".
15. **`/blog/world-schools-debate-pathway-us`** — "The World Schools Pathway in the US: From First Tournament to the National Team" — school teams → state leagues with WS divisions (only TX/TFA, FL/FFL, IN/ISSDA are verified) → NSDA Nationals WS → USA Debate. The funnel post that links every pillar + program page. KW: "world schools debate near me", "world schools debate tournaments us".

## Accuracy guardrails (per repo CLAUDE.md "do not publish" list)

- The doc's hosting timeline is stale (calls Panama 2025 "the current edition"; it's now July 2026).
  Keep posts **evergreen — no host-city or "current champion" claims** unless re-verified.
- Junior timings (4-min speeches, 2-min replies) come from the doc — fine to cite as "junior divisions often halve times" without naming a specific league.
- Never add aggregateRating. USA Debate facts allowed in the P4 cluster: "won WSDC 2023",
  "a small national roster", season-specific application dates re-verified yearly. Still banned:
  2024/2025 elimination results, roster sizes ("12 national / 5+1"), WSDC 2027 host.

## Rollout

- Ship in four batches (5 / 3 / 4 / 3). Each batch: posts + sitemap + blog index update +
  branded OG image per post (extend the sharp asset script), then build/lint/tsc + visual check.
- Every post ends with the standard trial CTA band; speaker-role posts also CTA to
  /programs/competition-team ("this is what we drill every week").
