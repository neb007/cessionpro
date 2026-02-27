// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Zap, Image, Images, User, Users, Database, Shield, AlertCircle, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { PRICING, formatPrice } from '@/constants/pricing';
import SEO from '@/components/SEO';

const ADVISORY_PLANS = [
  {
    titleFr: 'Accompagnement Cédant',
    titleEn: 'Seller Support',
    descFr: "De la valorisation au closing — un expert M&A dédié pour maximiser votre prix de cession.",
    descEn: "From valuation to closing — a dedicated M&A expert to maximize your sale price.",
    featuresFr: [
      'Valorisation multi-méthodes et retraitements',
      'Rédaction du mémo d\'information',
      'Data Room constituée et gérée',
      'Matching repreneurs qualifiés',
      'Accompagnement négociation & closing',
    ],
    featuresEn: [
      'Multi-method valuation and restatements',
      'Information memo drafting',
      'Data Room setup and management',
      'Qualified buyer matching',
      'Negotiation & closing support',
    ],
    badgeFr: 'Pour cédants',
    badgeEn: 'For sellers',
  },
  {
    titleFr: 'Accompagnement Repreneur',
    titleEn: 'Buyer Support',
    descFr: "Du sourcing au closing — identification de cibles, due diligence et structuration du financement.",
    descEn: "From sourcing to closing — target identification, due diligence and financing structure.",
    featuresFr: [
      'Sourcing et qualification de cibles',
      'Analyse financière et due diligence',
      'Simulation de financement (DSCR)',
      'Accompagnement négociation LOI/SPA',
      'Support closing et post-reprise',
    ],
    featuresEn: [
      'Target sourcing and qualification',
      'Financial analysis and due diligence',
      'Financing simulation (DSCR)',
      'LOI/SPA negotiation support',
      'Closing and post-acquisition support',
    ],
    badgeFr: 'Pour repreneurs',
    badgeEn: 'For buyers',
    popular: true,
  },
  {
    titleFr: 'Accès Conseil Professionnel',
    titleEn: 'Professional Advisor Access',
    descFr: "Pour cabinets M&A, experts-comptables et avocats : multi-dossiers, data room, co-conseil.",
    descEn: "For M&A firms, accountants and lawyers: multi-file, data room, co-advisory.",
    featuresFr: [
      'Tableau de bord multi-mandats',
      'Data Room et NDA pour tous vos dossiers',
      'Messagerie transactionnelle sécurisée',
      'Co-conseil et réseau d\'experts',
      'Facturation et suivi honoraires',
    ],
    featuresEn: [
      'Multi-mandate dashboard',
      'Data Room and NDA for all your files',
      'Secure transactional messaging',
      'Co-advisory and expert network',
      'Billing and fee tracking',
    ],
    badgeFr: 'Pour conseils',
    badgeEn: 'For advisors',
  },
];

