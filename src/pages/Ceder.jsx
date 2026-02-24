// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, CheckCircle2, TrendingUp, Shield, Users, FileText,
  Handshake, ChevronDown, BarChart2, Clock, Star
} from 'lucide-react';

const STEPS = [
  {
    num: '01',
    titleFr: 'Valorisation',
    titleEn: 'Valuation',
    descFr: "Estimez la valeur de marché de votre entreprise avec nos 3 méthodes complémentaires : approche par les multiples, par la rentabilité et par l'actif net.",
    descEn: 'Estimate your business market value with our 3 complementary methods: multiples, profitability and net asset.',
    icon: BarChart2,
  },
  {
    num: '02',
    titleFr: 'Préparation du dossier',
    titleEn: 'File preparation',
    descFr: "Constituez votre data room sécurisée : bilans, comptes de résultat, contrats clés, liste des actifs. Riviqo vous guide étape par étape.",
    descEn: 'Build your secure data room: balance sheets, income statements, key contracts, asset list. Riviqo guides you step by step.',
    icon: FileText,
  },
  {
    num: '03',
    titleFr: 'Matching repreneur',
    titleEn: 'Buyer matching',
    descFr: "Notre algorithme SmartMatching identifie les repreneurs qualifiés correspondant au profil de votre entreprise — secteur, taille, localisation, capacité de financement.",
    descEn: 'Our SmartMatching algorithm identifies qualified buyers matching your business profile — sector, size, location, financing capacity.',
    icon: Users,
  },
  {
    num: '04',
    titleFr: 'Négociation & closing',
    titleEn: 'Negotiation & closing',
    descFr: "Échangez en toute confidentialité via notre messagerie transactionnelle. Signez la lettre d'intention, finalisez la due diligence et accompagnez le closing avec votre expert dédié.",
    descEn: 'Exchange confidentially via our transactional messaging. Sign the letter of intent, finalize due diligence and complete closing with your dedicated expert.',
    icon: Handshake,
  },
];

const ADVANTAGES = [
  {
    icon: TrendingUp,
    titleFr: 'Valorisation multi-méthodes',
    titleEn: 'Multi-method valuation',
    descFr: "Obtenez une fourchette de valorisation réaliste basée sur les données de marché actuelles, la rentabilité et l'actif net de votre entreprise.",
    descEn: 'Get a realistic valuation range based on current market data, profitability and net assets.',
  },
  {
    icon: Shield,
    titleFr: 'Confidentialité totale',
    titleEn: 'Total confidentiality',
    descFr: "NDA électronique systématique, data room à accès contrôlé, audit trail. Vos informations sensibles ne sont partagées qu'avec des repreneurs qualifiés.",
    descEn: 'Systematic e-NDA, controlled access data room, audit trail. Your sensitive information is shared only with qualified buyers.',
  },
  {
    icon: Users,
    titleFr: 'Réseau de repreneurs qualifiés',
    titleEn: 'Network of qualified buyers',
    descFr: "Accédez à notre base de repreneurs actifs — entrepreneurs, fonds, family offices — ayant déjà démontré leur capacité de financement.",
    descEn: 'Access our base of active buyers — entrepreneurs, funds, family offices — who have already demonstrated financing capacity.',
  },
  {
    icon: Handshake,
    titleFr: 'Accompagnement Advisory de A à Z',
    titleEn: 'End-to-end Advisory support',
    descFr: "Au-delà de la plateforme, Riviqo Advisory met à votre disposition un expert M&A dédié pour piloter l'intégralité de votre cession : rédaction du mémo, approche repreneurs, négociation et closing.",
    descEn: "Beyond the platform, Riviqo Advisory provides a dedicated M&A expert to manage your entire sale: memo drafting, buyer approach, negotiation and closing.",
  },
];

const FAQS = [
  {
    qFr: 'Combien de temps dure une cession ?',
    qEn: 'How long does a sale take?',
    aFr: "La durée médiane d'une cession de PME est de 6 à 18 mois selon la complexité du dossier, la valorisation retenue et le marché sectoriel. Riviqo optimise chaque étape pour réduire ce délai sans sacrifier la qualité du processus.",
    aEn: "The median duration of an SME sale is 6 to 18 months depending on the complexity of the file, the agreed valuation and the sector market. Riviqo optimizes each step to reduce this time without sacrificing process quality.",
  },
  {
    qFr: "Faut-il un expert-comptable pour céder son entreprise ?",
    qEn: "Is an accountant required to sell a business?",
    aFr: "Oui, un expert-comptable est indispensable pour préparer les documents financiers (bilans retraités, comptes prévisionnels), calculer le produit net de cession et optimiser la fiscalité. Riviqo met en relation avec des experts-comptables spécialisés en transmission.",
    aEn: "Yes, an accountant is essential for preparing financial documents (restated balance sheets, projected accounts), calculating net sale proceeds and optimizing taxation. Riviqo connects you with accountants specializing in business transfers.",
  },
  {
    qFr: "Quelle est la fiscalité lors d'une cession ?",
    qEn: "What is the taxation on a business sale?",
    aFr: "La plus-value de cession est soumise au prélèvement forfaitaire unique (PFU) de 30 % ou au barème progressif de l'IR selon l'option choisie. Des abattements pour durée de détention et certains dispositifs (Madelin, Dutreil) peuvent réduire significativement l'imposition. Utilisez notre simulateur gratuit.",
    aEn: "The capital gain on sale is subject to the flat tax (PFU) of 30% or the progressive income tax scale depending on the chosen option. Duration of ownership allowances and certain schemes (Madelin, Dutreil) can significantly reduce taxation. Use our free simulator.",
  },
];

