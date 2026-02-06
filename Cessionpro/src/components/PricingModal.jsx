import React, { useState } from 'react';
import { X, Check, Zap } from 'lucide-react';
import { PRICING, getPricingLabel, getPricingDescription, formatPrice, getContactPackages, getPhotoPackages } from '@/constants/pricing';
import { Button } from '@/components/ui/button';

/**
 * PricingModal Component
 * Display available packages for purchase
 * Payment integration point (Stripe/PayPal)
 */
export default function PricingModal({
  open,
  onOpenChange,
  type = 'photos', // 'photos' or 'contacts'
  language = 'fr',
  onPurchase,
  loading = false
}) {
  const [selectedPackage, setSelectedPackage] = useState(null);

  if (!open) return null;

  const isPhotos = type === 'photos';
  const packages = isPhotos ? getPhotoPackages() : getContactPackages();
  const heading = isPhotos ? 
    (language === 'fr' ? 'Ajouter des photos' : 'Add More Photos') :
    (language === 'fr' ? 'Acheter des contacts' : 'Buy Contacts');

  const handlePurchase = (pkg) => {
    setSelectedPackage(pkg.id);
    onPurchase?.(pkg);
  };

  const labels = language === 'fr' ? {
    close: 'Fermer',
    buy: 'Acheter maintenant',
    photos: 'photos',
    contacts: 'contacts',
    savings: 'Économisez',
    perUnit: 'par unité'
  } : {
    close: 'Close',
    buy: 'Buy now',
    photos: 'photos',
    contacts: 'contacts',
    savings: 'Save',
    perUnit: 'per unit'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary to-blue-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{heading}</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all ${
                  selectedPackage === pkg.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {/* Best Value Badge */}
                {pkg.savingsPercent > 20 && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {language === 'fr' ? 'Meilleur' : 'Best'}
                  </div>
                )}

                {/* Package Details */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {getPricingLabel(pkg, language)}
                </h3>

                <p className="text-sm text-gray-600 mb-3">
                  {getPricingDescription(pkg, language)}
                </p>

                {/* Price */}
                <div className="mb-3">
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(pkg.price, language)}
                  </p>
                  {pkg.unitPrice && (
                    <p className="text-sm text-gray-500">
                      {formatPrice(pkg.unitPrice, language)} {labels.perUnit}
                    </p>
                  )}
                </div>

                {/* Savings */}
                {pkg.savingsPercent > 0 && (
                  <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-700">
                      {labels.savings} {formatPrice(pkg.savingsAmount, language)}
                      <span className="text-xs ml-1">({pkg.savingsPercent}%)</span>
                    </p>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-gray-900">
                    {pkg.quantity} {isPhotos ? labels.photos : labels.contacts}
                  </p>
                </div>

                {/* Select Button */}
                <button
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                    selectedPackage === pkg.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {selectedPackage === pkg.id ? '✓ ' + labels.buy : labels.buy}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-gray-900 mb-3">
              {language === 'fr' ? 'Questions fréquentes' : 'Frequently Asked'}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{language === 'fr' ? 'Les crédits n\'expirent jamais' : 'Credits never expire'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{language === 'fr' ? 'Paiement sécurisé via Stripe' : 'Secure payment via Stripe'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{language === 'fr' ? 'Facture automatique envoyée' : 'Automatic invoice sent'}</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {labels.close}
            </Button>
            <Button
              onClick={() => {
                if (selectedPackage) {
                  const pkg = packages.find(p => p.id === selectedPackage);
                  handlePurchase(pkg);
                }
              }}
              disabled={!selectedPackage || loading}
              className="flex-1 bg-gradient-to-r from-primary to-blue-600"
            >
              {loading ? '...' : labels.buy}
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            {language === 'fr' 
              ? 'En achetant, vous acceptez nos conditions de service'
              : 'By purchasing, you accept our terms of service'}
          </p>
        </div>
      </div>
    </div>
  );
}
