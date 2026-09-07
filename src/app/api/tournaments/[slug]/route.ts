// Minimal tournament lookup for the checkout page's ?tournament= prefill.
// Server-side proxy so the browser never calls ClassDesk directly (CSP).

import { NextResponse } from 'next/server';
import { getTournament, priceUsd } from '@/lib/tournaments';

export const runtime = 'nodejs';

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const t = await getTournament(slug);
  if (!t) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(
    {
      slug: t.slug,
      name: t.name,
      price: { amountMinor: t.price.amountMinor, currency: t.price.currency, usd: priceUsd(t) },
      status: t.status,
    },
    { headers: { 'cache-control': 'private, max-age=0, must-revalidate' } },
  );
}