export default function Ceder() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Hero */}
      <section className="bg-[#FAF9F7] pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5" />
            {isFr ? 'Transmission d\'entreprise' : 'Business transfer'}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3B4759] leading-tight mb-6">
            {isFr
              ? 'Céder votre entreprise : préparez, valorisez, transmettez.'
              : 'Sell your business: prepare, value, transfer.'}
          </h1>
          <p className="text-lg text-[#6B7A94] max-w-2xl mx-auto mb-8 leading-relaxed">
            {isFr
              ? "Riviqo, plateforme et service d'accompagnement en transmission, accompagne les dirigeants de la valorisation au closing avec des outils professionnels et une équipe d'experts M&A dédiée."
              : "Riviqo, a business transfer platform and M&A advisory service, supports owners from valuation to closing with professional tools and a dedicated team of M&A experts."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('AccountCreation')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold">
                {isFr ? 'Déposer une annonce' : 'Post a listing'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Valuations')}>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-display font-semibold border-[#3B4759] text-[#3B4759] hover:bg-[#3B4759] hover:text-white">
                {isFr ? 'Estimer ma valorisation' : 'Estimate my valuation'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-[#F0ECE6] py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '700 000', labelFr: "entreprises à transmettre d'ici 2034", labelEn: 'businesses to transfer by 2034' },
            { val: '1/3', labelFr: 'sans repreneur identifié', labelEn: 'without an identified buyer' },
            { val: '6–18', labelFr: 'mois — durée médiane d\'une cession', labelEn: 'months — median sale duration' },
            { val: '3 200+', labelFr: 'valorisations réalisées sur Riviqo', labelEn: 'valuations performed on Riviqo' },
          ].map((s) => (
            <div key={s.val}>
              <div className="font-display text-3xl font-bold text-[#FF6B4A] mb-1">{s.val}</div>
              <div className="text-sm text-[#6B7A94]">{isFr ? s.labelFr : s.labelEn}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 étapes */}
      <section className="py-20 px-4 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
              {isFr ? 'Les 4 étapes d\'une cession réussie' : 'The 4 steps of a successful sale'}
            </h2>
            <p className="text-[#6B7A94] mt-3 max-w-2xl mx-auto">
              {isFr
                ? "Riviqo structure votre processus de cession de A à Z pour maximiser la valeur et sécuriser la transaction."
                : "Riviqo structures your sale process from A to Z to maximize value and secure the transaction."}
            </p>
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

      {/* Avantages Riviqo */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
              {isFr ? 'Pourquoi choisir Riviqo ?' : 'Why choose Riviqo?'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((adv) => (
              <div key={adv.titleFr} className="rounded-2xl border border-[#F0ECE6] p-7 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center mb-5">
                  <adv.icon className="w-5 h-5 text-[#FF6B4A]" />
                </div>
                <h3 className="font-display font-semibold text-[#3B4759] mb-2">{isFr ? adv.titleFr : adv.titleEn}</h3>
                <p className="text-sm text-[#6B7A94] leading-relaxed flex-1">{isFr ? adv.descFr : adv.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-[#FAF9F7]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-[#3B4759] text-center mb-10">
            {isFr ? 'Questions fréquentes sur la cession' : 'Frequently asked questions about selling'}
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

      {/* Riviqo Advisory */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#FFF0ED] rounded-2xl border border-[#FFD8CC] p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF6B4A] text-white text-xs font-semibold rounded-full mb-4">
                <Star className="w-3 h-3" />
                Riviqo Advisory
              </div>
              <h3 className="font-display text-2xl font-bold text-[#3B4759] mb-3">
                {isFr ? "Besoin d'un accompagnement complet ?" : "Need full support?"}
              </h3>
              <p className="text-[#6B7A94] leading-relaxed">
                {isFr
                  ? "La majorité des cessions prennent 12 à 24 mois de plus que nécessaire, faute d'un processus structuré. Riviqo Advisory est notre service d'accompagnement M&A intégré. Un expert dédié pilote et accélère votre cession de bout en bout : valorisation, data room, matching, négociation et closing."
                  : "Most business sales take 12 to 24 months longer than necessary, for lack of a structured process. Riviqo Advisory is our integrated M&A support service. A dedicated expert drives and accelerates your sale end-to-end: valuation, data room, matching, negotiation and closing."}
              </p>
            </div>
            <div>
              <ul className="space-y-3 mb-6">
                {[
                  { fr: 'Processus accéléré : jusqu\'à 12 mois gagnés', en: 'Accelerated process: up to 12 months saved' },
                  { fr: 'Expert M&A dédié à votre dossier', en: 'Dedicated M&A expert for your file' },
                  { fr: 'Valorisation et rédaction du mémo', en: 'Valuation and memo drafting' },
                  { fr: 'Approche et qualification des repreneurs', en: 'Buyer approach and qualification' },
                  { fr: 'Négociation et closing accompagnés', en: 'Supported negotiation and closing' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-[#3B4759]">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B4A] flex-shrink-0" />
                    {isFr ? item.fr : item.en}
                  </li>
                ))}
              </ul>
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-7 py-5 font-display font-semibold">
                  {isFr ? 'Demander un devis' : 'Request a quote'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 bg-[#3B4759]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            {isFr ? 'Démarrez votre cession avec Riviqo' : 'Start your sale with Riviqo'}
          </h2>
          <p className="text-[#B7C2D4] mb-8 max-w-xl mx-auto">
            {isFr
              ? "Créez votre compte gratuitement et accédez à tous les outils pour préparer et réussir votre transmission."
              : "Create your free account and access all the tools to prepare and succeed in your transfer."}
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
            <Link to={createPageUrl('GuideCession')}>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-display font-semibold border-white/30 text-white hover:bg-white/10">
                {isFr ? 'Lire le guide de cession' : 'Read the sale guide'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
