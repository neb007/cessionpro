// @ts-nocheck
import React, { useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Zap, Image, Images, User, Users, Database, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PRICING, formatPrice } from '@/constants/pricing';

export default function Pricing() {
  const { language } = useLanguage();
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  const labels = {
    fr: {
      photoPackages: 'Packs Photos Supplémentaires',
      photoSubtitle: 'Complétez votre annonce avec plus de visuels',
      contactPackages: 'Packs de Mise en Relation',
      contactSubtitle: 'Contactez les profils en dehors de votre quota',
      optionsTitle: 'Options à la Carte',
      optionsSubtitle: 'Complétez votre plan avec des fonctionnalités avancées',
      verifiedTitle: 'Badge "Annonce Vérifiée"',
      verifiedDesc: 'Obtenez le badge de certification pour augmenter la confiance des acheteurs/vendeurs',
      badge: 'Obtenez le badge de certification',
      requirements: 'Conditions requises :',
      contactTeam: 'Des questions sur nos tarifs ?',
      contactButton: 'Contactez notre équipe',
      activate: 'Activer',
      comingSoon: 'Disponible prochainement',
      perMonth: '/mois',
      perYear: '/an',
      oneTime: '(paiement unique)',
      photos: 'photos',
      contacts: 'contacts',
      dataRoomWithBilans: 'Data Room avec les 3 derniers bilans',
      profileComplete: 'Profil utilisateur complété à 100%',
      identityCertified: 'Identité certifiée par la plateforme'
    },
    en: {
      photoPackages: 'Additional Photo Packages',
      photoSubtitle: 'Complete your listing with more visuals',
      contactPackages: 'Contact Packages',
      contactSubtitle: 'Contact profiles outside your quota',
      optionsTitle: 'A La Carte Options',
      optionsSubtitle: 'Enhance your plan with advanced features',
      verifiedTitle: '"Verified Announcement" Badge',
      verifiedDesc: 'Get the certification badge to increase buyer/seller confidence',
      badge: 'Get the certification badge',
      requirements: 'Required acquisitions:',
      contactTeam: 'Questions about our pricing?',
      contactButton: 'Contact our team',
      activate: 'Activate',
      comingSoon: 'Coming soon',
      perMonth: '/month',
      perYear: '/year',
      oneTime: '(one-time payment)',
      photos: 'photos',
      contacts: 'contacts',
      dataRoomWithBilans: 'Data Room with 3 last bilans',
      profileComplete: 'User profile 100% completed',
      identityCertified: 'Identity certified by platform'
    }
  };

  const l = labels[language];

  // Generic card component
  const PricingCard = ({ option, isPopular = false, hasTooltip = false, tooltipText = '' }) => {
    const Icon = getIconByName(option.icon);
    const iconBg = isPopular ? 'bg-[#FF6B4A] text-white' : 'bg-gray-100 text-[#3B4759]';
    const borderColor = isPopular ? 'border-[#FF6B4A]' : 'border-gray-200';
    const buttonColor = isPopular
      ? 'bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white'
      : 'bg-white hover:bg-gray-50 text-[#3B4759]';

    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <Card
          className={`h-full border transition-all rounded-xl ${borderColor} ${
            hasTooltip ? 'opacity-70' : 'hover:shadow-sm'
          }`}
        >
          {/* Popular Badge */}
          {isPopular && (
            <div className="absolute -top-3 left-5 z-10">
              <Badge className="bg-[#FF6B4A] text-white border-0 px-3 py-1 text-xs">
                {language === 'fr' ? 'Populaire' : 'Popular'}
              </Badge>
            </div>
          )}

          {/* Coming Soon Icon */}
          {hasTooltip && (
            <div className="absolute top-4 right-4 z-20">
              <div
                className="relative inline-block"
                onMouseEnter={() => setHoveredTooltip(option.id)}
                onMouseLeave={() => setHoveredTooltip(null)}
              >
                <AlertCircle className="w-5 h-5 text-amber-500 cursor-help" />
                {hoveredTooltip === option.id && (
                  <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
                    {tooltipText}
                  </div>
                )}
              </div>
            </div>
          )}

          <CardHeader className={`pb-2 ${isPopular ? 'pt-6' : 'pt-4'}`}>
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-lg ${iconBg} flex-shrink-0`}>
                {Icon && <Icon className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <CardTitle className={`text-base font-semibold ${isPopular ? 'text-[#FF6B4A]' : 'text-[#3B4759]'}`}>
                  {language === 'fr' ? option.frenchLabel : option.englishLabel}
                </CardTitle>
                <p className="text-xs text-[#6B7A94] mt-0.5 leading-relaxed">
                  {language === 'fr' ? option.frenchDescription : option.englishDescription}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {/* Price */}
              <div className="border-t border-gray-100 pt-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#FF6B4A]">
                    {formatPrice(option.price, language)}
                  </span>
                  <span className={`text-xs ${isPopular ? 'text-[#FF6B4A]' : 'text-[#6B7A94]'}`}>
                    {option.billingCycle === 'monthly'
                      ? l.perMonth
                      : option.billingCycle === 'yearly'
                      ? l.perYear
                      : l.oneTime}
                  </span>
                </div>
              </div>

              {/* Features */}
              {option.features && (
                <div className="space-y-1">
                  {(option.features[language] || option.features.fr).map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <Check className="w-4 h-4 text-[#FF6B4A] flex-shrink-0 mt-0.5" />
                      <span className="text-[#6B7A94]">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity for packages */}
              {option.quantity && !option.features && (
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF6B4A]" />
                  <span className="text-xs font-medium text-[#3B4759]">
                    {option.quantity} {option.quantity === 1 ? (option.icon === 'user' ? l.contacts.slice(0, -1) : l.photos.slice(0, -1)) : (option.icon === 'user' ? l.contacts : l.photos)}
                  </span>
                </div>
              )}

              {/* Button */}
              <Button
                disabled={hasTooltip}
                className={`w-full rounded-lg font-medium text-xs ${buttonColor} border border-gray-200 ${hasTooltip ? 'cursor-not-allowed' : ''}`}
              >
                {l.activate}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Get icon
  const getIconByName = (iconName) => {
    const icons = {
      zap: Zap,
      image: Image,
      images: Images,
      user: User,
      users: Users,
      database: Database,
      shield: Shield,
    };
    return icons[iconName];
  };

  // Section title
  const SectionTitle = ({ title, subtitle }) => (
    <div className="text-center mb-6">
      <h2 className="font-display text-lg font-bold text-[#3B4759] mb-1">
        {title}
      </h2>
      <p className="text-[#6B7A94] text-xs">
        {subtitle}
      </p>
    </div>
  );

  return (
    <div className="py-4 px-0">
      <div className="max-w-5xl mx-auto">
        {/* PREMIUM OPTIONS SECTION */}
        <section className="mb-10">
          <SectionTitle title={l.optionsTitle} subtitle={l.optionsSubtitle} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <PricingCard 
              option={PRICING.premium.smartMatching} 
              isPopular={true}
            />
            <PricingCard 
              option={PRICING.premium.dataRoom}
              hasTooltip={true}
              tooltipText={language === 'fr' ? 'Disponible prochainement' : 'Coming soon'}
            />
            <PricingCard 
              option={PRICING.premium.ndaProtection}
              hasTooltip={true}
              tooltipText={language === 'fr' ? 'Disponible prochainement' : 'Coming soon'}
            />
          </div>
        </section>

        {/* PHOTO PACKAGES SECTION */}
        <section className="mb-10">
          <SectionTitle title={l.photoPackages} subtitle={l.photoSubtitle} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <PricingCard option={PRICING.photos.pack5} />
            <PricingCard option={PRICING.photos.pack15} />
          </div>
        </section>

        {/* CONTACT PACKAGES SECTION */}
        <section className="mb-10">
          <SectionTitle title={l.contactPackages} subtitle={l.contactSubtitle} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <PricingCard option={PRICING.contacts.unit} />
            <PricingCard option={PRICING.contacts.pack5} />
            <PricingCard option={PRICING.contacts.pack8} />
            <PricingCard option={PRICING.contacts.pack10} />
          </div>
        </section>

        {/* VERIFIED BADGE SECTION */}
        <section className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-lg p-5"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-[#3B4759] mb-1.5">
                  {l.verifiedTitle}
                </h3>
                <p className="text-[#6B7A94] text-xs mb-3">
                  {l.verifiedDesc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[l.dataRoomWithBilans, l.profileComplete, l.identityCertified].map((req, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-md">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs text-[#3B4759]">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA SECTION */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <p className="text-[#6B7A94] text-xs mb-3">
              {l.contactTeam}
            </p>
            <Button className="bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white px-6 py-2 rounded-lg text-xs">
              {l.contactButton}
            </Button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
