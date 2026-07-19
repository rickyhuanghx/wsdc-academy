@AGENTS.md

# CLAUDE.md

## Project

WSDC Prep — a Next.js marketing/lead-gen site for World Schools Debate (WSDC-format) coaching in America, to deploy at **wsdcacademy.com**. Sibling brand to wsc-academy (wscprep.com) and built on its proven SEO architecture; the coaching roster is shared with atlantic-ivy-landing. **SEO is the #1 priority.**

> Renamed 2026-07-09 from "World Schools Prep / worldschoolsprep.com" (repo folder name predates the rename).

Brand positioning (owner-confirmed 2026-07-09): **results & rigor** — "A real training system for World Schools debate": structured curriculum mapped to the 40/40/20 judging criteria, judged practice rounds, written feedback after every session. **Do NOT make USA Debate / Team USA the story** — the owner explicitly rejected national-team-heavy framing. National-team credentials appear only as coach-credibility lines; `/usa-debate-team` is kept as an SEO asset (footer + sitemap, not navbar).

**Related brands, same owner:** wscprep.com (WSC Academy) and logosdebate.com (Logos Debate Academy — elite/international WSDC positioning). Logos is NOT a competitor; don't write copy attacking it. Keep the brands editorially independent (no doorway-style cross-linking).

## Commands

```bash
npm run dev      # Next dev server on :3000
npm run build    # Production build — primary verification (no test suite)
npm run lint     # ESLint
npx tsc --noEmit # Type-check
```

## Architecture

Next.js 16 App Router · React 19 · Tailwind 4 (`@theme` in `src/app/globals.css`) · TypeScript strict · path alias `@/*` → `src/*`. No client state library. All pages are server components except `Navbar` and `LeadForm`.

### Brand constants & identity

- `src/lib/site.ts` is the single source of truth for brand name, domain, email, slogan, and description. Import from it; never hardcode "WSDC Prep" or the domain in new code.
- Identity: **Varsity Editorial** (2026-07-09, owner-directed redesign after references: debatedrills.com, earlyscholars.org, crimsoneducation.org) — navy `#0d2240`, scarlet `#c8102e`, warm paper `#faf9f6`; token ramps `navy-*` / `signal-*` (signal = the scarlet) live in `globals.css`. Fonts: Source Serif 4 (display; applied globally to h1–h3 via `--font-display`, italic available for editorial accents), Inter (body), Geist Mono (numeric accents). Design rules distilled from the references: **white-first pages** (navy reserved for bands/footer/text, scarlet used sparingly for CTAs/numbers/rules), full-bleed real photography with navy overlay for the hero, a university-name proof strip, huge scarlet serif stat numerals on white, editorial numbered lists instead of icon-card grids, `rounded-sm` corners, quiet underlined text links (no `→` arrows). Avoid dark full-page themes, electric blue, grotesk display fonts, and uniform rounded-card grids — the owner flagged that style as looking AI-generated. Logo: `public/images/logo.png` + `src/app/icon.png`; navbar/footer mark is typographic (navy tile, serif W, scarlet dot).
- Photos in `public/images/` have orientation baked into pixels (no EXIF rotation) — three originals had wrong EXIF that Next's image optimizer rendered sideways. If adding photos, verify orientation with a real render, not just Preview.

### SEO / metadata pattern (lifted from wsc-academy — keep it)

