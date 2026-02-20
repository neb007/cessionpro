import { supabase } from '@/api/supabaseClient';

class BillingService {
  _isSchemaGapError(error) {
    const code = String(error?.code || '');
    const message = String(error?.message || '').toLowerCase();
    const details = String(error?.details || '').toLowerCase();

    return (
      code === '42P01' ||
      code === '42703' ||
      message.includes('could not find the table') ||
      message.includes('schema cache') ||
      message.includes('does not exist') ||
      details.includes('schema cache')
    );
  }

  _normalizeInvokeError(error) {
    const rawMessage = (error?.message || '').toLowerCase();
    const isAbortLike =
      error?.name === 'AbortError' ||
      rawMessage.includes('signal is aborted') ||
      rawMessage.includes('aborted without reason') ||
      rawMessage.includes('the operation was aborted');

    if (isAbortLike) {
      return new Error('La requête de paiement a été interrompue. Réessaie dans quelques secondes.');
    }

    return error;
  }

  async _invokeWithTimeout(functionName, options, timeoutMs = 15000) {
    const invokePromise = supabase.functions
      .invoke(functionName, options)
      .catch((error) => {
        throw this._normalizeInvokeError(error);
      });
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('La requête de paiement prend trop de temps. Réessaie dans quelques secondes.'));
      }, timeoutMs);
    });

    return Promise.race([invokePromise, timeoutPromise]);
  }

  async _getAccessTokenOrThrow() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(error.message || 'Unable to read authentication session');
    }

    const existingSession = data?.session;
    if (!existingSession?.access_token) {
      throw new Error('Vous devez être connecté pour lancer un paiement.');
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(existingSession.access_token);
    if (!userError && userData?.user) {
      return existingSession.access_token;
    }

    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError || !refreshed?.session?.access_token) {
      throw new Error(
        'Session expirée ou invalide. Déconnectez-vous puis reconnectez-vous avant de payer.'
      );
    }

    return refreshed.session.access_token;
  }

  async _extractFunctionError(error) {
    if (!error) return 'Unknown function error';

    const normalized = this._normalizeInvokeError(error);
    if (normalized?.message && normalized !== error) {
      return normalized.message;
    }

    if (error.context instanceof Response) {
      try {
        const payload = await error.context.json();
        if (payload?.error) return payload.error;
        if (payload?.message) return payload.message;
      } catch {
        try {
          const text = await error.context.text();
          if (text) return text;
        } catch {
          // no-op
        }
      }
    }

    return error.message || 'Unable to call edge function';
  }

  async createCheckoutSession({ items, language = 'fr' }) {
    const accessToken = await this._getAccessTokenOrThrow();

    const { data, error } = await this._invokeWithTimeout('stripe-checkout', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: {
        items,
        language
      }
    });

    if (error) {
      const detailedMessage = await this._extractFunctionError(error);
      throw new Error(detailedMessage || 'Unable to create checkout session');
    }

    if (!data?.url) {
      throw new Error('Checkout URL not returned by backend');
    }

    return data;
  }

  async createElementsSession({ items, language = 'fr' }) {
    const accessToken = await this._getAccessTokenOrThrow();

    const { data, error } = await this._invokeWithTimeout('stripe-checkout', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: {
        items,
        language,
        checkoutType: 'elements'
      }
    });

    if (error) {
      const detailedMessage = await this._extractFunctionError(error);
      throw new Error(detailedMessage || 'Unable to initialize custom checkout');
    }

    if (!data?.clientSecret) {
      throw new Error('Client secret not returned by backend');
    }

    return data;
  }

  async createPortalSession() {
    const accessToken = await this._getAccessTokenOrThrow();

    const { data, error } = await this._invokeWithTimeout('stripe-portal', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: {}
    });

    if (error) {
      const detailedMessage = await this._extractFunctionError(error);
      throw new Error(detailedMessage || 'Unable to open billing portal');
    }

    if (!data?.url) {
      throw new Error('Portal URL not returned by backend');
    }

    return data;
  }

  async getMyTransactions(limit = 20) {
    const { data, error } = await supabase
      .from('billing_transactions')
      .select('id, status, currency, amount_paid_cents, item_codes, invoice_url, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message || 'Unable to load transactions');
    }

    return data || [];
  }

  async getMySubscriptions() {
    const { data, error } = await supabase
      .from('billing_subscriptions')
      .select('id, status, cancel_at_period_end, current_period_end, stripe_price_id, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5);

    if (error) {
      throw new Error(error.message || 'Unable to load subscriptions');
    }

    return data || [];
  }

  async getMyActiveServices(limitUsage = 30) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('photos_remaining_balance, contact_credits_balance')
      .single();

    const balances = this._isSchemaGapError(profileError)
      ? { photos: 0, contacts: 0 }
      : {
          photos: Number(profileData?.photos_remaining_balance || 0),
          contacts: Number(profileData?.contact_credits_balance || 0)
        };

    if (profileError && !this._isSchemaGapError(profileError)) {
      throw new Error(profileError.message || 'Unable to load profile balances');
    }

    const [{ data: entitlements, error: entitlementsError }, { data: usageLogs, error: usageError }] =
      await Promise.all([
        supabase
          .from('billing_entitlements')
          .select(
            'id, product_code, entitlement_type, quantity_total, quantity_remaining, status, activated_at, expires_at, metadata, updated_at'
          )
          .order('updated_at', { ascending: false }),
        supabase
          .from('billing_usage_logs')
          .select('id, product_code, usage_type, quantity, context_type, context_id, metadata, created_at')
          .order('created_at', { ascending: false })
          .limit(limitUsage)
      ]);

    if (entitlementsError && !this._isSchemaGapError(entitlementsError)) {
      throw new Error(entitlementsError.message || 'Unable to load active services');
    }

    if (usageError && !this._isSchemaGapError(usageError)) {
      throw new Error(usageError.message || 'Unable to load service usage logs');
    }

    return {
      balances,
      entitlements: this._isSchemaGapError(entitlementsError) ? [] : (entitlements || []),
      usageLogs: this._isSchemaGapError(usageError) ? [] : (usageLogs || [])
    };
  }
}

export const billingService = new BillingService();
export default billingService;
