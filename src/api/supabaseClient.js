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

export const storageKey = `riviqo-auth-${getProjectRefFromUrl(supabaseUrl || '')}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const authLocks = new Map();
const AUTH_LOCK_MAX_HOLD_MS = 15000;

const localAuthLock = async (name, acquireTimeout, fn) => {
  const startedAt = Date.now();

  while (authLocks.has(name)) {
    // Force-release si le lock est tenu trop longtemps (recovery après tab freeze)
    const lockInfo = authLocks.get(name);
    if (lockInfo && Date.now() - lockInfo.acquiredAt > AUTH_LOCK_MAX_HOLD_MS) {
      authLocks.delete(name);
      break;
    }
    if (acquireTimeout >= 0 && Date.now() - startedAt >= acquireTimeout) {
      const timeoutError = Object.assign(new Error('Lock acquire timeout'), {
        isAcquireTimeout: true
      });
      throw timeoutError;
    }
    await sleep(20);
  }

  authLocks.set(name, { held: true, acquiredAt: Date.now() });
  try {
    return await fn();
  } finally {
    authLocks.delete(name);
  }
};

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
  // Some environments repeatedly abort Supabase requests via provided signals.
  // We intentionally ignore incoming signal to avoid systemic false-aborts in prod.
  const { signal: _ignoredSignal, ...safeInit } = init || {};

  // Timeout global pour éviter les requêtes pendantes indéfiniment
  // (ex: après mise en veille de l'onglet par le navigateur)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  safeInit.signal = controller.signal;

  let lastError;
  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await fetch(input, safeInit);
      } catch (error) {
        lastError = error;
        if (!isAbortLikeError(error) || attempt === 2) {
          throw error;
        }
        await sleep(200 * (attempt + 1));
      }
    }
    throw lastError;
  } finally {
    clearTimeout(timeoutId);
  }
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
    lock: localAuthLock,
    storageKey,
    flowType: 'pkce'
  }
});

export default supabase;
