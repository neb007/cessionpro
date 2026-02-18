import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type SendEmailBody = {
  type:
    | 'message'
    | 'listing_published'
    | 'deal_stage_update'
    | 'document_shared'
    | 'nda_signed';
  recipientId?: string;
  conversationId?: string;
  listingId?: string;
  senderName?: string;
  messagePreview?: string;
  dealStage?: string;
  documentName?: string;
  signerName?: string;
  sourceId?: string;
  idempotencyKey?: string;
  language?: 'fr' | 'en';
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') || 'Riviqo <no-reply@riviqo.com>';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const APP_URL = Deno.env.get('APP_URL') || 'https://riviqo.com';
const DEFAULT_RATE_LIMIT_PER_MINUTE = 12;

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

const logEmailDispatch = async (params: {
  supabase: ReturnType<typeof createClient>;
  actorId: string;
  eventType: string;
  recipientId?: string;
  recipientEmail?: string;
  sourceId?: string;
  idempotencyKey?: string;
  status: 'sent' | 'skipped' | 'failed';
  providerId?: string | null;
  error?: string | null;
}) => {
  try {
    await params.supabase.from('email_dispatch_logs').insert({
      actor_id: params.actorId,
      event_type: params.eventType,
      recipient_id: params.recipientId || null,
      recipient_email: params.recipientEmail || null,
      source_id: params.sourceId || null,
      idempotency_key: params.idempotencyKey || null,
      status: params.status,
      provider_id: params.providerId || null,
      error: params.error || null
    });
  } catch (_error) {
    // Logging must never block email delivery.
  }
};

const isRateLimited = async (params: {
  supabase: ReturnType<typeof createClient>;
  actorId: string;
  eventType: string;
  limitPerMinute?: number;
}) => {
  const limit = params.limitPerMinute || DEFAULT_RATE_LIMIT_PER_MINUTE;
  const since = new Date(Date.now() - 60_000).toISOString();

  try {
    const { count } = await params.supabase
      .from('email_dispatch_logs')
      .select('id', { count: 'exact', head: true })
      .eq('actor_id', params.actorId)
      .eq('event_type', params.eventType)
      .gte('created_at', since);

    return (count || 0) >= limit;
  } catch (_error) {
    return false;
  }
};

const hasSentForIdempotencyKey = async (params: {
  supabase: ReturnType<typeof createClient>;
  idempotencyKey?: string;
}) => {
  if (!params.idempotencyKey) return false;
  try {
    const { data } = await params.supabase
      .from('email_dispatch_logs')
      .select('id')
      .eq('idempotency_key', params.idempotencyKey)
      .eq('status', 'sent')
      .limit(1)
      .maybeSingle();
    return Boolean(data?.id);
  } catch (_error) {
    return false;
  }
};

const buildSubjectAndHtml = (
  type: SendEmailBody['type'],
  data: {
    senderName?: string;
    messagePreview?: string;
    listingTitle?: string;
    dealStage?: string;
    documentName?: string;
    signerName?: string;
    language: 'fr' | 'en';
  }
) => {
  const { senderName, messagePreview, listingTitle, dealStage, documentName, signerName, language } = data;
  const isFr = language === 'fr';

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

  if (type === 'message') {
    const subject = isFr
      ? 'Nouveau message sur Riviqo'
      : 'New message on Riviqo';
    const preview = messagePreview || (isFr ? 'Aucun apercu disponible.' : 'No preview available.');
    const senderLabel = isFr ? 'Expediteur' : 'Sender';
    const ctaLabel = isFr ? 'Ouvrir la conversation' : 'Open conversation';
    const title = isFr ? 'Vous avez un nouveau message' : 'You have a new message';
    const subtitle = isFr
      ? 'Un nouvel echange vient d\'etre recu dans votre messagerie.'
      : 'A new message has been received in your inbox.';
    const messageLabel = isFr ? 'Apercu du message' : 'Message preview';
    const footerNote = isFr
      ? 'Vous recevez cet email car vous avez active les notifications.'
      : 'You are receiving this email because notifications are enabled.';
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
                <p>${subtitle}</p>
                <div class="meta">
                  <div><strong>${senderLabel}:</strong> ${senderName || (isFr ? 'Utilisateur' : 'User')}</div>
                  <div style="margin-top:8px;"><strong>${messageLabel}:</strong> "${preview}"</div>
                </div>
                <a class="button" href="${APP_URL}/Messages">${ctaLabel}</a>
              </div>
              <div class="footer">${footerNote}</div>
            </div>
          </div>
        </body>
      </html>
    `;
    return { subject, html };
  }

  if (type === 'deal_stage_update') {
    const subject = isFr
      ? 'Mise a jour de votre transaction'
      : 'Deal stage update';
    const title = isFr ? 'Mise a jour du dossier' : 'Deal update';
    const intro = isFr
      ? 'Une etape de votre transaction a ete mise a jour.'
      : 'A step of your deal has been updated.';
    const stageLabel = isFr ? 'Nouvelle etape' : 'New stage';
    const ctaLabel = isFr ? 'Voir la transaction' : 'View deal';
    const footerNote = isFr
      ? 'Consultez votre messagerie pour les details.'
      : 'Check your inbox for more details.';
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
                  <div><strong>${stageLabel}:</strong> ${dealStage || '-'}</div>
                </div>
                <a class="button" href="${APP_URL}/Messages">${ctaLabel}</a>
              </div>
              <div class="footer">${footerNote}</div>
            </div>
          </div>
        </body>
      </html>
    `;
    return { subject, html };
  }

  if (type === 'document_shared') {
    const subject = isFr
      ? 'Nouveau document partage'
      : 'New document shared';
    const title = isFr ? 'Un document a ete partage' : 'A document was shared';
    const intro = isFr
      ? 'Un nouveau document est disponible dans votre espace de conversation.'
      : 'A new document is available in your conversation.';
    const docLabel = isFr ? 'Document' : 'Document';
    const senderLabel = isFr ? 'Expediteur' : 'Sender';
    const ctaLabel = isFr ? 'Voir le document' : 'View document';
    const footerNote = isFr
      ? 'Accedez au document depuis votre messagerie.'
      : 'Access the document from your inbox.';
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
                  <div><strong>${docLabel}:</strong> ${documentName || '-'}</div>
                  <div style="margin-top:8px;"><strong>${senderLabel}:</strong> ${senderName || (isFr ? 'Utilisateur' : 'User')}</div>
                </div>
                <a class="button" href="${APP_URL}/Messages">${ctaLabel}</a>
              </div>
              <div class="footer">${footerNote}</div>
            </div>
          </div>
        </body>
      </html>
    `;
    return { subject, html };
  }

  if (type === 'nda_signed') {
    const subject = isFr
      ? 'NDA signe'
      : 'NDA signed';
    const title = isFr ? 'Accord de confidentialite signe' : 'NDA signed';
    const intro = isFr
      ? 'Un accord de confidentialite a ete signe dans votre dossier.'
      : 'A confidentiality agreement has been signed in your deal.';
    const signerLabel = isFr ? 'Signataire' : 'Signer';
    const ctaLabel = isFr ? 'Voir le dossier' : 'View deal';
    const footerNote = isFr
      ? 'Consultez votre messagerie pour plus de details.'
      : 'Check your inbox for more details.';
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
                  <div><strong>${signerLabel}:</strong> ${signerName || '-'}</div>
                </div>
                <a class="button" href="${APP_URL}/Messages">${ctaLabel}</a>
              </div>
              <div class="footer">${footerNote}</div>
            </div>
          </div>
        </body>
      </html>
    `;
    return { subject, html };
  }

  const subject = isFr
    ? 'Votre annonce est publiee'
    : 'Your listing is published';
  const title = isFr ? 'Annonce publiee avec succes' : 'Listing published successfully';
  const intro = isFr
    ? 'Bonne nouvelle, votre annonce est maintenant visible par la communaute.'
    : 'Good news, your listing is now visible to the community.';
  const listingLabel = isFr ? 'Titre de l’annonce' : 'Listing title';
  const ctaLabel = isFr ? 'Voir mes annonces' : 'View my listings';
  const footerNote = isFr
    ? 'Vous pouvez mettre a jour votre annonce a tout moment depuis votre espace.'
    : 'You can update your listing at any time from your dashboard.';
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
              ${
                listingTitle
                  ? `<div class="meta"><strong>${listingLabel}:</strong> ${listingTitle}</div>`
                  : ''
              }
              <a class="button" href="${APP_URL}/MyListings">${ctaLabel}</a>
            </div>
            <div class="footer">${footerNote}</div>
          </div>
        </div>
      </body>
    </html>
  `;
  return { subject, html };
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

serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const token = getBearerToken(req);
  if (!token) {
    return jsonResponse(401, { error: 'Missing authorization token' });
  }

  let payload: SendEmailBody;
  try {
    payload = await req.json();
  } catch (_error) {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  if (!payload?.type) {
    return jsonResponse(400, { error: 'Missing email type' });
  }

  const supabase = getSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return jsonResponse(401, { error: 'Invalid auth token' });
  }

  const actorId = userData.user.id;
  let recipientId = payload.recipientId;
  let listingTitle: string | null = null;

  if (payload.type === 'message') {
    if (!recipientId || !payload.conversationId) {
      return jsonResponse(400, { error: 'Missing recipientId or conversationId' });
    }
  }

  if (payload.type === 'listing_published') {
    if (!payload.listingId && !recipientId) {
      return jsonResponse(400, { error: 'Missing listingId or recipientId' });
    }
  }

  if (payload.type === 'deal_stage_update') {
    if (!recipientId || !payload.dealStage) {
      return jsonResponse(400, { error: 'Missing recipientId or dealStage' });
    }
  }

  if (payload.type === 'document_shared') {
    if (!recipientId || !payload.documentName) {
      return jsonResponse(400, { error: 'Missing recipientId or documentName' });
    }
  }

  if (payload.type === 'nda_signed') {
    if (!recipientId || !payload.signerName) {
      return jsonResponse(400, { error: 'Missing recipientId or signerName' });
    }
  }

  if (payload.listingId) {
    const { data: listing, error: listingError } = await supabase
      .from('businesses')
      .select('id, seller_id, title')
      .eq('id', payload.listingId)
      .maybeSingle();

    if (listingError) {
      return jsonResponse(500, { error: 'Failed to load listing' });
    }

    if (listing) {
      listingTitle = listing.title || null;
      if (!recipientId) {
        recipientId = listing.seller_id || undefined;
      }
    }
  }

  if (!recipientId) {
    return jsonResponse(400, { error: 'Missing recipientId' });
  }

  const isDuplicate = await hasSentForIdempotencyKey({
    supabase,
    idempotencyKey: payload.idempotencyKey
  });
  if (isDuplicate) {
    await logEmailDispatch({
      supabase,
      actorId,
      eventType: payload.type,
      recipientId,
      sourceId: payload.sourceId,
      idempotencyKey: payload.idempotencyKey,
      status: 'skipped',
      error: 'idempotency_duplicate'
    });
    return jsonResponse(200, { skipped: true, reason: 'idempotency_duplicate' });
  }

  if (
    payload.type === 'message' ||
    payload.type === 'deal_stage_update' ||
    payload.type === 'document_shared' ||
    payload.type === 'nda_signed'
  ) {
    const limited = await isRateLimited({
      supabase,
      actorId,
      eventType: payload.type
    });
    if (limited) {
      await logEmailDispatch({
        supabase,
        actorId,
        eventType: payload.type,
        recipientId,
        sourceId: payload.sourceId,
        idempotencyKey: payload.idempotencyKey,
        status: 'skipped',
        error: 'rate_limited'
      });
      return jsonResponse(429, { error: 'Rate limit exceeded' });
    }
  }

  const { data: recipientProfile, error: profileError } = await supabase
    .from('profiles')
    .select('email, full_name, first_name, last_name, notification_emails_enabled')
    .eq('id', recipientId)
    .maybeSingle();

  if (profileError) {
    return jsonResponse(500, { error: 'Failed to load recipient profile' });
  }

  if (!recipientProfile?.email) {
    await logEmailDispatch({
      supabase,
      actorId,
      eventType: payload.type,
      recipientId,
      sourceId: payload.sourceId,
      idempotencyKey: payload.idempotencyKey,
      status: 'failed',
      error: 'recipient_email_not_found'
    });
    return jsonResponse(404, { error: 'Recipient email not found' });
  }

  if (recipientProfile.notification_emails_enabled === false) {
    await logEmailDispatch({
      supabase,
      actorId,
      eventType: payload.type,
      recipientId,
      recipientEmail: recipientProfile.email,
      sourceId: payload.sourceId,
      idempotencyKey: payload.idempotencyKey,
      status: 'skipped',
      error: 'notifications_disabled'
    });
    return jsonResponse(200, { skipped: true, reason: 'notifications_disabled' });
  }

  const language = payload.language === 'en' ? 'en' : 'fr';
  const { subject, html } = buildSubjectAndHtml(payload.type, {
    senderName: payload.senderName,
    messagePreview: payload.messagePreview,
    listingTitle,
    dealStage: payload.dealStage,
    documentName: payload.documentName,
    signerName: payload.signerName,
    language
  });

  try {
    const response = await sendViaResend({
      to: recipientProfile.email,
      subject,
      html,
      text: subject
    });

    await logEmailDispatch({
      supabase,
      actorId,
      eventType: payload.type,
      recipientId,
      recipientEmail: recipientProfile.email,
      sourceId: payload.sourceId || payload.conversationId || payload.listingId,
      idempotencyKey: payload.idempotencyKey,
      status: 'sent',
      providerId: response?.id || null
    });

    return jsonResponse(200, { id: response?.id || null });
  } catch (error) {
    await logEmailDispatch({
      supabase,
      actorId,
      eventType: payload.type,
      recipientId,
      recipientEmail: recipientProfile.email,
      sourceId: payload.sourceId || payload.conversationId || payload.listingId,
      idempotencyKey: payload.idempotencyKey,
      status: 'failed',
      error: (error as Error).message
    });
    return jsonResponse(500, { error: (error as Error).message });
  }
});
