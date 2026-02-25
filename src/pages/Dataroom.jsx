// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, CheckCircle2, Eye, FileText, Lock, Shield,
  Star, Users, Zap
} from 'lucide-react';
import SEO from '@/components/SEO';

const FEATURES = [
  {
    icon: Shield,
    titleFr: 'NDA électronique',
    titleEn: 'Electronic NDA',
    descFr: "Signature automatique d'un accord de confidentialité avant tout accès aux documents. Horodatage qualifié, archivage légal 10 ans.",
    descEn: "Automatic signing of a confidentiality agreement before any document access. Qualified timestamping, 10-year legal archiving.",
  },
  {
    icon: Users,
    titleFr: 'Permissions granulaires',
    titleEn: 'Granular permissions',
    descFr: "Définissez qui voit quoi : par dossier, par partie prenante, par niveau de due diligence. Accès révocable à tout moment.",
    descEn: "Define who sees what: by folder, by stakeholder, by due diligence level. Access revocable at any time.",
  },
  {
    icon: Eye,
    titleFr: 'Audit trail complet',
    titleEn: 'Complete audit trail',
    descFr: "Chaque consultation, téléchargement et action est journalisé avec horodatage, identifiant utilisateur et adresse IP. Traçabilité totale.",
    descEn: "Every view, download and action is logged with timestamp, user ID and IP address. Total traceability.",
  },
  {
    icon: Lock,
    titleFr: 'Chiffrement AES-256',
    titleEn: 'AES-256 encryption',
    descFr: "Vos documents sont chiffrés au repos et en transit avec AES-256. Infrastructure hébergée en Europe (RGPD-compliant).",
    descEn: "Your documents are encrypted at rest and in transit with AES-256. Infrastructure hosted in Europe (GDPR-compliant).",
  },
];

const USE_CASES = [
  {
    icon: FileText,
    titleFr: 'Pour les cédants',
    titleEn: 'For sellers',
    pointsFr: [
      'Centralisez bilans, contrats et documents juridiques dans un espace unique',
      'Partagez en toute sécurité avec les repreneurs qualifiés uniquement',
      'Suivez en temps réel qui consulte vos documents et lesquels',
      'Contrôlez les téléchargements et impressions document par document',
    ],
    pointsEn: [
      'Centralize balance sheets, contracts and legal documents in one space',
      'Share securely only with qualified buyers',
      'Track in real time who views your documents and which ones',
      'Control downloads and prints document by document',
    ],
  },
  {
    icon: Zap,
    titleFr: 'Pour les repreneurs',
    titleEn: 'For buyers',
    pointsFr: [
      'Accédez aux documents de la cible après signature NDA',
      'Organisez votre due diligence par thème (financier, juridique, RH)',
      'Annotez et partagez des questions directement dans la plateforme',
      'Exportez un rapport complet de votre analyse',
    ],
    pointsEn: [
      'Access target documents after NDA signing',
      'Organize your due diligence by topic (financial, legal, HR)',
      'Annotate and share questions directly in the platform',
      'Export a complete analysis report',
    ],
  },
  {
    icon: Users,
    titleFr: 'Pour les conseils',
    titleEn: 'For advisors',
    pointsFr: [
      'Gérez plusieurs dossiers clients depuis un tableau de bord unique',
      'Invitez co-conseils et experts avec des droits précis',
      'Suivez l\'avancement des due diligences de vos mandats',
      'Archivage automatique post-closing',
    ],
    pointsEn: [
      'Manage multiple client files from a single dashboard',
      'Invite co-advisors and experts with precise rights',
      'Track due diligence progress of your mandates',
      'Automatic post-closing archiving',
    ],
  },
];

