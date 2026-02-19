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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isAbortLikeError = (error) => {
  const message = (error?.message || '').toLowerCase();
  return (
    error?.name === 'AbortError' ||
    message.includes('signal is aborted') ||
    message.includes('aborted without reason') ||
    message.includes('the operation was aborted')
  );
};

const resilientFetch = async (input, init = {}) => {
  // If caller provides an already-aborted signal, do not retry.
  if (init?.signal?.aborted) {
    return fetch(input, init);
  }

  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await fetch(input, init);
    } catch (error) {
      lastError = error;
      if (!isAbortLikeError(error) || attempt === 2) {
        throw error;
      }
      await sleep(200 * (attempt + 1));
    }
  }

  throw lastError;
};

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: resilientFetch
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey,
    flowType: 'pkce'
  }
});

export default supabase;
