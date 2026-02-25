import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search, ArrowRight, Sparkles, Brain, MessageCircle,
  FolderLock, Users, Calculator, Landmark, Banknote,
  BadgeCheck, MapPin, Eye, TrendingUp, CheckCircle2,
  Phone, FileText, UserCheck, Handshake, ClipboardList,
  AlertTriangle, Clock, BarChart3, Building2, ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

/* ─────────────────────────────────────────
   Mock listings
───────────────────────────────────────── */
const mockFeaturedListings = [
  {
    id: 1, title: 'Boulangerie artisanale premium',
    sector: 'Alimentaire', sectorColor: '#F59E0B',
    location: 'Lyon, France', askingPrice: '180 000 €',
    annualRevenue: '420 000 €', growth: '+11%',
    match: 94, views: 183, reference: 'RVQ-7821',
    verified: true, hot: false,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 2, title: 'SaaS RH B2B en croissance',
    sector: 'Tech', sectorColor: '#6366F1',
    location: 'Paris, France', askingPrice: '850 000 €',
    annualRevenue: '1 200 000 €', growth: '+24%',
    match: 91, views: 267, reference: 'RVQ-7714',
    verified: true, hot: true,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 3, title: 'Cabinet comptable régional',
    sector: 'Services', sectorColor: '#10B981',
    location: 'Bordeaux, France', askingPrice: '390 000 €',
    annualRevenue: '610 000 €', growth: '+7%',
    match: 88, views: 131, reference: 'RVQ-7562',
    verified: false, hot: false,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 4, title: 'E-commerce bio omnicanal',
    sector: 'Retail', sectorColor: '#EC4899',
    location: 'Nantes, France', askingPrice: '320 000 €',
    annualRevenue: '790 000 €', growth: '+18%',
    match: 90, views: 209, reference: 'RVQ-7448',
    verified: true, hot: true,
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&auto=format&fit=crop&q=80'
  }
];

