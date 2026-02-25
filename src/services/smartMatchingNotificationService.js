import {
  DEFAULT_SMART_MATCHING_ALERTS,
  DEFAULT_SMART_MATCHING_CRITERIA,
  SMART_MATCHING_BUSINESS_TYPES,
  SMART_MATCHING_BUYER_PROFILE_TYPES,
  SMART_MATCHING_LOCATIONS,
  SMART_MATCHING_SECTORS,
} from '@/constants/smartMatchingConfig';
import { supabase } from '@/api/supabaseClient';

// Re-export constants for backward-compatible imports
export {
  DEFAULT_SMART_MATCHING_ALERTS,
  DEFAULT_SMART_MATCHING_CRITERIA,
  SMART_MATCHING_BUSINESS_TYPES,
  SMART_MATCHING_BUYER_PROFILE_TYPES,
  SMART_MATCHING_LOCATIONS,
  SMART_MATCHING_SECTORS,
};

const SMART_MATCHING_CRITERIA_STORAGE_PREFIX = 'smartMatchingCriteria';
const SMART_MATCHING_ALERTS_STORAGE_PREFIX = 'smartMatchingAlerts';

const parseJSON = (raw, fallback) => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const getCriteriaStorageKey = (userId, mode) =>
  `${SMART_MATCHING_CRITERIA_STORAGE_PREFIX}:${userId || 'guest'}:${mode || 'buyer'}`;

export const getAlertsStorageKey = (userId) =>
  `${SMART_MATCHING_ALERTS_STORAGE_PREFIX}:${userId || 'guest'}`;

export function getSmartMatchingCriteria(userId, mode) {
  if (!canUseStorage()) return { ...DEFAULT_SMART_MATCHING_CRITERIA };

  const raw = window.localStorage.getItem(getCriteriaStorageKey(userId, mode));
  return {
    ...DEFAULT_SMART_MATCHING_CRITERIA,
    ...parseJSON(raw, {}),
  };
}

export function saveSmartMatchingCriteria(userId, mode, criteria) {
  if (!canUseStorage()) return;

  const payload = {
    ...DEFAULT_SMART_MATCHING_CRITERIA,
    ...(criteria || {}),
  };

  window.localStorage.setItem(getCriteriaStorageKey(userId, mode), JSON.stringify(payload));
}

export function getSmartMatchingAlertPreferences(userId) {
  if (!canUseStorage()) return { ...DEFAULT_SMART_MATCHING_ALERTS };

  const raw = window.localStorage.getItem(getAlertsStorageKey(userId));
  return {
    ...DEFAULT_SMART_MATCHING_ALERTS,
    ...parseJSON(raw, {}),
  };
}

export function saveSmartMatchingAlertPreferences(userId, alerts) {
  if (!canUseStorage()) return;

  const payload = {
    ...DEFAULT_SMART_MATCHING_ALERTS,
    ...(alerts || {}),
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(getAlertsStorageKey(userId), JSON.stringify(payload));
}

export function getSmartMatchingAlertFrequencyLabel(frequency, language = 'fr') {
  const map = {
    daily: language === 'fr' ? 'Quotidienne' : 'Daily',
    weekly: language === 'fr' ? 'Hebdomadaire' : 'Weekly',
    disabled: language === 'fr' ? 'Désactivée' : 'Disabled',
  };

  return map[frequency] || map.disabled;
}

// ── DB sync (for cron digest) ──────────────────────────────────────────────

const ALERT_PREFS_TABLE = 'smart_matching_alert_preferences';

/**
 * Sync alert preferences + criteria to DB so the smartmatch-digest cron can read them.
 * Upserts one row per (user_id, mode).
 */
export async function syncAlertPreferencesToDB(userId, { mode, criteria, alerts }) {
  if (!userId) return;

  try {
    await supabase.from(ALERT_PREFS_TABLE).upsert(
      {
        user_id: userId,
        mode: mode || 'buyer',
        criteria: criteria || {},
        enabled: alerts?.enabled ?? false,
        frequency: alerts?.frequency || 'disabled',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,mode' }
    );
  } catch {
    // Best-effort sync; localStorage remains the primary source
  }
}
