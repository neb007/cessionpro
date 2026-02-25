/**
 * smartmatch-digest
 *
 * Cron-triggered Edge Function that sends SmartMatching digest emails.
 * Reads alert preferences from `smart_matching_alert_preferences`,
 * scores recent listings against each user's saved criteria,
 * and sends a digest email via Resend for qualifying matches.
 *
 * Schedule: daily at 08:00 UTC (configured externally via cron/webhook).
 */

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { calculateSmartMatchScore, Listing } from '../_shared/smartMatchingEngine.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') || 'Riviqo <no-reply@riviqo.com>';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const APP_URL = Deno.env.get('APP_URL') || 'https://riviqo.com';

const SCORE_THRESHOLD = 60;
const MAX_MATCHES_PER_DIGEST = 10;

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const getSupabaseClient = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
};

const sendViaResend = async (params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) => {
  if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend error: ${response.status} ${errorText}`);
  }

  return response.json();
};

type MatchItem = {
  title: string;
  score: number;
  sector?: string;
  location?: string;
};

const buildDigestEmail = (params: {
  language: 'fr' | 'en';
  matches: MatchItem[];
  mode: string;
}) => {
  const isFr = params.language === 'fr';
  const count = params.matches.length;

  const subject = isFr
    ? `${count} nouveau${count > 1 ? 'x' : ''} match${count > 1 ? 's' : ''} Smart Matching sur Riviqo`
    : `${count} new Smart Matching match${count > 1 ? 'es' : ''} on Riviqo`;

  const title = isFr
    ? `Votre digest Smart Matching`
    : `Your Smart Matching digest`;

  const intro = isFr
    ? `Nous avons trouvé ${count} annonce${count > 1 ? 's' : ''} correspondant à vos critères ${params.mode === 'seller' ? "d'acquisition" : 'de cession'}.`
    : `We found ${count} listing${count > 1 ? 's' : ''} matching your ${params.mode === 'seller' ? 'acquisition' : 'sell-side'} criteria.`;

  const matchRows = params.matches
    .map(
      (m) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e6e6e6;font-size:14px;color:#2b2b2b;">${m.title || '-'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e6e6e6;font-size:14px;color:#2b2b2b;">${m.sector || '-'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e6e6e6;font-size:14px;color:#2b2b2b;">${m.location || '-'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e6e6e6;font-size:14px;font-weight:700;color:${m.score >= 80 ? '#059669' : m.score >= 60 ? '#2563eb' : '#d97706'};">${m.score}%</td>
        </tr>`
    )
    .join('');

  const tableHeader = isFr
    ? '<tr><th style="text-align:left;padding:8px 12px;background:#f3f4f6;font-size:12px;color:#6b7280;">Annonce</th><th style="text-align:left;padding:8px 12px;background:#f3f4f6;font-size:12px;color:#6b7280;">Secteur</th><th style="text-align:left;padding:8px 12px;background:#f3f4f6;font-size:12px;color:#6b7280;">Lieu</th><th style="text-align:left;padding:8px 12px;background:#f3f4f6;font-size:12px;color:#6b7280;">Score</th></tr>'
    : '<tr><th style="text-align:left;padding:8px 12px;background:#f3f4f6;font-size:12px;color:#6b7280;">Listing</th><th style="text-align:left;padding:8px 12px;background:#f3f4f6;font-size:12px;color:#6b7280;">Sector</th><th style="text-align:left;padding:8px 12px;background:#f3f4f6;font-size:12px;color:#6b7280;">Location</th><th style="text-align:left;padding:8px 12px;background:#f3f4f6;font-size:12px;color:#6b7280;">Score</th></tr>';

  const ctaLabel = isFr ? 'Voir tous les matchs' : 'View all matches';
  const footerNote = isFr
    ? 'Vous pouvez modifier vos critères et la fréquence dans Paramètres > Notifications Smart Matching.'
    : 'You can update your criteria and frequency in Settings > Smart Matching Notifications.';

  const html = `<!doctype html>
<html lang="${isFr ? 'fr' : 'en'}">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:Arial,sans-serif;">
  <div style="width:100%;background:#f7f7f7;padding:24px 0;">
    <div style="width:100%;max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6e6e6;">
      <div style="padding:24px 28px;background:#111;color:#fff;">
        <h1 style="margin:0;font-size:20px;">Riviqo</h1>
      </div>
      <div style="padding:28px;color:#111;">
        <h2 style="margin:0 0 12px;font-size:20px;">${title}</h2>
        <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#2b2b2b;">${intro}</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          ${tableHeader}
          ${matchRows}
        </table>
        <a href="${APP_URL}/SmartMatching" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;">${ctaLabel}</a>
      </div>
      <div style="padding:20px 28px;font-size:12px;color:#6b7280;background:#fafafa;border-top:1px solid #e6e6e6;">${footerNote}</div>
    </div>
  </div>
</body>
</html>`;

  return { subject, html };
};

/**
 * Determine if a preference row is due for a digest.
 */
function isDue(pref: { frequency: string; last_digest_at: string | null }): boolean {
  if (pref.frequency === 'disabled') return false;

  const now = Date.now();
  const lastAt = pref.last_digest_at ? new Date(pref.last_digest_at).getTime() : 0;

  if (pref.frequency === 'daily') {
    // At least 20 hours since last digest
    return now - lastAt > 20 * 60 * 60 * 1000;
  }

  if (pref.frequency === 'weekly') {
    // At least 6 days since last digest
    return now - lastAt > 6 * 24 * 60 * 60 * 1000;
  }

  return false;
}

