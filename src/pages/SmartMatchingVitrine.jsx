// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Sparkles, SlidersHorizontal, BarChart3, Bell,
  Users, CheckCircle2, Star, Target, Brain, Zap
} from 'lucide-react';

const HOW_STEPS = [
  {
    num: '01',
    icon: SlidersHorizontal,
    titleFr: 'Définissez vos critères',
    titleEn: 'Define your criteria',
    descFr: "Renseignez votre profil : secteur d'activité, zone géographique, chiffre d'affaires cible, EBITDA, effectif, budget d'acquisition. Plus vos critères sont précis, plus les matchs sont pertinents.",
    descEn: "Fill in your profile: business sector, geographic area, target revenue, EBITDA, headcount, acquisition budget. The more precise your criteria, the more relevant your matches.",
  },
  {
    num: '02',
    icon: Brain,
    titleFr: "L'algorithme analyse et score",
    titleEn: 'The algorithm analyzes and scores',
    descFr: "SmartMatching croise vos critères avec l'ensemble des profils et annonces de la plateforme. Chaque opportunité reçoit un score de compatibilité de 0 à 100, basé sur une analyse multi-dimensionnelle.",
    descEn: "SmartMatching cross-references your criteria with all profiles and listings on the platform. Each opportunity receives a compatibility score from 0 to 100, based on multi-dimensional analysis.",
  },
  {
    num: '03',
    icon: Bell,
    titleFr: 'Recevez vos matchs en temps réel',
    titleEn: 'Receive your matches in real time',
    descFr: "Dès qu'une nouvelle opportunité correspond à votre profil, vous recevez une alerte. Accédez directement à la fiche, engagez la conversation ou ajoutez le dossier à vos favoris.",
    descEn: "As soon as a new opportunity matches your profile, you receive an alert. Access the listing directly, start a conversation or add the file to your favorites.",
  },
];

const FEATURES = [
  {
    icon: SlidersHorizontal,
    titleFr: 'Matching multi-critères',
    titleEn: 'Multi-criteria matching',
    descFr: "Secteur, sous-secteur, localisation, taille (CA/EBITDA), capacité de financement, type de clientèle — l'algorithme prend en compte plus de 12 dimensions pour chaque match.",
    descEn: "Sector, sub-sector, location, size (revenue/EBITDA), financing capacity, client type — the algorithm considers over 12 dimensions for each match.",
  },
  {
    icon: BarChart3,
    titleFr: 'Score de compatibilité 0–100',
    titleEn: 'Compatibility score 0–100',
    descFr: "Chaque opportunité est notée sur 100. Un score > 80 signifie une forte compatibilité sur les critères essentiels. Le détail du score est accessible pour chaque match.",
    descEn: "Each opportunity is scored out of 100. A score > 80 means strong compatibility on essential criteria. Score breakdown is available for each match.",
  },
  {
    icon: Bell,
    titleFr: 'Alertes temps réel',
    titleEn: 'Real-time alerts',
    descFr: "Recevez une notification par e-mail et dans la plateforme dès qu'un nouveau match compatible est identifié. Soyez parmi les premiers à réagir sur les meilleures opportunités.",
    descEn: "Receive email and in-platform notifications as soon as a new compatible match is identified. Be among the first to react to the best opportunities.",
  },
  {
    icon: Users,
    titleFr: 'Mode Acheteur & Vendeur',
    titleEn: 'Buyer & Seller mode',
    descFr: "Le SmartMatching fonctionne dans les deux sens : les repreneurs trouvent des cibles, les cédants voient les repreneurs qualifiés matchés sur leur annonce.",
    descEn: "SmartMatching works both ways: buyers find targets, sellers see qualified buyers matched to their listing.",
  },
];

