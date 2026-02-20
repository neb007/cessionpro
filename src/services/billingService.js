import { supabase } from '@/api/supabaseClient';

class BillingService {
  constructor() {
    this._billingRuntimeTablesUnavailable = false;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        this._billingRuntimeTablesUnavailable =
          window.localStorage.getItem('riviqo_billing_runtime_unavailable') === '1';
      }
    } catch {
      // ignore storage errors
    }
  }

  _markBillingRuntimeTablesUnavailable() {
    this._billingRuntimeTablesUnavailable = true;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('riviqo_billing_runtime_unavailable', '1');
      }
    } catch {
      // ignore storage errors
    }
  }

  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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

  _isAbortLikeError(error) {
    const rawMessage = String(error?.message || '').toLowerCase();
    return (
      error?.name === 'AbortError' ||
      rawMessage.includes('signal is aborted') ||
      rawMessage.includes('aborted without reason') ||
      rawMessage.includes('the operation was aborted') ||
      rawMessage.includes('operation was aborted')
    );
  }

  async _callAuthWithAbortRetry(fn, retries = 2) {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (!this._isAbortLikeError(error) || attempt === retries) {
          throw error;
        }

        await this._sleep(200 * (attempt + 1));
      }
    }

    throw lastError;
  }

  _normalizeInvokeError(error) {
    if (this._isAbortLikeError(error)) {
      return this._toCheckoutError(
        {
          code: 'CHECKOUT_ABORTED',
          message: 'La requête de paiement a été interrompue. Nouvelle tentative en cours…',
          retryable: true,
          action: 'HOSTED_FALLBACK'
        },
        'La requête de paiement a été interrompue. Nouvelle tentative en cours…'
      );
    }

    return error;
  }

  _toCheckoutError(payload, fallbackMessage) {
    return Object.assign(new Error(payload?.message || fallbackMessage || 'Checkout error'), {
      code: payload?.code || null,
      retryable: Boolean(payload?.retryable),
      action: payload?.action || null,
      details: payload?.details || null
    });
  }

  _getCheckoutReturnOrigin() {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin;
    }

    return null;
  }

  async _invokeWithTimeout(functionName, options, timeoutMs = 15000, actionOnAbort = 'RETRY') {
    const invokePromise = supabase.functions
      .invoke(functionName, options)
      .catch((error) => {
        if (this._isAbortLikeError(error)) {
          throw this._toCheckoutError(
            {
              code: 'CHECKOUT_ABORTED',
              message: 'La requête de paiement a été interrompue. Nouvelle tentative en cours…',
              retryable: true,
              action: actionOnAbort
            },
            'La requête de paiement a été interrompue. Nouvelle tentative en cours…'
          );
        }

        throw this._normalizeInvokeError(error);
      });

    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(
          this._toCheckoutError(
            {
              code: 'CHECKOUT_TIMEOUT',
              message: 'La requête de paiement prend trop de temps. Réessaie dans quelques secondes.',
              retryable: true,
              action: 'RETRY'
            },
            'La requête de paiement prend trop de temps. Réessaie dans quelques secondes.'
          )
        );
      }, timeoutMs);
    });

    try {
      return await Promise.race([invokePromise, timeoutPromise]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      invokePromise.catch(() => {
        // évite les "Uncaught (in promise)" si Promise.race a déjà été tranchée
      });
    }
  }

  async _getAccessTokenOrThrow() {
    let sessionPayload;
    try {
      sessionPayload = await this._callAuthWithAbortRetry(() => supabase.auth.getSession(), 2);
    } catch (error) {
      if (this._isAbortLikeError(error)) {
        throw this._toCheckoutError(
          {
            code: 'AUTH_ABORTED',
            message: 'La session de paiement a été interrompue. Réessaie dans quelques secondes.',
            retryable: true,
            action: 'RETRY'
          },
          'La session de paiement a été interrompue. Réessaie dans quelques secondes.'
        );
      }
      throw error;
    }

    const { data, error } = sessionPayload;
    if (error) {
      throw this._toCheckoutError(
        {
          code: 'AUTH_SESSION_READ_FAILED',
          message: error.message || 'Unable to read authentication session',
          retryable: true,
          action: 'REAUTH'
        },
        'Unable to read authentication session'
      );
    }

    const existingSession = data?.session;
    if (existingSession?.access_token) {
      return existingSession.access_token;
    }

    let refreshedPayload;
    try {
      refreshedPayload = await this._callAuthWithAbortRetry(() => supabase.auth.refreshSession(), 2);
    } catch (error) {
      if (this._isAbortLikeError(error)) {
        throw this._toCheckoutError(
          {
            code: 'AUTH_REFRESH_ABORTED',
            message: 'Impossible de réactiver la session pour le paiement. Réessaie dans quelques secondes.',
            retryable: true,
            action: 'RETRY'
          },
          'Impossible de réactiver la session pour le paiement. Réessaie dans quelques secondes.'
        );
      }
      throw error;
    }

    const { data: refreshed, error: refreshError } = refreshedPayload;
    if (refreshError || !refreshed?.session?.access_token) {
      throw this._toCheckoutError(
        {
          code: 'AUTH_SESSION_EXPIRED',
          message: 'Session expirée ou invalide. Déconnectez-vous puis reconnectez-vous avant de payer.',
          retryable: false,
          action: 'REAUTH'
        },
        'Session expirée ou invalide. Déconnectez-vous puis reconnectez-vous avant de payer.'
      );
    }

    return refreshed.session.access_token;
  }

  async _extractFunctionError(error) {
    const fallback = {
      message: 'Unable to call edge function',
      code: null,
      retryable: false,
      action: null,
      details: null
    };

    if (!error) return fallback;

    if (
      error &&
      (Object.prototype.hasOwnProperty.call(error, 'code') ||
        Object.prototype.hasOwnProperty.call(error, 'action') ||
        Object.prototype.hasOwnProperty.call(error, 'retryable'))
    ) {
      return {
        message: error?.message || fallback.message,
        code: error?.code || null,
        retryable: Boolean(error?.retryable),
        action: error?.action || null,
        details: error?.details || null
      };
    }

    const normalized = this._normalizeInvokeError(error);
    if (normalized?.message && normalized !== error) {
      return {
        ...fallback,
        message: normalized.message
      };
    }

    if (error.context instanceof Response) {
      try {
        const payload = await error.context.json();

        if (payload && typeof payload === 'object') {
          const payloadError = payload.error;

          if (payloadError && typeof payloadError === 'object') {
            return {
              message: payloadError.message || payload.message || fallback.message,
              code: payloadError.code || payload.code || null,
              retryable: Boolean(payloadError.retryable ?? payload.retryable),
              action: payloadError.action || payload.action || null,
              details: payloadError.details || payload.details || null
            };
          }

          return {
            message: payload.error || payload.message || fallback.message,
            code: payload.code || null,
            retryable: Boolean(payload.retryable),
            action: payload.action || null,
            details: payload.details || null
          };
        }
      } catch {
        try {
          const text = await error.context.text();
          if (text) {
            return {
              ...fallback,
              message: text
            };
          }
        } catch {
          // no-op
        }
      }
    }

    return {
      ...fallback,
      message: error.message || fallback.message
    };
  }

  async createCheckoutSession({ items, language = 'fr' }) {
    const accessToken = await this._getAccessTokenOrThrow();

    const { data, error } = await this._invokeWithTimeout('stripe-checkout', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: {
        items,
        language,
        returnOrigin: this._getCheckoutReturnOrigin()
      }
    }, 15000, 'RETRY');

    if (error) {
      const detailed = await this._extractFunctionError(error);
      throw this._toCheckoutError(detailed, 'Unable to create checkout session');
    }

    if (!data?.url) {
      throw this._toCheckoutError(
        {
          message: 'Checkout URL not returned by backend',
          code: 'CHECKOUT_URL_MISSING',
          retryable: true,
          action: 'RETRY'
        },
        'Checkout URL not returned by backend'
      );
    }

    return data;
  }

  async createElementsSession({ items, language = 'fr' }) {
    const accessToken = await this._getAccessTokenOrThrow();

    const invokeOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: {
        items,
        language,
        checkoutType: 'elements',
        returnOrigin: this._getCheckoutReturnOrigin()
      }
    };

    let result;
    try {
      result = await this._invokeWithTimeout('stripe-checkout', invokeOptions, 15000, 'HOSTED_FALLBACK');
    } catch (error) {
      if (error?.code !== 'CHECKOUT_ABORTED') {
        throw error;
      }

      // retry 1 fois avant fallback hosted
      await new Promise((resolve) => setTimeout(resolve, 250));
      result = await this._invokeWithTimeout('stripe-checkout', invokeOptions, 15000, 'HOSTED_FALLBACK');
    }

    const { data, error } = result;

    if (error) {
      const detailed = await this._extractFunctionError(error);
      throw this._toCheckoutError(detailed, 'Unable to initialize custom checkout');
    }

    if (!data?.clientSecret) {
      throw this._toCheckoutError(
        {
          message: 'Client secret not returned by backend',
          code: 'CLIENT_SECRET_MISSING',
          retryable: true,
          action: 'HOSTED_FALLBACK'
        },
        'Client secret not returned by backend'
      );
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
      const detailed = await this._extractFunctionError(error);
      throw this._toCheckoutError(detailed, 'Unable to open billing portal');
    }

    if (!data?.url) {
      throw this._toCheckoutError(
        {
          message: 'Portal URL not returned by backend',
          code: 'PORTAL_URL_MISSING',
          retryable: true,
          action: 'RETRY'
        },
        'Portal URL not returned by backend'
      );
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

    if (this._billingRuntimeTablesUnavailable) {
      return {
        balances,
        entitlements: [],
        usageLogs: []
      };
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

    const hasEntitlementsSchemaGap = this._isSchemaGapError(entitlementsError);
    const hasUsageSchemaGap = this._isSchemaGapError(usageError);

    if (hasEntitlementsSchemaGap || hasUsageSchemaGap) {
      this._markBillingRuntimeTablesUnavailable();
    }

    if (entitlementsError && !hasEntitlementsSchemaGap) {
      throw new Error(entitlementsError.message || 'Unable to load active services');
    }

    if (usageError && !hasUsageSchemaGap) {
      throw new Error(usageError.message || 'Unable to load service usage logs');
    }

    return {
      balances,
      entitlements: hasEntitlementsSchemaGap ? [] : (entitlements || []),
      usageLogs: hasUsageSchemaGap ? [] : (usageLogs || [])
    };
  }
}

export const billingService = new BillingService();
export default billingService;
