import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Row shapes for documentation / consumer use. Not passed as a Database
// generic — supabase-js v2's strict Database type is more involved than we
// need for an insert-only table.

export type OrderStudent = {
  name: string;
  gradeLevel: string;
  school: string;
  programId: string;
};

export type OrderRow = {
  id: string;
  created_at: string;
  stripe_payment_intent_id: string;
  amount_total: number; // minor units (cents)
  currency: string; // lowercase ISO code
  status: 'paid' | 'refunded' | 'failed';
  receipt_email: string;
  parent_name: string;
  parent_phone: string | null;
  program_ids: string; // comma-separated
  program_names: string; // ' | '-separated for display
  students: OrderStudent[];
  fulfillment: 'new' | 'welcomed' | 'placed' | 'completed';
  notes: string | null;
};

let cachedAdminClient: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the service-role key.
 * Bypasses RLS — never expose this client to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cachedAdminClient) return cachedAdminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase env vars missing: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local',
    );
  }

  cachedAdminClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cachedAdminClient;
}