- `src/app/layout.tsx` sets `metadataBase: new URL(SITE_URL)`; `SITE_URL` (in `src/lib/site.ts`) reads `NEXT_PUBLIC_SITE_URL` with a `https://wsdcacademy.com` fallback. The same constant drives `sitemap.ts`, `robots.ts`, and `JsonLd.tsx`. Don't remove the fallback — it lets `npm run build` work without env.
- Title template binds the brand to the money keyword: default "WSDC Prep | World Schools Debate Coaching & Training". Keyword targeting stays on **"world schools debate"** phrasing (what Americans actually search), not "WSDC".
- Per-page metadata is exported from each `page.tsx` (server components). All `canonical`, `openGraph.url`, and image URLs are **relative paths** resolved against `metadataBase` — never hardcode absolute URLs in per-page metadata.
- Structured data lives in `src/components/JsonLd.tsx` (Organization, WebSite, Service, Course, FAQ, Breadcrumb, Article, CoachList/Person). **Never add `aggregateRating`** with self-declared ratings — that caused a near-penalty on wscprep.com.
- Guide cluster (each with Article + Breadcrumb + page-local FAQ schema): `/what-is-world-schools-debate`, `/usa-debate-team`, `/world-schools-debate-judging`, `/world-schools-vs-public-forum`. New guides follow this pattern and get added to `sitemap.ts` and the footer "Learn" column.
- **Content split (owner-directed):** `/resources/*` = tools a student *uses* (printable cheat sheets, quick references, motion bank, glossary) — registry in `src/data/resources.ts`, fill-in-sheet primitives in `src/components/CheatSheet.tsx`, print CSS in `globals.css` (`.cheat-sheet`, `.print-hide`, `PrintButton`). `/blog/*` = editorial essays a student *reads* — registry in `src/data/blog.ts` (drives index, sitemap, and per-post metadata via `postMetadata()`), shared chrome in `src/components/BlogPostShell.tsx`. Both registries feed `sitemap.ts` automatically; new resources/posts only need a page + a registry entry. Content plan: `docs/blog-plan.md`.

### Data-driven content (single source of truth, no CMS)

