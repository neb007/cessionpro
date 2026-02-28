// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, ChevronRight, Landmark } from 'lucide-react';
import SEO from '@/components/SEO';

const CHAPTERS = [
  {
    id: 'projet',
    num: '01',
    titleFr: 'Définir son projet de reprise',
    titleEn: 'Defining your acquisition project',
    contentFr: `Avant de chercher une cible, vous devez définir précisément votre projet d'acquisition. Un projet flou génère des recherches interminables et des opportunités manquées.

**Les 5 dimensions à clarifier :**
- **Secteur** : Visez-vous votre secteur actuel ou une diversification ? La maîtrise sectorielle réduit le risque opérationnel post-reprise.
- **Taille** : Chiffre d'affaires cible, EBITDA minimum, nombre de salariés. Calé sur votre capacité de financement (apport × 4 à 5 = CA accessible).
- **Localisation** : Nationale, régionale, géographique précise ? Impacte fortement le pool de cibles disponibles.
- **Format juridique** : Rachat de fonds de commerce (simplicité, pas de passif caché) vs rachat de titres (passif potentiel mais continuité clientèle).
- **Horizon** : Projet de 3-5 ans de développement ou transmission familiale à 10-15 ans ?

**Le pacte d'actionnaires en amont :**
Si vous reprenez avec des associés, rédigez un pacte avant la signature. Il précise les pouvoirs, les conditions de sortie et la gouvernance — évite 90 % des conflits futurs.`,
    contentEn: `Before searching for a target, you must precisely define your acquisition project. A vague project generates endless searches and missed opportunities.

**The 5 dimensions to clarify:**
- **Sector**: Are you targeting your current sector or diversifying? Sector expertise reduces post-acquisition operational risk.
- **Size**: Target revenue, minimum EBITDA, number of employees. Calibrated to your financing capacity (contribution × 4 to 5 = accessible revenue).
- **Location**: National, regional, specific geographic? Strongly impacts the available target pool.
- **Legal format**: Business asset purchase (simplicity, no hidden liabilities) vs share purchase (potential liabilities but client continuity).
- **Horizon**: 3-5 year development project or 10-15 year family transfer?

**The shareholder agreement upfront:**
If acquiring with partners, draft a shareholder agreement before signing. It specifies powers, exit conditions and governance — prevents 90% of future conflicts.`,
  },
  {
    id: 'sourcing',
    num: '02',
    titleFr: 'Sourcing et identification des cibles',
    titleEn: 'Sourcing and target identification',
    contentFr: `Trouver la bonne cible est souvent la phase la plus longue et la plus frustrante. La plupart des bonnes opportunités ne sont pas sur les plateformes publiques.

**Sources de cibles :**
- **Plateformes spécialisées** (Riviqo, CessionPME, FUSACQ) : cibles qualifiées, informations disponibles, processus structuré
- **Réseau personnel** : le bouche-à-oreille reste la source n°1 des transactions > 1 M€
- **Experts-comptables** : contacts directs avec les dirigeants envisageant de céder
- **Banques** : gestionnaires de patrimoine au fait des projets de leurs clients
- **SmartMatching Riviqo** : algorithme qui vous présente les cibles correspondant à votre profil

**Critères de qualification d'une cible :**
Avant d'investir du temps dans l'analyse, vérifiez en quelques minutes :
- Résultats en croissance ou stables (2 ans minimum)
- Pas de dépendance excessive à 1-2 clients (> 30 % = risque)
- Dirigeant vendeur motivé (et non contraint)
- Prix de cession dans votre envelope de financement
- Localisation et secteur compatibles avec votre projet`,
    contentEn: `Finding the right target is often the longest and most frustrating phase. Most good opportunities are not on public platforms.

**Target sources:**
- **Specialized platforms** (Riviqo, CessionPME, FUSACQ): qualified targets, available information, structured process
- **Personal network**: word-of-mouth remains the #1 source for transactions > €1M
- **Accountants**: direct contacts with owners considering selling
- **Banks**: wealth managers aware of their clients' projects
- **Riviqo SmartMatching**: algorithm that presents targets matching your profile

**Target qualification criteria:**
Before investing time in analysis, check in a few minutes:
- Growing or stable results (2 years minimum)
- No excessive dependence on 1-2 clients (> 30% = risk)
- Motivated (not constrained) selling owner
- Sale price within your financing envelope
- Location and sector compatible with your project`,
  },
  {
    id: 'due-diligence',
    num: '03',
    titleFr: 'Due diligence approfondie',
    titleEn: 'In-depth due diligence',
    contentFr: `La due diligence (DD) est l'audit complet de la cible avant engagement définitif. Elle se déroule généralement en exclusivité, après signature de la LOI (Lettre d'Intention).

**Les 5 volets de la due diligence :**

**1. Due diligence financière**
- Retraitement des comptes : charges non récurrentes, rémunération anormale du dirigeant
- Analyse du BFR : évolution sur 3 ans, saisonnalité, délais clients/fournisseurs
- Trésorerie nette à la date de cession (incluse ou exclue du prix ?)
- Engagements hors bilan : avals, cautions, garanties données

**2. Due diligence juridique**
- Titres : qui détient quoi, clauses d'agrément, droits de préférence
- Contrats : durée, renouvellement, clauses de résiliation, transfert de contrats
- Contentieux en cours ou potentiels (prud'hommes, fiscal, commercial)
- Propriété intellectuelle : brevets, marques, logiciels, noms de domaine

**3. Due diligence sociale (RH)**
- Conventions collectives, accords d'entreprise
- Contrats clés : non-concurrence, loyauté, confidentialité
- Risques prud'homaux : CDD abusifs, heures sup non payées, discrimination

**4. Due diligence fiscale**
- Vérifications fiscales passées (VFG) et délais de prescription
- TVA récupérée ou payée anormalement
- Crédit impôt recherche (CIR) : risque de remise en cause

**5. Due diligence opérationnelle**
- Visite de site, rencontre des équipes clés
- État des équipements et des systèmes IT
- Dépendance à des fournisseurs uniques
- Carnet de commandes et pipeline commercial`,
    contentEn: `Due diligence (DD) is the complete audit of the target before final commitment. It generally takes place in exclusivity, after signing the LOI (Letter of Intent).

**The 5 due diligence tracks:**

**1. Financial due diligence**
- Account restatement: non-recurring charges, abnormal owner compensation
- WCR analysis: evolution over 3 years, seasonality, client/supplier payment terms
- Net cash at sale date (included or excluded from price?)
- Off-balance sheet commitments: endorsements, guarantees given

**2. Legal due diligence**
- Securities: who holds what, approval clauses, pre-emption rights
- Contracts: duration, renewal, termination clauses, contract transfer
- Ongoing or potential litigation (labor, tax, commercial)
- Intellectual property: patents, trademarks, software, domain names

**3. Social (HR) due diligence**
- Collective agreements, company agreements
- Key contracts: non-compete, loyalty, confidentiality
- Labor tribunal risks: abusive fixed-term contracts, unpaid overtime, discrimination

**4. Tax due diligence**
- Past tax audits and limitation periods
- Abnormally recovered or paid VAT
- Research tax credit (CIR): risk of challenge

**5. Operational due diligence**
- Site visit, meeting key teams
- Equipment and IT systems condition
- Dependence on single suppliers
- Order book and commercial pipeline`,
  },
  {
    id: 'financement',
    num: '04',
    titleFr: 'Structurer le financement',
    titleEn: 'Structuring the financing',
    contentFr: `Le financement d'une reprise se structure en 3 à 4 couches complémentaires. La clé est l'optimisation du DSCR (Debt Service Coverage Ratio) pour que l'entreprise puisse rembourser sa dette.

**Les composantes du financement :**

**1. Apport personnel (20–30 % du prix)**
Incontournable. Les banques exigent au minimum 20 % d'apport. Des fonds propres insuffisants = refus bancaire quasi-systématique.

**2. Dette senior bancaire (50–60 %)**
Prêt amortissable sur 5 à 7 ans. Le taux dépend du risque sectoriel, du levier et de la qualité du dossier. Taux usuellement : Euribor + 200-350 bps.
Condition : DSCR > 1,2 (les flux disponibles couvrent au moins 1,2x le service de la dette).

**3. Prêt d'honneur BPI / réseau Initiative (5–10 %)**
Prêt à 0 % sans garantie personnelle. Renforce l'apport et améliore le ratio bancaire. Plafond : 50 k€ à 90 k€ selon les dispositifs.

**4. Crédit vendeur (10–20 %, optionnel)**
Le cédant accepte de recevoir une partie du prix en différé (généralement 2-4 ans). Rassure la banque sur la confiance du vendeur en la continuité.

**Le DSCR, indicateur clé :**
DSCR = EBITDA retraité / (annuités de remboursement + charges financières)
Si DSCR < 1,0 : l'entreprise ne peut pas rembourser sa dette — montage non finançable
Si DSCR > 1,2 : montage finançable
Si DSCR > 1,5 : montage confortable, marge de sécurité suffisante

**Utilisez notre simulateur de financement** pour calculer instantanément le DSCR, la dette senior maximale et le cash disponible post-reprise selon votre montage.`,
    contentEn: `Acquisition financing is structured in 3 to 4 complementary layers. The key is optimizing the DSCR (Debt Service Coverage Ratio) so the company can repay its debt.

**Financing components:**

**1. Personal contribution (20–30% of price)**
Essential. Banks require at least 20% contribution. Insufficient equity = near-systematic bank refusal.

**2. Senior bank debt (50–60%)**
Amortizing loan over 5 to 7 years. Rate depends on sector risk, leverage and file quality. Typical rate: Euribor + 200-350 bps.
Condition: DSCR > 1.2 (available cash flows cover at least 1.2x debt service).

**3. BPI / Initiative network honor loan (5–10%)**
0% loan without personal guarantee. Strengthens contribution and improves bank ratio. Cap: €50k to €90k depending on scheme.

**4. Seller credit (10–20%, optional)**
The seller agrees to receive part of the price deferred (generally 2-4 years). Reassures the bank about the seller's confidence in continuity.

**DSCR, the key indicator:**
DSCR = Restated EBITDA / (repayment installments + financial charges)
If DSCR < 1.0: company cannot repay its debt — non-financeable structure
If DSCR > 1.2: financeable structure
If DSCR > 1.5: comfortable structure, sufficient safety margin

**Use our financing simulator** to instantly calculate DSCR, maximum senior debt and available post-acquisition cash based on your structure.`,
  },
  {
    id: 'negociation',
    num: '05',
    titleFr: 'Négociation et protocole d\'accord',
    titleEn: 'Negotiation and framework agreement',
    contentFr: `La négociation porte sur le prix, mais aussi sur les conditions de paiement, les garanties et les modalités de transition. Un bon accord protège les deux parties.

**Les leviers de négociation :**
- **Earn-out** : partie du prix versée en fonction des performances post-cession (12-24 mois). Comble l'écart de valorisation entre vendeur et acheteur.
- **Crédit vendeur** : différé de paiement 2-4 ans à taux convenu. Renforce la confiance et la motivation du cédant.
- **Période de transition** : accompagnement du cédant de 3 à 18 mois pour faciliter le transfert de compétences et de relations clients.

**La Lettre d'Intention (LOI / Term Sheet) :**
Document non contraignant précisant : fourchette de prix, méthode de valorisation retenue, périmètre de la cession, conditions suspensives, durée d'exclusivité (souvent 60-90 jours), gouvernance de la due diligence.

**La Garantie d'Actif et de Passif (GAP) :**
Couvre l'acheteur contre des passifs non révélés lors de la due diligence. Durée : 2 à 5 ans selon la nature (fiscale : 3 ans, sociale : 5 ans). Plafond : souvent 30-50 % du prix. Franchise : 5-10 k€ par sinistre.

**Le SPA (Share Purchase Agreement) :**
Contrat définitif de cession des titres. Signé par les parties et leurs avocats. Contient : prix, conditions de closing, GAP, clauses de non-concurrence, modalités de paiement.`,
    contentEn: `Negotiation covers price, but also payment terms, warranties and transition modalities. A good agreement protects both parties.

**Negotiation levers:**
- **Earn-out**: part of price paid based on post-sale performance (12-24 months). Bridges the valuation gap between seller and buyer.
- **Seller credit**: deferred payment 2-4 years at agreed rate. Strengthens trust and seller motivation.
- **Transition period**: seller accompaniment for 3 to 18 months to facilitate transfer of skills and client relationships.

**The Letter of Intent (LOI / Term Sheet):**
Non-binding document specifying: price range, valuation method used, sale scope, conditions precedent, exclusivity period (often 60-90 days), due diligence governance.

**The Asset and Liability Guarantee (W&I):**
Covers the buyer against liabilities not revealed during due diligence. Duration: 2 to 5 years depending on nature (tax: 3 years, labor: 5 years). Cap: often 30-50% of price. Deductible: €5-10k per claim.

**The SPA (Share Purchase Agreement):**
Definitive share transfer agreement. Signed by parties and their lawyers. Contains: price, closing conditions, W&I, non-compete clauses, payment terms.`,
  },
  {
    id: 'closing',
    num: '06',
    titleFr: 'Closing et intégration post-reprise',
    titleEn: 'Closing and post-acquisition integration',
    contentFr: `Le closing est la finalisation légale et financière de l'opération. La période post-reprise est critique : la majorité des échecs se produisent dans les 12 premiers mois.

**Le jour du closing :**
- Déblocage des fonds par la banque
- Signature des actes de cession (devant notaire pour les SCI, acte SSP ou authentique pour les titres)
- Transfert des pouvoirs dans les registres (INPI, BODACC, Kbis)
- Remise des clés, codes, accès aux systèmes

**Les 100 premiers jours — priorités :**
1. **Communication interne** : annoncez vous-même à l'équipe, soyez transparent sur votre vision et les changements envisagés
2. **Relations clients** : appelez personnellement les 10-20 clients représentant 80 % du CA
3. **Fournisseurs** : renégociez les contrats et validez les conditions de crédit
4. **Diagnostic opérationnel** : identifiez les quick wins (améliorations rapides visible dans les 90 jours)
5. **Plan de développement à 12 mois** : fixez des objectifs mesurables et partagez-les avec l'équipe

**Les erreurs fréquentes post-reprise :**
- Vouloir tout changer trop vite (perte des salariés clés, rupture de continuité client)
- Sous-estimer le BFR post-reprise (trésorerie tendue dans les premiers mois)
- Négliger la dette bancaire (sous-capitalisation initiale)
- Ne pas anticiper la dépendance au cédant (clauses de transition insuffisantes)`,
    contentEn: `Closing is the legal and financial finalization of the transaction. The post-acquisition period is critical: most failures occur in the first 12 months.

**Closing day:**
- Funds released by the bank
- Signing of transfer deeds (before notary for real estate, SSP or authentic deed for securities)
- Power transfer in registers (INPI, BODACC, Kbis)
- Handover of keys, codes, system access

**First 100 days — priorities:**
1. **Internal communication**: announce yourself to the team, be transparent about your vision and planned changes
2. **Client relations**: personally call the 10-20 clients representing 80% of revenue
3. **Suppliers**: renegotiate contracts and validate credit terms
4. **Operational diagnosis**: identify quick wins (rapid improvements visible in 90 days)
5. **12-month development plan**: set measurable objectives and share them with the team

**Common post-acquisition mistakes:**
- Wanting to change everything too quickly (loss of key employees, client continuity disruption)
- Underestimating post-acquisition WCR (tight cash flow in first months)
- Neglecting bank debt (initial undercapitalization)
- Not anticipating dependence on the seller (insufficient transition clauses)`,
  },
];

