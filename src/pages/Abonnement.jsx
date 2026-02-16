// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  ShoppingCart,
  Trash2,
  Zap,
  Image,
  Images,
  User,
  Users,
  Database,
  Shield,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2
} from 'lucide-react';
import { PRICING, formatPrice } from '@/constants/pricing';

const iconMap = {
  zap: Zap,
  image: Image,
  images: Images,
  user: User,
  users: Users,
  database: Database,
  shield: Shield
};

export default function Abonnement() {
  const { language } = useLanguage();
  const [cart, setCart] = useState([]);

  const labels = {
    fr: {
      title: "Débloquez plus d'opportunités",
      subtitle: "Sélectionnez vos options, ajoutez-les et validez en 2 minutes.",
      heroCta: 'Passer commande',
      heroSecondary: 'Comparer les options',
      socialProof: 'Déjà +1 200 vendeurs activés ce mois-ci',
      stepOne: 'Choisir',
      stepTwo: 'Ajouter',
      stepThree: 'Payer',
      addToCart: 'Ajouter',
      buyNow: 'Commander',
      cartTitle: 'Commande en cours',
      emptyCart: 'Commencez par choisir une option pour démarrer.',
      checkout: 'Finaliser la commande',
      secure: 'Paiement sécurisé (Stripe)',
      invoice: 'Facture disponible après achat',
      trustTitle: 'Pourquoi c’est efficace',
      trustOne: 'Décisions plus rapides',
      trustTwo: 'Visibilité immédiate',
      trustThree: 'Support réactif',
      bestValue: 'Meilleure valeur',
      remove: 'Retirer',
      popular: 'Populaire',
      comingSoon: 'Disponible prochainement',
      optionsTitle: 'Options Premium',
      optionsSubtitle: 'Boostez votre visibilité et vos performances',
      photoTitle: 'Visuels & Annonces',
      photoSubtitle: 'Donnez plus d’impact à vos annonces',
      contactTitle: 'Mises en relation',
      contactSubtitle: 'Accédez aux bons profils plus vite',
      highlightsTitle: 'Ce que vous gagnez',
      highlightOne: 'Annonces plus crédibles et attractives',
      highlightTwo: 'Contacts qualifiés plus rapidement',
      highlightThree: 'Temps gagné sur la prospection'
    },
    en: {
      title: 'Unlock more opportunities',
      subtitle: 'Select your options, add them, and checkout in 2 minutes.',
      heroCta: 'Checkout now',
      heroSecondary: 'Compare options',
      socialProof: 'Already 1,200+ sellers activated this month',
      stepOne: 'Choose',
      stepTwo: 'Add',
      stepThree: 'Pay',
      addToCart: 'Add',
      buyNow: 'Checkout',
      cartTitle: 'Current order',
      emptyCart: 'Start by selecting an option.',
      checkout: 'Complete checkout',
      secure: 'Secure payment (Stripe)',
      invoice: 'Invoice available after purchase',
      trustTitle: 'Why it works',
      trustOne: 'Faster decisions',
      trustTwo: 'Instant visibility',
      trustThree: 'Responsive support',
      bestValue: 'Best value',
      remove: 'Remove',
      popular: 'Popular',
      comingSoon: 'Coming soon',
      optionsTitle: 'Premium Options',
      optionsSubtitle: 'Boost visibility and performance',
      photoTitle: 'Visuals & Listings',
      photoSubtitle: 'Give your listings more impact',
      contactTitle: 'Connections',
      contactSubtitle: 'Reach the right profiles faster',
      highlightsTitle: 'What you gain',
      highlightOne: 'More credible, attractive listings',
      highlightTwo: 'Qualified contacts faster',
      highlightThree: 'Less time spent prospecting'
    }
  };

  const l = labels[language];

  const handleAdd = (option) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === option.id);
      if (existing) {
        return prev.map((item) =>
          item.id === option.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...option, quantity: 1 }];
    });
  };

  const handleRemove = (optionId) => {
    setCart((prev) => prev.filter((item) => item.id !== optionId));
  };

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const SectionTitle = ({ title, subtitle }) => (
    <div className="mb-4">
      <h2 className="font-display text-lg font-semibold text-[#3B4759]">{title}</h2>
      <p className="text-sm text-[#111827]">{subtitle}</p>
    </div>
  );

  const OptionRow = ({ option, isPopular = false, isBestValue = false }) => {
    const Icon = iconMap[option.icon];
    const isComingSoon = option.comingSoon;
    const featureList = option.features ? (option.features[language] || option.features.fr).slice(0, 2) : [];

    return (
      <div className="flex flex-col gap-4 border-b border-gray-100 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-orange-50 text-[#FF6B4A]">
              {Icon && <Icon className="w-5 h-5" />}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-[#111827]">
                  {language === 'fr' ? option.frenchLabel : option.englishLabel}
                </h3>
                {isPopular && (
                  <Badge className="bg-[#FF6B4A] text-white border-0 text-[10px]">
                    {l.popular}
                  </Badge>
                )}
                {isBestValue && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                    {l.bestValue}
                  </Badge>
                )}
                {isComingSoon && (
                  <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">
                    {l.comingSoon}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[#3B4759]">
                {language === 'fr' ? option.frenchDescription : option.englishDescription}
              </p>
              {option.quantity && !option.features && (
                <div className="flex items-center gap-2 text-xs text-[#3B4759]">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B4A]" />
                  <span>
                    {option.quantity} {option.icon === 'user' ? 'contacts' : 'photos'}
                  </span>
                </div>
              )}
              {featureList.length > 0 && (
                <div className="flex flex-wrap gap-3 text-xs text-[#3B4759]">
                  {featureList.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B4A]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-left sm:text-right">
              <p className="text-2xl font-semibold text-[#111827]">
                {formatPrice(option.price, language)}
              </p>
              {option.billingCycle && (
                <p className="text-xs text-[#3B4759]">
                  {option.billingCycle === 'monthly'
                    ? '/mois'
                    : option.billingCycle === 'yearly'
                    ? '/an'
                    : '(paiement unique)'}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                disabled={isComingSoon}
                onClick={() => handleAdd(option)}
                className="rounded-full text-xs bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white"
              >
                {l.addToCart}
              </Button>
              <Button
                disabled={isComingSoon}
                variant="outline"
                className="rounded-full text-xs"
              >
                {l.buyNow}
              </Button>
            </div>
          </div>
        </div>
        {isComingSoon && (
          <div className="flex items-center gap-2 text-[11px] text-amber-600">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? option.frenchTooltip : option.englishTooltip}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-0 py-6">
      <section className="border-b border-gray-100 pb-10 mb-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-6">
            <Badge className="bg-orange-100 text-orange-700 border-0 text-xs px-3 py-1 inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              {l.socialProof}
            </Badge>
            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-4xl text-[#111827] font-semibold">
                {l.title}
              </h1>
              <p className="text-base text-[#3B4759] max-w-xl">{l.subtitle}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="rounded-full bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white">
                {l.heroCta}
              </Button>
              <Button variant="outline" className="rounded-full">
                {l.heroSecondary}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#3B4759]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B4A]" />
                <span>{l.stepOne}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B4A]" />
                <span>{l.stepTwo}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B4A]" />
                <span>{l.stepThree}</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="border border-gray-100 rounded-3xl p-6 space-y-4 bg-orange-50/20">
              <h3 className="text-sm font-semibold text-[#111827]">{l.highlightsTitle}</h3>
              <div className="space-y-3 text-sm text-[#3B4759]">
                {[l.highlightOne, l.highlightTwo, l.highlightThree].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B4A] mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 text-xs text-[#3B4759]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{l.secure}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange-500" />
                  <span>{l.invoice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-8">
          <section>
            <SectionTitle title={l.optionsTitle} subtitle={l.optionsSubtitle} />
            <div className="border border-gray-100 rounded-3xl px-6">
              <OptionRow option={PRICING.premium.smartMatching} isPopular={true} />
              <OptionRow option={PRICING.premium.dataRoom} />
              <OptionRow option={PRICING.premium.ndaProtection} />
            </div>
          </section>

          <section>
            <SectionTitle title={l.photoTitle} subtitle={l.photoSubtitle} />
            <div className="border border-gray-100 rounded-3xl px-6">
              <OptionRow option={PRICING.photos.pack5} />
              <OptionRow option={PRICING.photos.pack15} isBestValue={true} />
            </div>
          </section>

          <section>
            <SectionTitle title={l.contactTitle} subtitle={l.contactSubtitle} />
            <div className="border border-gray-100 rounded-3xl px-6">
              <OptionRow option={PRICING.contacts.unit} />
              <OptionRow option={PRICING.contacts.pack5} />
              <OptionRow option={PRICING.contacts.pack8} isBestValue={true} />
              <OptionRow option={PRICING.contacts.pack10} />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 h-fit">
          <Card className="border border-gray-200 rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#FF6B4A]" />
                <CardTitle className="text-base font-semibold text-[#3B4759]">
                  {l.cartTitle}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-xs text-[#111827]">{l.emptyCart}</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-[#3B4759]">
                          {language === 'fr' ? item.frenchLabel : item.englishLabel}
                        </p>
                        <p className="text-[11px] text-[#111827]">
                          {formatPrice(item.price, language)} × {item.quantity}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="text-[11px] text-red-500 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        {l.remove}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#111827]">Total</span>
                  <span className="text-sm font-semibold text-[#3B4759]">
                    {formatPrice(total, language)}
                  </span>
                </div>
                <Button
                  disabled={cart.length === 0}
                  className="w-full rounded-lg text-xs bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white"
                >
                  {l.checkout}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="text-[11px] text-[#3B4759] space-y-1">
                  <p>{l.secure}</p>
                  <p>{l.invoice}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <section className="mt-10 border-t border-gray-100 pt-8">
        <h3 className="font-display text-lg font-semibold text-[#111827] mb-4">{l.trustTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-[#3B4759]">
          {[l.trustOne, l.trustTwo, l.trustThree].map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-orange-50 text-[#FF6B4A]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-3 flex items-center gap-3 shadow-lg lg:hidden">
        <div className="flex-1">
          <p className="text-[11px] text-[#3B4759]">Total</p>
          <p className="text-sm font-semibold text-[#111827]">{formatPrice(total, language)}</p>
        </div>
        <Button
          disabled={cart.length === 0}
          className="rounded-full bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white text-xs px-5"
        >
          {l.checkout}
        </Button>
      </div>
    </div>
  );
}