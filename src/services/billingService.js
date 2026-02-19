import { supabase } from '@/api/supabaseClient';

class BillingService {
  async _invokeWithTimeout(functionName, options, timeoutMs = 15000) {
    const invokePromise = supabase.functions.invoke(functionName, options);
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
}

export const billingService = new BillingService();
export default billingService;
