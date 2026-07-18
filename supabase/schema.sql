-- WSDC Academy — checkout schema
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