export default function Dataroom() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <SEO pageName="Dataroom" />
      {/* Hero */}
      <section className="bg-[#FAF9F7] pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5" />
            {isFr ? 'Data Room M&A sécurisée' : 'Secure M&A Data Room'}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3B4759] leading-tight mb-6">
            {isFr
              ? 'La data room dédiée aux opérations de transmission d\'entreprise'
              : 'The data room dedicated to business transfer transactions'}
          </h1>
          <p className="text-lg text-[#6B7A94] max-w-2xl mx-auto mb-8 leading-relaxed">
            {isFr
              ? "Partagez vos documents en toute confiance. NDA électronique, chiffrement AES-256, permissions granulaires et audit trail — tout ce dont les professionnels de la transmission ont besoin."
              : "Share your documents with confidence. Electronic NDA, AES-256 encryption, granular permissions and audit trail — everything business transfer professionals need."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('AccountCreation')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold">
                {isFr ? 'Démarrer gratuitement' : 'Start for free'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Pricing')}>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-display font-semibold border-[#3B4759] text-[#3B4759] hover:bg-[#3B4759] hover:text-white">
                {isFr ? 'Voir les tarifs' : 'View pricing'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
              {isFr ? 'Sécurité et contrôle total' : 'Total security and control'}
            </h2>
            <p className="text-[#6B7A94] mt-3 max-w-2xl mx-auto">
              {isFr
                ? "Riviqo Data Room est conçue pour les standards les plus exigeants des opérations M&A."
                : "Riviqo Data Room is designed for the most demanding M&A transaction standards."}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat) => (
              <div key={feat.titleFr} className="rounded-2xl border border-[#F0ECE6] bg-[#FAF9F7] p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center mx-auto mb-4">
                  <feat.icon className="w-5 h-5 text-[#FF6B4A]" />
                </div>
                <h3 className="font-display font-semibold text-[#3B4759] mb-2">{isFr ? feat.titleFr : feat.titleEn}</h3>
                <p className="text-sm text-[#6B7A94] leading-relaxed">{isFr ? feat.descFr : feat.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 px-4 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
              {isFr ? 'Conçue pour tous les acteurs de la transmission' : 'Designed for all transfer actors'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {USE_CASES.map((uc) => (
              <div key={uc.titleFr} className="bg-white rounded-2xl border border-[#F0ECE6] p-7">
                <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center mb-5">
                  <uc.icon className="w-5 h-5 text-[#FF6B4A]" />
                </div>
                <h3 className="font-display font-semibold text-xl text-[#3B4759] mb-4">{isFr ? uc.titleFr : uc.titleEn}</h3>
                <ul className="space-y-2.5">
                  {(isFr ? uc.pointsFr : uc.pointsEn).map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#6B7A94]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B4A] flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / stats */}
      <section className="py-14 px-4 bg-white border-y border-[#F0ECE6]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: 'AES-256', labelFr: 'Chiffrement des documents', labelEn: 'Document encryption' },
            { val: 'RGPD', labelFr: 'Infrastructure européenne', labelEn: 'European infrastructure' },
            { val: '100%', labelFr: 'Audit trail des accès', labelEn: 'Access audit trail' },
            { val: '10 ans', labelFr: 'Archivage légal', labelEn: 'Legal archiving' },
          ].map((s) => (
            <div key={s.val}>
              <div className="font-display text-2xl font-bold text-[#FF6B4A] mb-1">{s.val}</div>
              <div className="text-sm text-[#6B7A94]">{isFr ? s.labelFr : s.labelEn}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Room + Advisory */}
      <section className="py-20 px-4 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#FFF0ED] rounded-2xl border border-[#FFD8CC] p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display text-2xl font-bold text-[#3B4759] mb-4">
                  {isFr ? "Data Room intégrée à l'accompagnement Advisory" : 'Data Room integrated with Advisory support'}
                </h3>
                <p className="text-sm text-[#6B7A94] leading-relaxed">
                  {isFr
                    ? "Les clients Riviqo Advisory bénéficient d'une data room constituée, organisée et gérée par leur expert M&A dédié. Chaque document est indexé, chaque accès est tracé."
                    : "Riviqo Advisory clients benefit from a data room built, organized and managed by their dedicated M&A expert. Every document is indexed, every access is tracked."}
                </p>
              </div>
              <div>
                <ul className="space-y-3 mb-6">
                  {[
                    { fr: 'Data Room constituée par votre expert', en: 'Data Room built by your expert' },
                    { fr: 'Gestion des accès et NDA automatiques', en: 'Automatic access management and NDA' },
                    { fr: 'Audit trail intégré au reporting Advisory', en: 'Audit trail integrated with Advisory reporting' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-[#3B4759]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B4A] flex-shrink-0" />
                      {isFr ? item.fr : item.en}
                    </li>
                  ))}
                </ul>
                <Link to={createPageUrl('Contact')}>
                  <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-6 py-3 text-sm font-display font-semibold">
                    {isFr ? 'Découvrir Riviqo Advisory' : 'Discover Riviqo Advisory'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#3B4759]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            {isFr ? 'Démarrez votre première data room' : 'Start your first data room'}
          </h2>
          <p className="text-[#B7C2D4] mb-8 max-w-xl mx-auto">
            {isFr
              ? "Créez un compte gratuit et accédez à la Data Room Riviqo pour votre prochaine opération de transmission."
              : "Create a free account and access Riviqo Data Room for your next transfer transaction."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('AccountCreation')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold">
                {isFr ? 'Commencer gratuitement' : 'Start for free'}
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
