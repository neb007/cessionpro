// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, CheckCircle2, TrendingUp, Search, Calculator,
  Landmark, Handshake, ChevronDown, BarChart2, ShieldCheck, Lightbulb
} from 'lucide-react';
import SEO from '@/components/SEO';

const STEPS = [
  {
    num: '01',
    titleFr: 'Définir son projet',
    titleEn: 'Define your project',
    descFr: "Secteur, taille, localisation, capacité d'apport personnel et objectif de chiffre d'affaires — clarifiez votre cible avant de chercher.",
    descEn: 'Sector, size, location, personal contribution capacity and revenue target — clarify your target before searching.',
    icon: Lightbulb,
  },
  {
    num: '02',
    titleFr: 'Trouver la bonne cible',
    titleEn: 'Find the right target',
    descFr: "Parcourez les annonces vérifiées sur Riviqo. Notre algorithme SmartMatching vous présente en priorité les entreprises correspondant à votre profil d'acquéreur.",
    descEn: "Browse verified listings on Riviqo. Our SmartMatching algorithm prioritizes businesses matching your buyer profile.",
    icon: Search,
  },
  {
    num: '03',
    titleFr: 'Analyser & due diligence',
    titleEn: 'Analyze & due diligence',
    descFr: "Accédez à la data room sécurisée, analysez les documents financiers, opérationnels et juridiques. Commandez une analyse professionnelle si nécessaire.",
    descEn: "Access the secure data room, analyze financial, operational and legal documents. Order a professional analysis if needed.",
    icon: BarChart2,
  },
  {
    num: '04',
    titleFr: 'Financer & closer',
    titleEn: 'Finance & close',
    descFr: "Simulez votre montage avec notre outil de financement. Vérifiez DSCR, dette senior et cash disponible post-reprise. Finalisez avec votre expert Riviqo.",
    descEn: "Simulate your structure with our financing tool. Check DSCR, senior debt and available post-acquisition cash. Finalize with your Riviqo expert.",
    icon: Landmark,
  },
];

const COMPARAISONS = [
  {
    critFr: 'Délai de lancement',
    critEn: 'Time to launch',
    reprFr: '3–6 mois',
    reprEn: '3–6 months',
    crFr: '12–24 mois',
    crEn: '12–24 months',
  },
  {
    critFr: 'Risque initial',
    critEn: 'Initial risk',
    reprFr: 'Activité et clients existants',
    reprEn: 'Existing activity and clients',
    crFr: 'Zéro historique',
    crEn: 'Zero track record',
  },
  {
    critFr: 'Financement bancaire',
    critEn: 'Bank financing',
    reprFr: 'Facilité (actifs + EBITDA)',
    reprEn: 'Easy (assets + EBITDA)',
    crFr: 'Difficile (projections)',
    crEn: 'Difficult (projections)',
  },
  {
    critFr: 'Retour sur investissement',
    critEn: 'Return on investment',
    reprFr: 'Immédiat dès le Day 1',
    reprEn: 'Immediate from Day 1',
    crFr: "Après point mort (2–5 ans)",
    crEn: 'After break-even (2–5 years)',
  },
];

const FAQS = [
  {
    qFr: "Quel apport faut-il pour reprendre une entreprise ?",
    qEn: "What personal contribution is required to acquire a business?",
    aFr: "Les banques exigent généralement un apport de 20 à 30 % du prix de cession. Pour un achat à 500 000 €, comptez 100 000 à 150 000 € d'apport personnel. Des dispositifs comme le prêt d'honneur (BPI, réseau Initiative) peuvent compléter l'apport sans diluer.",
    aEn: "Banks generally require a contribution of 20 to 30% of the sale price. For a €500,000 acquisition, plan €100,000 to €150,000 in personal contribution. Schemes like honor loans (BPI, Initiative network) can supplement the contribution without dilution.",
  },
  {
    qFr: "Comment financer une reprise d'entreprise ?",
    qEn: "How to finance a business acquisition?",
    aFr: "Le montage classique combine : apport personnel (20-30 %), dette senior bancaire (40-60 %), crédit vendeur possible (10-20 %) et parfois dette mezzanine pour les plus grandes opérations. Notre simulateur de financement calcule la faisabilité et le DSCR de votre montage en quelques minutes.",
    aEn: "The classic structure combines: personal contribution (20-30%), senior bank debt (40-60%), possible seller credit (10-20%) and sometimes mezzanine debt for larger deals. Our financing simulator calculates feasibility and DSCR of your structure in minutes.",
  },
  {
    qFr: "Faut-il un avocat pour reprendre une entreprise ?",
    qEn: "Is a lawyer required to acquire a business?",
    aFr: "Fortement recommandé. L'avocat intervient dans la négociation du protocole d'accord, la rédaction de la garantie d'actif et de passif (GAP), la structuration juridique de l'acquisition (achat de titres vs fonds de commerce) et la sécurisation des clauses de non-concurrence.",
    aEn: "Strongly recommended. The lawyer intervenes in negotiating the framework agreement, drafting the asset and liability guarantee, structuring the acquisition (share purchase vs. business assets) and securing non-compete clauses.",
  },
];

