// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, ChevronRight, Landmark, Rocket } from 'lucide-react';
import SEO from '@/components/SEO';

const CHAPTERS = [
  {
    id: 'definition',
    num: '01',
    titleFr: "Qu'est-ce que le repreneuriat ?",
    titleEn: 'What is entrepreneurship through acquisition?',
    contentFr: `Le repreneuriat — contraction de « reprise » et « entrepreneuriat » — désigne le fait de devenir entrepreneur en rachetant une entreprise existante plutôt qu'en créant de zéro. C'est un modèle en plein essor en France et en Europe.

**Pourquoi le repreneuriat explose :**
- **700 000 entreprises** à transmettre en France dans les 10 prochaines années (source : BPCE L'Observatoire)
- **60 % des dirigeants de PME** ont plus de 55 ans et n'ont pas de repreneur identifié
- Le taux de survie à 5 ans d'une entreprise reprise est de **90 %**, contre **50 %** pour une création
- Les banques financent plus facilement une reprise qu'une création (historique, actifs, EBITDA)

**Le repreneuriat, c'est pour qui ?**
- Les cadres en reconversion qui veulent devenir leur propre patron
- Les entrepreneurs expérimentés qui veulent accélérer via l'acquisition
- Les jeunes diplômés ambitieux qui préfèrent un actif existant à un projet risqué
- Les investisseurs qui cherchent du rendement immédiat avec un levier bancaire`,
    contentEn: `Entrepreneurship through acquisition (ETA) means becoming a business owner by buying an existing company rather than starting from scratch. It's a rapidly growing model in France and across Europe.

**Why ETA is booming:**
- **700,000 businesses** to be transferred in France over the next 10 years (source: BPCE Observatory)
- **60% of SME owners** are over 55 and have no identified successor
- The 5-year survival rate of an acquired business is **90%**, compared to **50%** for a startup
- Banks finance acquisitions more easily than startups (track record, assets, EBITDA)

**Who is ETA for?**
- Executives in career transition who want to become their own boss
- Experienced entrepreneurs who want to accelerate through acquisition
- Ambitious graduates who prefer an existing asset to a risky startup
- Investors seeking immediate returns with bank leverage`,
  },
  {
    id: 'avantages-risques',
    num: '02',
    titleFr: 'Repreneuriat vs création : avantages et risques',
    titleEn: 'ETA vs startup: advantages and risks',
    contentFr: `Le repreneuriat n'est pas sans risque, mais il offre un rapport bénéfice/risque nettement supérieur à la création d'entreprise.

**Les avantages du repreneuriat :**
- **Revenus dès le jour 1** : l'entreprise a déjà des clients, des contrats, un chiffre d'affaires
- **Financement bancaire facilité** : les banques prêtent sur la base de l'EBITDA historique, pas de projections
- **Infrastructure en place** : locaux, équipes, processus, fournisseurs — tout est opérationnel
- **Risque réduit** : vous connaissez les chiffres réels avant d'acheter (due diligence)
- **Délai de lancement** : 3 à 6 mois pour être opérationnel, contre 12 à 24 mois en création

**Les risques à anticiper :**
- **Passif caché** : dettes non révélées, litiges en cours, conformité réglementaire
- **Dépendance au dirigeant sortant** : clients liés au fondateur, perte de savoir-faire
- **Résistance au changement** : les salariés et clients peuvent mal réagir à un nouveau dirigeant
- **Surévaluation** : payer trop cher par rapport à la rentabilité réelle
- **Sous-capitalisation** : ne pas prévoir assez de trésorerie pour les premiers mois post-reprise

**Comment minimiser les risques :**
- Due diligence approfondie (financière, juridique, sociale, fiscale)
- Garantie d'actif et de passif (GAP) solide
- Période de transition avec le cédant (3 à 12 mois)
- Matelas de trésorerie post-reprise (3 à 6 mois de charges)`,
    contentEn: `ETA is not without risk, but it offers a significantly better risk/reward ratio than starting a business from scratch.

**Advantages of ETA:**
- **Revenue from day 1**: the company already has clients, contracts, revenue
- **Easier bank financing**: banks lend based on historical EBITDA, not projections
- **Infrastructure in place**: premises, teams, processes, suppliers — everything is operational
- **Reduced risk**: you know the real numbers before buying (due diligence)
- **Time to launch**: 3 to 6 months to be operational, vs 12 to 24 months for a startup

**Risks to anticipate:**
- **Hidden liabilities**: undisclosed debts, ongoing litigation, regulatory compliance
- **Dependence on outgoing owner**: clients tied to the founder, loss of know-how
- **Resistance to change**: employees and clients may react poorly to a new leader
- **Overvaluation**: paying too much relative to actual profitability
- **Undercapitalization**: not planning enough cash for the first post-acquisition months

**How to minimize risks:**
- Thorough due diligence (financial, legal, social, tax)
- Solid asset and liability guarantee (W&I)
- Transition period with the seller (3 to 12 months)
- Post-acquisition cash cushion (3 to 6 months of expenses)`,
  },
  {
    id: 'profil-repreneur',
    num: '03',
    titleFr: 'Le profil du repreneur idéal',
    titleEn: 'The ideal buyer profile',
    contentFr: `Il n'existe pas de profil unique du repreneur. Mais certaines qualités et compétences augmentent significativement vos chances de réussite.

**Les compétences clés :**
- **Leadership** : capacité à fédérer une équipe existante autour d'un nouveau projet
- **Gestion financière** : comprendre un bilan, un compte de résultat, un tableau de flux
- **Vision stratégique** : identifier les leviers de croissance et d'optimisation
- **Résilience** : les 12 premiers mois post-reprise sont intenses et exigeants
- **Humilité** : écouter avant de changer, comprendre avant de décider

**L'apport personnel :**
Les banques exigent généralement 20 à 30 % du prix de cession en apport personnel. Pour une entreprise à 500 000 €, comptez 100 000 à 150 000 €.

**Les dispositifs pour compléter l'apport :**
- **Prêt d'honneur** (BPI, réseau Initiative) : 0 %, sans garantie, jusqu'à 90 k€
- **Love money** : famille et amis
- **Business angels** : en échange de parts minoritaires
- **Crowdlending** : financement participatif pour compléter

**L'importance du projet personnel :**
Avant de chercher une cible, clarifiez votre projet : pourquoi reprendre ? Quel secteur ? Quelle taille ? Quel style de management ? Un projet flou génère des mois de recherche infructueuse.`,
    contentEn: `There is no single buyer profile. But certain qualities and skills significantly increase your chances of success.

**Key skills:**
- **Leadership**: ability to unite an existing team around a new project
- **Financial management**: understanding a balance sheet, income statement, cash flow statement
- **Strategic vision**: identifying growth and optimization levers
- **Resilience**: the first 12 months post-acquisition are intense and demanding
- **Humility**: listen before changing, understand before deciding

**Personal contribution:**
Banks generally require 20 to 30% of the sale price as personal contribution. For a €500,000 business, plan €100,000 to €150,000.

**Schemes to supplement the contribution:**
- **Honor loan** (BPI, Initiative network): 0%, no guarantee, up to €90k
- **Love money**: family and friends
- **Business angels**: in exchange for minority shares
- **Crowdlending**: crowdfunding to supplement

**The importance of the personal project:**
Before searching for a target, clarify your project: why acquire? Which sector? What size? What management style? A vague project generates months of fruitless searching.`,
  },
  {
    id: 'etapes-cles',
    num: '04',
    titleFr: 'Les étapes clés du repreneuriat',
    titleEn: 'Key steps in entrepreneurship through acquisition',
    contentFr: `Le parcours du repreneur se déroule en 6 étapes principales, sur une durée de 6 à 18 mois selon la complexité de l'opération.

**Étape 1 — Définir son projet (1 mois)**
Secteur, taille, localisation, budget, objectif. Formalisez vos critères de recherche.

**Étape 2 — Sourcing et identification (2 à 6 mois)**
Parcourez les plateformes spécialisées comme Riviqo, activez le SmartMatching, sollicitez votre réseau et les intermédiaires M&A. C'est souvent la phase la plus longue.

**Étape 3 — Premiers contacts et NDA (2 semaines)**
Demandez le mémorandum d'information (MI), signez un accord de confidentialité (NDA), analysez les premiers chiffres.

**Étape 4 — Lettre d'intention et due diligence (2 à 3 mois)**
Rédigez une LOI (offre non contraignante), obtenez l'exclusivité, lancez l'audit complet : financier, juridique, social, fiscal, opérationnel.

**Étape 5 — Financement et négociation (1 à 2 mois)**
Montez votre plan de financement, sollicitez les banques, négociez le prix définitif, la GAP et les conditions de transition.

**Étape 6 — Closing et prise en main (1 mois)**
Signature des actes, déblocage des fonds, transfert des pouvoirs, communication aux équipes et clients. Les 100 premiers jours sont déterminants.

**Conseil Riviqo :**
Ne faites pas tout seul. Un avocat d'affaires, un expert-comptable et un conseiller M&A sont indispensables pour sécuriser chaque étape.`,
    contentEn: `The buyer's journey unfolds in 6 main stages, over a period of 6 to 18 months depending on the complexity of the deal.

**Step 1 — Define your project (1 month)**
Sector, size, location, budget, objective. Formalize your search criteria.

**Step 2 — Sourcing and identification (2 to 6 months)**
Browse specialized platforms like Riviqo, activate SmartMatching, reach out to your network and M&A intermediaries. This is often the longest phase.

**Step 3 — First contacts and NDA (2 weeks)**
Request the information memorandum (IM), sign a non-disclosure agreement (NDA), analyze the initial figures.

**Step 4 — Letter of intent and due diligence (2 to 3 months)**
Draft a LOI (non-binding offer), obtain exclusivity, launch the full audit: financial, legal, social, tax, operational.

**Step 5 — Financing and negotiation (1 to 2 months)**
Build your financing plan, approach banks, negotiate the final price, W&I guarantee and transition terms.

**Step 6 — Closing and takeover (1 month)**
Signing of deeds, release of funds, power transfer, communication to teams and clients. The first 100 days are critical.

**Riviqo tip:**
Don't do it alone. A business lawyer, accountant and M&A advisor are essential to secure each step.`,
  },
  {
    id: 'financement',
    num: '05',
    titleFr: 'Comment financer son projet de repreneuriat',
    titleEn: 'How to finance your acquisition project',
    contentFr: `Le financement est souvent le premier frein perçu par les repreneurs. Pourtant, les banques financent volontiers les reprises d'entreprises rentables.

**Le montage classique :**
- **Apport personnel** : 20–30 % du prix (minimum exigé par les banques)
- **Dette senior bancaire** : 50–60 % sur 5 à 7 ans (remboursement via l'EBITDA de la cible)
- **Prêt d'honneur BPI** : 5–10 % à taux 0 %, sans garantie personnelle
- **Crédit vendeur** : 10–20 % différé sur 2 à 4 ans (montre la confiance du cédant)

**L'indicateur clé : le DSCR**
Le DSCR (Debt Service Coverage Ratio) mesure la capacité de l'entreprise à rembourser sa dette :
- DSCR = EBITDA retraité / service annuel de la dette
- DSCR < 1,0 = montage non finançable
- DSCR > 1,2 = montage acceptable pour une banque
- DSCR > 1,5 = montage confortable

**Les aides et dispositifs :**
- **ACRE** : exonération de cotisations sociales la 1ère année
- **NACRE** : accompagnement et prêt à taux 0
- **Prêt d'honneur** : BPI France, réseau Initiative, réseau Entreprendre
- **Garantie BPI** : couvre 50–70 % du risque bancaire, facilite l'accord de prêt

**Utilisez notre simulateur de financement** pour calculer en 2 minutes votre DSCR, la dette senior maximale et le cash disponible post-reprise.`,
    contentEn: `Financing is often the first perceived barrier for buyers. Yet banks willingly finance acquisitions of profitable businesses.

**The classic structure:**
- **Personal contribution**: 20–30% of price (minimum required by banks)
- **Senior bank debt**: 50–60% over 5 to 7 years (repaid via target's EBITDA)
- **BPI honor loan**: 5–10% at 0% rate, no personal guarantee
- **Seller credit**: 10–20% deferred over 2 to 4 years (shows seller confidence)

**The key indicator: DSCR**
The DSCR (Debt Service Coverage Ratio) measures the company's ability to repay its debt:
- DSCR = Restated EBITDA / annual debt service
- DSCR < 1.0 = non-financeable structure
- DSCR > 1.2 = acceptable structure for a bank
- DSCR > 1.5 = comfortable structure

**Available support schemes:**
- **ACRE**: social contribution exemption in the 1st year
- **NACRE**: support and 0% loan
- **Honor loan**: BPI France, Initiative network, Entreprendre network
- **BPI guarantee**: covers 50–70% of bank risk, facilitates loan approval

**Use our financing simulator** to calculate in 2 minutes your DSCR, maximum senior debt and available post-acquisition cash.`,
  },
  {
    id: 'erreurs',
    num: '06',
    titleFr: 'Les erreurs à éviter',
    titleEn: 'Mistakes to avoid',
    contentFr: `La plupart des échecs en repreneuriat ne viennent pas d'un mauvais choix de cible, mais d'erreurs évitables dans le processus ou la phase post-reprise.

**Les 10 erreurs les plus fréquentes :**

**1. Ne pas définir son projet avant de chercher**
Résultat : des mois de recherche dispersée, des opportunités non pertinentes et une fatigue décisionnelle.

**2. Sous-estimer la durée du processus**
Une reprise prend en moyenne 9 à 15 mois. Prévoyez un runway financier personnel suffisant.

**3. Négliger la due diligence**
L'enthousiasme ne remplace pas l'audit. Un passif caché de 100 k€ peut transformer une bonne affaire en cauchemar.

**4. Payer trop cher**
Le prix doit être justifié par l'EBITDA retraité et le DSCR du montage. Un multiple > 6x EBITDA doit être solidement argumenté.

**5. Sous-capitaliser le montage**
Prévoir uniquement le prix d'achat sans matelas de trésorerie (BFR, imprévus) est une erreur fatale.

**6. Négliger la période de transition**
Le départ brutal du cédant peut entraîner la perte de clients clés et de savoir-faire opérationnel.

**7. Vouloir tout changer immédiatement**
Écoutez pendant 3 mois, ajustez pendant 3 mois, transformez ensuite. L'empressement fait fuir les talents.

**8. Ne pas s'entourer de professionnels**
Avocat, expert-comptable, conseiller M&A — leur coût est dérisoire comparé aux erreurs qu'ils évitent.

**9. Ignorer la culture d'entreprise**
Un repreneur qui impose un style managérial incompatible provoque une hémorragie de salariés.

**10. Ne pas avoir de plan post-reprise**
Les 100 premiers jours doivent être planifiés : communication interne, relations clients, diagnostic opérationnel, objectifs à 12 mois.`,
    contentEn: `Most failures in ETA don't come from a bad target choice, but from avoidable mistakes in the process or post-acquisition phase.

**The 10 most common mistakes:**

**1. Not defining your project before searching**
Result: months of scattered searching, irrelevant opportunities and decision fatigue.

**2. Underestimating the process duration**
An acquisition takes an average of 9 to 15 months. Plan sufficient personal financial runway.

**3. Neglecting due diligence**
Enthusiasm doesn't replace auditing. A €100k hidden liability can turn a good deal into a nightmare.

**4. Paying too much**
Price must be justified by restated EBITDA and the deal's DSCR. A multiple > 6x EBITDA needs solid justification.

**5. Undercapitalizing the deal**
Planning only for the purchase price without a cash cushion (WCR, contingencies) is a fatal mistake.

**6. Neglecting the transition period**
The seller's abrupt departure can lead to loss of key clients and operational know-how.

**7. Wanting to change everything immediately**
Listen for 3 months, adjust for 3 months, then transform. Rushing drives away talent.

**8. Not surrounding yourself with professionals**
Lawyer, accountant, M&A advisor — their cost is negligible compared to the mistakes they prevent.

**9. Ignoring company culture**
A buyer who imposes an incompatible management style causes an employee exodus.

**10. Not having a post-acquisition plan**
The first 100 days must be planned: internal communication, client relations, operational diagnosis, 12-month objectives.`,
  },
];

