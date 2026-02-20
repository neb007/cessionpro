import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { billingService } from '@/services/billingService';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const formatMoney = (amountCents, currency = 'eur', language = 'fr') => {
  if (amountCents == null) return '-';
  return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency: (currency || 'eur').toUpperCase()
  }).format(amountCents / 100);
};

const formatDate = (dateValue, language = 'fr') => {
  if (!dateValue) return '-';
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateValue));
};

export default function Billing() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const labels = useMemo(
    () =>
      language === 'en'
        ? {
            title: 'Billing',
            subtitle: 'Track payments, invoices and subscriptions in one place.',
            manage: 'Manage subscription',
            transactionsTitle: 'Recent transactions',
            subscriptionsTitle: 'Subscriptions',
            emptyTransactions: 'No transactions yet.',
            emptySubscriptions: 'No active subscriptions.',
            amount: 'Amount',
            status: 'Status',
            date: 'Date',
            invoice: 'Invoice',
            openInvoice: 'Open',
            secure: 'Secure payment by Stripe',
            loading: 'Loading billing data...',
            paymentSuccessTitle: 'Payment confirmed',
            paymentSuccessDescription:
              'Thank you for your order. Your payment has been successfully confirmed.'
          }
        : {
            title: 'Facturation',
            subtitle: 'Suivez vos paiements, factures et abonnements en un seul endroit.',
            manage: 'Gérer mon abonnement',
            transactionsTitle: 'Transactions récentes',
            subscriptionsTitle: 'Abonnements',
            emptyTransactions: 'Aucune transaction pour le moment.',
            emptySubscriptions: 'Aucun abonnement actif.',
            amount: 'Montant',
            status: 'Statut',
            date: 'Date',
            invoice: 'Facture',
            openInvoice: 'Ouvrir',
            secure: 'Paiement sécurisé par Stripe',
            loading: 'Chargement des données de facturation...',
            paymentSuccessTitle: 'Paiement confirmé',
            paymentSuccessDescription:
              'Merci pour votre commande. Votre paiement a été validé avec succès.'
          },
    [language]
  );

  const checkoutStatus = searchParams.get('checkout');

  useEffect(() => {
    if (checkoutStatus !== 'success') return;
    setShowPaymentSuccess(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('checkout');
    setSearchParams(nextParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutStatus]);

  const loadBilling = async () => {
    try {
      setLoading(true);
      const [transactionsData, subscriptionsData] = await Promise.all([
        billingService.getMyTransactions(20),
        billingService.getMySubscriptions()
      ]);

      setTransactions(transactionsData || []);
      setSubscriptions(subscriptionsData || []);
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur de facturation' : 'Billing error',
        description:
          error?.message ||
          (language === 'fr'
            ? 'Impossible de charger la facturation.'
            : 'Unable to load billing data.'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBilling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenPortal = async () => {
    try {
      setIsPortalLoading(true);
      const { url } = await billingService.createPortalSession();
      window.location.href = url;
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Portail indisponible' : 'Portal unavailable',
        description:
          error?.message ||
          (language === 'fr'
            ? 'Impossible d’ouvrir le portail de facturation.'
            : 'Unable to open billing portal.'),
        variant: 'destructive'
      });
    } finally {
      setIsPortalLoading(false);
    }
  };

  return (
    <div className="w-full max-w-none px-0 py-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl text-[#3B4759] mb-2">{labels.title}</h1>
            <p className="text-sm text-[#111827]">{labels.subtitle}</p>
          </div>
          <Button
            onClick={handleOpenPortal}
            disabled={isPortalLoading}
            className="rounded-full bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white"
          >
            {labels.manage}
          </Button>
        </div>

        {showPaymentSuccess ? (
          <div className="rounded-2xl border border-success/20 bg-success/10 p-4 mb-6">
            <p className="text-sm font-semibold text-success inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {labels.paymentSuccessTitle}
            </p>
            <p className="text-sm text-foreground mt-1">{labels.paymentSuccessDescription}</p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-[#FF6B4A]/20 bg-orange-50/40 p-4 mb-6">
          <p className="text-xs text-[#3B4759]">🔒 {labels.secure}</p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-[#3B4759]">
            {labels.loading}
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="font-display text-lg text-[#3B4759] mb-3">{labels.subscriptionsTitle}</h2>
              {subscriptions.length === 0 ? (
                <p className="text-sm text-[#111827]">{labels.emptySubscriptions}</p>
              ) : (
                <div className="space-y-3">
                  {subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-100 rounded-xl p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[#3B4759]">{sub.stripe_price_id || '-'}</p>
                        <p className="text-xs text-[#111827]">
                          {labels.date}: {formatDate(sub.current_period_end, language)}
                        </p>
                      </div>
                      <Badge className="w-fit bg-orange-100 text-orange-700 border-0">
                        {sub.status || '-'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-display text-lg text-[#3B4759] mb-3">{labels.transactionsTitle}</h2>
              {transactions.length === 0 ? (
                <p className="text-sm text-[#111827]">{labels.emptyTransactions}</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border border-gray-100 rounded-xl p-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-[#111827]">{labels.amount}</p>
                          <p className="font-medium text-[#3B4759]">
                            {formatMoney(txn.amount_paid_cents, txn.currency, language)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#111827]">{labels.status}</p>
                          <p className="font-medium text-[#3B4759]">{txn.status || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#111827]">{labels.date}</p>
                          <p className="font-medium text-[#3B4759]">{formatDate(txn.created_at, language)}</p>
                        </div>
                      </div>
                      {txn.invoice_url ? (
                        <a
                          href={txn.invoice_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#FF6B4A] font-medium"
                        >
                          {labels.invoice}: {labels.openInvoice}
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
