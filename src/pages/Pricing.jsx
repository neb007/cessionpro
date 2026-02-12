import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pricing() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const sellerPlans = [
    {
      name: language === 'fr' ? 'Gratuit' : 'Free',
      price: 0,
      period: language === 'fr' ? '/mois' : '/month',
      features: [
        language === 'fr' ? '1 annonce active' : '1 active listing',
        language === 'fr' ? 'Photos limitées (3 max)' : 'Limited photos (3 max)',
        language === 'fr' ? 'Messagerie basique' : 'Basic messaging',
        language === 'fr' ? 'Statistiques basiques' : 'Basic statistics',
      ],
      cta: language === 'fr' ? 'Commencer' : 'Get Started',
      popular: false,
    },
    {
      name: 'Starter',
      price: 29,
      period: language === 'fr' ? '/mois' : '/month',
      features: [
        language === 'fr' ? '5 annonces actives' : '5 active listings',
        language === 'fr' ? 'Photos illimitées' : 'Unlimited photos',
        language === 'fr' ? 'Messagerie avancée' : 'Advanced messaging',
        language === 'fr' ? 'Statistiques détaillées' : 'Detailed statistics',
        language === 'fr' ? 'Badge "Vendeur vérifié"' : '"Verified Seller" badge',
      ],
      cta: language === 'fr' ? 'Choisir Starter' : 'Choose Starter',
      popular: false,
    },
    {
      name: 'Pro',
      price: 79,
      period: language === 'fr' ? '/mois' : '/month',
      features: [
        language === 'fr' ? 'Annonces illimitées' : 'Unlimited listings',
        language === 'fr' ? 'Mise en avant premium' : 'Premium highlighting',
        language === 'fr' ? 'Accès annuaire repreneurs' : 'Buyers directory access',
        language === 'fr' ? 'Support prioritaire' : 'Priority support',
        language === 'fr' ? 'Analyses avancées' : 'Advanced analytics',
        language === 'fr' ? 'Badge "Vendeur Pro"' : '"Pro Seller" badge',
      ],
      cta: language === 'fr' ? 'Choisir Pro' : 'Choose Pro',
      popular: true,
    },
  ];

  const buyerPlans = [
    {
      name: 'Discovery',
      price: 0,
      period: language === 'fr' ? '/mois' : '/month',
      features: [
        language === 'fr' ? 'Recherche d\'annonces' : 'Search listings',
        language === 'fr' ? 'Favoris illimités' : 'Unlimited favorites',
        language === 'fr' ? 'Contact vendeurs' : 'Contact sellers',
        language === 'fr' ? 'Alertes par email' : 'Email alerts',
      ],
      cta: language === 'fr' ? 'Commencer' : 'Get Started',
      popular: false,
    },
    {
      name: 'Premium',
      price: 19,
      period: language === 'fr' ? '/mois' : '/month',
      features: [
        language === 'fr' ? 'Tout de Discovery' : 'All Discovery features',
        language === 'fr' ? 'Accès annonces premium' : 'Premium listings access',
        language === 'fr' ? 'Profil dans l\'annuaire' : 'Directory profile',
        language === 'fr' ? 'Alertes avancées' : 'Advanced alerts',
        language === 'fr' ? 'Matching intelligent' : 'Smart matching',
      ],
      cta: language === 'fr' ? 'Choisir Premium' : 'Choose Premium',
      popular: true,
    },
    {
      name: 'Expert',
      price: 49,
      period: language === 'fr' ? '/mois' : '/month',
      features: [
        language === 'fr' ? 'Tout de Premium' : 'All Premium features',
        language === 'fr' ? 'Analyse financière détaillée' : 'Detailed financial analysis',
        language === 'fr' ? 'Conseiller dédié' : 'Dedicated advisor',
        language === 'fr' ? 'Accès prioritaire aux nouvelles annonces' : 'Priority access to new listings',
        language === 'fr' ? 'Rapports de marché' : 'Market reports',
      ],
      cta: language === 'fr' ? 'Choisir Expert' : 'Choose Expert',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#3B4759] mb-4">
            {language === 'fr' ? 'Tarifs simples et transparents' : 'Simple and transparent pricing'}
          </h1>
          <p className="text-lg text-[#6B7A94] max-w-2xl mx-auto">
            {language === 'fr'
              ? 'Choisissez le plan qui correspond à vos besoins'
              : 'Choose the plan that fits your needs'}
          </p>
        </div>

        {/* Seller Plans */}
        <div className="mb-20">
          <h2 className="font-display text-3xl font-bold text-[#3B4759] mb-8 text-center">
            {language === 'fr' ? 'Plans Vendeurs' : 'Seller Plans'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sellerPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative h-full border-0 ${plan.popular ? 'shadow-2xl ring-2 ring-[#FF6B4A]' : 'shadow-lg'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] text-white border-0 px-4 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {language === 'fr' ? 'Populaire' : 'Popular'}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-8 pt-8">
                    <CardTitle className="font-display text-2xl text-[#3B4759]">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="font-display text-5xl font-bold text-[#3B4759]">{plan.price}€</span>
                      <span className="text-[#6B7A94] ml-2">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#FF6B4A] mt-0.5 flex-shrink-0" />
                          <span className="text-[#6B7A94]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => navigate(createPageUrl('CreateBusiness'))}
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] hover:from-[#FF5A3A] hover:to-[#FF7F5D] text-white shadow-lg shadow-[#FF6B4A]/25'
                          : 'bg-[#3B4759] hover:bg-[#2C3544] text-white'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Buyer Plans */}
        <div>
          <h2 className="font-display text-3xl font-bold text-[#3B4759] mb-8 text-center">
            {language === 'fr' ? 'Plans Repreneurs' : 'Buyer Plans'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {buyerPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative h-full border-0 ${plan.popular ? 'shadow-2xl ring-2 ring-[#FF6B4A]' : 'shadow-lg'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] text-white border-0 px-4 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {language === 'fr' ? 'Populaire' : 'Popular'}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-8 pt-8">
                    <CardTitle className="font-display text-2xl text-[#3B4759]">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="font-display text-5xl font-bold text-[#3B4759]">{plan.price}€</span>
                      <span className="text-[#6B7A94] ml-2">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#FF6B4A] mt-0.5 flex-shrink-0" />
                          <span className="text-[#6B7A94]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => navigate(createPageUrl('Businesses'))}
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] hover:from-[#FF5A3A] hover:to-[#FF7F5D] text-white shadow-lg shadow-[#FF6B4A]/25'
                          : 'bg-[#3B4759] hover:bg-[#2C3544] text-white'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}