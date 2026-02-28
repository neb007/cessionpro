// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { ArrowRight, Banknote, Calculator, Landmark, Sparkles } from 'lucide-react';
import SEO from '@/components/SEO';

export default function Outils() {
  const { language } = useLanguage();

  const tools = [
    {
      icon: Calculator,
      title: language === 'fr' ? 'Valorisation vendeur' : 'Seller valuation',
      desc:
        language === 'fr'
          ? 'Estimez une fourchette de valorisation avec les approches marché, rentabilité et patrimoniale.'
          : 'Estimate a valuation range using market, profitability and asset-based approaches.',
      path: createPageUrl('Valuations')
    },
    {
      icon: Landmark,
      title: language === 'fr' ? 'Financement de reprise' : 'Acquisition financing',
      desc:
        language === 'fr'
          ? 'Évaluez la faisabilité du montage, la dette supportable, le DSCR et le cash post-reprise.'
          : 'Assess deal feasibility, debt capacity, DSCR and post-acquisition cash flow.',
      path: createPageUrl('Financing')
    },
    {
      icon: Banknote,
      title: language === 'fr' ? 'Produit net de cession' : 'Net sale proceeds',
      desc:
        language === 'fr'
          ? 'Estimez le montant réellement encaissé après fiscalité, frais et scénarios PFU/barème.'
          : 'Estimate actual proceeds after taxes, fees and PFU/progressive bracket scenarios.',
      path: createPageUrl('Targeting')
    }
  ];

  return (
    <div className="bg-[#FAF9F7]">
      <SEO pageName="Outils" />
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="sm" showText={false} />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                to={createPageUrl('Outils')}
                className="text-[#3B4759] hover:text-primary transition-colors"
                style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}
              >
                {language === 'fr' ? 'Outils' : 'Tools'}
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/Login"
                className="text-gray-900 hover:text-gray-700 font-medium transition-colors px-4 py-2"
                style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}
              >
                {language === 'fr' ? 'Se connecter' : 'Login'}
              </Link>
              <Link to="/AccountCreation">
                <Button
                  className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-white"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}
                >
                  {language === 'fr' ? 'Créer un compte' : 'Sign up'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            {language === 'fr' ? 'Boîte à outils Riviqo' : 'Riviqo toolbox'}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
            {language === 'fr' ? 'Nos 3 outils pour acheteurs et vendeurs' : 'Our 3 tools for buyers and sellers'}
          </h1>
          <p className="text-[#6B7A94] mt-3 max-w-3xl mx-auto">
            {language === 'fr'
              ? 'Accédez à des simulateurs concrets pour piloter votre valorisation, votre montage de financement et votre produit net de cession.'
              : 'Use practical simulators to manage valuation, financing structure and net sale proceeds.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.title} to={tool.path} className="block h-full">
              <Card className="h-full border border-[#F3E9E4] shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                <CardContent className="p-7">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center mb-5">
                    <tool.icon className="w-6 h-6 text-[#FF6B4A]" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#3B4759] mb-2">{tool.title}</h3>
                  <p className="text-[#6B7A94] mb-5">{tool.desc}</p>
                  <span className="inline-flex items-center gap-2 text-[#FF6B4A] font-medium">
                    {language === 'fr' ? 'Utiliser cet outil' : 'Use this tool'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="border border-[#F2E8E2] bg-white shadow-sm">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-display text-lg font-semibold text-[#3B4759]">
                {language === 'fr' ? 'Un accompagnement humain, de A à Z' : 'Human support, end-to-end'}
              </p>
              <p className="text-sm text-[#6B7A94] mt-1">
                {language === 'fr'
                  ? 'De la première analyse à la signature, Riviqo vous accompagne avec un expert dédié pour votre acquisition ou votre cession.'
                  : 'From first analysis to signature, Riviqo supports your acquisition or sale with a dedicated expert.'}
              </p>
            </div>
            <Link to={createPageUrl('Contact')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white whitespace-nowrap">
                {language === 'fr' ? 'Contacter notre équipe' : 'Contact our team'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
