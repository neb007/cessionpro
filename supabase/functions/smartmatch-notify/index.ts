import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { calculateSmartMatchScore, Listing } from '../_shared/smartMatchingEngine.ts';

type SmartMatchBody = {
  listingId?: string;
  language?: 'fr' | 'en';
  idempotencyKey?: string;
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') || 'Riviqo <no-reply@riviqo.com>';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const APP_URL = Deno.env.get('APP_URL') || 'https://riviqo.com';

const SCORE_THRESHOLD = 60;
const MAX_RECIPIENTS = 20;

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });

const getBearerToken = (req: Request) => {
  const authHeader = req.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7).trim();
};

const getSupabaseClient = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
};

const logDispatch = async (params: {
  supabase: ReturnType<typeof createClient>;
  actorId: string;
  recipientId?: string;
  recipientEmail?: string;
  sourceId: string;
  idempotencyKey?: string;
  status: 'sent' | 'skipped' | 'failed';
  providerId?: string | null;
  error?: string | null;
}) => {
  try {
    const { error } = await params.supabase.from('email_dispatch_logs').insert({
      actor_id: params.actorId,
      event_type: 'smartmatch_notify',
      recipient_id: params.recipientId || null,
      recipient_email: params.recipientEmail || null,
      source_id: params.sourceId,
      idempotency_key: params.idempotencyKey || null,
      status: params.status,
      provider_id: params.providerId || null,
      error: params.error || null
    });

    if (error) {
      console.error('[smartmatch-notify] email_dispatch_logs insert failed', {
        error: error.message,
        actorId: params.actorId,
        recipientId: params.recipientId || null,
        recipientEmail: params.recipientEmail || null,
        sourceId: params.sourceId,
        idempotencyKey: params.idempotencyKey || null,
        status: params.status
      });
    }
  } catch (error) {
    // Best-effort logging only.
    console.error('[smartmatch-notify] unexpected email_dispatch_logs error', {
      error: (error as Error).message,
      actorId: params.actorId,
      recipientId: params.recipientId || null,
      sourceId: params.sourceId,
      idempotencyKey: params.idempotencyKey || null,
      status: params.status
    });
  }
};

const alreadySent = async (params: {
  supabase: ReturnType<typeof createClient>;
  idempotencyKey: string;
}) => {
  try {
    const { data } = await params.supabase
      .from('email_dispatch_logs')
      .select('id')
      .eq('idempotency_key', params.idempotencyKey)
      .eq('status', 'sent')
      .maybeSingle();

    return Boolean(data?.id);
  } catch (_error) {
    return false;
  }
};

