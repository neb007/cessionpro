// @ts-nocheck
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@16.12.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const APP_URL = (Deno.env.get('APP_URL') || 'https://riviqo.com').replace(/\/$/, '');
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
      'Content-Type': 'application/json',
      ...corsHeaders
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

const isStripeCustomerMissingError = (error: unknown) => {
  const stripeError = error as { code?: string; message?: string };
  const message = (stripeError?.message || '').toLowerCase();
  return stripeError?.code === 'resource_missing' || message.includes('no such customer');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (!STRIPE_SECRET_KEY) {
    return jsonResponse(500, { error: 'Missing STRIPE_SECRET_KEY' });
  }

  const token = getBearerToken(req);
  if (!token) {
    return jsonResponse(401, { error: 'Missing authorization token' });
  }

  const supabase = getSupabaseClient();
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData?.user) {
    return jsonResponse(401, { error: 'Invalid auth token' });
  }

  const user = authData.user;
  const { data: customerRow } = await supabase
    .from('billing_customers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

    const createAndPersistCustomer = async () => {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.user_metadata?.full_name || undefined,
        metadata: {
          user_id: user.id
        }
      });

      await supabase.from('billing_customers').upsert(
        {
          user_id: user.id,
          stripe_customer_id: customer.id,
          email: user.email || null,
          full_name: user.user_metadata?.full_name || null,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      );

      return customer.id;
    };

    let stripeCustomerId = customerRow?.stripe_customer_id || null;
    if (!stripeCustomerId) {
      stripeCustomerId = await createAndPersistCustomer();
    }

    let portal;
    try {
      portal = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${APP_URL}/Settings?tab=billing`
      });
    } catch (error) {
      if (!isStripeCustomerMissingError(error)) {
        throw error;
      }

      const previousCustomerId = stripeCustomerId;
      stripeCustomerId = await createAndPersistCustomer();

      await supabase.from('billing_security_events').insert({
        user_id: user.id,
        event_type: 'portal_customer_recreated',
        ip:
          req.headers.get('cf-connecting-ip') ||
          req.headers.get('x-forwarded-for') ||
          req.headers.get('x-real-ip') ||
          null,
        user_agent: req.headers.get('user-agent'),
        details: {
          previous_customer_id: previousCustomerId,
          new_customer_id: stripeCustomerId
        }
      });

      portal = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${APP_URL}/Settings?tab=billing`
      });
    }

    await supabase.from('billing_security_events').insert({
      user_id: user.id,
      event_type: 'portal_created',
      ip:
        req.headers.get('cf-connecting-ip') ||
        req.headers.get('x-forwarded-for') ||
        req.headers.get('x-real-ip') ||
        null,
      user_agent: req.headers.get('user-agent'),
      details: {
        stripe_customer_id: stripeCustomerId
      }
    });

    return jsonResponse(200, { url: portal.url });
  } catch (error) {
    await supabase.from('billing_security_events').insert({
      user_id: user.id,
      event_type: 'portal_failed',
      ip:
        req.headers.get('cf-connecting-ip') ||
        req.headers.get('x-forwarded-for') ||
        req.headers.get('x-real-ip') ||
        null,
      user_agent: req.headers.get('user-agent'),
      details: {
        error: (error as Error).message
      }
    });

    return jsonResponse(400, {
      error: (error as Error).message
    });
  }
});
