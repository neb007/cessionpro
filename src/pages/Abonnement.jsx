// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PRICING, formatPrice, calculateSavings } from '@/constants/pricing';
import { billingService } from '@/services/billingService';
import {
  CheckCircle2,
  Loader2,
  Receipt,
  Sparkles,
  Image,
  Users,
  Star,
  Zap,
  Shield,
  Database,
  Clock,
  X,
  Minus,
  Plus,
  ShoppingCart
} from 'lucide-react';

const STORAGE_KEY = 'riviqo_checkout_payload';

const getOptionGroups = () => ({
  premium: [
    PRICING.premium.smartMatching,
    PRICING.premium.sponsoredListing,
    PRICING.premium.dataRoom,
    PRICING.premium.ndaProtection
  ].filter(Boolean),
  photos: [PRICING.photos.pack5, PRICING.photos.pack15].filter(Boolean),
  contacts: [PRICING.contacts.unit, PRICING.contacts.pack5, PRICING.contacts.pack8, PRICING.contacts.pack10].filter(Boolean)
});

const ICON_MAP = {
  zap: Zap,
  star: Star,
  database: Database,
  shield: Shield,
  image: Image,
  images: Image,
  user: Users,
  users: Users
};

/** Compute savings badge for a product compared to the unit reference price */
const getSavingsInfo = (option, allOptions) => {
  // Contacts: compare to unit price
  if (option.id?.startsWith('contact_pack')) {
    const unit = allOptions.find((o) => o.id === 'contact_unit');
    if (unit) return calculateSavings(unit.price, option.quantity, option.price);
  }
  // Photos: compare pack15 to pack5 per-unit cost
  if (option.id === 'photos_pack15') {
    const pack5 = allOptions.find((o) => o.id === 'photos_pack5');
    if (pack5) {
      const unitPrice = pack5.price / pack5.quantity;
      return calculateSavings(unitPrice, option.quantity, option.price);
    }
  }
  return null;
};

