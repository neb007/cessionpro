// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ShieldCheck, ArrowLeft, CheckCircle2, Clock3, CreditCard } from 'lucide-react';
import { billingService } from '@/services/billingService';
import { PRICING } from '@/constants/pricing';

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
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <PaymentElement
          options={{ layout: 'tabs' }}
          onLoadError={(event) => {
            const message = event?.error?.message || labels.genericError;
            setErrorMessage(message);
            onElementLoadError?.(message);
          }}
        />
      </div>

      <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-3 text-xs text-[#3B4759] flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>
          {labels.secureByStripe} • {labels.total}: {formatMoney(amountTotalCents, currency, language)}
          {mode === 'subscription' ? ` ${labels.perPeriod}` : ''}
        </span>
      </div>

      {errorMessage ? <p className="text-xs text-red-600">{errorMessage}</p> : null}

      <Button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="w-full rounded-full bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white"
      >
        {isSubmitting ? labels.processing : labels.confirmPayment}
      </Button>
    </form>
  );
}

export default function Checkout() {
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
          'La clé Stripe publique est absente (VITE_STRIPE_PUBLISHABLE_KEY). Ajoutez-la dans les variables d’environnement Vercel (Production/Preview), puis redéployez.',
        back: 'Retour à Abonnement',
        refresh: 'Réessayer',
        paySectionTitle: 'Finaliser le paiement',
        paySectionSubtitle: 'Choisissez votre moyen de paiement puis confirmez.',
        activationHint: 'Activation estimée: quelques minutes après validation.'
        ,
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
        activationHint: 'Estimated activation: a few minutes after validation.'
        ,
        actionRetry: 'Please retry in a few seconds.',
        actionReauth: 'Please sign in again before retrying payment.',
        actionHostedFallback: 'We are automatically switching to Stripe hosted checkout.',
        actionRefreshCart: 'Please return to Subscription and rebuild your cart.'
      }
    }),
    []
  );

  const [language, setLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [checkoutData, setCheckoutData] = useState(null);
  const [checkoutPayload, setCheckoutPayload] = useState(null);
  const [isHostedFallbackLoading, setIsHostedFallbackLoading] = useState(false);
  const [elementsLoadError, setElementsLoadError] = useState('');
  const [errorActionHint, setErrorActionHint] = useState('');

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

  const bootstrapCheckout = async () => {
    let bootstrapPayload = null;

    try {
      setIsLoading(true);
      setErrorMessage('');
      setElementsLoadError('');
      setErrorActionHint('');

      if (isCheckoutDebugEnabled()) {
        console.info('[Checkout][bootstrap][start]', {
          href: typeof window !== 'undefined' ? window.location.href : null,
          hostname: typeof window !== 'undefined' ? window.location.hostname : null,
          hasStripeKey: Boolean(stripeKey)
        });
      }

      if (!stripeKey) {
        setErrorMessage(labels[language].missingStripeKey);
        return;
      }

      const raw = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (!raw) {
        if (isCheckoutDebugEnabled()) {
          console.warn('[Checkout][bootstrap][missing_payload]', {
            storageKey: CHECKOUT_STORAGE_KEY
          });
        }
        setErrorMessage(t.missingPayload);
        return;
      }

      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        if (isCheckoutDebugEnabled()) {
          console.warn('[Checkout][bootstrap][invalid_payload_json]');
        }
        setErrorMessage(t.missingPayload);
        return;
      }

      bootstrapPayload = payload;
      setCheckoutPayload(payload);

      const payloadLanguage = payload?.language === 'en' ? 'en' : 'fr';
      setLanguage(payloadLanguage);

      const isStale = Date.now() - Number(payload?.createdAt || 0) > 30 * 60 * 1000;
      if (!payload?.items?.length || isStale) {
        if (isCheckoutDebugEnabled()) {
          console.warn('[Checkout][bootstrap][stale_or_empty_payload]', {
            hasItems: Boolean(payload?.items?.length),
            isStale,
            createdAt: payload?.createdAt || null
          });
        }
        setErrorMessage(labels[payloadLanguage].missingPayload);
        return;
      }

      const data = await billingService.createElementsSession({
        items: payload.items,
        language: payloadLanguage
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
        setErrorMessage(labels[payloadLanguage].genericError);
        return;
      }

      setCheckoutData(data);
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
        setErrorActionHint(getActionHint(checkoutError.action));
        await openHostedCheckout(fallbackPayload);
        return;
      }

      setErrorMessage(checkoutError.message);
      setErrorActionHint(getActionHint(checkoutError.action));
      toast({
        title: labels[language].paymentUnavailable,
        description: checkoutError.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openHostedCheckout = async (payloadOverride = null) => {
    try {
      const effectivePayload = payloadOverride || checkoutPayload;

      if (!effectivePayload?.items?.length) {
        throw new Error(t.missingPayload);
      }

      setIsHostedFallbackLoading(true);
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
      setErrorActionHint(getActionHint(checkoutError.action));

      toast({
        title: t.paymentUnavailable,
        description: checkoutError.message,
        variant: 'destructive'
      });
      setIsHostedFallbackLoading(false);
    }
  };

  useEffect(() => {
    bootstrapCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    const watchdog = setTimeout(() => {
      setErrorMessage((prev) => prev || t.genericError);
      setIsLoading(false);
    }, 12000);

    return () => clearTimeout(watchdog);
  }, [isLoading, t.genericError]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#FF6B4A',
      colorBackground: '#ffffff',
      colorText: '#111827',
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
        <section className="rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-orange-50 p-6 lg:p-8">
          <button
            type="button"
            className="text-xs text-[#3B4759] inline-flex items-center gap-2 mb-3"
            onClick={goBack}
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </button>
          <h1 className="text-3xl lg:text-4xl font-display font-semibold text-[#111827]">{t.title}</h1>
          <p className="text-sm lg:text-base text-[#3B4759] mt-2 max-w-3xl">{t.subtitle}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-white border border-gray-200 px-3 py-1 text-[#3B4759]">1. {t.stepSelect}</span>
            <span className="rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-[#D4573A] font-medium">2. {t.stepPay}</span>
            <span className="rounded-full bg-white border border-gray-200 px-3 py-1 text-[#3B4759]">3. {t.stepDone}</span>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
          <Card className="rounded-3xl border border-gray-200 shadow-sm h-fit xl:sticky xl:top-5">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl text-[#111827]">{t.summaryTitle}</CardTitle>
              <p className="text-sm text-[#3B4759]">{t.summarySubtitle}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 max-h-[240px] overflow-auto pr-1">
                {summaryItems.length === 0 ? (
                  <p className="text-sm text-[#3B4759]">-</p>
                ) : (
                  summaryItems.map((item, idx) => (
                    <div
                      key={`${item.code}-${idx}`}
                      className="text-sm border border-gray-100 rounded-xl px-3 py-2 flex items-center justify-between"
                    >
                      <span className="text-[#111827] font-medium">
                        {PRICING_LABELS[item.code]?.[language] || item.code}
                      </span>
                      <span className="text-[#3B4759]">x{item.quantity || 1}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#3B4759]">{t.total}</span>
                  <span className="text-xl font-semibold text-[#111827]">
                    {formatMoney(checkoutData?.amountTotalCents, checkoutData?.currency, language)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[#111827]">{t.secureTitle}</h3>
                <p className="text-xs text-[#3B4759] flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {t.secureOne}
                </p>
                <p className="text-xs text-[#3B4759] flex items-center gap-2">
                  <Clock3 className="w-3.5 h-3.5 text-orange-600" /> {t.secureTwo}
                </p>
                <p className="text-xs text-[#3B4759] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B4A]" /> {t.secureThree}
                </p>
                <p className="text-xs text-[#3B4759] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B4A]" /> {t.activationHint}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-gray-200 shadow-sm">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl text-[#111827] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#FF6B4A]" />
                {t.paySectionTitle}
              </CardTitle>
              <p className="text-sm text-[#3B4759]">{t.paySectionSubtitle}</p>
            </CardHeader>
            <CardContent>
              {!stripePromise ? (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                  {t.missingStripeKey}
                </div>
              ) : isLoading ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-sm text-[#3B4759] space-y-3">
                  <p>{t.loading}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="rounded-full" onClick={bootstrapCheckout}>
                      {t.refresh}
                    </Button>
                    <Button
                      className="rounded-full bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white"
                      onClick={openHostedCheckout}
                      disabled={isHostedFallbackLoading}
                    >
                      {isHostedFallbackLoading ? t.processing : t.confirmPayment}
                    </Button>
                  </div>
                </div>
              ) : errorMessage || elementsLoadError || !checkoutData?.clientSecret ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    {errorMessage || elementsLoadError || t.genericError}
                  </div>
                  {errorActionHint ? (
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800">
                      {errorActionHint}
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="rounded-full" onClick={bootstrapCheckout}>
                      {t.refresh}
                    </Button>
                    <Button
                      className="rounded-full bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white"
                      onClick={openHostedCheckout}
                      disabled={isHostedFallbackLoading}
                    >
                      {isHostedFallbackLoading ? t.processing : t.confirmPayment}
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
                        setElementsLoadError(t.stripeConfigMismatch);
                        toast({
                          title: t.paymentUnavailable,
                          description: t.stripeConfigMismatch,
                          variant: 'destructive'
                        });
                        openHostedCheckout();
                        return;
                      }

                      setElementsLoadError(message);
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
