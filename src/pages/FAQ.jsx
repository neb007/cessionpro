// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import SEO from '@/components/SEO';

const CATEGORIES = [
  {
    idFr: 'general', idEn: 'general',
    titleFr: 'Général',
    titleEn: 'General',
    questions: [
      {
        qFr: "Qu'est-ce que Riviqo ?",
        qEn: "What is Riviqo?",
        aFr: "Riviqo est à la fois une plateforme technologique de transmission d'entreprise et un service d'accompagnement M&A. Nous combinons des outils professionnels (valorisation, simulation de financement, produit net de cession) avec l'accompagnement d'une équipe d'experts dédiés — du premier diagnostic au closing. Riviqo est conçu pour rendre les opérations de cession et d'acquisition plus accessibles, plus transparentes et plus sécurisées.",
        aEn: "Riviqo is both a business transfer technology platform and an M&A advisory service. We combine professional tools (valuation, financing simulation, net sale proceeds) with the support of a dedicated team of experts — from initial diagnosis to closing. Riviqo is designed to make sale and acquisition transactions more accessible, transparent and secure.",
      },
      {
        qFr: "Riviqo est-il gratuit ?",
        qEn: "Is Riviqo free?",
        aFr: "Riviqo propose un accès gratuit aux fonctionnalités essentielles : création de compte, accès aux annonces publiques, utilisation des simulateurs (valorisation, financement, produit net) et messagerie de base. Des options premium sont disponibles pour débloquer des fonctionnalités avancées : Data Room, contacts acheteurs illimités, SmartMatching avancé et accompagnement Advisory.",
        aEn: "Riviqo offers free access to essential features: account creation, access to public listings, use of simulators (valuation, financing, net proceeds) and basic messaging. Premium options are available to unlock advanced features: Data Room, unlimited buyer contacts, advanced SmartMatching and Advisory support.",
      },
      {
        qFr: "Dans quels pays Riviqo est-il disponible ?",
        qEn: "In which countries is Riviqo available?",
        aFr: "Riviqo est actuellement disponible en France, Belgique, Luxembourg et Suisse. L'expansion vers d'autres pays européens (Espagne, Italie, Allemagne) est prévue pour 2026-2027. La plateforme est disponible en français et en anglais.",
        aEn: "Riviqo is currently available in France, Belgium, Luxembourg and Switzerland. Expansion to other European countries (Spain, Italy, Germany) is planned for 2026-2027. The platform is available in French and English.",
      },
      {
        qFr: "Qu'est-ce que Riviqo Advisory ?",
        qEn: "What is Riviqo Advisory?",
        aFr: "Riviqo Advisory est le service d'accompagnement M&A de Riviqo. Il propose un accompagnement complet pour les opérations de cession et d'acquisition : un expert M&A dédié pilote votre dossier de bout en bout (valorisation, data room, matching, négociation, closing). C'est l'offre idéale pour les dirigeants qui souhaitent être accompagnés au-delà des outils en libre-service de la plateforme. Tarification sur devis.",
        aEn: "Riviqo Advisory is Riviqo's M&A advisory service. It offers comprehensive support for sale and acquisition transactions: a dedicated M&A expert manages your file end-to-end (valuation, data room, matching, negotiation, closing). It's the ideal offer for business owners who want support beyond the platform's self-service tools. Pricing on request.",
      },
      {
        qFr: "Comment contacter le support Riviqo ?",
        qEn: "How to contact Riviqo support?",
        aFr: "Notre équipe est disponible via la messagerie intégrée à la plateforme (sous 24h ouvrées), par e-mail à hello@riviqo.com ou via le formulaire de contact. Pour les dossiers Advisory, un expert dédié vous est assigné personnellement.",
        aEn: "Our team is available via the integrated messaging platform (within 24 business hours), by email at hello@riviqo.com or via the contact form. For Advisory files, a dedicated expert is personally assigned to you.",
      },
    ],
  },
  {
    idFr: 'cession', idEn: 'sale',
    titleFr: 'Cession',
    titleEn: 'Selling',
    questions: [
      {
        qFr: "Comment déposer une annonce de cession sur Riviqo ?",
        qEn: "How to post a sale listing on Riviqo?",
        aFr: "Créez un compte gratuit, choisissez le profil 'Cédant', puis cliquez sur 'Déposer une annonce'. Vous renseignez les informations de base (secteur, CA, EBITDA, localisation, prix demandé). Votre annonce est publiée après validation par notre équipe, généralement sous 24-48h. Vous pouvez choisir une annonce confidentielle (informations masquées sauf aux repreneurs qualifiés ayant signé un NDA).",
        aEn: "Create a free account, choose the 'Seller' profile, then click 'Post a listing'. You fill in basic information (sector, revenue, EBITDA, location, asking price). Your listing is published after validation by our team, generally within 24-48 hours. You can choose a confidential listing (information masked except to qualified buyers who have signed an NDA).",
      },
      {
        qFr: "Combien de temps faut-il pour vendre son entreprise ?",
        qEn: "How long does it take to sell a business?",
        aFr: "La durée médiane d'une cession de PME est de 9 à 15 mois, de la mise en marché au closing. Cette durée dépend de la qualité du dossier, du secteur, du prix demandé et de la réactivité des parties. Une entreprise bien préparée (data room complète, comptes retraités, mémo d'information) se vend en moyenne 2 à 3 fois plus vite.",
        aEn: "The median duration of an SME sale is 9 to 15 months, from market listing to closing. This duration depends on file quality, sector, asking price and responsiveness of parties. A well-prepared company (complete data room, restated accounts, information memo) sells on average 2 to 3 times faster.",
      },
      {
        qFr: "Quelle est la fiscalité d'une cession de titres ?",
        qEn: "What is the taxation on a share sale?",
        aFr: "La plus-value sur cession de titres est soumise au PFU (Prélèvement Forfaitaire Unique) de 30 % (12,8 % IR + 17,2 % prélèvements sociaux) ou au barème progressif de l'IR sur option. Des abattements pour durée de détention s'appliquent en cas d'option au barème progressif (50 % pour 2-8 ans, 65 % au-delà). Des dispositifs spécifiques (Dutreil, abattement dirigeant partant en retraite) permettent de réduire significativement l'imposition. Utilisez notre simulateur gratuit pour estimer votre net.",
        aEn: "Capital gain on share sales is subject to the 30% flat tax (PFU) (12.8% income tax + 17.2% social contributions) or progressive income tax scale on option. Duration of ownership allowances apply with the progressive scale (50% for 2-8 years, 65% beyond). Specific schemes (Dutreil, retiring director allowance) can significantly reduce taxation. Use our free simulator to estimate your net.",
      },
      {
        qFr: "Puis-je vendre mon entreprise sans intermédiaire ?",
        qEn: "Can I sell my business without an intermediary?",
        aFr: "Oui, il est légalement possible de céder son entreprise sans mandataire. Riviqo permet d'ailleurs aux cédants de gérer leur processus en autonomie. Cependant, les statistiques montrent que les cessions accompagnées par un conseil (cabinet M&A, avocat) obtiennent en moyenne un prix de cession 15-20 % supérieur et se concluent plus rapidement. Pour les entreprises de moins de 500 k€, la cession en autonomie est plus courante.",
        aEn: "Yes, it is legally possible to sell your business without an intermediary. Riviqo even allows sellers to manage their process independently. However, statistics show that sales supported by an advisor (M&A firm, lawyer) obtain on average a 15-20% higher sale price and close more quickly. For businesses under €500k, independent sales are more common.",
      },
    ],
  },
  {
    idFr: 'reprise', idEn: 'acquisition',
    titleFr: 'Reprise',
    titleEn: 'Acquiring',
    questions: [
      {
        qFr: "Comment trouver une entreprise à reprendre sur Riviqo ?",
        qEn: "How to find a business to acquire on Riviqo?",
        aFr: "Créez un compte gratuit et choisissez le profil 'Repreneur'. Accédez aux annonces publiques dans la section 'Annonces', filtrez par secteur, CA, localisation et prix. Activez le SmartMatching pour recevoir des alertes automatiques sur les nouvelles cibles correspondant à votre profil. Pour les annonces confidentielles, demandez l'accès en signant un NDA électronique — le cédant valide votre demande.",
        aEn: "Create a free account and choose the 'Buyer' profile. Access public listings in the 'Listings' section, filter by sector, revenue, location and price. Activate SmartMatching to receive automatic alerts on new targets matching your profile. For confidential listings, request access by signing an electronic NDA — the seller validates your request.",
      },
      {
        qFr: "Quel apport faut-il pour financer une reprise ?",
        qEn: "What personal contribution is required to finance an acquisition?",
        aFr: "Les banques exigent généralement un apport personnel de 20 à 30 % du prix de cession. Pour un rachat à 600 k€, comptez 120 k€ à 180 k€ d'apport. Des compléments sont possibles via le prêt d'honneur BPI (jusqu'à 50-90 k€ selon les régions et profils) ou le réseau Initiative France. Notre simulateur de financement calcule instantanément la faisabilité selon votre apport.",
        aEn: "Banks generally require a personal contribution of 20 to 30% of the sale price. For a €600k acquisition, plan €120k to €180k in contribution. Supplements are possible via BPI honor loans (up to €50-90k depending on region and profile) or the Initiative France network. Our financing simulator instantly calculates feasibility based on your contribution.",
      },
      {
        qFr: "Qu'est-ce que le DSCR et quel niveau est requis ?",
        qEn: "What is DSCR and what level is required?",
        aFr: "Le DSCR (Debt Service Coverage Ratio) mesure la capacité de l'entreprise à rembourser sa dette : DSCR = EBITDA retraité / (annuités de dette + charges financières). Un DSCR < 1,0 signifie que l'entreprise ne peut pas rembourser sa dette — le montage est non-finançable. Les banques exigent généralement un DSCR > 1,2. Au-delà de 1,5, le montage est considéré confortable. Notre simulateur calcule automatiquement votre DSCR.",
        aEn: "DSCR (Debt Service Coverage Ratio) measures the company's ability to repay its debt: DSCR = Restated EBITDA / (debt installments + financial charges). A DSCR < 1.0 means the company cannot repay its debt — the structure is non-financeable. Banks generally require DSCR > 1.2. Above 1.5, the structure is considered comfortable. Our simulator automatically calculates your DSCR.",
      },
      {
        qFr: "Faut-il créer une holding pour reprendre une entreprise ?",
        qEn: "Is a holding company required to acquire a business?",
        aFr: "La création d'une holding (LBO — Leveraged Buyout) est recommandée pour les acquisitions avec levier bancaire significatif. Avantages : la holding rembourse le prêt avec les dividendes de la cible (régime mère-fille, quasi-exonération d'IS sur dividendes), optimisation de la rémunération du dirigeant et flexibilité pour les acquisitions multiples. Pour les petites opérations (< 200 k€), l'acquisition en direct est parfois plus simple.",
        aEn: "Creating a holding company (LBO — Leveraged Buyout) is recommended for acquisitions with significant bank leverage. Advantages: the holding repays the loan with dividends from the target (parent-subsidiary regime, near-exemption from corporate tax on dividends), optimization of director compensation and flexibility for multiple acquisitions. For small transactions (< €200k), direct acquisition is sometimes simpler.",
      },
    ],
  },
  {
    idFr: 'outils', idEn: 'tools',
    titleFr: 'Outils',
    titleEn: 'Tools',
    questions: [
      {
        qFr: "Comment fonctionne le simulateur de valorisation ?",
        qEn: "How does the valuation simulator work?",
        aFr: "Notre simulateur de valorisation utilise 3 méthodes complémentaires : (1) la méthode des multiples de marché — applique un multiple sectoriel à l'EBITDA ou au CA ; (2) la méthode DCF — actualise les flux prévisionnels ; (3) la méthode patrimoniale — calcule l'actif net corrigé. Il génère une fourchette de valorisation basse/médiane/haute, rend visible la pondération de chaque méthode et explique les retraitements recommandés. Résultats débloqués après saisie d'un e-mail.",
        aEn: "Our valuation simulator uses 3 complementary methods: (1) market multiples method — applies a sector multiple to EBITDA or revenue; (2) DCF method — discounts projected cash flows; (3) asset-based method — calculates adjusted net assets. It generates a low/median/high valuation range, shows the weighting of each method and explains recommended restatements. Results unlocked after entering an email.",
      },
      {
        qFr: "À quoi sert le simulateur de financement ?",
        qEn: "What is the financing simulator for?",
        aFr: "Le simulateur de financement permet à un repreneur de tester la faisabilité de son montage en quelques minutes. Il calcule : le DSCR (solvabilité), la dette senior maximale finançable par les banques, le cash disponible post-reprise (trésorerie résiduelle après remboursement de la dette), et l'impact du crédit vendeur ou du prêt d'honneur. Il distingue 3 niveaux : Finançable (DSCR > 1,2), Sous conditions (DSCR 0,9-1,2) et Risqué (DSCR < 0,9).",
        aEn: "The financing simulator allows a buyer to test the feasibility of their structure in minutes. It calculates: DSCR (solvency), maximum senior debt financeable by banks, available post-acquisition cash (residual treasury after debt repayment), and the impact of seller credit or honor loans. It distinguishes 3 levels: Financeable (DSCR > 1.2), Conditional (DSCR 0.9-1.2) and Risky (DSCR < 0.9).",
      },
      {
        qFr: "Qu'est-ce que le simulateur de produit net de cession ?",
        qEn: "What is the net sale proceeds simulator?",
        aFr: "Le simulateur de produit net estime le montant réellement encaissé par le cédant après impôts, prélèvements sociaux et frais de cession. Il prend en compte : le prix de cession, le prix de revient des titres, la durée de détention, le choix PFU ou barème progressif, les abattements applicables (durée de détention, Dutreil, retraite), les honoraires de cession (cabinet, avocat, notaire). Il affiche le net final et le taux d'imposition effectif.",
        aEn: "The net proceeds simulator estimates the amount actually received by the seller after taxes, social contributions and sale fees. It takes into account: sale price, cost basis of securities, holding period, choice of PFU or progressive scale, applicable allowances (holding period, Dutreil, retirement), sale fees (firm, lawyer, notary). It displays the final net and effective tax rate.",
      },
      {
        qFr: "Comment fonctionne le SmartMatching ?",
        qEn: "How does SmartMatching work?",
        aFr: "Le SmartMatching de Riviqo analyse en temps réel les profils cédants et repreneurs pour identifier les correspondances optimales. L'algorithme prend en compte : secteur, sous-secteur, taille (CA/EBITDA), localisation géographique, capacité de financement du repreneur, et critères spécifiques (croissance, type de clientèle...). Les repreneurs reçoivent des alertes email sur les nouvelles cibles compatibles. Les cédants voient les repreneurs qualifiés matchés sur leur annonce.",
        aEn: "Riviqo's SmartMatching analyzes seller and buyer profiles in real-time to identify optimal matches. The algorithm takes into account: sector, sub-sector, size (revenue/EBITDA), geographic location, buyer financing capacity, and specific criteria (growth, client type...). Buyers receive email alerts on new compatible targets. Sellers see qualified buyers matched on their listing.",
      },
    ],
  },
  {
    idFr: 'compte', idEn: 'account',
    titleFr: 'Compte & facturation',
    titleEn: 'Account & billing',
    questions: [
      {
        qFr: "Comment créer un compte sur Riviqo ?",
        qEn: "How to create an account on Riviqo?",
        aFr: "Cliquez sur 'Commencer gratuitement' ou 'Créer un compte' depuis la page d'accueil. Renseignez votre e-mail et un mot de passe, puis confirmez votre adresse e-mail. Choisissez votre profil principal (Cédant, Repreneur ou les deux). La création de compte est entièrement gratuite et ne nécessite aucun engagement.",
        aEn: "Click 'Start for free' or 'Create account' from the home page. Enter your email and a password, then confirm your email address. Choose your main profile (Seller, Buyer or both). Account creation is entirely free and requires no commitment.",
      },
      {
        qFr: "Quelles sont les options payantes de Riviqo ?",
        qEn: "What are Riviqo's paid options?",
        aFr: "Riviqo propose des options à la carte : Data Room (activation unique), contacts acheteurs supplémentaires, mise en avant d'annonce et SmartMatching avancé. Pour un accompagnement complet, l'offre Riviqo Advisory propose 3 formules sur devis : Accompagnement Cédant, Accompagnement Repreneur et Accès Conseil Professionnel. Consultez notre page Tarifs pour le détail.",
        aEn: "Riviqo offers à la carte options: Data Room (one-time activation), additional buyer contacts, listing promotion and advanced SmartMatching. For full support, the Riviqo Advisory offer includes 3 quote-based packages: Seller Support, Buyer Support and Professional Advisor Access. See our Pricing page for details.",
      },
      {
        qFr: "Mes données personnelles sont-elles sécurisées ?",
        qEn: "Are my personal data secure?",
        aFr: "Riviqo respecte le RGPD (Règlement Général sur la Protection des Données). Vos données personnelles ne sont jamais vendues à des tiers. Les documents de votre data room sont chiffrés avec AES-256. Les accès sont authentifiés et journalisés (audit trail). Vous pouvez demander la suppression de votre compte et de toutes vos données à tout moment en contactant privacy@riviqo.com.",
        aEn: "Riviqo complies with GDPR (General Data Protection Regulation). Your personal data is never sold to third parties. Your data room documents are encrypted with AES-256. Accesses are authenticated and logged (audit trail). You can request deletion of your account and all your data at any time by contacting privacy@riviqo.com.",
      },
      {
        qFr: "Comment fonctionne la facturation ?",
        qEn: "How does billing work?",
        aFr: "Les options à la carte sont facturées en une seule fois lors de l'achat, sans abonnement récurrent. Le paiement se fait par carte bancaire via Stripe (sécurisé 3D Secure). Pour les offres Advisory, la facturation est établie sur devis selon les modalités de l'accompagnement (forfait ou honoraires de résultat). Une facture est émise automatiquement après chaque paiement.",
        aEn: "À la carte options are billed once at purchase, with no recurring subscription. Payment is made by credit card via Stripe (3D Secure). For Advisory offers, billing is established by quote according to support modalities (fixed fee or success fee). An invoice is automatically issued after each payment.",
      },
    ],
  },
];

