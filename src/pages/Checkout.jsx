// @ts-nocheck
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, ArrowLeft, CheckCircle2, Clock3, CreditCard, Loader2 } from 'lucide-react';
import { billingService } from '@/services/billingService';
import { PRICING } from '@/constants/pricing';
import { useLanguage } from '@/components/i18n/LanguageContext';

const CHECKOUT_STORAGE_KEY = 'riviqo_checkout_payload';
const APP_CHECKOUT_RETURN_URL_FALLBACK = 'https://riviqo.com';
const CHECKOUT_SUCCESS_QUERY = 'checkout=success';

const isCheckoutDebugEnabled = () => {
  if (typeof window === 'undefined') return false;

  const isDevMode = Boolean(import.meta.env.DEV);
  const host = String(window.location.hostname || '').toLowerCase();
  const isLocalHost = host === 'localhost' || host === '127.0.0.1';

  let forcedDebug = false;
  try {
    forcedDebug = window.localStorage?.getItem('riviqo_checkout_debug') === '1';
  } catch {
    // ignore storage access errors
  }

  return isDevMode || isLocalHost || forcedDebug;
};

const getCheckoutReturnOrigin = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return APP_CHECKOUT_RETURN_URL_FALLBACK;
};

const normalizeCheckoutError = (error, fallbackMessage) => ({
  message: error?.message || fallbackMessage,
  code: error?.code || null,
  action: error?.action || null,
  retryable: Boolean(error?.retryable),
  details: error?.details || null
});

const formatMoney = (amountCents, currency = 'eur', language = 'fr') => {
  if (amountCents == null) return '-';
  return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: (currency || 'eur').toUpperCase()
  }).format(amountCents / 100);
};

const PRICING_LABELS = (() => {
  const pool = [
    ...Object.values(PRICING.premium || {}),
    ...Object.values(PRICING.photos || {}),
    ...Object.values(PRICING.contacts || {})
  ].filter((x) => x && typeof x === 'object' && x.id);

  return pool.reduce((acc, item) => {
    acc[item.id] = {
      fr: item.frenchLabel || item.id,
      en: item.englishLabel || item.id
    };
    return acc;
  }, {});
})();

const initialCheckoutState = {
  isLoading: true,
  errorMessage: '',
  checkoutData: null,
  checkoutPayload: null,
  isHostedFallbackLoading: false,
  elementsLoadError: '',
  errorActionHint: '',
};

function checkoutReducer(state, action) {
  switch (action.type) {
    case 'BOOTSTRAP_START':
      return { ...state, isLoading: true, errorMessage: '', elementsLoadError: '', errorActionHint: '' };
    case 'BOOTSTRAP_SUCCESS':
      return { ...state, isLoading: false, checkoutData: action.data, checkoutPayload: action.payload };
    case 'BOOTSTRAP_ERROR':
      return { ...state, isLoading: false, errorMessage: action.message, errorActionHint: action.hint || '' };
    case 'SET_PAYLOAD':
      return { ...state, checkoutPayload: action.payload };
    case 'HOSTED_FALLBACK_START':
      return { ...state, isHostedFallbackLoading: true };
    case 'HOSTED_FALLBACK_ERROR':
      return { ...state, isHostedFallbackLoading: false, errorActionHint: action.hint || '' };
    case 'ELEMENT_LOAD_ERROR':
      return { ...state, elementsLoadError: action.message };
    case 'WATCHDOG_TIMEOUT':
      return { ...state, isLoading: false, errorMessage: state.errorMessage || action.fallback };
    default:
      return state;
  }
}

