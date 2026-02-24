// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Briefcase, Calculator, FileText, MessageSquare,
  Shield, Users, CheckCircle2, ChevronRight, Star, Building2
} from 'lucide-react';

const PROFILES = [
  {
    icon: Briefcase,
    titleFr: 'Cabinets M&A',
    titleEn: 'M&A firms',
    descFr: "Gérez vos mandats de cession et d'acquisition sur une plateforme dédiée. Accès data room, messagerie confidentielle, suivi de process et co-conseil avec d'autres experts du réseau.",
    descEn: "Manage your sale and acquisition mandates on a dedicated platform. Data room access, confidential messaging, process tracking and co-advisory with other network experts.",
    features: [
      { fr: 'Tableau de bord multi-dossiers', en: 'Multi-file dashboard' },
      { fr: 'Data room et NDA électronique', en: 'Data room and e-NDA' },
      { fr: 'Matching acheteur/vendeur intelligent', en: 'Smart buyer/seller matching' },
      { fr: 'Co-mandat avec d\'autres conseils', en: 'Co-mandate with other advisors' },
    ],
  },
  {
    icon: Calculator,
    titleFr: 'Experts-comptables',
    titleEn: 'Accountants',
    descFr: "Accompagnez vos clients cédants et repreneurs avec les bons outils : valorisation multi-méthodes, simulation fiscale, analyse de financement. Positionnez-vous comme expert en transmission.",
    descEn: "Support your seller and buyer clients with the right tools: multi-method valuation, tax simulation, financing analysis. Position yourself as a transfer specialist.",
    features: [
      { fr: 'Simulateurs valorisation et fiscalité', en: 'Valuation and tax simulators' },
      { fr: 'Partage de rapport client', en: 'Client report sharing' },
      { fr: 'Référencement réseau Riviqo', en: 'Riviqo network listing' },
      { fr: 'Formation aux outils de transmission', en: 'Transfer tool training' },
    ],
  },
  {
    icon: Building2,
    titleFr: 'Avocats d\'affaires',
    titleEn: 'Business lawyers',
    descFr: "Intervenez sur les GAP, SPA, pactes d'actionnaires et closing dans un environnement numérique sécurisé. Messagerie transactionnelle, versioning des documents et audit trail complet.",
    descEn: "Intervene on warranties, SPAs, shareholder agreements and closings in a secure digital environment. Transactional messaging, document versioning and complete audit trail.",
    features: [
      { fr: 'Gestion documentaire et versioning', en: 'Document management and versioning' },
      { fr: 'Signature électronique intégrée', en: 'Integrated electronic signature' },
      { fr: 'Audit trail et traçabilité', en: 'Audit trail and traceability' },
      { fr: 'Messagerie confidentielle', en: 'Confidential messaging' },
    ],
  },
];

const HOW_STEPS = [
  {
    num: '01',
    titleFr: 'Rejoignez le réseau',
    titleEn: 'Join the network',
    descFr: "Créez votre profil professionnel en quelques minutes. Renseignez vos spécialités, secteurs et zones géographiques d'intervention.",
    descEn: "Create your professional profile in minutes. Fill in your specialties, sectors and geographic areas.",
  },
  {
    num: '02',
    titleFr: 'Accédez aux dossiers',
    titleEn: 'Access files',
    descFr: "Recevez des alertes sur les opérations correspondant à vos critères. Candidatez comme conseil ou co-conseil sur les dossiers ouverts.",
    descEn: "Receive alerts on transactions matching your criteria. Apply as advisor or co-advisor on open files.",
  },
  {
    num: '03',
    titleFr: 'Collaborez et concluez',
    titleEn: 'Collaborate and close',
    descFr: "Gérez les échanges, documents et signatures depuis la plateforme. Facturation et suivi des honoraires intégrés.",
    descEn: "Manage exchanges, documents and signatures from the platform. Integrated billing and fee tracking.",
  },
];