export default function FAQ() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [activeCategory, setActiveCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(null);

  const handleCategoryChange = (idx) => {
    setActiveCategory(idx);
    setOpenQuestion(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <SEO pageName="FAQ" />
      {/* Hero */}
      <section className="pt-20 pb-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
          <HelpCircle className="w-3.5 h-3.5" />
          {isFr ? 'Questions fréquentes' : 'Frequently asked questions'}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B4759] mb-4">
          {isFr ? 'FAQ Riviqo' : 'Riviqo FAQ'}
        </h1>
        <p className="text-[#6B7A94] max-w-xl mx-auto text-lg">
          {isFr
            ? "Toutes les réponses aux questions les plus posées sur la cession et la reprise d'entreprise avec Riviqo."
            : "All answers to the most asked questions about business sale and acquisition with Riviqo."}
        </p>
      </section>

      {/* Content */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Categories sidebar */}
          <aside className="md:w-52 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCategoryChange(i)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeCategory === i
                      ? 'bg-[#FFF0ED] text-[#FF6B4A] font-semibold'
                      : 'text-[#6B7A94] hover:bg-[#F5F0EB] hover:text-[#3B4759]'
                  }`}
                >
                  {isFr ? cat.titleFr : cat.titleEn}
                </button>
              ))}
            </nav>
          </aside>

          {/* Questions */}
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold text-[#3B4759] mb-5">
              {isFr ? CATEGORIES[activeCategory].titleFr : CATEGORIES[activeCategory].titleEn}
            </h2>
            <div className="space-y-3">
              {CATEGORIES[activeCategory].questions.map((q, i) => (
                <div key={i} className="bg-white border border-[#F0ECE6] rounded-xl overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                    onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
                  >
                    <span className="font-display font-medium text-[#3B4759] pr-4">{isFr ? q.qFr : q.qEn}</span>
                    <ChevronDown className={`w-4 h-4 text-[#6B7A94] transition-transform flex-shrink-0 ${openQuestion === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openQuestion === i && (
                    <div className="px-6 pb-5 text-sm text-[#6B7A94] leading-relaxed border-t border-[#F0ECE6] pt-4">
                      {isFr ? q.aFr : q.aEn}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA contact */}
      <section className="py-14 px-4 bg-white border-t border-[#F0ECE6]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-5 h-5 text-[#FF6B4A]" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#3B4759] mb-3">
            {isFr ? "Vous n'avez pas trouvé la réponse ?" : "Didn't find the answer?"}
          </h2>
          <p className="text-[#6B7A94] mb-6">
            {isFr
              ? "Notre équipe répond à toutes vos questions sous 24h ouvrées."
              : "Our team answers all your questions within 24 business hours."}
          </p>
          <Link to={createPageUrl('Contact')}>
            <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-5 font-display font-semibold">
              {isFr ? 'Contacter notre équipe' : 'Contact our team'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