export default function Pricing() {
  const { language } = useLanguage();
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  const labels = {
    fr: {
      photoPackages: 'Packs Photos Supplémentaires',
      photoSubtitle: 'Complétez votre annonce avec plus de visuels',
      contactPackages: 'Packs de Mise en Relation',
      contactSubtitle: 'Contactez les profils intéressés par vos annonces',
      optionsTitle: 'Options à la Carte',
      optionsSubtitle: 'Boostez la visibilité de vos annonces',
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
      contactSubtitle: 'Contact profiles interested in your listings',
      optionsTitle: 'A La Carte Options',
      optionsSubtitle: 'Boost the visibility of your listings',
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
                <p className="text-xs text-[#111827] mt-0.5 leading-relaxed">
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
                  <span className={`text-xs ${isPopular ? 'text-[#FF6B4A]' : 'text-[#111827]'}`}>
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
                      <span className="text-[#111827]">{feature}</span>
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
      star: Star,
    };
    return icons[iconName];
  };

  // Section title
  const SectionTitle = ({ title, subtitle }) => (
    <div className="text-center mb-6">
      <h2 className="font-display text-lg font-bold text-[#3B4759] mb-1">
        {title}
      </h2>
      <p className="text-[#111827] text-xs">
        {subtitle}
      </p>
    </div>
  );

  return (
    <div className="py-4 px-0">
      <SEO pageName="Pricing" />
      <div className="max-w-5xl mx-auto">

        {/* FREE PLAN SECTION */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50/80 to-white p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-display text-xl font-bold text-[#3B4759]">
                    {language === 'fr' ? 'Plan Gratuit' : 'Free Plan'}
                  </h2>
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                    {language === 'fr' ? 'Inclus' : 'Included'}
                  </Badge>
                </div>
                <p className="text-sm text-[#6B7A94] mb-4">
                  {language === 'fr' ? PRICING.free.frenchDescription : PRICING.free.englishDescription}
                </p>
                <div className="flex flex-wrap gap-3">
                  {(PRICING.free.features[language] || PRICING.free.features.fr).map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-sm text-[#3B4759]">
                      <Check className="w-4 h-4 text-green-600 shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center sm:text-right shrink-0">
                <span className="font-display text-4xl font-bold text-green-600">0€</span>
                <p className="text-xs text-[#6B7A94] mt-1">{language === 'fr' ? 'pour toujours' : 'forever'}</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ADVISORY SECTION */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-4">
              <Star className="w-3.5 h-3.5" />
              Riviqo Advisory
            </div>
            <h2 className="font-display text-2xl font-bold text-[#3B4759] mb-2">
              {language === 'fr' ? 'Accompagnement expert de A à Z' : 'Expert support from A to Z'}
            </h2>
            <p className="text-[#6B7A94] text-sm max-w-xl mx-auto">
              {language === 'fr'
                ? "Nos formules Advisory vous donnent accès à un expert M&A dédié pour piloter votre opération."
                : "Our Advisory packages give you access to a dedicated M&A expert to manage your transaction."}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {ADVISORY_PLANS.map((plan) => (
              <div
                key={plan.titleFr}
                className={`rounded-2xl border p-6 flex flex-col ${
                  plan.popular
                    ? 'border-[#FF6B4A] bg-[#FFF4F1]'
                    : 'border-[#F0ECE6] bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FF6B4A] text-white text-xs font-semibold rounded-full">
                      <Star className="w-3 h-3" />
                      {language === 'fr' ? 'Le plus demandé' : 'Most requested'}
                    </span>
                  </div>
                )}
                <div className="mb-1">
                  <span className="text-xs font-medium text-[#FF6B4A]">{language === 'fr' ? plan.badgeFr : plan.badgeEn}</span>
                </div>
                <h3 className="font-display font-bold text-[#3B4759] text-lg mb-2">{language === 'fr' ? plan.titleFr : plan.titleEn}</h3>
                <p className="text-sm text-[#6B7A94] mb-5 leading-relaxed">{language === 'fr' ? plan.descFr : plan.descEn}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {(language === 'fr' ? plan.featuresFr : plan.featuresEn).map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#3B4759]">
                      <Check className="w-4 h-4 text-[#FF6B4A] flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <div className="mb-3 text-center">
                  <span className="font-display font-bold text-2xl text-[#FF6B4A]">{language === 'fr' ? 'Sur mesure' : 'Custom'}</span>
                </div>
                <Link to={createPageUrl('Contact')}>
                  <Button className={`w-full rounded-full font-display font-semibold text-sm ${
                    plan.popular
                      ? 'bg-[#FF6B4A] hover:bg-[#FF5733] text-white'
                      : 'bg-white hover:bg-[#FFF0ED] text-[#FF6B4A] border border-[#FF6B4A]/30'
                  }`}>
                    {language === 'fr' ? 'Nous contacter' : 'Contact us'}
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* DIVIDER */}
        <div className="border-t border-[#F0ECE6] mb-10">
          <div className="text-center -mt-3">
            <span className="bg-[#FAF9F7] px-4 text-xs text-[#9EABC1] font-medium">
              {language === 'fr' ? 'Options pour vos annonces' : 'Options for your listings'}
            </span>
          </div>
        </div>

        {/* PREMIUM OPTIONS SECTION */}
        <section className="mb-10">
          <SectionTitle title={l.optionsTitle} subtitle={l.optionsSubtitle} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <PricingCard 
              option={PRICING.premium.smartMatching} 
              isPopular={true}
            />
            <PricingCard option={PRICING.premium.sponsoredListing} />
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
                <p className="text-[#111827] text-xs mb-3">
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
            <p className="text-[#111827] text-xs mb-3">
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
