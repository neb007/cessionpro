// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, FileText, TrendingUp, Landmark, Calculator } from 'lucide-react';
import SEO from '@/components/SEO';

const ARTICLES = [
  {
    slug: 'GuideCession',
    icon: FileText,
    titleFr: 'Guide complet de la cession d\'entreprise',
    titleEn: 'Complete guide to selling a business',
    descFr: 'Tout savoir pour vendre votre entreprise : préparation, valorisation, timing, négociation et fiscalité. Un guide pas-à-pas pour maximiser la valeur de votre cession.',
    descEn: 'Everything you need to know to sell your business: preparation, valuation, timing, negotiation and taxation. A step-by-step guide to maximize the value of your sale.',
    categoryFr: 'Guide',
    categoryEn: 'Guide',
    readTimeFr: '25 min de lecture',
    readTimeEn: '25 min read',
  },
  {
    slug: 'GuideRepreneur',
    icon: Landmark,
    titleFr: 'Guide complet de la reprise d\'entreprise',
    titleEn: 'Complete guide to buying a business',
    descFr: 'Du projet au closing : sourcing, due diligence, financement et négociation. Le guide indispensable pour réussir votre première acquisition.',
    descEn: 'From project to closing: sourcing, due diligence, financing and negotiation. The essential guide to succeeding in your first acquisition.',
    categoryFr: 'Guide',
    categoryEn: 'Guide',
    readTimeFr: '30 min de lecture',
    readTimeEn: '30 min read',
  },
  {
    slug: 'Valuations',
    icon: Calculator,
    titleFr: 'Comment valoriser une entreprise : les 3 méthodes essentielles',
    titleEn: 'How to value a business: 3 essential methods',
    descFr: 'Découvrez les méthodes de valorisation (multiples, DCF, patrimoniale) et estimez la valeur de votre entreprise avec notre simulateur gratuit.',
    descEn: 'Discover valuation methods (multiples, DCF, asset-based) and estimate your business value with our free simulator.',
    categoryFr: 'Outil',
    categoryEn: 'Tool',
    readTimeFr: '10 min de lecture',
    readTimeEn: '10 min read',
  },
  {
    slug: 'Financing',
    icon: TrendingUp,
    titleFr: 'Financer une reprise d\'entreprise : le guide du montage financier',
    titleEn: 'Financing a business acquisition: the financial structuring guide',
    descFr: 'Capacité d\'emprunt, DSCR, apport personnel, dette senior — tout comprendre pour monter un plan de financement solide. Simulateur inclus.',
    descEn: 'Borrowing capacity, DSCR, personal contribution, senior debt — understand everything to build a solid financing plan. Simulator included.',
    categoryFr: 'Outil',
    categoryEn: 'Tool',
    readTimeFr: '12 min de lecture',
    readTimeEn: '12 min read',
  },
  {
    slug: 'Targeting',
    icon: BookOpen,
    titleFr: 'Fiscalité de la cession : calculer son produit net',
    titleEn: 'Sale taxation: calculating your net proceeds',
    descFr: 'PFU vs barème progressif, abattements pour durée de détention, plus-values — calculez précisément ce que vous toucherez après impôts.',
    descEn: 'Flat tax vs progressive scale, holding period allowances, capital gains — precisely calculate what you will receive after taxes.',
    categoryFr: 'Outil',
    categoryEn: 'Tool',
    readTimeFr: '8 min de lecture',
    readTimeEn: '8 min read',
  },
];

export default function Blog() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <SEO pageName="Blog" />
      {/* Hero */}
      <section className="bg-[#FAF9F7] pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            {isFr ? 'Ressources & Guides' : 'Resources & Guides'}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B4759] leading-tight mb-6">
            {isFr ? 'Blog Riviqo' : 'Riviqo Blog'}
          </h1>
          <p className="text-lg text-[#6B7A94] max-w-2xl mx-auto leading-relaxed">
            {isFr
              ? "Guides, analyses et conseils d'experts pour réussir votre cession ou reprise d'entreprise. Contenus gratuits rédigés par des professionnels M&A."
              : "Guides, analysis and expert advice to succeed in your business sale or acquisition. Free content written by M&A professionals."}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {ARTICLES.map((article) => (
              <Link
                key={article.slug}
                to={createPageUrl(article.slug)}
                className="group bg-white rounded-2xl border border-[#F0ECE6] p-7 hover:border-[#FF6B4A]/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0ED] flex items-center justify-center">
                    <article.icon className="w-5 h-5 text-[#FF6B4A]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A] font-display">
                    {isFr ? article.categoryFr : article.categoryEn}
                  </span>
                </div>
                <h2 className="font-display font-semibold text-lg text-[#3B4759] mb-3 group-hover:text-[#FF6B4A] transition-colors">
                  {isFr ? article.titleFr : article.titleEn}
                </h2>
                <p className="text-sm text-[#6B7A94] leading-relaxed mb-4">
                  {isFr ? article.descFr : article.descEn}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9EABC1]">
                    {isFr ? article.readTimeFr : article.readTimeEn}
                  </span>
                  <span className="text-sm font-medium text-[#FF6B4A] flex items-center gap-1 group-hover:gap-2 transition-all">
                    {isFr ? 'Lire' : 'Read'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#3B4759]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            {isFr ? 'Prêt à passer à l\'action ?' : 'Ready to take action?'}
          </h2>
          <p className="text-[#B7C2D4] mb-8 max-w-xl mx-auto">
            {isFr
              ? "Utilisez nos outils gratuits pour concrétiser votre projet de cession ou de reprise d'entreprise."
              : "Use our free tools to bring your business sale or acquisition project to life."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Outils')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold">
                {isFr ? 'Découvrir les outils' : 'Discover tools'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-display font-semibold border-white/30 text-white hover:bg-white/10">
                {isFr ? 'Parler à un expert' : 'Talk to an expert'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