- `src/data/programs.ts` — the 4 programs. Drives `/programs`, `/programs/[slug]`, sitemap, Course JSON-LD, and the homepage pathway grid. To change program content, touch only this file. **Lineup (real, owner-supplied 2026-07-17):** Foundation (`foundations`) and Competition Team (`competition-team`) each run **Junior + Senior age-band tracks** — carried in `Program.tracks` (band, ageRange, cadence, two time-slot `options`) and rendered as the "Class schedule" section by the **`ScheduleTimezones` client component**. Each slot is stored **anchored to US Eastern wall-clock** (`dayOfWeek` + `start`/`end` "HH:MM" ET) as the single source of truth; the component converts to the viewer's timezone with the `Intl` API (auto-detected on mount, plus a selector), and handles day-rollover for Asia/Pacific viewers. It's SSR-safe: the default is ET, so the static HTML carries real times for SEO/no-JS, then upgrades post-hydration. Changing a class time = edit the ET anchor only. The conversion/detection helpers are extracted to **`src/lib/schedule.ts`** (pure, no React) and the shared **`TimezoneSelect` + `useViewerTimezone`** (`src/components/TimezoneSelect.tsx`); the `/programs` index also renders a term-wide **`TermSchedule`** (all group slots in one timezone-aware view, grouped by the viewer's local weekday) off the same helpers. A **seasonal Summer Bootcamp** (`summer-bootcamp`, `seasonal: true`, `bootcamp` field: a 12-hour / 6-session August intensive for beginners) is purchasable like the others but kept **out of the year-round pathway ladders** (homepage grid + the `[slug]` stepper both filter `!seasonal`; `pathwayStep` is now optional); it sorts first on `/programs` with a "Summer intensive" badge and is rendered by **`BootcampSchedule`**. The bootcamp now offers **two either/or time options** (`bootcamp.options`: A = Mon+Thu 1–3pm ET, B = Tue+Fri 10am–12pm ET); the buyer picks one at checkout. Price stays at the program level (bands share a price), so the cart/checkout stay per-program. **Checkout now collects age band + time slot** for every group/bootcamp line: `getEnrollmentOptions(program)` resolves the selectable ages/times (track programs derive them from `tracks`, tying a slot to a band via `ageId`; the bootcamp uses `ageGroups` + `bootcamp.options`), the payment-intent route re-validates the chosen ids server-side, and the labels are recorded on the Supabase `orders.students` jsonb (`ageGroup`, `timeSlot`) plus the confirmation/admin emails. National Team Sprint (`national-team-sprint`, renamed from `usa-debate-intensive`) is **invitation-only** (`invitationOnly: true`). **1-on-1 (`private-coaching`) sells tiered variants** (`Program.oneOnOne`), not a fixed unit: diagnostic $80 (buy once), hourly $120/hr (1–9 hrs), 10-hr $1,000, 20-hr $1,700, hours valid one year. The `OneOnOnePicker` client component adds a variant cart line (`CartItem.variantId`/`quantity`); `resolveOneOnOne()` is the server-side price source of truth. Group programs carry a `term` (Term 1 · 2026/27, Sept 1–Dec 18, early-bird before Aug 15) rendered as a banner under the hero. **Pricing (owner-supplied 2026-07-19):** Foundation $756/term (was $945), Competition $980/term (was $1,225), Bootcamp $328 (was $410); each carries `pricing.compareAt` (struck original) and a **permanent "25% off early-bird" marketing label** (`EARLY_BIRD_PERCENT`, always shown regardless of date per owner directive — the 3 group prices are actually 20% off, but the badge always reads 25%).
- `src/data/coaches.ts` — roster (shared with atlantic-ivy-landing; headshots in `public/images/coaches/`). Drives `/coaches`, homepage grid, Person JSON-LD.
- `src/data/faqs.ts` — drives `/faq`, homepage FAQ, and FAQ JSON-LD. `onHomepage: true` marks homepage items.

### Forms → API routes

`/trial` and `/contact` use the shared `LeadForm` client component posting JSON to `src/app/api/{trial,contact}/route.ts`. Server pattern (from wsc-academy): honeypot field `website_url` (silent 200), per-IP rate limit (5/min, in-memory), validation, then admin notification via **Resend HTTP API** (plain fetch in `src/lib/leads.ts`, no SDK — `sendEmail()` there is the generic sender). Email failure never fails the request.

**Not yet wired:** Supabase lead persistence for the two lead forms (only `orders` has a table so far), user auto-reply emails on lead forms.

### Store: cart → checkout → Stripe → Supabase (built 2026-07-10, pattern ported from wsc-academy)

The 4 programs are directly purchasable. Multi-kid by design: each cart line = one program enrollment for one student, and the same program can be added once per child (lines carry a unique `lineId`).

- **What's sold** lives in `src/data/programs.ts` → `Program.enrollment` (`unitLabel` + `amount`) for the fixed-price group/bootcamp programs, and `Program.oneOnOne` for 1-on-1's tiered variants (diagnostic / hourly / 10- & 20-hr packages). Prices are **owner-supplied (2026-07-19)**. Prices are ALWAYS re-resolved server-side from this file (`enrollment.amount` or `resolveOneOnOne()`) — never trust client amounts. `GRADE_LEVELS` there is the shared grade allow-list. **Only 3 of the 4 programs are purchasable:** National Team Sprint is `invitationOnly` — no cart line, an "Request consideration" CTA to `/contact` instead, and the payment-intent route hard-rejects it (`program.invitationOnly` guard) so a crafted request can't buy in.
- **Cart**: `src/context/CartContext.tsx`, localStorage key `wsdc-academy-cart`; `CartProvider` wraps the root layout. `EnrollButton` (program pages) adds a line and routes to `/checkout`; label flips to "Enroll another student" when the program is already in the cart. Navbar shows "Cart (n)" only when n > 0.
- **/checkout**: single client page, three steps (cart → details → payment). Details = parent name/email(/phone) + per-line student name/grade/school, with a "same student for every enrollment" mirror toggle (default OFF — multiple lines usually means multiple kids). The PaymentIntent is created only on entering the payment step (`/api/checkout/payment-intent`); Back drops the clientSecret so edits produce a fresh intent. Embeds Stripe `<PaymentElement>`; success redirects to `/checkout/confirmation`, which clears the cart only on `redirect_status=succeeded`. `/checkout` is noindex (layout metadata) + disallowed in robots.ts.
- **Metadata → order**: buyer + per-student info ride on the intent as metadata. Students use per-item keys `student_0..N` (one JSON blob per line, each under Stripe's 500-char value cap) — do not collapse them into one key or multi-kid carts truncate.
- **Webhook** `/api/webhooks/stripe`: verifies signature against `STRIPE_WEBHOOK_SECRET` using the RAW body (`req.text()` — don't switch to `req.json()`), then on `payment_intent.succeeded` inserts a Supabase `orders` row (idempotent: UNIQUE `stripe_payment_intent_id`, 23505 → no-op) and sends buyer + admin emails (`src/lib/email-templates.ts`). Email failure never fails the webhook; a 500 makes Stripe retry.
- **Supabase**: `supabase/schema.sql` is canonical, applied manually via the SQL Editor. RLS enabled with NO policies → service-role key only (`src/lib/supabase.ts`, server-only). Orders carry a `fulfillment` workflow column (`new → welcomed → placed → completed`); the Supabase dashboard is the admin UI for now.
- Without env keys everything degrades gracefully: pages render, payment-intent returns a friendly 500, emails log to console.

## JSX whitespace gotcha (Next 16 / Turbopack)

A text node that follows an inline `{expression}` and wraps onto the next source line can
LOSE its leading space in the compiled output (seen 2026-07-11: `{coaches.length} coaches
whose…` rendered "coacheswhose"; `{SITE_NAME} is an independent…` rendered "Academyis").
It is inconsistent — some spots render fine — so never trust it: put an explicit `{' '}`
after any mid-sentence expression whose following text wraps, and verify rendered HTML
(curl + grep) rather than the source when prose contains inline expressions.

## Copy style (humanized 2026-07-10)

All site copy was swept with the `humanizer` skill (~/.agents/skills/humanizer/SKILL.md — Wikipedia "Signs of AI writing" patterns). Hold new copy to the same bar:
- **No em dashes (—) in rendered prose.** Use period/comma/colon/parentheses. En dashes stay ONLY in numeric ranges (ages 11–15, 2026–27, Apr 17–19). The lone survivors are code comments, console logs, the `'—'` empty-value markers in admin email tables, and the plain-text email signature.
- Avoid the tell patterns: "isn't just X, it's Y" and "not only… but…"; trailing "-ing" analysis clauses (", ensuring…", ", showcasing…"); forced rule-of-three rhythm; AI vocabulary (crucial, pivotal, delve, landscape, tapestry, testament, underscores, fosters, vibrant, elevate, seamless); copula avoidance ("serves as"); staccato drama runs; aphorism formulas; generic upbeat closers; fake-candid openers ("Here is an uncomfortable truth…").
- Metadata title separators are colons, not em dashes.
- Keep: typographic apostrophes/&apos; entities (ESLint), deliberate accuracy hedges ("expected", "verify with the organizer", "typically held"), SEO keyword phrases in titles/H1s, debate terms of art ("our worst case beats their best case") and example caselines (those are supposed to be aphorisms).
- "From X to Y" only counts as a false range when X and Y aren't a real span. "From the Oxford Union to national-squad training rooms" is a genuine span of venues — owner explicitly restored it after an over-eager edit. When in doubt, leave ranges alone.
- **SEO is untouchable during copy edits** (owner directive): keyword phrases, canonicals, slugs, H1s, and metadata structure must survive any style pass. Long keyword-led titles (>75 chars) and long descriptions are a deliberate choice here — do not trim them for "best practice". Verify after any sweep by auditing the rendered HTML of every sitemap route (title/description/canonical/keyword presence).

## Content accuracy rules

Factual claims about the WSDC ecosystem were verified June 2026 and re-verified via web research July 2026 (NSDA pages + USWSDI manual PDF fetched; WSDC/tournament sources fetched). **Newly SAFE facts (source in parens):**
- USA Debate eligibility: US citizens (dual OK) or 2+-year permanent residents, US secondary students, WSDC age rules, active NSDA membership; application = online form + coach/admin recommendations + videos on three provided motions; team announced late August (speechanddebate.org/usa-debate, fetched 2026-07)
- Two squads: National Team (sole US representative at WSDC) + Development Team (same page, exact wording)
- WSDC champions: USA 2023 (Hanoi), Scotland 2024 (Belgrade), India def. Australia 9-0 2025 (Panama City). WSDC 2026 = Nairobi, Kenya, July 14–24 2026 (africandebate.com/wsdc-2026)
- WSDC entry: one team per nation; ~60–70+ national teams; 8 prelims (4 prepared/4 impromptu) then octos (wsdcdebating.org + Wikipedia)
- NSDA Nationals WS = "USA World Schools Debate Invitational (USWSDI)": teams of 3–5, up to two teams per NSDA district, each team furnishes a judge; 6 prelims, 4-2 break; prepared motions released May 1; impromptu released 1 hour before round (USWSDI Manual PDF: speechanddebate.org/wp-content/uploads/USWSDI-Manual-2023.pdf)
- International teams may enter USWSDI (2025 HS champion was Team China Gold)

**Still do NOT publish (unverified):**
- USA team's 2024/2025 WSDC elimination placements (Wikipedia-only "quarterfinals" — no NSDA source)
- WSDC 2026 results (tournament just ended as of 2026-07; none published) and 2027 host as firm fact (Wikipedia says Sofia, Bulgaria — single source, phrase as "expected")
- National/Development Team roster sizes; tryout stages beyond the video application
- NSDA Nationals WS field size
- "First WSDC in Africa" for Nairobi (organizer's claim is "first in **East** Africa" — use that wording only)

USA Debate application dates (April 1 – June 25 for 2026–27) are season-specific — re-verify each year against speechanddebate.org/usa-debate.

**Tournament facts (second research pass, 2026-07-10, TOC bid list + event pages fetched):**
- TOC 2026–27 WS bid list = **33 tournaments in 3 tiers** (5 quarters: Greenhill Gold, Longhorn, Stanford, Harvard in-person + online; 15 semis; 13 finals — NO octas tier). TOC 2027 = Apr 17–19; NSDA Nationals 2027 = Phoenix, Jun 13–18. Several bid rows on ci.uky.edu still showed stale 2025 dates — re-check each September.
- State WS: TX (TFA + Team Texas), IN (ISSDA), FL (FFL Open State), WA (WIAA trial), **WI (WISDAA festival — Congress + WS only)** verified; **AR (ACTAA) partially** — WS is an official ACTAA event, state-championship contest not explicit. Negative checks: OK/LA/IL/VA/NC/SC/TN/NV/OR have no WS state division.
- Dedicated/US extras: Penn WS Invitational (online, Mar), NSDA Springboard Series (free online WS scrimmages, non-members OK), Sunvite WS carries NO TOC bid.
- International opens verified WS + open entry: ESDC Istanbul (17th ed. Jan 2027), Prague Debate Spring (Jul), Heart of Europe (Jul; site unreliable), Doxbridge (online Jul; 2025 £90/team), WHO Zagreb (Dec; 2026 dates pending), Oldham Cup (Apr; 2027 TBA), EurOpen (Nov; site under maintenance — "confirm first"), WS Debate Academy Kranjska Gora (late Jun, camp+tournament). Watchlist only (single-source/format unconfirmed): MIWSDC, EAWSDC/Tanzania/UAE Junior (africandebate.com), QatarDebate ISDC. **NOT WS format — never list as WS:** ICYD, Cambridge Schools (BP 2-person), Hart House, McGill (BP/CP), ASDC Hanoi (Asian Parl), EduDrift events. WSDL league is dormant + Asia-only.

## Launch checklist (owner action required)

- [x] **Register `wsdcacademy.com`** — registered (confirmed live 2026-07-10). ⚠ The domain currently serves a **"Coming Soon" placeholder** (a small TanStack app on Netlify) that is NOT this repo's build: no robots.txt, no sitemap, and no noindex, so Google can index "Coming Soon" as the homepage. Deploy this repo's build to replace it (or add noindex to the placeholder until then). Consider also `worldschoolsprep.com` / `wsdcprep.com` (verified available 2026-06-11) as redirect domains.
- [x] **Pricing sign-off (owner-supplied 2026-07-19)** — Foundation $756/term (was $945), Competition Team $980/term (was $1,225), Summer Bootcamp $328 for 12 hrs / 6 sessions (was $410). 1-on-1 is tiered: diagnostic $80 (one-time), $120/hr for 1–9 hrs, 10-hr package $1,000, 20-hr package $1,700 — hours valid one year. Hourly rates shown on pages: $27/hr (Foundation, Bootcamp), $35/hr (Competition). A **permanent "25% off early-bird" label** shows on every purchasable program (marketing, never date-gated); the group prices are really 20% off their struck original but the badge always reads 25% (owner directive). National Team Sprint is invitation-only with **no price**. Junior/Senior bands still share one price each (band is a scheduling choice confirmed at checkout, not a price variant).
- [ ] **Program content sign-off (owner)** — schedules/term dates and **age bands are owner-supplied (2026-07-19):** Foundation & Bootcamp 9–12 / 13–16, Competition 11–14 / 14–17. All four pages now carry the deep sections (session flow / what's included / FAQ); **the session-flow timings, deliverables, and FAQ commitments on all of them are invented and need owner review** (esp. make-up policy, tournament-support scope, the Sprint's "two classes + weekly practice" and its 2-hour session assumption). Foundation's copy was also nudged from a 90-min to a 2-hour class — reread for accuracy.
- [x] **Stripe account** — owner decided 2026-07-10: **reuse the Atlantic Ivy account**. LIVE keys are wired in `.env.local` (copied from atlantic-ivy-landing/.env) and verified working. ⚠ **Live keys in dev**: Stripe test cards do NOT work; a completed checkout charges a real card — refund via dashboard, and WSDC orders share the Atlantic Ivy dashboard/books.
- [ ] **Stripe webhook** — register `https://wsdcacademy.com/api/webhooks/stripe` (event `payment_intent.succeeded`) in the Stripe dashboard once the domain is live, set `STRIPE_WEBHOOK_SECRET` (empty until then — orders won't persist without it). Local dev: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
- [ ] **Supabase project** — create one for the brand, run `supabase/schema.sql`, set `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. Orders won't persist without it.
- [x] **Legal + trust pages** — /privacy, /terms, /refund, /about built 2026-07-11 (adapted from wscprep's owner-approved policies; shared chrome in `src/components/LegalPage.tsx`). Linked from footer bottom bar + checkout summary ("By completing this purchase you agree…"); /about substantiates the "500+ students" stat and is footer-linked. ⚠ **Owner review needed:** refund terms (7-day full / pro-rated to midpoint minus 15% / none after midpoint; 1-on-1 pack terms) and the **governing-law clause in /terms is deliberately generic** — set the real entity + jurisdiction (wscprep uses UAE/Dubai; this is a US-facing brand) before launch.
- [ ] **Email** — `hello@wsdcacademy.com` is used site-wide (via `src/lib/site.ts` and `.env.example`); create the mailbox and Resend domain, then set env vars.
- [x] **OG image** — branded 1200×630 at `/images/og-home.jpg` (generated 2026-07-09).
- [x] **Logo** — `/images/logo.png` + app `icon.png` (generated 2026-07-09).
- [ ] Hosting: Netlify with `@netlify/plugin-nextjs` (matching sibling sites) — not yet configured.
- [ ] Google Search Console + Bing verification (root `metadata.verification` not set).
- [ ] The "500+ students coached" hero stat carries over from the Atlantic Ivy team's track record — confirm owner is comfortable using it under this brand.

## Environment variables

See `.env.example`. `NEXT_PUBLIC_SITE_URL` (domain swap), `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `ADMIN_NOTIFICATION_EMAIL` (lead + order emails; degrade to console logging without them), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` (checkout + webhook), `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (order persistence).