/* ─────────────────────────────────────────
   Composant Home
───────────────────────────────────────── */
export default function Home() {
  const { language } = useLanguage();

  const isFr = language === 'fr';

  const stats = useMemo(
    () => ({ businesses: 547, matches: 1248, countries: 8, experts: 320 }),
    []
  );

  const [toolsOpen, setToolsOpen] = useState(false);

  const topNavLinks = [
    { label: isFr ? 'Céder' : 'Sell', to: createPageUrl('Ceder') },
    { label: isFr ? 'Reprendre' : 'Buy', to: createPageUrl('Reprendre') },
    { label: isFr ? 'Experts' : 'Experts', to: createPageUrl('Expert') }
  ];

  const toolItems = [
    { icon: Calculator, labelFr: 'Simulateur valorisation', labelEn: 'Valuation simulator', page: 'Valuations' },
    { icon: Landmark, labelFr: 'Simulateur financement', labelEn: 'Financing simulator', page: 'Financing' },
    { icon: Banknote, labelFr: 'Simulateur de cession', labelEn: 'Sale simulator', page: 'Targeting' },
  ];

  const platformFeatures = [
    {
      icon: Brain,
      title: isFr ? 'Smartmatching intelligent' : 'Smart matching',
      desc: isFr
        ? "L'algorithme analyse vos critères réels — secteur, géographie, EBITDA cible — pour prioriser les opportunités vraiment compatibles. Pas du volume, de la précision."
        : 'Algorithm analyzes real criteria to prioritize truly compatible opportunities. Precision, not volume.',
      checkItems: isFr
        ? ['Critères multi-dimensionnels', 'Score de compatibilité 0–100', 'Mise à jour en temps réel']
        : ['Multi-dimensional criteria', 'Compatibility score 0–100', 'Real-time updates'],
    },
    {
      icon: MessageCircle,
      title: isFr ? 'Messagerie transactionnelle' : 'Deal messaging',
      desc: isFr ? 'Échanges directs, qualifiés et tracés entre parties, avec déblocage des coordonnées à la demande.' : 'Direct, qualified communication with on-demand contact unlock.',
    },
    {
      icon: FolderLock,
      title: isFr ? 'Data Room sécurisée' : 'Secure Data Room',
      desc: isFr ? 'Documents chiffrés, NDA intégré, accès granulaire par dossier et par utilisateur.' : 'Encrypted documents, integrated NDA, granular per-user access.',
    },
    {
      icon: Users,
      title: isFr ? "Réseau d'experts" : 'Expert network',
      desc: isFr ? 'Avocats, experts-comptables et conseils M&A mobilisables au bon moment du deal.' : 'Lawyers, accountants and M&A advisors at the right deal stage.',
    }
  ];

  const decisionTools = [
    {
      icon: Calculator,
      title: isFr ? 'Outil de valorisation' : 'Valuation tool',
      subtitle: isFr ? 'Multiples · Bercy · DCF · Rapport PDF' : 'Multiples · Asset · DCF · PDF report',
      desc: isFr
        ? 'Croise les approches marché, patrimoniale et rentabilité pour une fourchette solide, défendable en négociation.'
        : 'Combines market, asset and profitability approaches for a solid, negotiation-ready range.',
      path: createPageUrl('Valuations')
    },
    {
      icon: Landmark,
      title: isFr ? 'Simulateur de financement' : 'Financing simulator',
      subtitle: isFr ? 'Dette supportable · DSCR · Cash post-reprise' : 'Debt capacity · DSCR · Post-deal cash',
      desc: isFr
        ? "Calculez votre capacité d'emprunt et le montage optimal entre apport personnel, dette bancaire et crédit vendeur."
        : 'Calculate your borrowing capacity and the optimal structure between equity, bank debt and seller note.',
      path: createPageUrl('Financing')
    },
    {
      icon: Banknote,
      title: isFr ? 'Produit net de cession' : 'Net proceeds calculator',
      subtitle: isFr ? 'Flat Tax · Barème · Holding' : 'Flat tax · Progressive · Holding',
      desc: isFr
        ? 'Calculez le montant réellement perçu après impôts, charges sociales et frais, selon votre situation fiscale.'
        : 'Calculate the amount actually received after taxes, social charges and fees, based on your tax situation.',
      path: createPageUrl('Targeting')
    }
  ];

  const transmissionSteps = [
    {
      num: '01', icon: ClipboardList,
      title: isFr ? 'Décision & préparation' : 'Decision & preparation',
      tag: isFr ? '12–24 mois avant' : '12–24 months prior',
      desc: isFr
        ? "C'est la phase que l'on sous-estime le plus. Nettoyer les comptes, réduire les dépendances personnelles, structurer la gouvernance. La valeur perçue par un repreneur se construit bien avant l'annonce."
        : 'The most underestimated phase. Clean accounts, reduce personal dependencies, structure governance. Perceived value is built long before the announcement.'
    },
    {
      num: '02', icon: BarChart3,
      title: isFr ? 'Valorisation & dossier' : 'Valuation & dossier',
      tag: isFr ? 'Étape fondatrice' : 'Foundational step',
      desc: isFr
        ? "Définir une fourchette juste et défendable avec les bons référentiels sectoriels. Construire un mémo vendeur clair qui raconte l'entreprise, ses atouts et son potentiel."
        : 'Define a fair, defensible range using sector benchmarks. Build a clear seller memo that tells the story of the business.'
    },
    {
      num: '03', icon: Users,
      title: isFr ? 'Sourcing & matching' : 'Sourcing & matching',
      tag: isFr ? 'Phase critique' : 'Critical phase',
      desc: isFr
        ? "Identifier les repreneurs sérieux et qualifiés financièrement, tout en préservant la discrétion vis-à-vis des salariés, clients et fournisseurs. Le bon repreneur ne se trouve pas par hasard."
        : 'Identify financially qualified buyers while preserving confidentiality. The right buyer is not found by chance.'
    },
    {
      num: '04', icon: FileText,
      title: isFr ? 'Négociation & due diligence' : 'Negotiation & due diligence',
      tag: isFr ? 'Phase technique' : 'Technical phase',
      desc: isFr
        ? "LOI, audit comptable et juridique, data room, NDA. La phase où la valeur se défend — et où les mauvaises surprises surviennent quand on n'est pas préparé."
        : 'LOI, legal/financial audit, data room, NDA. Where value is defended — and surprises arise when unprepared.'
    },
    {
      num: '05', icon: Handshake,
      title: isFr ? 'Protocole & closing' : 'Protocol & closing',
      tag: isFr ? 'Finalisation' : 'Finalization',
      desc: isFr
        ? "Rédaction des actes définitifs, levée des conditions suspensives, transfert de direction et plan d'intégration. La fin d'un cycle, le début du suivant."
        : 'Final deed drafting, condition lifting, management transfer and integration plan. The end of one cycle, the start of the next.'
    }
  ];

  const supportSteps = [
    {
      icon: Phone,
      title: isFr ? 'Appel stratégique' : 'Strategic call',
      desc: isFr ? '30 min pour comprendre votre projet, votre entreprise et vos objectifs.' : '30 min to understand your project, business and objectives.'
    },
    {
      icon: BarChart3,
      title: isFr ? 'Diagnostic & valorisation' : 'Diagnosis & valuation',
      desc: isFr ? 'Analyse complète de votre entreprise et fourchette de valeur argumentée.' : 'Full business analysis and argued valuation range.'
    },
    {
      icon: UserCheck,
      title: isFr ? 'Sourcing actif' : 'Active sourcing',
      desc: isFr ? 'Recherche proactive de repreneurs qualifiés via notre réseau et notre technologie.' : 'Proactive search for qualified buyers via our network and technology.'
    },
    {
      icon: Handshake,
      title: isFr ? "Jusqu'au closing" : 'Until closing',
      desc: isFr ? "Négociation, due diligence, actes. L'équipe reste engagée jusqu'à la signature." : 'Negotiation, due diligence, deeds. The team stays engaged until signing.'
    }
  ];


  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <SEO pageName="Home" />
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes signal-expand {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        @keyframes soft-pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        .mock-marquee-track {
          animation: marquee 54s linear infinite;
        }
        .mock-marquee-wrapper:hover .mock-marquee-track {
          animation-play-state: paused;
        }
        .listing-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .listing-card:hover {
          transform: translateY(-5px);
          box-shadow:
            0 0 0 1px rgba(255,107,74,0.13),
            0 20px 60px rgba(255,107,74,0.08),
            0 4px 16px rgba(0,0,0,0.05);
        }
        .path-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .path-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.10);
        }
        .signal-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,107,74,0.35);
          animation: signal-expand 2.4s ease-out infinite;
        }
        .step-connector::before {
          content: '';
          position: absolute;
          left: 1.75rem;
          top: 3.75rem;
          bottom: -0.5rem;
          width: 1px;
          background: linear-gradient(to bottom, rgba(255,107,74,0.25), transparent);
        }
      `}</style>


      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#F0ECE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="sm" showText={false} />
            </Link>
            <div className="hidden md:flex items-center gap-7">
              {topNavLinks.map((link) => (
                <Link key={link.label} to={link.to}
                  className="text-[#3B4759] hover:text-[#FF6B4A] transition-colors font-display font-medium text-sm">
                  {link.label}
                </Link>
              ))}
              {/* Dropdown Outils */}
              <div
                className="relative"
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 text-[#3B4759] hover:text-[#FF6B4A] transition-colors font-display font-medium text-sm"
                >
                  {isFr ? 'Outils' : 'Tools'}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
                </button>
                {toolsOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-[#EDE6E0] rounded-xl shadow-lg p-2 w-60 z-50">
                    {toolItems.map((tool) => (
                      <Link
                        key={tool.page}
                        to={createPageUrl(tool.page)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FFF0ED] transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#FFF0ED] flex items-center justify-center group-hover:bg-[#FFD5C7] transition-colors flex-shrink-0">
                          <tool.icon className="w-4 h-4 text-[#FF6B4A]" />
                        </div>
                        <span className="text-sm font-medium text-[#3B4759] group-hover:text-[#FF6B4A] transition-colors font-display">
                          {isFr ? tool.labelFr : tool.labelEn}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to={createPageUrl('Login')}
                className="text-[#3B4759] hover:text-[#FF6B4A] transition-colors font-display font-medium text-sm px-3 py-2">
                {isFr ? 'Se connecter' : 'Login'}
              </Link>
              <Link to={createPageUrl('AccountCreation')}>
                <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-5 font-display font-semibold text-sm">
                  {isFr ? 'Commencer gratuitement' : 'Start for free'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          1. HERO — section standalone, centrée
      ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-[#FAF9F7]"
        style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        {/* Dot grid subtil */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-dot-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="0.85" fill="#3B4759" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dot-grid)" />
        </svg>

        {/* Halos coral */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[36rem] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(255,107,74,0.09) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-0 left-[5%] w-[28rem] h-[28rem] rounded-full pointer-events-none"
          style={{ background: 'rgba(255,107,74,0.04)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-[5%] w-[24rem] h-[24rem] rounded-full pointer-events-none"
          style={{ background: 'rgba(255,107,74,0.04)', filter: 'blur(80px)' }} />

        {/* Content centré */}
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">

          {/* Badge institutionnel */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#EDE6E0] bg-white shadow-sm mb-10"
          >
            <BadgeCheck className="w-4 h-4 text-[#FF6B4A] shrink-0" />
            <span className="text-sm font-semibold text-[#3B4759]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {isFr ? "Plateforme et service d'accompagnement M&A dédié à la transmission d'entreprise" : 'Platform and M&A advisory service dedicated to business transfer'}
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-display font-bold tracking-tight text-[#3B4759] mb-7"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 1.04 }}
          >
            {isFr ? (
              <>
                Reprenez & Cédez<br />une entreprise{' '}
                <span style={{
                  backgroundImage: 'linear-gradient(90deg, #FF6B4A 0%, #FF8C6A 50%, #FFB39A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>en toute confiance.</span>
              </>
            ) : (
              <>
                Acquire & Sell<br />a business{' '}
                <span style={{
                  backgroundImage: 'linear-gradient(90deg, #FF6B4A, #FFB39A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>with confidence.</span>
              </>
            )}
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-[1.1rem] leading-relaxed text-[#6B7A94] mb-12"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {isFr
              ? "Riviqo accompagne cédants, repreneurs et professionnels à chaque étape d'une opération : évaluation, recherche de contrepartie, sécurisation et closing."
              : "Riviqo supports sellers, buyers and advisors at every stage of a transaction: valuation, counterpart sourcing, deal securing and closing."}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-14"
          >
            <Link to={createPageUrl('AccountCreation')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-5 text-base font-display font-semibold shadow-lg"
                style={{ boxShadow: '0 4px 20px rgba(255,107,74,0.30)' }}>
                {isFr ? 'Déposer une annonce de cession' : 'List my business for sale'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Annonces')}>
              <Button variant="outline"
                className="border-[#EDE6E0] bg-white text-[#3B4759] hover:border-[#FF6B4A] hover:text-[#FF6B4A] rounded-full px-8 py-5 text-base font-display font-semibold">
                {isFr ? 'Voir les annonces de cession' : 'Browse business listings'}
              </Button>
            </Link>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {[
              { val: '547+', label: isFr ? 'annonces vérifiées' : 'verified listings' },
              { val: '1 248', label: isFr ? 'matchs générés' : 'matches generated' },
              { val: '8', label: isFr ? 'pays couverts' : 'countries' },
              { val: '98 %', label: isFr ? 'de satisfaction' : 'satisfaction rate' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <span className="hidden sm:block w-px h-5 bg-[#DFD9D3]" />}
                <span className="font-mono text-base font-bold text-[#FF6B4A]">{item.val}</span>
                <span className="text-sm text-[#6B7A94]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. MARKET STATS — centrée, séparateurs
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#FAF9F7] border-y border-[#EDE6E0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Titre de section */}
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EDE6E0] text-xs font-bold uppercase tracking-wider text-[#6B7A94] mb-4 font-display">
              <BarChart3 className="w-3.5 h-3.5 text-[#FF6B4A]" />
              {isFr ? 'Le marché de la transmission' : 'The transfer market'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3B4759]">
              {isFr
                ? "La transmission d'entreprise en France, en chiffres"
                : 'Business transfer in France, by the numbers'}
            </h2>
          </div>

          {/* Stats avec séparateurs */}
          <div className="flex flex-col sm:flex-row items-stretch">
            {[
              {
                stat: '700 000',
                label: isFr ? 'entreprises françaises à transmettre' : 'French businesses to transfer',
                sub: isFr ? "d'ici 2034" : 'by 2034',
                icon: Building2
              },
              {
                stat: '1 / 3',
                label: isFr ? 'des cessions échouent' : 'of transfers fail',
                sub: isFr ? "faute de méthode ou d'accompagnement" : 'for lack of method or support',
                icon: AlertTriangle
              },
              {
                stat: '18 mois',
                label: isFr ? 'délai moyen pour céder' : 'average time to sell',
                sub: isFr ? 'Riviqo Advisory réduit ce délai de moitié' : 'Riviqo Advisory cuts this timeline in half',
                icon: Clock
              },
              {
                stat: '60 %',
                label: isFr ? 'des cédants sous-valorisent' : 'of sellers undervalue',
                sub: isFr ? 'leur entreprise au moment de céder' : 'their business when selling',
                icon: BarChart3
              }
            ].map((item, i) => (
              <motion.div
                key={item.stat}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex-1 flex flex-col items-center text-center px-6 py-8 sm:py-0 relative"
              >
                {/* Séparateur vertical entre items */}
                {i > 0 && (
                  <div className="hidden sm:block absolute left-0 top-4 bottom-4 w-px bg-[#DFD9D3]" />
                )}
                {/* Séparateur horizontal mobile */}
                {i > 0 && (
                  <div className="sm:hidden w-12 h-px bg-[#DFD9D3] mb-8" />
                )}

                {/* Icône */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: '#FFF0ED', border: '1px solid #FFD5C7' }}>
                  <item.icon className="w-5 h-5 text-[#FF6B4A]" />
                </div>

                {/* Grand chiffre */}
                <p className="font-mono font-bold text-[#FF6B4A] mb-2 leading-none"
                  style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)' }}>
                  {item.stat}
                </p>

                {/* Label principal */}
                <p className="font-display font-semibold text-[#3B4759] text-sm mb-1 leading-snug">
                  {item.label}
                </p>

                {/* Sous-label */}
                <p className="text-xs text-[#6B7A94] leading-snug"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {item.sub}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Source */}
          <p className="text-center text-[11px] text-[#B4BEC9] mt-10"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {isFr ? 'Sources : Bpifrance · INSEE · CCI France 2024' : 'Sources: Bpifrance · INSEE · CCI France 2024'}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. FEATURED LISTINGS — rail amélioré
          Fond : #FFFFFF
      ══════════════════════════════════════════ */}
      <section id="annonces" className="py-20 bg-white border-b border-[#F0ECE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0ED] text-[#FF6B4A] text-xs font-semibold uppercase tracking-wider mb-3 font-display">
                <BadgeCheck className="w-3.5 h-3.5" />{isFr ? 'Dossiers disponibles' : 'Available listings'}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759] mb-1">
                {isFr ? 'Entreprises à reprendre' : 'Businesses for sale'}
              </h2>
              <p className="text-sm text-[#6B7A94]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {isFr ? "Une sélection d'annonces qualifiées et vérifiées par nos équipes." : 'A selection of qualified listings verified by our teams.'}
              </p>
            </div>
            <Link to={createPageUrl('Annonces')}
              className="hidden sm:inline-flex items-center gap-1.5 text-[#FF6B4A] hover:text-[#FF5733] transition-colors font-semibold text-sm font-display">
              {isFr ? 'Toutes les annonces' : 'All listings'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mock-marquee-wrapper overflow-hidden">
            <div className="mock-marquee-track flex gap-5 w-max pb-3">
              {[...mockFeaturedListings, ...mockFeaturedListings].map((listing, index) => (
                <article key={`${listing.id}-${index}`}
                  className="listing-card w-[376px] shrink-0 bg-white rounded-2xl border border-[#EDE5DF] shadow-md overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48">
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)' }} />
                    {/* Badges gauche */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          background: listing.sectorColor + '22',
                          color: listing.sectorColor,
                          border: `1px solid ${listing.sectorColor}35`,
                          fontFamily: 'Plus Jakarta Sans, sans-serif'
                        }}>
                        {listing.sector}
                      </span>
                      {listing.verified && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{
                            background: 'rgba(255,107,74,0.15)',
                            color: '#FF6B4A',
                            border: '1px solid rgba(255,107,74,0.25)',
                            fontFamily: 'Plus Jakarta Sans, sans-serif'
                          }}>
                          <CheckCircle2 className="w-2.5 h-2.5" />{isFr ? 'Vérifié' : 'Verified'}
                        </span>
                      )}
                      {listing.hot && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{
                            background: 'rgba(255,107,74,0.12)',
                            color: '#FF8C6A',
                            border: '1px solid rgba(255,107,74,0.20)',
                            fontFamily: 'Plus Jakarta Sans, sans-serif'
                          }}>
                          🔥 Hot
                        </span>
                      )}
                    </div>
                    {/* Vues */}
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-white"
                      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <Eye className="w-3 h-3" />{listing.views}
                    </div>
                    {/* Match score */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[11px] font-bold shadow-lg bg-[#FF6B4A]"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {listing.match}% match
                    </div>
                  </div>

                  {/* Corps */}
                  <div className="p-4">
                    <h3 className="font-display text-[15px] font-semibold text-[#3B4759] leading-snug mb-1.5 line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-[#6B7A94] mb-4"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <MapPin className="w-3.5 h-3.5" />{listing.location}
                    </p>
                    {/* Métriques */}
                    <div className="grid grid-cols-3 gap-2 py-3 mb-4"
                      style={{ borderTop: '1px solid #F0E8E3', borderBottom: '1px solid #F0E8E3' }}>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#6B7A94] mb-0.5"
                          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>CA annuel</p>
                        <p className="font-mono text-[13px] font-semibold text-[#3B4759]">{listing.annualRevenue}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#6B7A94] mb-0.5"
                          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{isFr ? 'Croiss.' : 'Growth'}</p>
                        <p className="font-mono text-[13px] font-semibold flex items-center gap-0.5"
                          style={{ color: '#2E7D32' }}>
                          <TrendingUp className="w-3 h-3" />{listing.growth}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#6B7A94] mb-0.5"
                          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Réf.</p>
                        <p className="font-mono text-[11px] text-[#6B7A94]">{listing.reference}</p>
                      </div>
                    </div>
                    {/* Prix + CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#6B7A94] mb-0.5"
                          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          {isFr ? 'Prix demandé' : 'Asking price'}
                        </p>
                        <p className="font-mono text-[1.35rem] font-bold leading-none text-[#FF6B4A]">
                          {listing.askingPrice}
                        </p>
                      </div>
                      <Link to={createPageUrl('Annonces')}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF6B4A] hover:text-[#FF5733] transition-colors font-display">
                        {isFr ? "Voir l'annonce" : 'View listing'} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. DEUX PARCOURS — cédant / repreneur
          Fond : #FAF9F7 (crème)
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-[#FAF9F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759] mb-3">
              {isFr ? 'Quel est votre projet ?' : 'What is your project?'}
            </h2>
            <p className="text-[#6B7A94] max-w-lg mx-auto"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {isFr
                ? 'Deux chemins distincts, un seul objectif : réussir votre opération dans les meilleures conditions.'
                : 'Two distinct paths, one goal: a successful transaction under the best conditions.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Cédant — coral */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="path-card rounded-3xl p-10 text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #FF6B4A 0%, #FF5733 100%)' }}
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full"
                style={{ background: 'rgba(255,255,255,0.10)' }} />
              <div className="absolute -bottom-16 -left-8 w-36 h-36 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.20)' }}>
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 font-display"
                  style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {isFr ? 'Dirigeants & Cédants' : 'Owners & Sellers'}
                </span>
                <h3 className="font-display text-3xl font-bold mb-4">
                  {isFr ? 'Je cède mon entreprise' : 'I want to sell my business'}
                </h3>
                <p className="text-sm leading-relaxed mb-7"
                  style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {isFr
                    ? "Vous avez construit de la valeur sur le long terme. Une cession réussie nécessite une valorisation rigoureuse, des repreneurs qualifiés et un processus sécurisé du protocole au closing."
                    : "You've built long-term value. A successful exit requires rigorous valuation, qualified buyers, and a structured process from protocol to closing."}
                </p>
                <ul className="space-y-2.5 mb-8">
                  {(isFr
                    ? ['Valorisation multi-méthodes (Multiples, DCF, Bercy)', 'Accès à des repreneurs et investisseurs qualifiés', 'Accompagnement juridique et fiscal jusqu\'au closing']
                    : ['Multi-method valuation (Multiples, DCF, Asset)', 'Access to qualified buyers and investors', 'Legal and tax support until closing']
                  ).map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: 'rgba(255,255,255,0.70)' }} />{item}
                    </li>
                  ))}
                </ul>
                <Link to={createPageUrl('AccountCreation')}>
                  <Button className="bg-white hover:bg-white/90 rounded-full px-6 font-display font-semibold"
                    style={{ color: '#FF6B4A' }}>
                    {isFr ? 'Déposer mon annonce' : 'Post my listing'}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Repreneur — blanc avec bordure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="path-card rounded-3xl p-10 relative overflow-hidden bg-white"
              style={{ border: '1px solid #EDE6E0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full"
                style={{ background: 'rgba(255,107,74,0.04)' }} />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
                  style={{ background: '#FFF0ED', border: '1px solid #FFD5C7' }}>
                  <Search className="w-7 h-7 text-[#FF6B4A]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 font-display text-[#6B7A94]">
                  {isFr ? 'Repreneurs & Investisseurs' : 'Buyers & Investors'}
                </span>
                <h3 className="font-display text-3xl font-bold mb-4 text-[#3B4759]">
                  {isFr ? 'Je reprends ou j\'investis' : 'I want to acquire a business'}
                </h3>
                <p className="text-sm leading-relaxed mb-7 text-[#6B7A94]"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {isFr
                    ? "Qu'il s'agisse d'une première acquisition ou d'une opération de croissance externe, Riviqo vous donne accès à un catalogue d'annonces qualifiées, avec les outils pour évaluer leur faisabilité avant tout engagement."
                    : "Whether it's a first acquisition or external growth, Riviqo gives you access to a catalogue of qualified listings with tools to assess feasibility before committing."}
                </p>
                <ul className="space-y-2.5 mb-8">
                  {(isFr
                    ? ["Catalogue d'annonces évaluées et vérifiées", 'Simulation de capacité de financement', 'Accompagnement à la due diligence']
                    : ['Catalogue of evaluated and verified listings', 'Financing capacity simulation', 'Due diligence support']
                  ).map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#6B7A94]"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#FF6B4A]" />{item}
                    </li>
                  ))}
                </ul>
                <Link to={createPageUrl('Annonces')}>
                  <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-6 font-display font-semibold">
                    {isFr ? 'Accéder aux annonces' : 'Browse listings'}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. MISSION ÉDITORIALE — fond blanc
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-white border-y border-[#F0ECE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0ED] border border-[#FFD5C7] text-[#FF6B4A] text-[10px] font-bold uppercase tracking-widest mb-8 font-display">
                <BadgeCheck className="w-3.5 h-3.5" />{isFr ? 'Notre mission' : 'Our mission'}
              </span>

              <h2 className="font-display font-bold leading-[1.05] mb-6 text-[#3B4759]"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                {isFr ? (
                  <>
                    La transmission d'entreprise<br />est une décision stratégique.<br />
                    <span style={{
                      backgroundImage: 'linear-gradient(90deg, #FF6B4A, #FF9F8A)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>Elle se prépare et se conclut<br />avec méthode.</span>
                  </>
                ) : (
                  <>
                    A business transfer is<br />a strategic decision.<br />
                    <span style={{
                      backgroundImage: 'linear-gradient(90deg, #FF6B4A, #FF9F8A)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>It requires preparation<br />and a structured process.</span>
                  </>
                )}
              </h2>

              <div className="w-12 h-0.5 mb-6 bg-[#FF6B4A]" />

              <p className="text-[1.05rem] leading-relaxed text-[#6B7A94]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {isFr
                  ? "En France, plus de 700 000 entreprises devront changer de mains d'ici 2034. Parmi elles, des milliers ne trouveront pas de repreneur — non par manque d'intérêt, mais par manque de méthode. Riviqo apporte aux cédants, repreneurs et professionnels les outils et l'accompagnement nécessaires pour structurer chaque opération."
                  : "In France, over 700,000 businesses will change hands by 2034. Among them, thousands will fail to find a buyer — not for lack of interest, but lack of method. Riviqo provides sellers, buyers and advisors the tools and support needed to structure every transaction."}
              </p>
            </motion.div>

            {/* Stats proof */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: `${stats.businesses}+`, label: isFr ? 'Entreprises listées' : 'Listed businesses', sub: isFr ? 'PME & ETI vérifiées' : 'Verified SMB & mid-market' },
                { value: `${stats.matches}+`,    label: isFr ? 'Matchs qualifiés' : 'Qualified matches',  sub: isFr ? 'générés par l\'IA' : 'AI-generated' },
                { value: `${stats.countries}`,   label: isFr ? 'Pays couverts' : 'Countries',             sub: isFr ? 'Europe en priorité' : 'Europe first' },
                { value: '98%',                  label: isFr ? 'Satisfaction projet' : 'Satisfaction',    sub: isFr ? 'des utilisateurs actifs' : 'of active users' }
              ].map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl p-5 bg-[#FAF9F7]"
                  style={{ border: '1px solid #EDE6E0' }}>
                  <p className="font-mono text-3xl font-bold text-[#FF6B4A] mb-0.5">{stat.value}</p>
                  <p className="text-sm font-semibold font-display text-[#3B4759]">{stat.label}</p>
                  <p className="text-xs mt-1 text-[#6B7A94]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{stat.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. LES 5 ÉTAPES — contenu éducatif
          Fond : #FFFFFF
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* Titre sticky */}
            <div className="lg:col-span-2 lg:sticky lg:top-24">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0ED] text-[#FF6B4A] text-xs font-bold uppercase tracking-wider mb-5 font-display">
                <ClipboardList className="w-3.5 h-3.5" />{isFr ? 'Le process' : 'The process'}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759] mb-5">
                {isFr ? (
                  <>Les 5 étapes<br />d'une transmission<br /><span className="text-[#FF6B4A]">réussie</span></>
                ) : (
                  <>The 5 steps of<br />a <span className="text-[#FF6B4A]">successful</span><br />transfer</>
                )}
              </h2>
              <p className="text-[#6B7A94] leading-relaxed mb-8"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {isFr
                  ? "De la décision initiale à la signature finale, chaque étape compte. Une transmission bien préparée se joue souvent 12 à 24 mois avant l'annonce."
                  : "From the initial decision to the final signature, every step matters. A well-prepared transfer is often planned 12–24 months in advance."}
              </p>
              <Link to={createPageUrl('AccountCreation')}>
                <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-6 font-display font-semibold">
                  {isFr ? 'Commencer ma transmission' : 'Start my transfer'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Steps */}
            <div className="lg:col-span-3 space-y-0">
              {transmissionSteps.map((step, idx) => (
                <motion.div key={step.num}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  className={`relative flex gap-5 pb-8 ${idx < transmissionSteps.length - 1 ? 'step-connector' : ''}`}>
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFF0ED] border border-[#FFD5C7] flex items-center justify-center relative z-10">
                      <step.icon className="w-6 h-6 text-[#FF6B4A]" />
                    </div>
                  </div>
                  <div className="pt-1 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-bold tracking-widest text-[#FF6B4A]">{step.num}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#F4F6F8] text-[#6B7A94] px-2.5 py-0.5 rounded-full"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#3B4759] mb-2">{step.title}</h3>
                    <p className="text-[#6B7A94] text-sm leading-relaxed"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. PLATFORM FEATURES
          Fond : #FAF9F7 (crème)
      ══════════════════════════════════════════ */}
      <section id="solutions" className="py-24 bg-[#FAF9F7] border-y border-[#F0ECE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0ED] text-[#FF6B4A] text-xs font-bold uppercase tracking-wider mb-4 font-display">
              <Sparkles className="w-3.5 h-3.5" />{isFr ? 'Solutions' : 'Solutions'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759] mb-3">
              {isFr ? 'La plateforme M&A pour les professionnels de la transmission.' : 'The M&A platform for business transfer professionals.'}
            </h2>
            <p className="text-[#6B7A94]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {isFr
                ? "Riviqo centralise les outils nécessaires à chaque étape d'une opération — du matching initial à la signature finale."
                : 'Riviqo centralizes the tools needed at every stage of a transaction — from initial matching to final signing.'}
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-5">
            {/* Smartmatching — featured */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 rounded-3xl p-7 flex flex-col"
              style={{ background: 'linear-gradient(135deg, #FFF2EE, #FFE8E0)', border: '1px solid #FFCFBE' }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(255,107,74,0.12)', border: '1px solid rgba(255,107,74,0.18)' }}>
                <Brain className="w-6 h-6 text-[#FF6B4A]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B4A] mb-3 font-display">
                {isFr ? 'Fonctionnalité clé' : 'Core feature'}
              </span>
              <h3 className="font-display text-2xl font-bold text-[#3B4759] mb-3">
                {isFr ? 'Smartmatching intelligent' : 'Smart matching'}
              </h3>
              <p className="leading-relaxed mb-6 flex-1 text-[#6B7A94]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{platformFeatures[0].desc}</p>
              <ul className="space-y-2.5">
                {platformFeatures[0].checkItems.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#3B4759]"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    <CheckCircle2 className="w-4 h-4 text-[#FF6B4A] shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* 3 autres features */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {platformFeatures.slice(1).map((feature, idx) => (
                <motion.div key={feature.title}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-2xl bg-white p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  style={{ border: '1px solid #EDE6E0' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: '#FFF0ED', border: '1px solid #FFD5C7' }}>
                    <feature.icon className="w-5 h-5 text-[#FF6B4A]" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#3B4759] mb-1">{feature.title}</h3>
                    <p className="text-sm text-[#6B7A94] leading-relaxed"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. ACCOMPAGNEMENT — fond coral light
      ══════════════════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: '#FFF0ED' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 font-display bg-white border border-[#FFD5C7] text-[#FF6B4A]">
                <UserCheck className="w-3.5 h-3.5" />
                {isFr ? 'Riviqo Advisory' : 'Riviqo Advisory'}
              </span>

              <h2 className="font-display font-bold leading-[1.05] mb-6 text-[#3B4759]"
                style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3rem)' }}>
                {isFr ? (
                  <>
                    Riviqo Advisory :<br />
                    <span style={{
                      backgroundImage: 'linear-gradient(90deg, #FF6B4A, #FF9F8A)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>un accompagnement structuré,</span>
                    <br />de la valorisation au closing.
                  </>
                ) : (
                  <>
                    Riviqo Advisory:<br />
                    <span style={{
                      backgroundImage: 'linear-gradient(90deg, #FF6B4A, #FF9F8A)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>structured support,</span>
                    <br />from valuation to closing.
                  </>
                )}
              </h2>

              <p className="text-sm font-semibold text-[#FF6B4A] mb-4 font-display">
                {isFr
                  ? "Sans accompagnement, un dirigeant perd en moyenne 12 à 24 mois sur sa transmission."
                  : "Without support, a business owner loses on average 12 to 24 months on their transfer."}
              </p>

              <p className="leading-relaxed mb-8 text-[#6B7A94]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {isFr
                  ? "Riviqo Advisory accélère chaque étape de votre transmission. Pour les opérations complexes ou les dirigeants qui souhaitent un pilotage complet de leur dossier, nos équipes prennent en charge l'intégralité du processus : évaluation, constitution du dossier, sourcing des contreparties, négociation et finalisation juridique."
                  : "Riviqo Advisory accelerates every stage of your transfer. For complex transactions or owners who want full management of their deal, our teams handle the entire process: valuation, dossier preparation, counterpart sourcing, negotiation and legal finalization."}
              </p>

              <Link to={createPageUrl('Contact')}>
                <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-7 py-5 font-display font-semibold text-base">
                  {isFr ? 'Demander un appel stratégique' : 'Request a strategic call'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <p className="text-xs mt-4 text-[#6B7A94]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {isFr ? '✓ Gratuit · Sans engagement · Réponse en moins de 24h' : '✓ Free · No commitment · Response in under 24h'}
              </p>
            </motion.div>

            {/* 4 étapes accompagnement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {supportSteps.map((step, i) => (
                <motion.div key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl p-5 bg-white"
                  style={{ border: '1px solid #FFD5C7', boxShadow: '0 2px 12px rgba(255,107,74,0.06)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: '#FFF0ED', border: '1px solid #FFD5C7' }}>
                    <step.icon className="w-5 h-5 text-[#FF6B4A]" />
                  </div>
                  <h4 className="font-display text-base font-semibold text-[#3B4759] mb-2">{step.title}</h4>
                  <p className="text-sm leading-relaxed text-[#6B7A94]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. PERSONAS — 3 profils professionnels
          Fond : #FAF9F7 (crème)
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-[#FAF9F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759] mb-3">
              {isFr ? 'Pour qui ?' : 'Who is it for?'}
            </h2>
            <p className="text-[#6B7A94] max-w-lg mx-auto" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {isFr
                ? 'Dirigeants, repreneurs, investisseurs, professionnels du conseil — une plateforme conçue pour les opérations sérieuses.'
                : 'Owners, buyers, investors, advisors — a platform built for serious transactions.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Dirigeants & Cédants — coral */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="rounded-3xl p-8 text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #FF6B4A, #FF5733)' }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
              <div className="relative">
                <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 font-display"
                  style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {isFr ? 'TPE · PME · ETI · Fondateurs' : 'SMB · Mid-market · Founders'}
                </span>
                <h3 className="font-display text-2xl font-bold mb-4">{isFr ? 'Je cède mon entreprise' : 'I want to sell'}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {isFr
                    ? "Vous avez construit de la valeur sur le long terme. Une cession réussie nécessite une valorisation rigoureuse, des repreneurs qualifiés et un processus sécurisé du protocole au closing."
                    : "You've built long-term value. A successful exit needs rigorous valuation, qualified buyers and a secured process from protocol to closing."}
                </p>
                <ul className="space-y-2.5 mb-7">
                  {(isFr
                    ? ['Valorisation multi-méthodes (Multiples, DCF, Bercy)', 'Accès à des repreneurs et investisseurs qualifiés', 'Accompagnement juridique et fiscal jusqu\'au closing']
                    : ['Multi-method valuation (Multiples, DCF, Asset)', 'Access to qualified buyers and investors', 'Legal and tax support until closing']
                  ).map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'rgba(255,255,255,0.70)' }} />{item}
                    </li>
                  ))}
                </ul>
                <Link to={createPageUrl('AccountCreation')}>
                  <Button className="bg-white hover:bg-white/90 rounded-full px-5 font-display font-semibold text-sm"
                    style={{ color: '#FF6B4A' }}>
                    {isFr ? 'Céder mon entreprise' : 'Sell my business'} <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Repreneurs & Investisseurs — blanc */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.09 }}
              className="rounded-3xl p-8 relative overflow-hidden bg-white"
              style={{ border: '1px solid #EDE6E0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'rgba(255,107,74,0.04)' }} />
              <div className="relative">
                <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 font-display text-[#6B7A94]">
                  {isFr ? 'Entrepreneurs · Fonds · Family Offices' : 'Entrepreneurs · Funds · Family Offices'}
                </span>
                <h3 className="font-display text-2xl font-bold mb-4 text-[#3B4759]">{isFr ? 'Je reprends ou j\'investis' : 'I want to acquire'}</h3>
                <p className="text-sm leading-relaxed mb-6 text-[#6B7A94]"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {isFr
                    ? "Qu'il s'agisse d'une première acquisition ou d'une opération de croissance externe, Riviqo vous donne accès à un catalogue d'annonces qualifiées, avec les outils pour évaluer leur faisabilité financière avant tout engagement."
                    : "Whether a first acquisition or external growth operation, Riviqo gives you access to a catalogue of qualified listings with tools to assess financial feasibility."}
                </p>
                <ul className="space-y-2.5 mb-7">
                  {(isFr
                    ? ["Catalogue d'annonces évaluées et vérifiées", 'Simulation de capacité de financement', 'Accompagnement à la due diligence']
                    : ['Catalogue of evaluated and verified listings', 'Financing capacity simulation', 'Due diligence support']
                  ).map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[#6B7A94]"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#FF6B4A]" />{item}
                    </li>
                  ))}
                </ul>
                <Link to={createPageUrl('Annonces')}>
                  <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-5 font-display font-semibold text-sm">
                    {isFr ? 'Accéder aux annonces' : 'Browse listings'} <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Professionnels du conseil — blanc */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.18 }}
              className="rounded-3xl p-8 relative overflow-hidden bg-white"
              style={{ border: '1px solid #EDE6E0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
                style={{ background: 'rgba(255,107,74,0.04)' }} />
              <div className="relative">
                <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 font-display text-[#6B7A94]">
                  {isFr ? 'Cabinets M&A · EC · Avocats · CGP' : 'M&A firms · Accountants · Lawyers'}
                </span>
                <h3 className="font-display text-2xl font-bold mb-4 text-[#3B4759]">{isFr ? 'Je conseille des clients' : 'I advise clients'}</h3>
                <p className="text-sm leading-relaxed mb-6 text-[#6B7A94]"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {isFr
                    ? "Intervenez au cœur des opérations de vos clients avec une plateforme collaborative dédiée : data room sécurisée, NDA intégré, messagerie transactionnelle et suivi de dossiers en temps réel."
                    : "Operate at the center of your clients' transactions with a dedicated collaborative platform: secure data room, integrated NDA, transactional messaging and real-time deal tracking."}
                </p>
                <ul className="space-y-2.5 mb-7">
                  {(isFr
                    ? ['Data Room et NDA intégrés', 'Accès multi-dossiers et multi-clients', 'Réseau de co-conseil et d\'apporteurs']
                    : ['Data Room and integrated NDA', 'Multi-deal and multi-client access', 'Co-advisory and referral network']
                  ).map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-[#6B7A94]"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#FF6B4A]" />{item}
                    </li>
                  ))}
                </ul>
                <Link to={createPageUrl('Contact')}>
                  <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-5 font-display font-semibold text-sm">
                    {isFr ? 'Rejoindre le réseau' : 'Join the network'} <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          10. OUTILS DE DÉCISION
          Fond : #FFFFFF
      ══════════════════════════════════════════ */}
      <section id="outils" className="py-24 bg-white border-y border-[#F0ECE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0ED] text-[#FF6B4A] text-xs font-bold uppercase tracking-wider mb-4 font-display">
              <Calculator className="w-3.5 h-3.5" />{isFr ? 'Outils de décision' : 'Decision tools'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759] mb-4">
              {isFr ? "L'écosystème de décision" : 'Decision ecosystem'}
            </h2>
            <p className="text-[#6B7A94] max-w-2xl mx-auto" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {isFr
                ? "Trois outils d'analyse pour piloter la valorisation, la capacité de financement et le produit net de votre cession."
                : 'Three analysis tools to manage valuation, financing capacity and your net proceeds.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {decisionTools.map((tool, idx) => (
              <motion.div key={tool.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.09 }}>
                <Link to={tool.path} className="block h-full">
                  <div className="h-full bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                    style={{ border: '1px solid #EDE6E0' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: '#FFF0ED', border: '1px solid #FFD5C7' }}>
                      <tool.icon className="w-6 h-6 text-[#FF6B4A]" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#3B4759] mb-1">{tool.title}</h3>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B4A] mb-4 font-display">{tool.subtitle}</p>
                    <p className="text-[#6B7A94] text-sm leading-relaxed mb-6"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{tool.desc}</p>
                    <span className="inline-flex items-center gap-2 text-[#FF6B4A] font-semibold text-sm group-hover:gap-3 transition-all font-display">
                      {isFr ? 'Découvrir' : 'Discover'} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          11. CTA FINAL — fond coral gradient
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-[#FAF9F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl text-white px-8 py-16 lg:px-16 text-center"
            style={{ background: 'linear-gradient(135deg, #FF6B4A 0%, #FF5733 100%)' }}>
            {/* Dot grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-dots" width="36" height="36" patternUnits="userSpaceOnUse">
                  <circle cx="18" cy="18" r="0.9" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-dots)" />
            </svg>
            <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.05)' }} />

            <div className="relative">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 font-display"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: 'white'
                }}>
                <Sparkles className="w-3.5 h-3.5" />{isFr ? 'Commencez maintenant' : 'Get started'}
              </span>

              <h2 className="font-display font-bold mb-5 max-w-2xl mx-auto text-white"
                style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)' }}>
                {isFr ? 'Prêt à lancer votre projet de transmission ?' : 'Ready to launch your transfer project?'}
              </h2>

              <p className="text-lg max-w-xl mx-auto mb-10 text-white/80"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {isFr
                  ? "De la valorisation au closing, Riviqo met à votre disposition les outils, les experts et l'accompagnement pour réussir votre opération."
                  : 'From valuation to closing, Riviqo provides the tools, experts and support to succeed in your transaction.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl('AccountCreation')}>
                  <Button className="bg-white hover:bg-white/90 px-8 py-6 text-base font-semibold rounded-full shadow-xl font-display"
                    style={{ color: '#FF6B4A' }}>
                    {isFr ? 'Créer un compte gratuit' : 'Create a free account'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl('Annonces')}>
                  <Button variant="outline"
                    className="border-white/40 text-white hover:bg-white/10 px-8 py-6 text-base rounded-full font-display">
                    {isFr ? 'Voir les annonces' : 'Browse listings'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
