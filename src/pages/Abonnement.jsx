// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { PRICING, formatPrice } from '@/constants/pricing';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const STORAGE_KEY = 'riviqo_checkout_payload';

const getOptionGroups = () => ({
  premium: [PRICING.premium.smartMatching, PRICING.premium.sponsoredListing].filter(Boolean),
  photos: [PRICING.photos.pack5, PRICING.photos.pack15].filter(Boolean),
  contacts: [PRICING.contacts.unit, PRICING.contacts.pack5, PRICING.contacts.pack8, PRICING.contacts.pack10].filter(Boolean)
});

const flattenOptions = (groups) => Object.values(groups).flat();

export default function Abonnement() {
  const { language } = useLanguage();
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

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
      unavailable: 'Indisponible'
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
      unavailable: 'Unavailable'
    }
  };

  const l = labels[language] || labels.fr;
  const optionGroups = useMemo(() => getOptionGroups(), []);
  const options = useMemo(() => flattenOptions(optionGroups), [optionGroups]);
  const [selectedId, setSelectedId] = useState(options[0]?.id || '');
  const selectedOption = useMemo(() => options.find((x) => x.id === selectedId) || options[0], [options, selectedId]);

  const getQty = (id) => Math.max(1, Number(quantities[id] || 1));

  const setQty = (id, qty) => {
    const next = Math.max(1, Math.min(20, Number(qty || 1)));
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
    <div className="w-full px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827]">{l.title}</h1>
        <p className="text-sm text-[#3B4759] mt-1">{l.subtitle}</p>
      </div>

      <div className="border border-gray-200 rounded-2xl bg-white p-4 sm:p-5 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#3B4759]">{l.chooseService}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full border border-gray-200 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-[#FF6B4A] transition-colors">
                <span>
                  <span className="block text-sm font-medium text-[#111827]">
                    {selectedOption
                      ? language === 'fr'
                        ? selectedOption.frenchLabel
                        : selectedOption.englishLabel
                      : l.chooseService}
                  </span>
                  {selectedOption ? (
                    <span className="block text-xs text-[#3B4759]">
                      {formatPrice(selectedOption.price, language)} • {billingLabel(selectedOption.billingCycle)}
                    </span>
                  ) : null}
                </span>
                <ChevronDown className="w-4 h-4 text-[#3B4759]" />
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
                <p className="text-sm font-semibold text-[#111827]">
                  {language === 'fr' ? selectedOption.frenchLabel : selectedOption.englishLabel}
                </p>
                <p className="text-xs text-[#3B4759]">{l.details}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-[#111827]">{formatPrice(selectedOption.price, language)}</p>
                <p className="text-xs text-[#3B4759]">{billingLabel(selectedOption.billingCycle)}</p>
              </div>
            </div>

            <p className="text-sm text-[#3B4759]">
              {language === 'fr' ? selectedOption.frenchDescription : selectedOption.englishDescription}
            </p>

            {Array.isArray(selectedOption.features?.[language] || selectedOption.features?.fr) && (
              <ul className="text-xs text-[#3B4759] list-disc pl-4 space-y-1">
                {(selectedOption.features?.[language] || selectedOption.features?.fr).slice(0, 3).map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
              <div>
                <p className="text-xs font-semibold text-[#3B4759] mb-1">{l.quantity}</p>
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
        <h2 className="text-sm font-semibold text-[#111827]">{l.selectedTitle}</h2>
        {selectedItems.length === 0 ? (
          <p className="text-sm text-[#3B4759]">{l.empty}</p>
        ) : (
          <div className="space-y-1">
            {selectedItems.map((item) => (
              <div key={item.id} className="text-sm text-[#3B4759] flex justify-between">
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
          <span className="text-sm text-[#3B4759]">{l.total}</span>
          <span className="text-xl font-semibold text-[#111827]">{formatPrice(total, language)}</span>
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
