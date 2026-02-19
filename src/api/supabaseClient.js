import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const getProjectRefFromUrl = (url) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.split('.')[0] || 'default';
  } catch {
    return 'default';
  }
};

const storageKey = `riviqo-auth-${getProjectRefFromUrl(supabaseUrl || '')}`;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey,
    flowType: 'pkce'
  }
});

export default supabase;