export default function Reprendre() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-[#FAF9F7]">
      <SEO pageName="Reprendre" />
      {/* Hero */}
      <section className="bg-[#FAF9F7] pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            {isFr ? 'Repreneuriat' : 'Entrepreneurship through acquisition'}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3B4759] leading-tight mb-6">
            {isFr
              ? 'Le repreneuriat : devenez entrepreneur en reprenant une entreprise existante.'
              : 'Entrepreneurship through acquisition: become a business owner by acquiring an existing company.'}
          </h1>
          <p className="text-lg text-[#6B7A94] max-w-2xl mx-auto mb-8 leading-relaxed">
            {isFr
              ? "Le repreneuriat est la voie la plus rapide et la plus sûre vers l'entrepreneuriat. Reprenez une entreprise rentable avec un historique prouvé, une clientèle établie et des revenus dès le premier jour. Riviqo vous accompagne de la recherche à la signature."
              : "Entrepreneurship through acquisition is the fastest and safest path to business ownership. Take over a profitable company with a proven track record, established customers and revenue from day one. Riviqo supports you from search to signing."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Annonces')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold">
                {isFr ? 'Voir les annonces' : 'View listings'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Financing')}>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-display font-semibold border-[#3B4759] text-[#3B4759] hover:bg-[#3B4759] hover:text-white">
                {isFr ? 'Tester mon financement' : 'Test my financing'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reprendre vs créer */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
              {isFr ? 'Reprendre vs créer : les faits' : 'Acquire vs create: the facts'}
            </h2>
            <p className="text-[#6B7A94] mt-3">
              {isFr
                ? "La reprise offre des avantages décisifs par rapport à la création ex nihilo."
                : "Acquisition offers decisive advantages over starting from scratch."}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0ECE6]">
                  <th className="text-left py-3 px-4 text-[#6B7A94] font-medium">{isFr ? 'Critère' : 'Criterion'}</th>
                  <th className="py-3 px-4 text-[#FF6B4A] font-display font-semibold text-center">{isFr ? 'Reprise' : 'Acquisition'}</th>
                  <th className="py-3 px-4 text-[#6B7A94] font-medium text-center">{isFr ? 'Création' : 'Creation'}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARAISONS.map((row, i) => (
                  <tr key={i} className="border-b border-[#F0ECE6] hover:bg-[#FAF9F7]">
                    <td className="py-3 px-4 font-medium text-[#3B4759]">{isFr ? row.critFr : row.critEn}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-[#16A34A]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isFr ? row.reprFr : row.reprEn}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-[#6B7A94]">{isFr ? row.crFr : row.crEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4 étapes */}
      <section className="py-20 px-4 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
              {isFr ? 'Le parcours repreneur en 4 étapes' : 'The buyer journey in 4 steps'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="bg-white rounded-2xl border border-[#F0ECE6] p-7 flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-[#FF6B4A]" />
                </div>
                <div>
                  <div className="font-mono text-xs text-[#FF6B4A] font-semibold mb-1">{step.num}</div>
                  <h3 className="font-display font-semibold text-[#3B4759] mb-2">{isFr ? step.titleFr : step.titleEn}</h3>
                  <p className="text-sm text-[#6B7A94] leading-relaxed">{isFr ? step.descFr : step.descEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outils repreneurs */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-[#3B4759]">
              {isFr ? 'Nos outils pour repreneurs' : 'Our tools for buyers'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to={createPageUrl('Valuations')} className="block">
              <div className="rounded-2xl border border-[#F0ECE6] bg-[#FAF9F7] p-7 hover:border-[#FF6B4A]/30 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center mb-4">
                  <Calculator className="w-5 h-5 text-[#FF6B4A]" />
                </div>
                <h3 className="font-display font-semibold text-[#3B4759] mb-2">{isFr ? 'Valorisation de la cible' : 'Target valuation'}</h3>
                <p className="text-sm text-[#6B7A94] mb-4">
                  {isFr
                    ? "Estimez la juste valeur de la cible avec 3 méthodes complémentaires avant de faire une offre."
                    : "Estimate the fair value of the target with 3 complementary methods before making an offer."}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm text-[#FF6B4A] font-medium group-hover:gap-2.5 transition-all">
                  {isFr ? 'Utiliser le simulateur' : 'Use the simulator'} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
            <Link to={createPageUrl('Financing')} className="block">
              <div className="rounded-2xl border border-[#F0ECE6] bg-[#FAF9F7] p-7 hover:border-[#FF6B4A]/30 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center mb-4">
                  <Landmark className="w-5 h-5 text-[#FF6B4A]" />
                </div>
                <h3 className="font-display font-semibold text-[#3B4759] mb-2">{isFr ? 'Simulateur de financement' : 'Financing simulator'}</h3>
                <p className="text-sm text-[#6B7A94] mb-4">
                  {isFr
                    ? "Calculez DSCR, dette senior supportable et cash disponible post-reprise en quelques clics."
                    : "Calculate DSCR, supportable senior debt and post-acquisition available cash in a few clicks."}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm text-[#FF6B4A] font-medium group-hover:gap-2.5 transition-all">
                  {isFr ? 'Tester mon montage' : 'Test my structure'} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
            <Link to={createPageUrl('Contact')} className="block">
              <div className="rounded-2xl border border-[#FF6B4A]/30 bg-[#FFF0ED] p-7 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#FF6B4A] flex items-center justify-center mb-4">
                  <Handshake className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display font-semibold text-[#3B4759] mb-2">{isFr ? 'Accompagnement Riviqo Advisory' : 'Riviqo Advisory support'}</h3>
                <p className="text-sm text-[#6B7A94] mb-4">
                  {isFr
                    ? "Le sourcing et la qualification d'une cible prennent souvent 12 à 24 mois à un repreneur seul. Riviqo Advisory accélère votre acquisition : notre équipe M&A pilote le processus complet — sourcing, due diligence, structuration du financement, négociation et closing."
                    : "Sourcing and qualifying a target often takes a solo buyer 12 to 24 months. Riviqo Advisory accelerates your acquisition: our M&A team manages the complete process — sourcing, due diligence, financing structure, negotiation and closing."}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm text-[#FF6B4A] font-medium group-hover:gap-2.5 transition-all">
                  {isFr ? 'Demander un devis' : 'Request a quote'} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-[#FAF9F7]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-[#3B4759] text-center mb-10">
            {isFr ? 'Questions fréquentes sur la reprise' : 'Frequently asked questions about acquisition'}
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-[#F0ECE6] rounded-xl overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-display font-medium text-[#3B4759]">{isFr ? faq.qFr : faq.qEn}</span>
                  <ChevronDown className={`w-4 h-4 text-[#6B7A94] transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-[#6B7A94] leading-relaxed border-t border-[#F0ECE6] pt-4">
                    {isFr ? faq.aFr : faq.aEn}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 bg-[#3B4759]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            {isFr ? 'Lancez votre recherche dès aujourd\'hui' : 'Start your search today'}
          </h2>
          <p className="text-[#B7C2D4] mb-8 max-w-xl mx-auto">
            {isFr
              ? "Accédez aux annonces vérifiées, aux outils d'analyse et aux experts Riviqo pour trouver et financer votre acquisition."
              : "Access verified listings, analysis tools and Riviqo experts to find and finance your acquisition."}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Link to={createPageUrl('AccountCreation')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold">
                {isFr ? 'Commencer gratuitement' : 'Start for free'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-display font-semibold border-white/30 text-white hover:bg-white/10">
                {isFr ? 'Parler à un expert M&A' : 'Talk to an M&A expert'}
              </Button>
            </Link>
            <Link to={createPageUrl('GuideRepreneur')}>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-display font-semibold border-white/30 text-white hover:bg-white/10">
                {isFr ? 'Lire le guide du repreneur' : 'Read the buyer guide'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