function CheckoutPaymentForm({
  labels,
  language,
  amountTotalCents,
  currency,
  mode,
  onElementLoadError,
  onConfirmPaymentError
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || isSubmitting) {
      if (isCheckoutDebugEnabled()) {
        console.warn('[Checkout][confirmPayment][blocked]', {
          hasStripe: Boolean(stripe),
          hasElements: Boolean(elements),
          isSubmitting
        });
      }
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const returnUrl = `${getCheckoutReturnOrigin()}/Settings?tab=pricing&${CHECKOUT_SUCCESS_QUERY}`;

    if (isCheckoutDebugEnabled()) {
      console.info('[Checkout][confirmPayment][start]', {
        returnUrl,
        hasStripe: Boolean(stripe),
        hasElements: Boolean(elements)
      });
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl
      },
      redirect: 'if_required'
    });

    if (isCheckoutDebugEnabled()) {
      console.info('[Checkout][confirmPayment][result]', {
        errorCode: error?.code || null,
        errorType: error?.type || null,
        errorMessage: error?.message || null,
        paymentIntentStatus: paymentIntent?.status || null,
        paymentIntentId: paymentIntent?.id || null
      });
    }

    if (error) {
      const message = error.message || labels.genericError;
      setErrorMessage(message);
      toast({
        title: labels.paymentUnavailable,
        description: message,
        variant: 'destructive'
      });

      if (onConfirmPaymentError) {
        try {
          setIsSubmitting(false);
          await onConfirmPaymentError({
            errorCode: error?.code || null,
            errorType: error?.type || null,
            errorMessage: message
          });
          return;
        } catch {
          // no-op: keep default local error state
        }
      }

      setIsSubmitting(false);
      return;
    }

    if (paymentIntent && ['succeeded', 'processing'].includes(paymentIntent.status)) {
      window.location.href = `/Settings?tab=pricing&${CHECKOUT_SUCCESS_QUERY}`;
      return;
    }

    if (paymentIntent && onConfirmPaymentError) {
      try {
        setIsSubmitting(false);
        await onConfirmPaymentError({
          errorCode: 'unexpected_payment_intent_status',
          errorType: 'stripe_payment_intent_status',
          errorMessage: labels.genericError,
          paymentIntentStatus: paymentIntent.status || null
        });
        return;
      } catch {
        // no-op: keep default local error state
      }
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <PaymentElement
          options={{ layout: 'tabs' }}
          onLoadError={(event) => {
            const message = event?.error?.message || labels.genericError;
            setErrorMessage(message);
            onElementLoadError?.(message);
          }}
        />
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground flex items-center gap-2">
        <ShieldCheck aria-hidden="true" className="w-4 h-4 text-success" />
        <span>
          {labels.secureByStripe} • {labels.total}: {formatMoney(amountTotalCents, currency, language)}
          {mode === 'subscription' ? ` ${labels.perPeriod}` : ''}
        </span>
      </div>

      {errorMessage ? <p role="status" className="text-xs text-destructive">{errorMessage}</p> : null}

      <Button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full rounded-full bg-primary hover:bg-primary/90 text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {labels.processing}
          </>
        ) : labels.confirmPayment}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const { language } = useLanguage();

  const labels = useMemo(
    () => ({
      fr: {
        title: 'Paiement sécurisé',
        subtitle: 'Finalisez votre commande sur un tunnel rapide et rassurant.',
        stepSelect: 'Options',
        stepPay: 'Paiement',
        stepDone: 'Confirmation',
        summaryTitle: 'Résumé de commande',
        summarySubtitle: 'Vérifiez vos options avant de confirmer votre paiement.',
        secureTitle: 'Vos garanties',
        secureOne: 'Données de paiement chiffrées',
        secureTwo: 'Activation quasi immédiate des options',
        secureThree: 'Facture et suivi disponibles dans votre espace',
        loading: 'Initialisation du paiement...',
        secureByStripe: 'Paiement sécurisé par Stripe',
        total: 'Total',
        perPeriod: '/ période',
        processing: 'Traitement en cours...',
        confirmPayment: 'Payer maintenant',
        paymentUnavailable: 'Paiement indisponible',
        genericError: 'Impossible de confirmer le paiement.',
        stripeConfigMismatch:
          'Configuration Stripe incohérente (clé publique différente du compte qui a créé le paiement). Redirection vers le paiement hébergé…',
        missingPayload: 'Votre panier est vide ou expiré. Retournez sur Abonnement.',
        missingStripeKey:
          'La clé Stripe publique est absente (VITE_STRIPE_PUBLISHABLE_KEY). Ajoutez-la dans les variables d\'environnement Vercel (Production/Preview), puis redéployez.',
        back: 'Retour à Abonnement',
        refresh: 'Réessayer',
        paySectionTitle: 'Finaliser le paiement',
        paySectionSubtitle: 'Choisissez votre moyen de paiement puis confirmez.',
        activationHint: 'Activation estimée: quelques minutes après validation.',
        actionRetry: 'Réessayez dans quelques secondes.',
        actionReauth: 'Reconnectez-vous puis relancez le paiement.',
        actionHostedFallback: 'Nous lançons automatiquement le checkout hébergé Stripe.',
        actionRefreshCart: 'Retournez sur Abonnement et recomposez votre panier.'
      },
      en: {
        title: 'Secure payment',
        subtitle: 'Complete your order on a fast and reassuring checkout funnel.',
        stepSelect: 'Options',
        stepPay: 'Payment',
        stepDone: 'Confirmation',
        summaryTitle: 'Order summary',
        summarySubtitle: 'Review your options before confirming payment.',
        secureTitle: 'Your guarantees',
        secureOne: 'Encrypted payment data',
        secureTwo: 'Near-instant option activation',
        secureThree: 'Invoice and tracking in your account',
        loading: 'Initializing payment...',
        secureByStripe: 'Secure payment by Stripe',
        total: 'Total',
        perPeriod: '/ period',
        processing: 'Processing...',
        confirmPayment: 'Pay now',
        paymentUnavailable: 'Payment unavailable',
        genericError: 'Unable to confirm payment.',
        stripeConfigMismatch:
          'Stripe configuration mismatch (publishable key does not match the account that created the payment). Redirecting to hosted checkout…',
        missingPayload: 'Your cart is empty or expired. Please return to Subscription page.',
        missingStripeKey:
          'Missing Stripe publishable key (VITE_STRIPE_PUBLISHABLE_KEY). Add it to Vercel environment variables (Production/Preview), then redeploy.',
        back: 'Back to Subscription',
        refresh: 'Retry',
        paySectionTitle: 'Complete payment',
        paySectionSubtitle: 'Choose your payment method and confirm.',
        activationHint: 'Estimated activation: a few minutes after validation.',
        actionRetry: 'Please retry in a few seconds.',
        actionReauth: 'Please sign in again before retrying payment.',
        actionHostedFallback: 'We are automatically switching to Stripe hosted checkout.',
        actionRefreshCart: 'Please return to Subscription and rebuild your cart.'
      }
    }),
    []
  );

  const [state, dispatch] = useReducer(checkoutReducer, initialCheckoutState);
  const { isLoading, errorMessage, checkoutData, checkoutPayload, isHostedFallbackLoading, elementsLoadError, errorActionHint } = state;

  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = useMemo(() => (stripeKey ? loadStripe(stripeKey) : null), [stripeKey]);
  const t = labels[language] || labels.fr;

  const getActionHint = (action) => {
    if (action === 'REAUTH') return t.actionReauth;
    if (action === 'HOSTED_FALLBACK') return t.actionHostedFallback;
    if (action === 'REFRESH_CART') return t.actionRefreshCart;
    if (action === 'RETRY') return t.actionRetry;
    return '';
  };

  const openHostedCheckout = async (payloadOverride = null) => {
    try {
      const effectivePayload = payloadOverride || checkoutPayload;

      if (!effectivePayload?.items?.length) {
        throw new Error(t.missingPayload);
      }

      dispatch({ type: 'HOSTED_FALLBACK_START' });
      const data = await billingService.createCheckoutSession({
        items: effectivePayload.items,
        language
      });

      if (!data?.url) {
        throw new Error(t.genericError);
      }

      window.location.href = data.url;
    } catch (error) {
      const checkoutError = normalizeCheckoutError(error, t.genericError);
      if (isCheckoutDebugEnabled()) {
        console.error('[Checkout][hosted_fallback][error]', {
          message: checkoutError.message,
          code: checkoutError.code,
          action: checkoutError.action,
          retryable: checkoutError.retryable,
          details: checkoutError.details
        });
      }
      dispatch({ type: 'HOSTED_FALLBACK_ERROR', hint: getActionHint(checkoutError.action) });

      toast({
        title: t.paymentUnavailable,
        description: checkoutError.message,
        variant: 'destructive'
      });
    }
  };

  const bootstrapCheckout = async () => {
    let bootstrapPayload = null;

    try {
      dispatch({ type: 'BOOTSTRAP_START' });

      if (isCheckoutDebugEnabled()) {
        console.info('[Checkout][bootstrap][start]', {
          href: typeof window !== 'undefined' ? window.location.href : null,
          hostname: typeof window !== 'undefined' ? window.location.hostname : null,
          hasStripeKey: Boolean(stripeKey)
        });
      }

      if (!stripeKey) {
        dispatch({ type: 'BOOTSTRAP_ERROR', message: labels[language].missingStripeKey });
        return;
      }

      const raw = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (!raw) {
        if (isCheckoutDebugEnabled()) {
          console.warn('[Checkout][bootstrap][missing_payload]', {
            storageKey: CHECKOUT_STORAGE_KEY
          });
        }
        dispatch({ type: 'BOOTSTRAP_ERROR', message: t.missingPayload });
        return;
      }

      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        if (isCheckoutDebugEnabled()) {
          console.warn('[Checkout][bootstrap][invalid_payload_json]');
        }
        dispatch({ type: 'BOOTSTRAP_ERROR', message: t.missingPayload });
        return;
      }

      bootstrapPayload = payload;
      dispatch({ type: 'SET_PAYLOAD', payload });

      const isStale = Date.now() - Number(payload?.createdAt || 0) > 30 * 60 * 1000;
      if (!payload?.items?.length || isStale) {
        if (isCheckoutDebugEnabled()) {
          console.warn('[Checkout][bootstrap][stale_or_empty_payload]', {
            hasItems: Boolean(payload?.items?.length),
            isStale,
            createdAt: payload?.createdAt || null
          });
        }
        dispatch({ type: 'BOOTSTRAP_ERROR', message: labels[language].missingPayload });
        return;
      }

      const data = await billingService.createElementsSession({
        items: payload.items,
        language
      });

      if (isCheckoutDebugEnabled()) {
        console.info('[Checkout][bootstrap][elementsSession]', {
          hasClientSecret: Boolean(data?.clientSecret),
          mode: data?.mode || null,
          currency: data?.currency || null,
          amountTotalCents: data?.amountTotalCents || null,
          stripeKeyPrefix: stripeKey ? String(stripeKey).slice(0, 12) : null
        });
      }

      if (!data?.clientSecret) {
        dispatch({ type: 'BOOTSTRAP_ERROR', message: labels[language].genericError });
        return;
      }

      dispatch({ type: 'BOOTSTRAP_SUCCESS', data, payload });
    } catch (error) {
      const checkoutError = normalizeCheckoutError(error, labels[language].genericError);

      if (isCheckoutDebugEnabled()) {
        console.error('[Checkout][bootstrap][error]', {
          message: checkoutError.message,
          code: checkoutError.code,
          action: checkoutError.action,
          retryable: checkoutError.retryable,
          details: checkoutError.details,
          stack: error?.stack || null
        });
      }

      const fallbackPayload = bootstrapPayload || checkoutPayload;
      if (checkoutError.action === 'HOSTED_FALLBACK' && fallbackPayload?.items?.length) {
        dispatch({ type: 'BOOTSTRAP_ERROR', message: '', hint: getActionHint(checkoutError.action) });
        await openHostedCheckout(fallbackPayload);
        return;
      }

      dispatch({ type: 'BOOTSTRAP_ERROR', message: checkoutError.message, hint: getActionHint(checkoutError.action) });
      toast({
        title: labels[language].paymentUnavailable,
        description: checkoutError.message,
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    bootstrapCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    const watchdog = setTimeout(() => {
      dispatch({ type: 'WATCHDOG_TIMEOUT', fallback: t.genericError });
    }, 12000);

    return () => clearTimeout(watchdog);
  }, [isLoading, t.genericError]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: 'hsl(11, 100%, 64%)',
      colorBackground: 'hsl(0, 0%, 100%)',
      colorText: 'hsl(217, 25%, 28%)',
      borderRadius: '14px'
    }
  };

  const goBack = () => {
    window.location.href = '/Abonnement';
  };

  const summaryItems = checkoutPayload?.items || [];

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="w-full space-y-6">
        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 lg:p-8">
          <button
            type="button"
            className="text-xs text-muted-foreground inline-flex items-center gap-2 mb-3 hover:text-foreground"
            onClick={goBack}
            aria-label={t.back}
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </button>
          <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-foreground">{t.title}</h1>
          <p className="text-sm lg:text-base text-muted-foreground mt-2 max-w-3xl">{t.subtitle}</p>
          <nav className="mt-4 flex flex-wrap items-center gap-2 text-xs" aria-label="Checkout steps">
            <span className="rounded-full bg-white border border-border px-3 py-1 text-muted-foreground">1. {t.stepSelect}</span>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-primary font-medium">2. {t.stepPay}</span>
            <span className="rounded-full bg-white border border-border px-3 py-1 text-muted-foreground">3. {t.stepDone}</span>
          </nav>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
          <Card className="rounded-3xl border border-border shadow-sm h-fit xl:sticky xl:top-5">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl text-foreground">{t.summaryTitle}</CardTitle>
              <p className="text-sm text-muted-foreground">{t.summarySubtitle}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 max-h-[240px] overflow-auto pr-1">
                {summaryItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">-</p>
                ) : (
                  summaryItems.map((item, idx) => (
                    <div
                      key={`${item.code}-${idx}`}
                      className="text-sm border border-border rounded-xl px-3 py-2 flex items-center justify-between"
                    >
                      <span className="text-foreground font-medium">
                        {PRICING_LABELS[item.code]?.[language] || item.code}
                      </span>
                      <span className="text-muted-foreground">x{item.quantity || 1}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.total}</span>
                  <span className="text-xl font-semibold text-foreground">
                    {formatMoney(checkoutData?.amountTotalCents, checkoutData?.currency, language)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">{t.secureTitle}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-success" /> {t.secureOne}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock3 aria-hidden="true" className="w-3.5 h-3.5 text-primary" /> {t.secureTwo}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5 text-primary" /> {t.secureThree}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5 text-primary" /> {t.activationHint}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border shadow-sm">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl text-foreground flex items-center gap-2">
                <CreditCard aria-hidden="true" className="w-5 h-5 text-primary" />
                {t.paySectionTitle}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{t.paySectionSubtitle}</p>
            </CardHeader>
            <CardContent aria-live="polite">
              {!stripePromise ? (
                <div role="status" className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                  {t.missingStripeKey}
                </div>
              ) : isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-40 w-full rounded-2xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-32 rounded-full" />
                    <Skeleton className="h-10 w-40 rounded-full" />
                  </div>
                </div>
              ) : errorMessage || elementsLoadError || !checkoutData?.clientSecret ? (
                <div className="space-y-4">
                  <div role="status" className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                    {errorMessage || elementsLoadError || t.genericError}
                  </div>
                  {errorActionHint ? (
                    <div className="rounded-xl border border-warning/20 bg-warning/10 p-3 text-xs text-warning">
                      {errorActionHint}
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="rounded-full" onClick={bootstrapCheckout} aria-label={t.refresh}>
                      {t.refresh}
                    </Button>
                    <Button
                      className="rounded-full bg-primary hover:bg-primary/90 text-white"
                      onClick={() => openHostedCheckout()}
                      disabled={isHostedFallbackLoading}
                    >
                      {isHostedFallbackLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t.processing}
                        </>
                      ) : t.confirmPayment}
                    </Button>
                  </div>
                </div>
              ) : (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret: checkoutData.clientSecret,
                    appearance,
                    locale: language === 'en' ? 'en' : 'fr'
                  }}
                >
                  <CheckoutPaymentForm
                    labels={t}
                    language={language}
                    amountTotalCents={checkoutData.amountTotalCents}
                    currency={checkoutData.currency}
                    mode={checkoutData.mode}
                    onConfirmPaymentError={async (ctx) => {
                      if (isCheckoutDebugEnabled()) {
                        console.warn('[Checkout][confirmPayment][fallback_to_hosted]', {
                          ...ctx,
                          reason: 'elements_confirm_failed_or_unexpected_status'
                        });
                      }

                      await openHostedCheckout(checkoutPayload);
                    }}
                    onElementLoadError={(message) => {
                      const normalized = (message || '').toLowerCase();
                      if (normalized.includes('client_secret provided does not match')) {
                        dispatch({ type: 'ELEMENT_LOAD_ERROR', message: t.stripeConfigMismatch });
                        toast({
                          title: t.paymentUnavailable,
                          description: t.stripeConfigMismatch,
                          variant: 'destructive'
                        });
                        openHostedCheckout();
                        return;
                      }

                      dispatch({ type: 'ELEMENT_LOAD_ERROR', message });
                      toast({
                        title: t.paymentUnavailable,
                        description: message,
                        variant: 'destructive'
                      });
                    }}
                  />
                </Elements>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
