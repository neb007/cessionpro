import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { billingService } from '@/services/billingService';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, FileText } from 'lucide-react';

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

const formatItems = (itemCodes) => {
  if (Array.isArray(itemCodes) && itemCodes.length > 0) {
    return itemCodes.join(', ');
  }

  if (typeof itemCodes === 'string' && itemCodes.trim()) {
    return itemCodes;
  }

  return '-';
};

export default function Billing() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const labels = useMemo(
    () =>
      language === 'en'
        ? {
            emptyTransactions: 'No invoices yet.',
            amount: 'Amount',
            status: 'Status',
            date: 'Date',
            items: 'Items',
            invoice: 'Invoice',
            openInvoice: 'Download',
            loading: 'Loading billing data...',
            paymentSuccessTitle: 'Payment confirmed',
            paymentSuccessDescription:
              'Thank you for your order. Your payment has been successfully confirmed.'
          }
        : {
            emptyTransactions: 'Aucune facture pour le moment.',
            amount: 'Montant',
            status: 'Statut',
            date: 'Date',
            items: 'Articles',
            invoice: 'Facture',
            openInvoice: 'Télécharger',
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
      const transactionsData = await billingService.getMyTransactions(20);

      setTransactions(transactionsData || []);
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

  return (
    <div className="w-full max-w-none px-0 py-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        {showPaymentSuccess ? (
          <div className="rounded-2xl border border-success/20 bg-success/10 p-4 mb-6">
            <p className="text-sm font-semibold text-success inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {labels.paymentSuccessTitle}
            </p>
            <p className="text-sm text-foreground mt-1">{labels.paymentSuccessDescription}</p>
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-[#3B4759]">
            {labels.loading}
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-gray-500" />
            </div>
            <p className="text-sm text-[#111827]">{labels.emptyTransactions}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border border-gray-100 rounded-xl p-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm flex-1">
                  <div>
                    <p className="text-xs text-[#111827]">{labels.amount}</p>
                    <p className="font-medium text-[#3B4759]">
                      {formatMoney(txn.amount_paid_cents, txn.currency, language)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#111827]">{labels.status}</p>
                    <Badge className="w-fit bg-orange-100 text-orange-700 border-0 mt-0.5">
                      {txn.status || '-'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-[#111827]">{labels.date}</p>
                    <p className="font-medium text-[#3B4759]">{formatDate(txn.created_at, language)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#111827]">{labels.items}</p>
                    <p className="font-medium text-[#3B4759] break-words">{formatItems(txn.item_codes)}</p>
                  </div>
                </div>

                {txn.invoice_url ? (
                  <a
                    href={txn.invoice_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#FF6B4A] font-semibold underline-offset-2 hover:underline"
                  >
                    {labels.invoice}: {labels.openInvoice}
                  </a>
                ) : (
                  <span className="text-xs text-[#6B7280]">{labels.invoice}: -</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
