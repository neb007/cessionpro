import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type ToolLeadBody = {
  audienceId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  consent?: boolean;
  tool?: string;
  language?: 'fr' | 'en';
  simulationInput?: Record<string, unknown>;
  simulationResult?: Record<string, unknown>;
  notifyEmail?: string;
  notifySubject?: string;
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const DEFAULT_AUDIENCE_ID = 'c238e3f6-60cc-4d9f-a01a-b011582b8a3f';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });

const sanitize = (value?: string | null) => String(value || '').trim();

const subscribeContact = async (params: {
  audienceId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}) => {
  if (!RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY');
  }

  const response = await fetch(`https://api.resend.com/audiences/${params.audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: params.email,
      first_name: params.firstName || undefined,
      last_name: params.lastName || undefined,
      unsubscribed: false
    })
  });

  const payloadText = await response.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = payloadText ? JSON.parse(payloadText) : {};
  } catch {
    payload = {};
  }

  if (response.ok) {
    return {
      status: 'subscribed' as const,
      contactId: (payload.id as string | undefined) || null
    };
  }

  const message = String(payload.message || payload.error || payloadText || 'Resend error');
  const normalized = message.toLowerCase();

  if (response.status === 409 || normalized.includes('already exists')) {
    return {
      status: 'already_subscribed' as const,
      contactId: (payload.id as string | undefined) || null
    };
  }

  throw new Error(`Resend subscribe failed: ${response.status} ${message}`);
};

const sendNotificationEmail = async (params: {
  to: string;
  subject: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tool?: string;
  simulationInput?: Record<string, unknown>;
}) => {
  if (!RESEND_API_KEY) return;

  const details = params.simulationInput || {};
  const rows = [
    `<tr><td style="padding:6px 12px;font-weight:600;color:#3B4759">Email</td><td style="padding:6px 12px;color:#6B7A94">${params.email}</td></tr>`,
    `<tr><td style="padding:6px 12px;font-weight:600;color:#3B4759">Nom</td><td style="padding:6px 12px;color:#6B7A94">${params.firstName || ''} ${params.lastName || ''}</td></tr>`,
  ];

  for (const [key, value] of Object.entries(details)) {
    if (value) {
      rows.push(`<tr><td style="padding:6px 12px;font-weight:600;color:#3B4759">${key}</td><td style="padding:6px 12px;color:#6B7A94">${String(value)}</td></tr>`);
    }
  }

  const html = `
    <div style="font-family:'Sora',sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#FF6B4A;padding:20px 24px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;font-size:18px;margin:0">${params.subject}</h1>
      </div>
      <div style="background:#FAF9F7;padding:24px;border:1px solid #F0ECE6;border-top:none;border-radius:0 0 12px 12px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows.join('')}
        </table>
        <p style="margin-top:20px;font-size:12px;color:#9EABC1">Source : ${params.tool || 'formulaire'}</p>
      </div>
    </div>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Riviqo <noreply@riviqo.com>',
      to: [params.to],
      subject: params.subject,
      html,
    }),
  });
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  let body: ToolLeadBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  const email = sanitize(body.email).toLowerCase();
  const audienceId = sanitize(body.audienceId) || DEFAULT_AUDIENCE_ID;

  if (!email) {
    return jsonResponse(400, { error: 'Missing email' });
  }

  if (!body.consent) {
    return jsonResponse(400, { error: 'Consent required' });
  }

  try {
    const result = await subscribeContact({
      audienceId,
      email,
      firstName: sanitize(body.firstName) || undefined,
      lastName: sanitize(body.lastName) || undefined
    });

    const notifyTo = sanitize(body.notifyEmail);
    if (notifyTo) {
      await sendNotificationEmail({
        to: notifyTo,
        subject: sanitize(body.notifySubject) || `Nouveau contact — ${sanitize(body.tool) || 'formulaire'}`,
        email,
        firstName: sanitize(body.firstName) || undefined,
        lastName: sanitize(body.lastName) || undefined,
        tool: sanitize(body.tool) || undefined,
        simulationInput: body.simulationInput,
      }).catch((err) => {
        console.error('Notification email failed:', err);
      });
    }

    return jsonResponse(200, {
      ok: true,
      status: result.status,
      contactId: result.contactId,
      audienceId,
      email,
      tool: sanitize(body.tool) || 'unknown',
      language: body.language === 'en' ? 'en' : 'fr'
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: (error as Error).message
    });
  }
});
