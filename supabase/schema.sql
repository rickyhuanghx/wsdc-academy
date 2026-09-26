-- WSDC Prep — checkout schema
-- Run this in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Idempotent: safe to re-run.
--
-- RLS is enabled with NO policies: only the service-role key (server-side)
-- can read/write. The browser anon key has no access by design.

-- ============================================================
-- orders: paid enrollments from /checkout (Stripe PaymentIntent flow).
-- Populated by /api/webhooks/stripe on payment_intent.succeeded.
-- One row per payment; one order can hold several enrollments (multiple
-- kids and/or programs) — per-student detail lives in the students jsonb.
-- ============================================================
create table if not exists public.orders (
  id                          uuid primary key default gen_random_uuid(),
  created_at                  timestamptz not null default now(),
  -- Stripe identifiers
  stripe_payment_intent_id    text not null unique,  -- idempotency anchor
  amount_total                integer not null,       -- minor units (cents)
  currency                    text not null,          -- lowercase ISO code: 'usd'
  status                      text not null default 'paid'
                              check (status in ('paid', 'refunded', 'failed')),
  -- Buyer
  receipt_email               text not null,
  parent_name                 text not null,
  parent_phone                text,
  -- Items (denormalized from PaymentIntent metadata)
  program_ids                 text not null,   -- comma-separated program ids
  program_names               text not null,   -- ' | '-separated for display
  students                    jsonb not null,  -- [{ name, gradeLevel, school, programId, unitLabel?, ageGroup?, timeSlot? }, ...]
  -- Operational fields for the welcome/placement workflow
  fulfillment                 text not null default 'new'
                              check (fulfillment in ('new', 'welcomed', 'placed', 'completed')),
  notes                       text
);

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);
create index if not exists orders_receipt_email_idx
  on public.orders (receipt_email);
create index if not exists orders_fulfillment_idx
  on public.orders (fulfillment);

alter table public.orders enable row level security;

-- ============================================================
-- ad_clicks: raw click log for the /go/<slug> vanity ad redirects.
-- Written by src/app/go/[slug]/route.ts on every non-bot click.
--
-- This is the click *count* only — it is deliberately independent of GA4 so a
-- blocked tag or an instant back-out still registers. Sessions, engagement and
-- conversions stay in GA4; join the two on utm_campaign when reporting.
-- ============================================================
create table if not exists public.ad_clicks (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  slug         text not null,          -- the /go/<slug> that was hit
  utm_source   text not null,
  utm_campaign text not null,
  utm_content  text,                   -- which creative, when set
  referrer     text,
  user_agent   text,
  ip           text
);

create index if not exists ad_clicks_created_at_idx
  on public.ad_clicks (created_at desc);
create index if not exists ad_clicks_slug_idx
  on public.ad_clicks (slug, created_at desc);

alter table public.ad_clicks enable row level security;

-- ============================================================
-- coaching_1on1_requests: the unlisted 1-on-1 request form (/coaching-1on1).
-- Written by src/app/api/coaching-1on1/route.ts with the service-role key.
--
-- Nothing reads this from the browser, so RLS stays on with no policy at all.
-- The form works without this table (the staff email is the primary sink and
-- a failed insert is logged, never fatal), but this is the durable record.
-- ============================================================
create table if not exists public.coaching_1on1_requests (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),

  student_name       text not null,
  student_age        int,
  student_grade      text,
  level              text,              -- new to debate / some experience / competitive
  format_focus       text,              -- World Schools, BP, LD, PF, public speaking
  goal               text,              -- tournament or aim they are working towards

  parent_name        text not null,
  parent_email       text not null,
  parent_phone       text not null,

  -- Ordered preference as one readable string: "1. Tin Puljić · 2. Biser Angelov",
  -- or "No preference". Kept as text so reordering the roster needs no migration.
  preferred_coach    text,
  preferred_days     text[] not null default '{}',
  preferred_windows  text[] not null default '{}',
  timezone           text,               -- the parent's own zone, as they saw it

  video_url          text,               -- optional speech recording or ballot
  notes              text,
  page_url           text,

  -- Follow-up state, maintained by hand: new -> contacted -> booked / lost.
  status             text not null default 'new'
);

create index if not exists coaching_1on1_requests_created_at_idx
  on public.coaching_1on1_requests (created_at desc);
create index if not exists coaching_1on1_requests_status_idx
  on public.coaching_1on1_requests (status);

alter table public.coaching_1on1_requests enable row level security;

-- ============================================================
-- diagnostic_intakes: the private pre-diagnostic intake form
-- (/for/diagnostic/[token]). Written by src/app/api/diagnostic-intake/route.ts
-- with the service-role key. One row per submission; the invite token ties it
-- to the paid diagnostic (see DIAGNOSTIC_INVITES in src/lib/diagnostic-intake.ts).
--
-- Nothing reads this from the browser, so RLS stays on with no policy at all.
-- The form works without this table (the staff email is the primary sink and
-- a failed insert is logged, never fatal), but this is the durable record.
-- ============================================================
create table if not exists public.diagnostic_intakes (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),

  invite_token       text not null,
  payment_ref        text,               -- Stripe payment intent the diagnostic was bought on

  student_name       text not null,
  student_age        int,
  student_grade      text,
  school             text,
  experience         text,               -- never / school only / a few tournaments / regular
  formats_tried      text[] not null default '{}',
  goals              text[] not null default '{}',
  competitions       text,               -- competitions or deadlines on the horizon, free text
  notes              text,

  -- The written tasks, verbatim, with the prompts the student actually saw.
  motion             text,
  side               text,
  case_text          text,
  rebuttal_prompt    text,
  rebuttal_text      text,
  speech_url         text,               -- optional recording link
  time_spent         text,

  parent_name        text not null,
  parent_email       text not null,
  parent_phone       text not null,
  student_email      text,

  preferred_days     text[] not null default '{}',
  preferred_windows  text[] not null default '{}',
  timezone           text,               -- the family's own zone, as they saw it
  page_url           text,

  -- Follow-up state, maintained by hand: new -> scheduled -> done.
  status             text not null default 'new'
);

create index if not exists diagnostic_intakes_created_at_idx
  on public.diagnostic_intakes (created_at desc);
create index if not exists diagnostic_intakes_token_idx
  on public.diagnostic_intakes (invite_token);

alter table public.diagnostic_intakes enable row level security;