export default function SmartMatchingVitrine() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Hero */}
      <section className="bg-[#FAF9F7] pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {isFr ? 'Matching intelligent' : 'Smart matching'}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3B4759] leading-tight mb-6">
            {isFr
              ? 'Trouvez la contrepartie idéale avec le SmartMatching Riviqo'
              : 'Find the ideal counterpart with Riviqo SmartMatching'}
          </h1>
          <p className="text-lg text-[#6B7A94] max-w-2xl mx-auto mb-8 leading-relaxed">
            {isFr
              ? "L'algorithme de Riviqo analyse vos critères en profondeur pour vous présenter uniquement les opportunités réellement compatibles. Moins de bruit, plus de précision — pour des opérations qui aboutissent."
              : "Riviqo's algorithm deeply analyzes your criteria to present only truly compatible opportunities. Less noise, more precision — for transactions that succeed."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('AccountCreation')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold">
                {isFr ? 'Activer SmartMatching' : 'Enable SmartMatching'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Pricing')}>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-display font-semibold border-[#3B4759] text-[#3B4759] hover:bg-[#3B4759] hover:text-white">
                {isFr ? 'Voir les offres' : 'View plans'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 px-4 bg-white border-y border-[#F0ECE6]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0ED] text-[#FF6B4A] text-xs font-bold uppercase tracking-wider mb-4 font-display">
              <Target className="w-3.5 h-3.5" />
              {isFr ? 'Comment ça marche' : 'How it works'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
              {isFr ? '3 étapes vers votre match idéal' : '3 steps to your ideal match'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_STEPS.map((step) => (
              <div key={step.num} className="rounded-2xl bg-[#FAF9F7] border border-[#F0ECE6] p-7">
                <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center mb-5">
                  <step.icon className="w-5 h-5 text-[#FF6B4A]" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs font-bold text-[#FF6B4A]">{step.num}</span>
                  <h3 className="font-display font-semibold text-[#3B4759]">{isFr ? step.titleFr : step.titleEn}</h3>
                </div>
                <p className="text-sm text-[#6B7A94] leading-relaxed">{isFr ? step.descFr : step.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759]">
              {isFr ? 'Un algorithme conçu pour la transmission' : 'An algorithm built for business transfers'}
            </h2>
            <p className="text-[#6B7A94] mt-3 max-w-2xl mx-auto">
              {isFr
                ? "Le SmartMatching de Riviqo n'est pas un moteur de recherche classique. C'est un algorithme spécialisé dans les opérations de cession et d'acquisition d'entreprise."
                : "Riviqo's SmartMatching is not a standard search engine. It's an algorithm specialized in business sale and acquisition transactions."}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.titleFr} className="bg-white rounded-2xl border border-[#F0ECE6] p-7">
                <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center mb-5">
                  <feat.icon className="w-5 h-5 text-[#FF6B4A]" />
                </div>
                <h3 className="font-display font-semibold text-xl text-[#3B4759] mb-3">{isFr ? feat.titleFr : feat.titleEn}</h3>
                <p className="text-sm text-[#6B7A94] leading-relaxed">{isFr ? feat.descFr : feat.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-4 bg-white border-y border-[#F0ECE6]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '1 248+', labelFr: 'Matchs générés', labelEn: 'Matches generated' },
            { val: '92%', labelFr: 'Précision moyenne', labelEn: 'Average precision' },
            { val: '< 24h', labelFr: "Délai d'alerte", labelEn: 'Alert delay' },
            { val: '8', labelFr: 'Pays couverts', labelEn: 'Countries covered' },
          ].map((s) => (
            <div key={s.val}>
              <div className="font-display text-2xl font-bold text-[#FF6B4A] mb-1">{s.val}</div>
              <div className="text-sm text-[#6B7A94]">{isFr ? s.labelFr : s.labelEn}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SmartMatching + Advisory */}
      <section className="py-20 px-4 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#FFF0ED] rounded-2xl border border-[#FFD8CC] p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display text-2xl font-bold text-[#3B4759] mb-4">
                  {isFr ? 'SmartMatching + accompagnement Advisory' : 'SmartMatching + Advisory support'}
                </h3>
                <p className="text-sm font-semibold text-[#FF6B4A] mb-3 font-display">
                  {isFr
                    ? "Le sourcing manuel prend en moyenne 6 à 12 mois. Le SmartMatching + Advisory réduit ce délai à quelques semaines."
                    : "Manual sourcing takes an average of 6 to 12 months. SmartMatching + Advisory reduces this to a few weeks."}
                </p>
                <p className="text-sm text-[#6B7A94] leading-relaxed">
                  {isFr
                    ? "Les clients Riviqo Advisory bénéficient d'un sourcing actif par l'équipe M&A en complément de l'algorithme SmartMatching. Votre expert dédié qualifie chaque match, contacte les contreparties et organise les premières prises de contact."
                    : "Riviqo Advisory clients benefit from active sourcing by the M&A team in addition to the SmartMatching algorithm. Your dedicated expert qualifies each match, contacts counterparts and organizes initial meetings."}
                </p>
              </div>
              <div>
                <ul className="space-y-3 mb-6">
                  {[
                    { fr: 'Sourcing actif par un expert M&A dédié', en: 'Active sourcing by a dedicated M&A expert' },
                    { fr: 'Qualification humaine de chaque match', en: 'Human qualification of each match' },
                    { fr: 'Organisation des premiers échanges', en: 'Organization of initial meetings' },
                    { fr: "Accompagnement jusqu'au closing", en: 'Support until closing' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-[#3B4759]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B4A] flex-shrink-0" />
                      {isFr ? item.fr : item.en}
                    </li>
                  ))}
                </ul>
                <Link to={createPageUrl('Contact')}>
                  <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-6 py-3 text-sm font-display font-semibold">
                    {isFr ? 'Parler à un expert M&A' : 'Talk to an M&A expert'}
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
            {isFr ? 'Activez SmartMatching et recevez vos premiers matchs' : 'Enable SmartMatching and receive your first matches'}
          </h2>
          <p className="text-[#B7C2D4] mb-8 max-w-xl mx-auto">
            {isFr
              ? "Créez votre compte, renseignez vos critères et laissez l'algorithme travailler pour vous. Les premiers matchs arrivent en quelques heures."
              : "Create your account, fill in your criteria and let the algorithm work for you. First matches arrive within hours."}
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
