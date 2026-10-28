import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

function normalizeSupabaseUrl(raw) {
  if (!raw) return '';
  try {
    const parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const host = parsed.hostname.toLowerCase();

    // If the Dashboard URL was pasted by mistake, recover the project ref
    // from /dashboard/project/<ref> and construct the API origin.
    const dashboardMatch = parsed.pathname.match(/\/(?:dashboard\/)?project\/([a-z0-9-]+)/i);
    if (dashboardMatch && (host === 'supabase.com' || host === 'app.supabase.com' || host.endsWith('.supabase.com'))) {
      return `https://${dashboardMatch[1]}.supabase.co`;
    }

    // A valid project API URL must be an origin, not a Dashboard/API subpath.
    if (host.endsWith('.supabase.co')) {
      return `https://${host}`;
    }
    return raw.replace(/\/+$/, '');
  } catch {
    return raw.replace(/\/+$/, '');
  }
}

export const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null;