serve(async (req) => {
  // Accept POST (from cron webhook) or GET (for manual testing)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const supabase = getSupabaseClient();

  // 1. Fetch all active alert preferences that are due
  const { data: prefs, error: prefsError } = await supabase
    .from('smart_matching_alert_preferences')
    .select('id, user_id, mode, criteria, frequency, last_digest_at')
    .eq('enabled', true)
    .neq('frequency', 'disabled');

  if (prefsError) {
    console.error('[smartmatch-digest] Failed to load prefs:', prefsError.message);
    return jsonResponse(500, { error: 'Failed to load preferences' });
  }

  if (!prefs || prefs.length === 0) {
    return jsonResponse(200, { processed: 0, sent: 0 });
  }

  // Filter to only due preferences
  const duePrefs = prefs.filter(isDue);
  if (duePrefs.length === 0) {
    return jsonResponse(200, { processed: 0, sent: 0, reason: 'none_due' });
  }

  // 2. Fetch all active listings once (shared across all users)
  const { data: allListings, error: listingsError } = await supabase
    .from('businesses')
    .select('id, title, type, status, asking_price, sector, location, region, country, employees, annual_revenue, seller_id, created_at')
    .eq('status', 'active')
    .limit(500);

  if (listingsError || !allListings) {
    console.error('[smartmatch-digest] Failed to load listings:', listingsError?.message);
    return jsonResponse(500, { error: 'Failed to load listings' });
  }

  let totalSent = 0;
  let totalProcessed = 0;

  for (const pref of duePrefs) {
    totalProcessed++;

    // 3. Get user profile and email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, notification_emails_enabled, language')
      .eq('id', pref.user_id)
      .maybeSingle();

    if (!profile?.email || profile.notification_emails_enabled === false) {
      continue;
    }

    // 4. Determine which listings to score against
    // buyer mode -> score against cession listings
    // seller mode -> score against acquisition listings
    const targetType = pref.mode === 'seller' ? 'acquisition' : 'cession';
    const candidates = allListings.filter((l) => l.type === targetType);

    if (candidates.length === 0) continue;

    // 5. Build a pseudo-listing from the user's criteria for scoring
    const criteria = pref.criteria || {};
    const pseudoListing: Listing = {
      asking_price: criteria.minPrice ? Number(criteria.minPrice) : undefined,
      sector: criteria.sectors?.[0] || criteria.buyerSectorsInterested?.[0] || undefined,
      location: criteria.locations?.[0] || criteria.buyerLocations?.[0] || undefined,
      employees: criteria.minEmployees ? Number(criteria.minEmployees) : undefined,
      annual_revenue: criteria.minCA || criteria.buyerRevenueMin ? Number(criteria.minCA || criteria.buyerRevenueMin) : undefined,
    };

    // 6. Score each candidate
    const scored = candidates
      .map((candidate) => ({
        candidate,
        result: calculateSmartMatchScore(pseudoListing, candidate),
      }))
      .filter((item) => item.result.score >= SCORE_THRESHOLD)
      .sort((a, b) => b.result.score - a.result.score)
      .slice(0, MAX_MATCHES_PER_DIGEST);

    if (scored.length === 0) {
      // No matches, still update last_digest_at to avoid re-processing
      await supabase
        .from('smart_matching_alert_preferences')
        .update({ last_digest_at: new Date().toISOString() })
        .eq('id', pref.id);
      continue;
    }

    // 7. Build and send digest email
    const language = (profile.language === 'en' ? 'en' : 'fr') as 'fr' | 'en';
    const matches: MatchItem[] = scored.map((s) => ({
      title: s.candidate.title || '-',
      score: s.result.score,
      sector: s.candidate.sector || undefined,
      location: s.candidate.location || undefined,
    }));

    const { subject, html } = buildDigestEmail({ language, matches, mode: pref.mode });

    try {
      await sendViaResend({ to: profile.email, subject, html, text: subject });
      totalSent++;

      // Log dispatch
      try {
        await supabase.from('email_dispatch_logs').insert({
          actor_id: pref.user_id,
          event_type: 'smartmatch_digest',
          recipient_id: pref.user_id,
          recipient_email: profile.email,
          source_id: `digest:${pref.mode}:${new Date().toISOString().slice(0, 10)}`,
          status: 'sent',
        });
      } catch {
        // Best-effort logging
      }
    } catch (err) {
      console.error(`[smartmatch-digest] Send failed for ${pref.user_id}:`, (err as Error).message);
      try {
        await supabase.from('email_dispatch_logs').insert({
          actor_id: pref.user_id,
          event_type: 'smartmatch_digest',
          recipient_id: pref.user_id,
          recipient_email: profile.email,
          source_id: `digest:${pref.mode}:${new Date().toISOString().slice(0, 10)}`,
          status: 'failed',
          error: (err as Error).message,
        });
      } catch {
        // Best-effort logging
      }
    }

    // 8. Update last_digest_at regardless of send success (avoid retrying same day)
    await supabase
      .from('smart_matching_alert_preferences')
      .update({ last_digest_at: new Date().toISOString() })
      .eq('id', pref.id);
  }

  return jsonResponse(200, { processed: totalProcessed, sent: totalSent });
});
