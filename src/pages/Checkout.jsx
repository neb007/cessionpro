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

function CheckoutPaymentForm({ labels, language, amountTotalCents, currency, mode }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/Settings?tab=billing&checkout=success`
      },
      redirect: 'if_required'
    });

    if (error) {
      const message = error.message || labels.genericError;
      setErrorMessage(message);
      toast({
        title: labels.paymentUnavailable,
        description: message,
        variant: 'destructive'
      });
      setIsSubmitting(false);
      return;
    }

    if (paymentIntent && ['succeeded', 'processing'].includes(paymentIntent.status)) {
      window.location.href = '/Settings?tab=billing&checkout=success';
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <PaymentElement options={{ layout: 'tabs' }} />
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
        missingPayload: 'Votre panier est vide ou expiré. Retournez sur Abonnement.',
        missingStripeKey: 'La clé Stripe publique est absente (VITE_STRIPE_PUBLISHABLE_KEY).',
        back: 'Retour à Abonnement',
        refresh: 'Réessayer',
        paySectionTitle: 'Finaliser le paiement',
        paySectionSubtitle: 'Choisissez votre moyen de paiement puis confirmez.',
        activationHint: 'Activation estimée: quelques minutes après validation.'
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
        missingPayload: 'Your cart is empty or expired. Please return to Subscription page.',
        missingStripeKey: 'Missing Stripe publishable key (VITE_STRIPE_PUBLISHABLE_KEY).',
        back: 'Back to Subscription',
        refresh: 'Retry',
        paySectionTitle: 'Complete payment',
        paySectionSubtitle: 'Choose your payment method and confirm.',
        activationHint: 'Estimated activation: a few minutes after validation.'
      }
    }),
    []
  );

  const [language, setLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [checkoutData, setCheckoutData] = useState(null);
  const [checkoutPayload, setCheckoutPayload] = useState(null);

  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = useMemo(() => (stripeKey ? loadStripe(stripeKey) : null), [stripeKey]);
  const t = labels[language] || labels.fr;

  const bootstrapCheckout = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const raw = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (!raw) {
        setErrorMessage(t.missingPayload);
        return;
      }

      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        setErrorMessage(t.missingPayload);
        return;
      }

      setCheckoutPayload(payload);

      const payloadLanguage = payload?.language === 'en' ? 'en' : 'fr';
      setLanguage(payloadLanguage);

      const isStale = Date.now() - Number(payload?.createdAt || 0) > 30 * 60 * 1000;
      if (!payload?.items?.length || isStale) {
        setErrorMessage(labels[payloadLanguage].missingPayload);
        return;
      }

      const data = await billingService.createElementsSession({
        items: payload.items,
        language: payloadLanguage
      });

      if (!data?.clientSecret) {
        setErrorMessage(labels[payloadLanguage].genericError);
        return;
      }

      setCheckoutData(data);
    } catch (error) {
      const message = error?.message || labels[language].genericError;
      setErrorMessage(message);
      toast({
        title: labels[language].paymentUnavailable,
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bootstrapCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-sm text-[#3B4759]">
                  {t.loading}
                </div>
              ) : errorMessage || !checkoutData?.clientSecret ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    {errorMessage || t.genericError}
                  </div>
                  <Button variant="outline" className="rounded-full" onClick={bootstrapCheckout}>
                    {t.refresh}
                  </Button>
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