export default function Expert() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Hero */}
      <section className="bg-[#FAF9F7] pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5" />
            {isFr ? 'Réseau d\'experts M&A' : 'M&A expert network'}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3B4759] leading-tight mb-6">
            {isFr
              ? 'Riviqo, plateforme et service d\'accompagnement M&A : collaborez sur les opérations de transmission'
              : 'Riviqo, platform and M&A advisory service: collaborate on business transfers'}
          </h1>
          <p className="text-lg text-[#6B7A94] max-w-2xl mx-auto mb-8 leading-relaxed">
            {isFr
              ? "Riviqo combine une plateforme technologique dédiée à la transmission d'entreprise et un service d'accompagnement M&A. Rejoignez notre réseau pour accéder aux dossiers, co-conseiller et gérer vos mandats."
              : "Riviqo combines a technology platform dedicated to business transfers with an M&A advisory service. Join our network to access files, co-advise and manage your mandates."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Contact')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold">
                {isFr ? 'Rejoindre le réseau' : 'Join the network'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Dataroom')}>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-display font-semibold border-[#3B4759] text-[#3B4759] hover:bg-[#3B4759] hover:text-white">
                {isFr ? 'Découvrir la Data Room' : 'Discover the Data Room'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Profils */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
              {isFr ? 'Un réseau pour tous les profils de conseils' : 'A network for all advisor profiles'}
            </h2>
            <p className="text-[#6B7A94] mt-3 max-w-2xl mx-auto">
              {isFr
                ? "Que vous soyez conseil en M&A, expert-comptable ou avocat, Riviqo vous offre la puissance d'une plateforme dédiée et l'accompagnement d'une équipe M&A interne."
                : "Whether you are an M&A advisor, accountant or lawyer, Riviqo offers you the power of a dedicated platform and the support of an internal M&A team."}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PROFILES.map((profile) => (
              <div key={profile.titleFr} className="rounded-2xl border border-[#F0ECE6] p-7 bg-[#FAF9F7]">
                <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center mb-5">
                  <profile.icon className="w-5 h-5 text-[#FF6B4A]" />
                </div>
                <h3 className="font-display font-semibold text-xl text-[#3B4759] mb-3">{isFr ? profile.titleFr : profile.titleEn}</h3>
                <p className="text-sm text-[#6B7A94] leading-relaxed mb-5">{isFr ? profile.descFr : profile.descEn}</p>
                <ul className="space-y-2">
                  {profile.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#3B4759]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B4A] flex-shrink-0" />
                      {isFr ? feat.fr : feat.en}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités plateforme */}
      <section className="py-20 px-4 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
              {isFr ? 'Tout ce dont vous avez besoin' : 'Everything you need'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, titleFr: 'NDA électronique', titleEn: 'Electronic NDA', descFr: 'Signature et suivi automatiques', descEn: 'Automatic signing and tracking' },
              { icon: FileText, titleFr: 'Data Room', titleEn: 'Data Room', descFr: 'Accès granulaire par partie', descEn: 'Granular per-party access' },
              { icon: MessageSquare, titleFr: 'Messagerie transact.', titleEn: 'Transaction messaging', descFr: 'Conversations par dossier', descEn: 'Per-file conversations' },
              { icon: Users, titleFr: 'Co-conseil', titleEn: 'Co-advisory', descFr: 'Collaborez entre experts', descEn: 'Collaborate between experts' },
            ].map((feat) => (
              <div key={feat.titleFr} className="bg-white rounded-xl border border-[#F0ECE6] p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0ED] flex items-center justify-center mx-auto mb-3">
                  <feat.icon className="w-5 h-5 text-[#FF6B4A]" />
                </div>
                <div className="font-display font-semibold text-sm text-[#3B4759] mb-1">{isFr ? feat.titleFr : feat.titleEn}</div>
                <div className="text-xs text-[#6B7A94]">{isFr ? feat.descFr : feat.descEn}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-[#3B4759]">
              {isFr ? 'Comment rejoindre le réseau ?' : 'How to join the network?'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#FFF0ED] flex items-center justify-center mx-auto mb-4 border-2 border-[#FF6B4A]/20">
                  <span className="font-mono text-sm font-bold text-[#FF6B4A]">{step.num}</span>
                </div>
                <h3 className="font-display font-semibold text-[#3B4759] mb-2">{isFr ? step.titleFr : step.titleEn}</h3>
                <p className="text-sm text-[#6B7A94] leading-relaxed">{isFr ? step.descFr : step.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#3B4759]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            {isFr ? 'Rejoignez le réseau Riviqo Advisory' : 'Join the Riviqo Advisory network'}
          </h2>
          <p className="text-[#B7C2D4] mb-8 max-w-xl mx-auto">
            {isFr
              ? "Postulez en ligne pour intégrer notre réseau de conseils sélectionnés. Notre équipe vous contacte sous 48h."
              : "Apply online to join our network of selected advisors. Our team contacts you within 48 hours."}
          </p>
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-10 py-6 text-base font-display font-semibold">
              {isFr ? 'Rejoindre le réseau' : 'Join the network'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
