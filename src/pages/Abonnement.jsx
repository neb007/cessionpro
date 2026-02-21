// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PRICING, formatPrice } from '@/constants/pricing';
import { billingService } from '@/services/billingService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown, CheckCircle2, Loader2, Receipt, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'riviqo_checkout_payload';

const getOptionGroups = () => ({
  premium: [PRICING.premium.smartMatching, PRICING.premium.sponsoredListing].filter(Boolean),
  photos: [PRICING.photos.pack5, PRICING.photos.pack15].filter(Boolean),
  contacts: [PRICING.contacts.unit, PRICING.contacts.pack5, PRICING.contacts.pack8, PRICING.contacts.pack10].filter(Boolean)
});

const flattenOptions = (groups) => Object.values(groups).flat();

export default function Abonnement() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [activeServices, setActiveServices] = useState({
    balances: { photos: 0, contacts: 0 },
    entitlements: [],
    usageLogs: []
  });

  const labels = {
    fr: {
      title: 'Commander des services',
      subtitle: 'Sélectionnez une option, vérifiez les détails, puis commandez en 1 clic.',
      chooseService: 'Choisir un service',
      categoryPremium: 'Options Premium',
      categoryPhotos: 'Packs Photos',
      categoryContacts: 'Packs Contacts',
      details: 'Détails',
      quantity: 'Quantité',
      days: 'Jours',
      orderNow: 'Commander',
      addToOrder: 'Ajouter à la commande',
      selectedTitle: 'Services sélectionnés',
      empty: 'Aucun service sélectionné.',
      remove: 'Retirer',
      total: 'Total',
      continue: 'Continuer vers paiement',
      oneTime: 'Paiement unique',
      monthly: '/mois',
      yearly: '/an',
      unavailable: 'Indisponible',
      servicesTitle: 'Mes packs achetés',
      servicesSubtitle: 'Résumé des packs achetés sur votre compte.',
      photosPacksPurchased: 'Packs photos',
      contactsPacksPurchased: 'Packs contacts',
      sponsoredPacksPurchased: 'Jours sponsorisés achetés',
      smartMatchingPurchased: 'Packs Smart Matching',
      packsPurchasedSuffix: 'achetés',
      daysRemainingSuffix: 'jours restants',
      servicesLoadError: 'Impossible de charger vos services actifs.',
      paymentSuccessTitle: 'Paiement confirmé',
      paymentSuccessDescription: 'Merci pour votre commande. Votre paiement a été validé avec succès.',
      paymentSuccessEmail: 'Un email de confirmation de commande vient d’être envoyé.',
      paymentSuccessManage: 'Voir mes packs achetés',
      paymentSuccessBilling: 'Voir ma facture',
      photosService: 'Photos',
      contactsService: 'Contacts',
      smartMatchingService: 'Smart Matching',
      sponsoredService: 'Annonce sponsorisée',
      dataRoomService: 'Data Room',
      ndaService: 'Protection NDA',
      statusActive: 'Actif',
      statusInactive: 'Inactif',
      statusLocked: 'Verrouillé',
      soon: 'Bientôt disponible',
      usePhotosHint: 'Utilisable dans Mes annonces lors de l’ajout de photos.',
      useContactsHint: 'Utilisable dans Leads pour contacter des profils.',
      useSmartHint: 'Utilisable dans Smart Matching pour activer vos alertes.',
      useSponsoredHint: 'Utilisable dans Mes annonces pour booster votre visibilité.',
      useSoonHint: 'Service en préparation. Activation prochaine.'
    },
    en: {
      title: 'Order services',
      subtitle: 'Select an option, review details, then order in one click.',
      chooseService: 'Choose a service',
      categoryPremium: 'Premium Options',
      categoryPhotos: 'Photo Packs',
      categoryContacts: 'Contact Packs',
      details: 'Details',
      quantity: 'Quantity',
      days: 'Days',
      orderNow: 'Order now',
      addToOrder: 'Add to order',
      selectedTitle: 'Selected services',
      empty: 'No service selected.',
      remove: 'Remove',
      total: 'Total',
      continue: 'Continue to payment',
      oneTime: 'One-time',
      monthly: '/month',
      yearly: '/year',
      unavailable: 'Unavailable',
      servicesTitle: 'My purchased packs',
      servicesSubtitle: 'Summary of packs purchased on your account.',
      photosPacksPurchased: 'Photo packs',
      contactsPacksPurchased: 'Contact packs',
      sponsoredPacksPurchased: 'Sponsored days purchased',
      smartMatchingPurchased: 'Smart Matching packs',
      packsPurchasedSuffix: 'purchased',
      daysRemainingSuffix: 'days remaining',
      servicesLoadError: 'Unable to load your active services.',
      paymentSuccessTitle: 'Payment confirmed',
      paymentSuccessDescription: 'Thank you for your order. Your payment has been successfully confirmed.',
      paymentSuccessEmail: 'A purchase confirmation email has just been sent.',
      paymentSuccessManage: 'View my purchased packs',
      paymentSuccessBilling: 'View my invoice',
      photosService: 'Photos',
      contactsService: 'Contacts',
      smartMatchingService: 'Smart Matching',
      sponsoredService: 'Sponsored listing',
      dataRoomService: 'Data Room',
      ndaService: 'NDA Protection',
      statusActive: 'Active',
      statusInactive: 'Inactive',
      statusLocked: 'Locked',
      soon: 'Coming soon',
      usePhotosHint: 'Use it in My listings when adding photos.',
      useContactsHint: 'Use it in Leads to contact profiles.',
      useSmartHint: 'Use it in Smart Matching to enable alerts.',
      useSponsoredHint: 'Use it in My listings to boost visibility.',
      useSoonHint: 'Service in preparation. Activation coming soon.'
    }
  };

  const l = labels[language] || labels.fr;
  const optionGroups = useMemo(() => getOptionGroups(), []);
  const options = useMemo(() => flattenOptions(optionGroups), [optionGroups]);
  const [selectedId, setSelectedId] = useState(options[0]?.id || '');
  const selectedOption = useMemo(() => options.find((x) => x.id === selectedId) || options[0], [options, selectedId]);

  const getQty = (id) => Math.max(1, Number(quantities[id] || 1));

  const setQty = (id, qty) => {
    const maxQty = id === 'sponsored_listing' ? 365 : 20;
    const next = Math.max(1, Math.min(maxQty, Number(qty || 1)));
    setQuantities((prev) => ({ ...prev, [id]: next }));
  };

  const billingLabel = (cycle) => {
    if (cycle === 'monthly') return l.monthly;
    if (cycle === 'yearly') return l.yearly;
    return l.oneTime;
  };

  const selectedItems = useMemo(() => cart, [cart]);

  const total = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedItems]
  );

  const purchasedCounters = useMemo(() => {
    const base = {
      photoPacks: 0,
      contactPacks: 0,
      sponsoredDaysPurchased: 0,
      sponsoredDaysRemaining: 0,
      smartMatchingPacks: 0
    };

    const entitlements = Array.isArray(activeServices?.entitlements) ? activeServices.entitlements : [];

    return entitlements.reduce((acc, item) => {
      const code = String(item?.product_code || '').toLowerCase();

      if (code === 'photos_pack5' || code === 'photos_pack15') {
        acc.photoPacks += 1;
      }

      if (code === 'contact_unit' || code === 'contact_pack5' || code === 'contact_pack8' || code === 'contact_pack10') {
        acc.contactPacks += 1;
      }

      if (code === 'sponsored_listing') {
        const fallbackDays = item?.entitlement_type === 'feature' ? 30 : 0;
        acc.sponsoredDaysPurchased += Math.max(0, Number(item?.quantity_total ?? fallbackDays));
        acc.sponsoredDaysRemaining += Math.max(0, Number(item?.quantity_remaining || 0));
      }

      if (code === 'smart_matching') {
        acc.smartMatchingPacks += 1;
      }

      return acc;
    }, base);
  }, [activeServices?.entitlements]);

  const scrollToServices = () => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('service-hub');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToBillingHistory = () => {
    window.location.href = '/Settings?tab=billing';
  };

  const loadActiveServices = async () => {
    try {
      setServicesLoading(true);
      const data = await billingService.getMyActiveServices(20);
      setActiveServices(
        data || {
          balances: { photos: 0, contacts: 0 },
          entitlements: [],
          usageLogs: []
        }
      );
    } catch (error) {
      toast({
        title: l.servicesTitle,
        description: error?.message || l.servicesLoadError,
        variant: 'destructive'
      });
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    loadActiveServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkoutStatus = searchParams.get('checkout');

  useEffect(() => {
    if (checkoutStatus !== 'success') return;
    setShowPaymentSuccess(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('checkout');
    setSearchParams(nextParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutStatus]);

  useEffect(() => {
    if (!showPaymentSuccess) return;
    loadActiveServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPaymentSuccess]);

  const goCheckout = async (items) => {
    try {
      if (!items?.length) return;
      setIsCheckoutLoading(true);
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items,
          language,
          source: 'abonnement_simple',
          createdAt: Date.now()
        })
      );
      window.location.href = '/Checkout';
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Paiement indisponible' : 'Checkout unavailable',
        description:
          error?.message ||
          (language === 'fr'
            ? 'Impossible de lancer le paiement pour le moment.'
            : 'Unable to start checkout right now.'),
        variant: 'destructive'
      });
      setIsCheckoutLoading(false);
    }
  };

  const handleOrderNow = async (option) => {
    await goCheckout([{ code: option.id, quantity: getQty(option.id) }]);
  };

  const handleAddToOrder = (option) => {
    const qty = getQty(option.id);
    if (!option?.id || option.comingSoon) return;

    setCart((prev) => {
      const existing = prev.find((x) => x.id === option.id);
      if (existing) {
        return prev.map((x) => (x.id === option.id ? { ...x, quantity: x.quantity + qty } : x));
      }
      return [...prev, { ...option, quantity: qty }];
    });
  };

  const removeFromOrder = (id) => setCart((prev) => prev.filter((x) => x.id !== id));

  const handleContinue = async () => {
    await goCheckout(selectedItems.map((item) => ({ code: item.id, quantity: item.quantity })));
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {showPaymentSuccess ? (
        <div className="rounded-2xl border border-success/20 bg-success/10 p-4">
          <p className="text-sm font-semibold text-success inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {l.paymentSuccessTitle}
          </p>
          <p className="text-sm text-foreground mt-1">{l.paymentSuccessDescription}</p>
          <p className="text-xs text-muted-foreground mt-1">{l.paymentSuccessEmail}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-full" onClick={scrollToServices}>
              <Sparkles className="w-4 h-4 mr-2" />
              {l.paymentSuccessManage}
            </Button>
            <Button className="rounded-full bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white" onClick={goToBillingHistory}>
              <Receipt className="w-4 h-4 mr-2" />
              {l.paymentSuccessBilling}
            </Button>
          </div>
        </div>
      ) : null}

      <section id="service-hub" className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div>
          <div>
            <h2 className="text-base font-semibold text-foreground">{l.servicesTitle}</h2>
            <p className="text-xs text-muted-foreground mt-1">{l.servicesSubtitle}</p>
          </div>
        </div>

        {servicesLoading ? (
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground py-3">
            <Loader2 className="w-4 h-4 animate-spin" />
            {language === 'fr' ? 'Chargement des services…' : 'Loading services...'}
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-muted-foreground">{l.photosPacksPurchased}</p>
              <p className="text-2xl font-semibold text-foreground mt-1">{purchasedCounters.photoPacks}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{l.packsPurchasedSuffix}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-muted-foreground">{l.contactsPacksPurchased}</p>
              <p className="text-2xl font-semibold text-foreground mt-1">{purchasedCounters.contactPacks}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{l.packsPurchasedSuffix}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-muted-foreground">{l.sponsoredPacksPurchased}</p>
              <p className="text-2xl font-semibold text-foreground mt-1">{purchasedCounters.sponsoredDaysPurchased}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {purchasedCounters.sponsoredDaysRemaining} {l.daysRemainingSuffix}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-muted-foreground">{l.smartMatchingPurchased}</p>
              <p className="text-2xl font-semibold text-foreground mt-1">{purchasedCounters.smartMatchingPacks}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{l.packsPurchasedSuffix}</p>
            </div>
          </div>
        )}
      </section>

      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">{l.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{l.subtitle}</p>
      </div>

      <div id="order-composer" className="border border-gray-200 rounded-2xl bg-white p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">{l.chooseService}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full border border-gray-200 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-primary transition-colors">
                <span>
                  <span className="block text-sm font-medium text-foreground">
                    {selectedOption
                      ? language === 'fr'
                        ? selectedOption.frenchLabel
                        : selectedOption.englishLabel
                      : l.chooseService}
                  </span>
                  {selectedOption ? (
                    <span className="block text-xs text-muted-foreground">
                      {formatPrice(selectedOption.price, language)} • {billingLabel(selectedOption.billingCycle)}
                    </span>
                  ) : null}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[min(92vw,680px)]">
              <DropdownMenuLabel>{l.categoryPremium}</DropdownMenuLabel>
              <DropdownMenuGroup>
                {optionGroups.premium.map((option) => (
                  <DropdownMenuItem key={option.id} onClick={() => setSelectedId(option.id)}>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {language === 'fr' ? option.frenchLabel : option.englishLabel} — {formatPrice(option.price, language)}
                      </span>
                      <span className="text-xs text-[#3B4759]">
                        {language === 'fr' ? option.frenchDescription : option.englishDescription}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{l.categoryPhotos}</DropdownMenuLabel>
              <DropdownMenuGroup>
                {optionGroups.photos.map((option) => (
                  <DropdownMenuItem key={option.id} onClick={() => setSelectedId(option.id)}>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {language === 'fr' ? option.frenchLabel : option.englishLabel} — {formatPrice(option.price, language)}
                      </span>
                      <span className="text-xs text-[#3B4759]">
                        {language === 'fr' ? option.frenchDescription : option.englishDescription}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{l.categoryContacts}</DropdownMenuLabel>
              <DropdownMenuGroup>
                {optionGroups.contacts.map((option) => (
                  <DropdownMenuItem key={option.id} onClick={() => setSelectedId(option.id)}>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {language === 'fr' ? option.frenchLabel : option.englishLabel} — {formatPrice(option.price, language)}
                      </span>
                      <span className="text-xs text-[#3B4759]">
                        {language === 'fr' ? option.frenchDescription : option.englishDescription}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selectedOption ? (
          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {language === 'fr' ? selectedOption.frenchLabel : selectedOption.englishLabel}
                </p>
                <p className="text-xs text-muted-foreground">{l.details}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">{formatPrice(selectedOption.price, language)}</p>
                <p className="text-xs text-muted-foreground">{billingLabel(selectedOption.billingCycle)}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {language === 'fr' ? selectedOption.frenchDescription : selectedOption.englishDescription}
            </p>

            {Array.isArray(selectedOption.features?.[language] || selectedOption.features?.fr) && (
              <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                {(selectedOption.features?.[language] || selectedOption.features?.fr).slice(0, 3).map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  {selectedOption.id === 'sponsored_listing' ? l.days : l.quantity}
                </p>
                <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="px-2 py-1 text-sm"
                    onClick={() => setQty(selectedOption.id, getQty(selectedOption.id) - 1)}
                    disabled={selectedOption.comingSoon}
                  >
                    -
                  </button>
                  <input
                    className="w-10 text-center text-sm border-l border-r border-gray-200 py-1"
                    value={getQty(selectedOption.id)}
                    onChange={(e) => setQty(selectedOption.id, e.target.value)}
                    disabled={selectedOption.comingSoon}
                  />
                  <button
                    type="button"
                    className="px-2 py-1 text-sm"
                    onClick={() => setQty(selectedOption.id, getQty(selectedOption.id) + 1)}
                    disabled={selectedOption.comingSoon}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => handleAddToOrder(selectedOption)}
                  disabled={selectedOption.comingSoon || isCheckoutLoading}
                >
                  {selectedOption.comingSoon ? l.unavailable : l.addToOrder}
                </Button>
                <Button
                  className="rounded-full bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white"
                  onClick={() => handleOrderNow(selectedOption)}
                  disabled={selectedOption.comingSoon || isCheckoutLoading}
                >
                  {l.orderNow}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="border border-gray-200 rounded-2xl bg-white p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">{l.selectedTitle}</h2>
        {selectedItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">{l.empty}</p>
        ) : (
          <div className="space-y-1">
            {selectedItems.map((item) => (
              <div key={item.id} className="text-sm text-muted-foreground flex justify-between">
                <span>{language === 'fr' ? item.frenchLabel : item.englishLabel} × {item.quantity}</span>
                <span className="inline-flex items-center gap-2">
                  {formatPrice(item.price * item.quantity, language)}
                  <button type="button" className="text-red-500" onClick={() => removeFromOrder(item.id)}>
                    {l.remove}
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm text-muted-foreground">{l.total}</span>
          <span className="text-xl font-semibold text-foreground">{formatPrice(total, language)}</span>
        </div>

        <Button
          className="w-full rounded-full bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white"
          onClick={handleContinue}
          disabled={selectedItems.length === 0 || isCheckoutLoading}
        >
          {l.continue}
        </Button>
      </div>

    </div>
  );
}