/** Find the best savings option in a group */
const getBestSavingsId = (options, allOptions) => {
  let best = null;
  let bestPercent = 0;
  for (const opt of options) {
    const info = getSavingsInfo(opt, allOptions);
    if (info && info.savingsPercent > bestPercent) {
      bestPercent = info.savingsPercent;
      best = opt.id;
    }
  }
  return best;
};

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
      subtitle: 'Comparez les options, choisissez votre pack et commandez en 1 clic.',
      categoryPremium: 'Premium',
      categoryPhotos: 'Photos',
      categoryContacts: 'Contacts',
      quantity: 'Quantité',
      days: 'Jours',
      orderNow: 'Commander',
      addToCart: 'Ajouter',
      popular: 'Populaire',
      saveBadge: 'Économie',
      comingSoon: 'Bientôt',
      maxLabel: 'max.',
      subtotal: 'Sous-total',
      yourOrder: 'Votre commande',
      orderItems: 'articles',
      emptyCart: 'Votre panier est vide. Sélectionnez un service ci-dessus.',
      total: 'Total',
      payNow: 'Payer maintenant',
      oneTime: 'Paiement unique',
      monthly: '/mois',
      yearly: '/an',
      creditsTitle: 'Mes crédits',
      creditsSubtitle: 'Soldes disponibles sur votre compte.',
      photosRemaining: 'Photos restantes',
      contactsRemaining: 'Contacts restants',
      sponsoredDays: 'Jours sponsorisés',
      smartMatchingPacks: 'Smart Matching',
      remaining: 'restants',
      packs: 'packs',
      daysRemaining: 'jours restants',
      servicesLoadError: 'Impossible de charger vos services actifs.',
      paymentSuccessTitle: 'Paiement confirmé',
      paymentSuccessDescription: 'Merci pour votre commande. Votre paiement a été validé avec succès.',
      paymentSuccessEmail: 'Un email de confirmation de commande vient d\u2019être envoyé.',
      paymentSuccessManage: 'Voir mes crédits',
      paymentSuccessBilling: 'Voir ma facture',
      perUnit: '/ unité'
    },
    en: {
      title: 'Order services',
      subtitle: 'Compare options, choose your pack and order in one click.',
      categoryPremium: 'Premium',
      categoryPhotos: 'Photos',
      categoryContacts: 'Contacts',
      quantity: 'Quantity',
      days: 'Days',
      orderNow: 'Order now',
      addToCart: 'Add',
      popular: 'Popular',
      saveBadge: 'Save',
      comingSoon: 'Soon',
      maxLabel: 'max.',
      subtotal: 'Subtotal',
      yourOrder: 'Your order',
      orderItems: 'items',
      emptyCart: 'Your cart is empty. Select a service above.',
      total: 'Total',
      payNow: 'Pay now',
      oneTime: 'One-time',
      monthly: '/month',
      yearly: '/year',
      creditsTitle: 'My credits',
      creditsSubtitle: 'Available balances on your account.',
      photosRemaining: 'Photos remaining',
      contactsRemaining: 'Contacts remaining',
      sponsoredDays: 'Sponsored days',
      smartMatchingPacks: 'Smart Matching',
      remaining: 'remaining',
      packs: 'packs',
      daysRemaining: 'days remaining',
      servicesLoadError: 'Unable to load your active services.',
      paymentSuccessTitle: 'Payment confirmed',
      paymentSuccessDescription: 'Thank you for your order. Your payment has been successfully confirmed.',
      paymentSuccessEmail: 'A purchase confirmation email has just been sent.',
      paymentSuccessManage: 'View my credits',
      paymentSuccessBilling: 'View my invoice',
      perUnit: '/ unit'
    }
  };

  const l = labels[language] || labels.fr;
  const optionGroups = useMemo(() => getOptionGroups(), []);
  const allOptions = useMemo(() => Object.values(optionGroups).flat(), [optionGroups]);
  const bestContactId = useMemo(() => getBestSavingsId(optionGroups.contacts, allOptions), [optionGroups.contacts, allOptions]);

  const getQty = (id) => Math.max(1, Number(quantities[id] || 1));

  const setQty = (id, qty) => {
    const maxQty = id === 'sponsored_listing' ? 365 : 20;
    const next = Math.max(1, Math.min(maxQty, Number(qty || 1)));
    setQuantities((prev) => ({ ...prev, [id]: next }));
  };

  const getMaxQty = (id) => (id === 'sponsored_listing' ? 365 : 20);

  const billingLabel = (cycle) => {
    if (cycle === 'monthly') return l.monthly;
    if (cycle === 'yearly') return l.yearly;
    return l.oneTime;
  };

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const sponsoredDaysRemaining = useMemo(() => {
    const entitlements = Array.isArray(activeServices?.entitlements) ? activeServices.entitlements : [];
    return entitlements.reduce((acc, item) => {
      if (String(item?.product_code || '').toLowerCase() === 'sponsored_listing') {
        return acc + Math.max(0, Number(item?.quantity_remaining || 0));
      }
      return acc;
    }, 0);
  }, [activeServices?.entitlements]);

  const smartMatchingPacks = useMemo(() => {
    const entitlements = Array.isArray(activeServices?.entitlements) ? activeServices.entitlements : [];
    return entitlements.filter((item) => String(item?.product_code || '').toLowerCase() === 'smart_matching').length;
  }, [activeServices?.entitlements]);

  const scrollToServices = () => {
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
        data || { balances: { photos: 0, contacts: 0 }, entitlements: [], usageLogs: [] }
      );
    } catch (error) {
      toast({
        title: l.creditsTitle,
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
    setCart([]);
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
        JSON.stringify({ items, language, source: 'abonnement_simple', createdAt: Date.now() })
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

  const handleDirectOrder = async (option) => {
    await goCheckout([{ code: option.id, quantity: getQty(option.id) }]);
  };

  const handleAddToCart = (option) => {
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

  const updateCartQty = (id, qty) => {
    const maxQty = id === 'sponsored_listing' ? 365 : 20;
    const next = Math.max(1, Math.min(maxQty, Number(qty || 1)));
    setCart((prev) => prev.map((x) => (x.id === id ? { ...x, quantity: next } : x)));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((x) => x.id !== id));

  const handleCheckoutCart = async () => {
    await goCheckout(cart.map((item) => ({ code: item.id, quantity: item.quantity })));
  };

  // ─── Product Card ───
  const ProductCard = ({ option }) => {
    const savings = getSavingsInfo(option, allOptions);
    const isPopular = option.popular || option.id === bestContactId;
    const isComingSoon = option.comingSoon;
    const IconComponent = ICON_MAP[option.icon] || Star;
    const features = option.features?.[language] || option.features?.fr || [];
    const qty = getQty(option.id);
    const maxQty = getMaxQty(option.id);
    const qtyLabel = option.id === 'sponsored_listing' ? l.days : l.quantity;

    return (
      <div
        className={`relative rounded-xl border p-4 flex flex-col gap-3 transition-all ${
          isComingSoon
            ? 'border-border opacity-60'
            : isPopular
              ? 'border-primary shadow-md'
              : 'border-border hover:border-primary/50 hover:shadow-sm'
        }`}
      >
        {/* Popular / Savings badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {isPopular && !isComingSoon && (
            <Badge className="bg-primary/10 text-primary border-0 text-[11px]">
              <Sparkles className="w-3 h-3 mr-1" />
              {l.popular}
            </Badge>
          )}
          {savings && savings.savingsPercent > 0 && !isComingSoon && (
            <Badge className="bg-success/10 text-success border-0 text-[11px]">
              -{savings.savingsPercent}%
            </Badge>
          )}
          {isComingSoon && (
            <Badge className="bg-muted text-muted-foreground border-0 text-[11px]">
              <Clock className="w-3 h-3 mr-1" />
              {l.comingSoon}
            </Badge>
          )}
        </div>

        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <IconComponent className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">
              {language === 'fr' ? option.frenchLabel : option.englishLabel}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {language === 'fr' ? option.frenchDescription : option.englishDescription}
            </p>
          </div>
        </div>

        {/* Price */}
        <div>
          <span className="text-xl font-bold text-foreground font-numbers">
            {formatPrice(option.price, language)}
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            {billingLabel(option.billingCycle)}
          </span>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-1">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* Quantity + CTA (only for available products) */}
        {!isComingSoon && (
          <div className="mt-auto pt-2 space-y-2">
            {/* Quantity selector */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{qtyLabel}</span>
              <div className="inline-flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                  onClick={() => setQty(option.id, qty - 1)}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input
                  className="w-10 text-center text-sm border-l border-r border-border h-8 font-numbers"
                  value={qty}
                  onChange={(e) => setQty(option.id, e.target.value)}
                />
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                  onClick={() => setQty(option.id, qty + 1)}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            {/* Max hint + subtotal */}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{l.maxLabel} {maxQty}</span>
              {qty > 1 && (
                <span className="font-medium text-foreground font-numbers">
                  {l.subtotal}: {formatPrice(option.price * qty, language)}
                </span>
              )}
            </div>
            {/* CTA buttons */}
            <Button
              className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white"
              onClick={() => handleAddToCart(option)}
              disabled={isCheckoutLoading}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {l.addToCart}
            </Button>
            <button
              type="button"
              className="w-full text-center text-xs text-primary hover:underline"
              onClick={() => handleDirectOrder(option)}
              disabled={isCheckoutLoading}
            >
              {l.orderNow} →
            </button>
          </div>
        )}
      </div>
    );
  };

  // ─── Render ───
  return (
    <div className="w-full max-w-full overflow-x-hidden px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Payment Success Banner */}
      {showPaymentSuccess && (
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
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-white" onClick={goToBillingHistory}>
              <Receipt className="w-4 h-4 mr-2" />
              {l.paymentSuccessBilling}
            </Button>
          </div>
        </div>
      )}

      {/* ─── Credits / Balances ─── */}
      <section id="service-hub" className="rounded-2xl border border-border bg-white px-4 py-4 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">{l.creditsTitle}</h2>
        <p className="text-xs text-muted-foreground mt-1">{l.creditsSubtitle}</p>

        {servicesLoading ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">{l.photosRemaining}</p>
              </div>
              <p className="text-2xl font-semibold text-foreground mt-1 font-numbers">
                {activeServices.balances.photos}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{l.remaining}</p>
            </div>

            <div className="rounded-xl border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">{l.contactsRemaining}</p>
              </div>
              <p className="text-2xl font-semibold text-foreground mt-1 font-numbers">
                {activeServices.balances.contacts}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{l.remaining}</p>
            </div>

            <div className="rounded-xl border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">{l.sponsoredDays}</p>
              </div>
              <p className="text-2xl font-semibold text-foreground mt-1 font-numbers">
                {sponsoredDaysRemaining}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{l.daysRemaining}</p>
            </div>

            <div className="rounded-xl border border-border bg-white p-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">{l.smartMatchingPacks}</p>
              </div>
              <p className="text-2xl font-semibold text-foreground mt-1 font-numbers">
                {smartMatchingPacks}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{l.packs}</p>
            </div>
          </div>
        )}
      </section>

      {/* ─── Order Section ─── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">{l.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{l.subtitle}</p>
      </div>

      {/* Product Catalog with Category Tabs */}
      <div className="border border-border rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
        <Tabs defaultValue="premium" className="w-full">
          <TabsList className="w-full justify-start bg-muted/50 mb-4">
            <TabsTrigger value="premium" className="flex-1 sm:flex-none">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              {l.categoryPremium}
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex-1 sm:flex-none">
              <Image className="w-3.5 h-3.5 mr-1.5" />
              {l.categoryPhotos}
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex-1 sm:flex-none">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              {l.categoryContacts}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="premium">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {optionGroups.premium.map((option) => (
                <ProductCard key={option.id} option={option} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {optionGroups.photos.map((option) => (
                <ProductCard key={option.id} option={option} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {optionGroups.contacts.map((option) => (
                <ProductCard key={option.id} option={option} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ─── Cart Section (visible only when items in cart) ─── */}
      {cart.length > 0 && (
        <div className="border border-primary/30 rounded-2xl bg-white p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-primary" />
              {l.yourOrder}
            </h2>
            <Badge variant="outline" className="font-numbers">
              {cart.length} {l.orderItems}
            </Badge>
          </div>

          <div className="divide-y divide-border">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {language === 'fr' ? item.frenchLabel : item.englishLabel}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(item.price, language)} {l.perUnit}
                  </p>
                </div>

                {/* Inline quantity editor */}
                <div className="inline-flex items-center border border-border rounded-lg overflow-hidden shrink-0">
                  <button
                    type="button"
                    className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                    onClick={() => updateCartQty(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-numbers">{item.quantity}</span>
                  <button
                    type="button"
                    className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                    onClick={() => updateCartQty(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-sm font-semibold text-foreground font-numbers w-20 text-right">
                  {formatPrice(item.price * item.quantity, language)}
                </span>

                <button
                  type="button"
                  className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  onClick={() => removeFromCart(item.id)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-medium text-muted-foreground">{l.total}</span>
            <span className="text-xl font-bold text-foreground font-numbers">
              {formatPrice(cartTotal, language)}
            </span>
          </div>

          <Button
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-white"
            onClick={handleCheckoutCart}
            disabled={isCheckoutLoading}
          >
            {isCheckoutLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Receipt className="w-4 h-4 mr-2" />
            )}
            {l.payNow}
          </Button>
        </div>
      )}
    </div>
  );
}
