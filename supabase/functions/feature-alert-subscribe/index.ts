import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type SubscribeBody = {
  featureCode?: 'nda_dataroom' | string;
  language?: 'fr' | 'en';
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_AUDIENCE_ID =
  Deno.env.get('RESEND_NDA_DATAROOM_AUDIENCE_ID') ||
  '72acae04-62f3-49a4-9226-d1c78ccc8e3b';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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

const sanitize = (value?: string | null) => String(value || '').trim();

const buildLabel = (profile: {
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  company_name?: string | null;
  email?: string | null;
}) => {
  const first = sanitize(profile.first_name);
  const last = sanitize(profile.last_name);
  const full = sanitize(profile.full_name);
  const company = sanitize(profile.company_name);
  const email = sanitize(profile.email);

  const composed = [first, last].filter(Boolean).join(' ').trim();
  if (composed) return composed;
  if (full) return full;
  if (company) return company;
  return email || 'Utilisateur Riviqo';
};

const upsertContactInResendAudience = async (params: {
  audienceId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  unsubscribed?: boolean;
}) => {
  if (!RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY');
  }

  const response = await fetch(
    `https://api.resend.com/audiences/${params.audienceId}/contacts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: params.email,
        first_name: params.firstName || undefined,
        last_name: params.lastName || undefined,
        unsubscribed: params.unsubscribed ?? false
      })
    }
  );

  const payloadText = await response.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = payloadText ? JSON.parse(payloadText) : {};
  } catch (_error) {
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

  throw new Error(`Resend contact subscribe failed: ${response.status} ${message}`);
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const token = getBearerToken(req);
  if (!token) {
    return jsonResponse(401, { error: 'Missing authorization token' });
  }

  let payload: SubscribeBody;
  try {
    payload = await req.json();
  } catch (_error) {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  const featureCode = String(payload?.featureCode || '').trim();
  if (!featureCode) {
    return jsonResponse(400, { error: 'Missing featureCode' });
  }
  if (featureCode !== 'nda_dataroom') {
    return jsonResponse(400, { error: 'Unsupported featureCode' });
  }

  const supabase = getSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return jsonResponse(401, { error: 'Invalid auth token' });
  }

  const userId = userData.user.id;
  const language = payload.language === 'en' ? 'en' : 'fr';

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email, first_name, last_name, full_name, company_name')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    return jsonResponse(500, { error: 'Failed to load profile' });
  }

  const profileEmail = sanitize(profile?.email);
  const authEmail = sanitize(userData.user.email);
  const email = profileEmail || authEmail;

  if (!email) {
    return jsonResponse(400, {
      error:
        language === 'fr'
          ? 'Aucune adresse email disponible pour cette inscription.'
          : 'No email address available for this subscription.'
    });
  }

  const firstName = sanitize(profile?.first_name) || undefined;
  const lastName = sanitize(profile?.last_name) || undefined;
  const fallbackLabel = buildLabel({
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    full_name: profile?.full_name,
    company_name: profile?.company_name,
    email
  });

  try {
    const result = await upsertContactInResendAudience({
      audienceId: RESEND_AUDIENCE_ID,
      email,
      firstName,
      lastName,
      unsubscribed: false
    });

    return jsonResponse(200, {
      ok: true,
      status: result.status,
      featureCode,
      audienceId: RESEND_AUDIENCE_ID,
      email,
      label: fallbackLabel,
      contactId: result.contactId,
      message:
        result.status === 'already_subscribed'
          ? language === 'fr'
            ? 'Vous êtes déjà inscrit à l’alerte.'
            : 'You are already subscribed to this alert.'
          : language === 'fr'
            ? 'Vous serez alerté dès que la fonctionnalité sera disponible.'
            : 'You will be notified as soon as this feature is available.'
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: (error as Error).message
    });
  }
});