export default function GuideRepreneur() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  return (
    <div className="bg-[#FAF9F7]">
      <SEO pageName="GuideRepreneur" />
      {/* Hero */}
      <section className="bg-[#FAF9F7] pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            {isFr ? 'Guide du repreneur 2025' : 'Buyer Guide 2025'}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B4759] leading-tight mb-6">
            {isFr
              ? 'Guide complet pour reprendre une entreprise'
              : 'Complete guide to acquiring a business'}
          </h1>
          <p className="text-lg text-[#6B7A94] max-w-2xl mx-auto mb-8 leading-relaxed">
            {isFr
              ? "De la définition du projet à l'intégration post-reprise — tout ce qu'un repreneur doit savoir pour sécuriser son acquisition et réussir sa prise en main."
              : "From project definition to post-acquisition integration — everything a buyer needs to know to secure their acquisition and successfully take over."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Financing')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-7 py-5 font-display font-semibold">
                <Landmark className="w-4 h-4 mr-2" />
                {isFr ? 'Tester mon financement' : 'Test my financing'}
              </Button>
            </Link>
            <Link to={createPageUrl('Annonces')}>
              <Button variant="outline" className="rounded-full px-7 py-5 font-display font-semibold border-[#3B4759] text-[#3B4759] hover:bg-[#3B4759] hover:text-white">
                {isFr ? 'Voir les annonces' : 'View listings'}
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

      {/* Chapitres — format article long */}
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
                        <span className="text-[#FF6B4A] flex-shrink-0 mt-0.5">•</span>
                        <span><strong className="text-[#3B4759]">{parts[1]}</strong>{parts[2] || ''}</span>
                      </p>
                    );
                  }
                  if (line.startsWith('- ')) {
                    return <p key={li} className="flex gap-2 text-sm"><span className="text-[#FF6B4A] flex-shrink-0">•</span>{line.slice(2)}</p>;
                  }
                  if (line === '') return <div key={li} className="h-3" />;
                  return <p key={li} className="text-sm">{line}</p>;
                })}
              </div>
              {ch.id === 'financement' && (
                <>
                  <div className="mt-8 p-5 bg-[#FFF4F1] rounded-xl border border-[#FFD8CC]">
                    <p className="text-sm font-medium text-[#FF6B4A] mb-2">{isFr ? 'Simulateur gratuit' : 'Free simulator'}</p>
                    <p className="text-sm text-[#3B4759] mb-3">{isFr ? 'Calculez votre DSCR et la dette senior maximale finançable en 2 minutes.' : 'Calculate your DSCR and maximum financeable senior debt in 2 minutes.'}</p>
                    <Link to={createPageUrl('Financing')}>
                      <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full text-sm px-5 py-2 font-display font-semibold">
                        {isFr ? 'Tester mon montage' : 'Test my structure'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-4 p-5 bg-[#FFF4F1] rounded-xl border border-[#FFD8CC]">
                    <p className="font-display font-semibold text-[#3B4759] mb-2">{isFr ? 'Riviqo Advisory pour repreneurs' : 'Riviqo Advisory for buyers'}</p>
                    <p className="text-sm text-[#6B7A94] leading-relaxed mb-3">
                      {isFr
                        ? "Les repreneurs qui cherchent seuls perdent souvent 12 à 18 mois avant de trouver et sécuriser la bonne cible. Notre service d'accompagnement M&A accélère votre parcours : structuration du financement, négociation avec les banques, optimisation du montage et closing. Plateforme + conseil dédié."
                        : "Buyers searching alone often lose 12 to 18 months before finding and securing the right target. Our M&A advisory service accelerates your journey: financing structuring, bank negotiation, deal optimization and closing. Platform + dedicated advisory."}
                    </p>
                    <Link to={createPageUrl('Contact')}>
                      <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full text-sm px-5 py-2 font-display font-semibold">
                        {isFr ? 'Parler à un expert' : 'Talk to an expert'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#3B4759]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            {isFr ? 'Passez à l\'action dès aujourd\'hui' : 'Take action today'}
          </h2>
          <p className="text-[#B7C2D4] mb-8 max-w-xl mx-auto">
            {isFr
              ? "Parcourez les annonces vérifiées sur Riviqo et accédez à nos outils pour analyser et financer votre acquisition."
              : "Browse verified listings on Riviqo and access our tools to analyze and finance your acquisition."}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Link to={createPageUrl('AccountCreation')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold">
                {isFr ? 'Commencer gratuitement' : 'Start for free'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Annonces')}>
              <Button variant="outline" className="bg-transparent rounded-full px-8 py-6 text-base font-display font-semibold border-white/30 text-white hover:bg-white/10">
                {isFr ? 'Voir les annonces' : 'View listings'}
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button variant="outline" className="bg-transparent rounded-full px-8 py-6 text-base font-display font-semibold border-white/30 text-white hover:bg-white/10">
                {isFr ? 'Être accompagné par un expert M&A' : 'Get M&A expert support'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
