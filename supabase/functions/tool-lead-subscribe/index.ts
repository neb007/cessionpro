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