const sendViaResend = async (params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) => {
  if (!RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend error: ${response.status} ${errorText}`);
  }

  return response.json();
};

const buildSmartMatchEmail = (params: {
  language: 'fr' | 'en';
  listingTitle?: string | null;
  score: number;
}) => {
  const isFr = params.language === 'fr';
  const baseStyles = `
    body { margin: 0; padding: 0; background: #f7f7f7; }
    .wrap { width: 100%; background: #f7f7f7; padding: 24px 0; }
    .container { width: 100%; max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e6e6e6; }
    .header { padding: 24px 28px; background: #111111; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; line-height: 1.3; }
    .content { padding: 28px; color: #111111; font-family: Arial, sans-serif; }
    .content h2 { margin: 0 0 12px; font-size: 20px; }
    .content p { margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: #2b2b2b; }
    .meta { margin: 12px 0 18px; padding: 12px; background: #f3f4f6; border-radius: 8px; font-size: 13px; color: #3a3a3a; }
    .button { display: inline-block; padding: 12px 18px; background: #111111; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 14px; }
    .footer { padding: 20px 28px; font-size: 12px; color: #6b7280; background: #fafafa; border-top: 1px solid #e6e6e6; }
  `;
  const subject = isFr
    ? 'Nouveau match potentiel sur Riviqo'
    : 'New potential match on Riviqo';
  const title = isFr
    ? 'Une annonce correspond a vos criteres'
    : 'A listing matches your criteria';
  const intro = isFr
    ? 'Nous avons detecte un match interessant base sur vos preferences.'
    : 'We found a promising match based on your preferences.';
  const listingLabel = isFr ? 'Annonce' : 'Listing';
  const scoreLabel = isFr ? 'Score de compatibilite' : 'Compatibility score';
  const ctaLabel = isFr ? 'Voir le match' : 'View match';
  const footerNote = isFr
    ? 'Vous pouvez ajuster vos criteres dans votre espace Smart Matching.'
    : 'You can adjust your criteria in Smart Matching settings.';
  const html = `
    <!doctype html>
    <html lang="${isFr ? 'fr' : 'en'}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="wrap">
          <div class="container">
            <div class="header">
              <h1>Riviqo</h1>
            </div>
            <div class="content">
              <h2>${title}</h2>
              <p>${intro}</p>
              <div class="meta">
                ${
                  params.listingTitle
                    ? `<div><strong>${listingLabel}:</strong> ${params.listingTitle}</div>`
                    : ''
                }
                <div style="margin-top:8px;"><strong>${scoreLabel}:</strong> ${params.score}</div>
              </div>
              <a class="button" href="${APP_URL}/SmartMatching">${ctaLabel}</a>
            </div>
            <div class="footer">${footerNote}</div>
          </div>
        </div>
      </body>
    </html>
  `;
  return { subject, html };
};

serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const token = getBearerToken(req);
  if (!token) {
    return jsonResponse(401, { error: 'Missing authorization token' });
  }

  let payload: SmartMatchBody;
  try {
    payload = await req.json();
  } catch (_error) {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  if (!payload?.listingId) {
    return jsonResponse(400, { error: 'Missing listingId' });
  }

  const supabase = getSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return jsonResponse(401, { error: 'Invalid auth token' });
  }
  const actorId = userData.user.id;

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (!adminProfile?.is_admin) {
    return jsonResponse(403, { error: 'Admin access required' });
  }

  const { data: listing, error: listingError } = await supabase
    .from('businesses')
    .select(
      'id, title, type, status, asking_price, sector, location, region, country, employees, annual_revenue'
    )
    .eq('id', payload.listingId)
    .maybeSingle();

  if (listingError || !listing) {
    return jsonResponse(404, { error: 'Listing not found' });
  }

  if (listing.status !== 'active') {
    return jsonResponse(200, { skipped: true, reason: 'listing_not_active' });
  }

  let query = supabase
    .from('businesses')
    .select(
      'id, seller_id, seller_email, title, type, asking_price, sector, location, region, country, employees, annual_revenue, status'
    )
    .eq('status', 'active')
    .neq('id', listing.id)
    .limit(200);

  if (listing.type === 'cession') {
    query = query.eq('type', 'acquisition');
  } else if (listing.type === 'acquisition') {
    query = query.eq('type', 'cession');
  }

  const { data: candidates, error: candidatesError } = await query;
  if (candidatesError) {
    return jsonResponse(500, { error: 'Failed to load candidates' });
  }

  const listingInput: Listing = listing;
  const scored = (candidates || [])
    .map((candidate) => ({
      candidate,
      score: calculateSmartMatchScore(listingInput, candidate).score
    }))
    .filter((item) => item.score >= SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RECIPIENTS);

  if (scored.length === 0) {
    return jsonResponse(200, { sent: 0 });
  }

  const language = payload.language === 'en' ? 'en' : 'fr';
  let sent = 0;
  const bucketDate = new Date().toISOString().slice(0, 10);

  for (const item of scored) {
    const recipientId = item.candidate.seller_id;
    if (!recipientId) continue;

    const { data: recipientProfile } = await supabase
      .from('profiles')
      .select('email, notification_emails_enabled')
      .eq('id', recipientId)
      .maybeSingle();

    if (!recipientProfile?.email) {
      await logDispatch({
        supabase,
        actorId,
        recipientId,
        sourceId: payload.listingId,
        status: 'failed',
        error: 'recipient_email_not_found'
      });
      continue;
    }
    if (recipientProfile.notification_emails_enabled === false) {
      await logDispatch({
        supabase,
        actorId,
        recipientId,
        recipientEmail: recipientProfile.email,
        sourceId: payload.listingId,
        status: 'skipped',
        error: 'notifications_disabled'
      });
      continue;
    }

    const computedKey =
      payload.idempotencyKey ||
      `smartmatch:${payload.listingId}:${recipientId}:${bucketDate}`;
    const duplicate = await alreadySent({
      supabase,
      idempotencyKey: computedKey
    });
    if (duplicate) {
      await logDispatch({
        supabase,
        actorId,
        recipientId,
        recipientEmail: recipientProfile.email,
        sourceId: payload.listingId,
        idempotencyKey: computedKey,
        status: 'skipped',
        error: 'idempotency_duplicate'
      });
      continue;
    }

    const { subject, html } = buildSmartMatchEmail({
      language,
      listingTitle: listing.title,
      score: item.score
    });

    try {
      const response = await sendViaResend({
        to: recipientProfile.email,
        subject,
        html,
        text: subject
      });
      await logDispatch({
        supabase,
        actorId,
        recipientId,
        recipientEmail: recipientProfile.email,
        sourceId: payload.listingId,
        idempotencyKey: computedKey,
        status: 'sent',
        providerId: response?.id || null
      });
      sent += 1;
    } catch (error) {
      await logDispatch({
        supabase,
        actorId,
        recipientId,
        recipientEmail: recipientProfile.email,
        sourceId: payload.listingId,
        idempotencyKey: computedKey,
        status: 'failed',
        error: (error as Error).message
      });
      // Continue on individual failures
    }
  }

  return jsonResponse(200, { sent });
});