export default function GuideRepreneuriat() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <SEO pageName="GuideRepreneuriat" />
      {/* Hero */}
      <section className="bg-[#FAF9F7] pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
            <Rocket className="w-3.5 h-3.5" />
            {isFr ? 'Guide du repreneuriat 2025' : 'ETA Guide 2025'}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B4759] leading-tight mb-6">
            {isFr
              ? 'Le repreneuriat : le guide complet pour devenir entrepreneur par la reprise'
              : 'Entrepreneurship through acquisition: the complete guide to becoming a business owner'}
          </h1>
          <p className="text-lg text-[#6B7A94] max-w-2xl mx-auto mb-8 leading-relaxed">
            {isFr
              ? "Reprendre une entreprise existante est la voie la plus rapide vers l'entrepreneuriat. Ce guide couvre tout : définition, avantages, financement, étapes clés et erreurs à éviter."
              : "Acquiring an existing business is the fastest path to entrepreneurship. This guide covers everything: definition, advantages, financing, key steps and mistakes to avoid."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Annonces')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-7 py-5 font-display font-semibold">
                <Landmark className="w-4 h-4 mr-2" />
                {isFr ? 'Voir les entreprises à reprendre' : 'View businesses for sale'}
              </Button>
            </Link>
            <Link to={createPageUrl('Financing')}>
              <Button variant="outline" className="rounded-full px-7 py-5 font-display font-semibold border-[#3B4759] text-[#3B4759] hover:bg-[#3B4759] hover:text-white">
                {isFr ? 'Simuler mon financement' : 'Simulate my financing'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Table des matières */}
      <section className="py-10 px-4 bg-white border-y border-[#F0ECE6]">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-[#6B7A94] uppercase tracking-wider mb-4">{isFr ? 'Table des matières' : 'Table of contents'}</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {CHAPTERS.map((ch) => (
              <a
                key={ch.id}
                href={`#${ch.id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFF0ED] transition-colors group"
              >
                <span className="font-mono text-xs text-[#FF6B4A] font-bold">{ch.num}</span>
                <span className="text-sm font-medium text-[#3B4759] group-hover:text-[#FF6B4A] transition-colors">{isFr ? ch.titleFr : ch.titleEn}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#6B7A94] ml-auto flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Chapitres */}
      <section className="py-16 px-4 bg-[#FAF9F7]">
        <div className="max-w-4xl mx-auto space-y-16">
          {CHAPTERS.map((ch) => (
            <article key={ch.id} id={ch.id} className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-sm font-bold text-[#FF6B4A] flex-shrink-0">{ch.num}</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3B4759]">{isFr ? ch.titleFr : ch.titleEn}</h2>
              </div>
              <div className="w-12 h-0.5 bg-[#FF6B4A] mb-6" />
              <div className="text-[#6B7A94] leading-relaxed space-y-1">
                {(isFr ? ch.contentFr : ch.contentEn).split('\n').map((line, li) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h3 key={li} className="font-display font-semibold text-[#3B4759] text-lg mt-6 mb-2">{line.replace(/\*\*/g, '')}</h3>;
                  }
                  if (line.startsWith('- **')) {
                    const parts = line.slice(2).split('**');
                    return (
                      <p key={li} className="flex gap-2 text-sm">
                        <span className="text-[#FF6B4A] flex-shrink-0 mt-0.5">&bull;</span>
                        <span><strong className="text-[#3B4759]">{parts[1]}</strong>{parts[2] || ''}</span>
                      </p>
                    );
                  }
                  if (line.startsWith('- ')) {
                    return <p key={li} className="flex gap-2 text-sm"><span className="text-[#FF6B4A] flex-shrink-0">&bull;</span>{line.slice(2)}</p>;
                  }
                  if (line === '') return <div key={li} className="h-3" />;
                  return <p key={li} className="text-sm">{line}</p>;
                })}
              </div>
              {ch.id === 'financement' && (
                <div className="mt-8 p-5 bg-[#FFF4F1] rounded-xl border border-[#FFD8CC]">
                  <p className="text-sm font-medium text-[#FF6B4A] mb-2">{isFr ? 'Simulateur gratuit' : 'Free simulator'}</p>
                  <p className="text-sm text-[#3B4759] mb-3">{isFr ? 'Calculez votre DSCR et la dette senior maximale finançable en 2 minutes.' : 'Calculate your DSCR and maximum financeable senior debt in 2 minutes.'}</p>
                  <Link to={createPageUrl('Financing')}>
                    <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full text-sm px-5 py-2 font-display font-semibold">
                      {isFr ? 'Tester mon montage' : 'Test my structure'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#3B4759]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            {isFr ? 'Lancez-vous dans le repreneuriat' : 'Start your acquisition journey'}
          </h2>
          <p className="text-[#B7C2D4] mb-8 max-w-xl mx-auto">
            {isFr
              ? "Parcourez les entreprises à reprendre sur Riviqo et utilisez nos outils pour préparer votre projet d'acquisition."
              : "Browse businesses for sale on Riviqo and use our tools to prepare your acquisition project."}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Link to={createPageUrl('AccountCreation')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold">
                {isFr ? 'Commencer gratuitement' : 'Start for free'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Annonces')}>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-display font-semibold border-white/30 text-white hover:bg-white/10">
                {isFr ? 'Voir les annonces' : 'View listings'}
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-display font-semibold border-white/30 text-white hover:bg-white/10">
                {isFr ? 'Parler à un expert M&A' : 'Talk to an M&A expert'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
