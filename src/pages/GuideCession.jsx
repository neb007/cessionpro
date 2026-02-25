// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Calculator, ChevronRight, FileText } from 'lucide-react';
import SEO from '@/components/SEO';

const CHAPTERS = [
  {
    id: 'pourquoi',
    numFr: '01', numEn: '01',
    titleFr: 'Pourquoi céder son entreprise ?',
    titleEn: 'Why sell your business?',
    contentFr: `Céder son entreprise est l'une des décisions les plus importantes dans la vie d'un dirigeant. Les motifs sont variés : départ à la retraite (61 % des cessions selon la BPCE), désir de réorientation professionnelle, opportunité de marché favorable ou projet personnel.

**Les bonnes raisons de céder maintenant :**
- Marché de la transmission porteur : taux d'intérêt en baisse, multiples sectoriels élevés dans certains secteurs
- Fenêtre fiscale avantageuse : abattements pour durée de détention, dispositifs Dutreil, PFU à 30 %
- 700 000 entreprises françaises à transmettre d'ici 2034 : pression de l'offre modérée dans certains niches

**À éviter :**
- Céder sous contrainte (urgence financière, maladie) réduit significativement le prix
- Attendre que les résultats baissent : un acheteur valorisera les 3 derniers exercices
- Manquer la préparation : un dossier incomplet allonge les délais et nuit à la confiance`,
    contentEn: `Selling your business is one of the most important decisions in an owner's life. Reasons vary: retirement (61% of sales according to BPCE), desire for professional reorientation, favorable market opportunity or personal project.

**Good reasons to sell now:**
- Strong transfer market: falling interest rates, high sector multiples in certain sectors
- Favorable tax window: duration of ownership allowances, Dutreil schemes, 30% flat tax
- 700,000 French businesses to transfer by 2034: moderate supply pressure in certain niches

**To avoid:**
- Selling under constraint (financial urgency, illness) significantly reduces the price
- Waiting for results to decline: a buyer will value the last 3 financial years
- Skipping preparation: an incomplete file extends timelines and damages confidence`,
  },
  {
    id: 'timing',
    numFr: '02', numEn: '02',
    titleFr: 'Choisir le bon moment',
    titleEn: 'Choosing the right moment',
    contentFr: `Le timing d'une cession influence directement le prix obtenu. Un dirigeant qui anticipe 2 à 3 ans à l'avance obtient en moyenne 15 à 25 % de plus qu'un cédant contraint.

**Indicateurs favorables pour lancer une cession :**
- Résultats en croissance sur au moins 2 des 3 derniers exercices
- Carnet de commandes ou contrats récurrents visibles sur 12 mois minimum
- Management équipe en place (la dépendance au dirigeant est un facteur dépréciatif majeur)
- Absence de contentieux social, fiscal ou commercial en cours

**Indicateurs d'attente :**
- Lancement d'un nouveau produit/service dont le potentiel n'est pas encore reflété dans les résultats
- Investissements récents non encore rentabilisés
- Secteur en cycle bas (attente de retournement)

**Règle des 3 ans :**
Commencez à préparer votre cession 3 ans avant l'échéance souhaitée. Cela vous laisse le temps de retraiter les comptes, documenter les actifs et former votre successeur dans les fonctions clés.`,
    contentEn: `The timing of a sale directly influences the price obtained. An owner who plans 2 to 3 years ahead obtains on average 15 to 25% more than a constrained seller.

**Favorable indicators to launch a sale:**
- Growth results on at least 2 of the last 3 financial years
- Visible order book or recurring contracts over at least 12 months
- Management team in place (owner dependency is a major depreciation factor)
- No ongoing labor, tax or commercial litigation

**Wait indicators:**
- Launch of a new product/service whose potential is not yet reflected in results
- Recent investments not yet profitable
- Sector in low cycle (waiting for reversal)

**The 3-year rule:**
Start preparing your sale 3 years before the desired deadline. This gives you time to restate accounts, document assets and train your successor in key functions.`,
  },
  {
    id: 'valorisation',
    numFr: '03', numEn: '03',
    titleFr: 'Valorisation de votre entreprise',
    titleEn: 'Valuing your business',
    contentFr: `La valorisation est le cœur de la négociation. Aucune méthode unique n'est reconnue : les acheteurs et vendeurs retiennent généralement une fourchette issue de plusieurs approches complémentaires.

**Les 3 méthodes principales :**

**1. Méthode des multiples (approche marché)**
Le multiple d'EBITDA est la référence la plus utilisée en PME. Il varie selon le secteur (5x à 12x l'EBITDA selon les industries), la taille de l'entreprise et le potentiel de croissance. Un multiple sectoriel de 6x appliqué à un EBITDA de 500 k€ donne une valeur de 3 M€.

**2. Méthode DCF (actualisation des flux)**
Plus technique, elle actualise les flux de trésorerie futurs à un taux reflétant le risque. Utilisée par les fonds et pour les entreprises à fort potentiel de croissance.

**3. Méthode patrimoniale (actif net corrigé)**
Basée sur la valeur des actifs moins le passif. Pertinente pour les entreprises à fort bilan (immobilier, industrie lourde) ou en situation de cession-liquidation.

**Retraitements courants :**
- Rémunération du dirigeant : ramener à la valeur de marché d'un salarié équivalent
- Charges non récurrentes : loyers anormaux, honoraires exceptionnels, charge familiale
- BFR normatif vs BFR réel : ajustement si décalage important`,
    contentEn: `Valuation is the heart of negotiation. No single method is recognized: buyers and sellers generally retain a range from several complementary approaches.

**The 3 main methods:**

**1. Multiple method (market approach)**
The EBITDA multiple is the most used reference in SMEs. It varies by sector (5x to 12x EBITDA depending on industry), company size and growth potential. A sector multiple of 6x applied to EBITDA of €500k gives a value of €3M.

**2. DCF method (discounted cash flows)**
More technical, it discounts future cash flows at a rate reflecting risk. Used by funds and for companies with high growth potential.

**3. Asset-based method (adjusted net assets)**
Based on asset value minus liabilities. Relevant for asset-heavy companies (real estate, heavy industry) or in liquidation situations.

**Common restatements:**
- Owner's compensation: adjust to market value of equivalent employee
- Non-recurring charges: abnormal rents, exceptional fees, family charges
- Normative WCR vs. actual WCR: adjustment if significant gap`,
  },
  {
    id: 'preparation',
    numFr: '04', numEn: '04',
    titleFr: 'Préparation du dossier de cession',
    titleEn: 'Preparing the sale file',
    contentFr: `Un dossier de cession structuré accélère le processus et inspire confiance aux repreneurs. Il se compose de plusieurs volets que vous devrez mettre à disposition via la data room sécurisée.

**Documents financiers (3 derniers exercices) :**
- Bilans et comptes de résultat (certifiés ou non)
- Liasses fiscales complètes
- Détail du chiffre d'affaires par client, produit, zone
- Tableau d'endettement (emprunts, crédit-bail, cautions)

**Documents juridiques :**
- Extrait K-Bis, statuts à jour
- Registre des mouvements de titres
- Contrats commerciaux stratégiques (clients, fournisseurs, partenaires)
- Bail commercial ou titre de propriété des locaux

**Documents opérationnels :**
- Organigramme et contrats de travail des salariés clés
- Inventaire des immobilisations et des stocks
- Portefeuille clients : liste, récurrence, concentration
- Certifications, agréments, brevets

**Memo Information (Information Memorandum) :**
Document de présentation confidentiel (20-40 pages) décrivant l'entreprise, son historique, son marché, son modèle économique et sa stratégie. Partagé uniquement après signature NDA.`,
    contentEn: `A structured sale file accelerates the process and inspires confidence in buyers. It consists of several components that you will need to make available through the secure data room.

**Financial documents (last 3 years):**
- Balance sheets and income statements (certified or not)
- Complete tax returns
- Revenue breakdown by client, product, area
- Debt schedule (loans, leases, guarantees)

**Legal documents:**
- Company registration extract, updated articles of association
- Share transfer register
- Strategic commercial contracts (clients, suppliers, partners)
- Commercial lease or property title for premises

**Operational documents:**
- Organizational chart and employment contracts for key employees
- Fixed asset and inventory list
- Client portfolio: list, recurrence, concentration
- Certifications, approvals, patents

**Information Memorandum:**
Confidential presentation document (20-40 pages) describing the company, its history, market, business model and strategy. Shared only after NDA signing.`,
  },
  {
    id: 'processus',
    numFr: '05', numEn: '05',
    titleFr: 'Le processus de cession',
    titleEn: 'The sale process',
    contentFr: `Une cession structurée passe par plusieurs étapes chronologiques qui sécurisent les intérêts des deux parties.

**Phase 1 — Préparation (3-6 mois)**
Retraitement des comptes, constitution de la data room, rédaction du mémo d'information, identification des repreneurs potentiels.

**Phase 2 — Approche & qualification (1-3 mois)**
Diffusion confidentielle du mémo, collecte des manifestations d'intérêt (NDI), qualification des candidats selon critères financiers et opérationnels.

**Phase 3 — Offres indicatives & sélection (1-2 mois)**
Les candidats qualifiés soumettent une LOI (Letter of Intent) non-engageante avec une fourchette de valorisation et les conditions d'acquisition.

**Phase 4 — Due diligence & exclusivité (2-4 mois)**
Audit financier, juridique, social, fiscal et technique. Le repreneur sélectionné entre en exclusivité. C'est la phase la plus intensive.

**Phase 5 — Négociation & closing (1-2 mois)**
Finalisation du contrat de cession (SPA), négociation de la Garantie d'Actif et de Passif (GAP), arrangements de prix (earn-out, crédit vendeur), signature et transfert de propriété.

**Durée totale médiane : 9 à 15 mois**`,
    contentEn: `A structured sale goes through several chronological stages that protect the interests of both parties.

**Phase 1 — Preparation (3-6 months)**
Account restatement, data room setup, information memo drafting, identification of potential buyers.

**Phase 2 — Approach & qualification (1-3 months)**
Confidential memo distribution, collection of expressions of interest, candidate qualification by financial and operational criteria.

**Phase 3 — Indicative offers & selection (1-2 months)**
Qualified candidates submit a non-binding LOI (Letter of Intent) with a valuation range and acquisition conditions.

**Phase 4 — Due diligence & exclusivity (2-4 months)**
Financial, legal, labor, tax and technical audit. The selected buyer enters exclusivity. This is the most intensive phase.

**Phase 5 — Negotiation & closing (1-2 months)**
Finalization of the sale agreement (SPA), negotiation of the Asset and Liability Guarantee (W&I), price arrangements (earn-out, seller credit), signing and transfer of ownership.

**Median total duration: 9 to 15 months**`,
  },
  {
    id: 'fiscalite',
    numFr: '06', numEn: '06',
    titleFr: 'Fiscalité de la cession',
    titleEn: 'Sale taxation',
    contentFr: `La fiscalité d'une cession de titres (parts sociales ou actions) est encadrée par le PFU de 30 % ou le barème progressif de l'IR. Des dispositifs permettent de réduire significativement l'imposition.

**Régime de droit commun :**
Plus-value = Prix de cession – Prix de revient
PFU : 12,8 % d'IR + 17,2 % de prélèvements sociaux = 30 %

**Abattements pour durée de détention (régime de l'IR sur option) :**
- 50 % si détention entre 2 et 8 ans
- 65 % si détention > 8 ans
Ces abattements ne s'appliquent que sur l'assiette IR, pas sur les prélèvements sociaux.

**Dispositif Dutreil-Transmission (Art. 787 B CGI) :**
Exonération de 75 % des droits de mutation sous conditions : engagement collectif de conservation 2 ans, puis individuel 4 ans, poursuite d'une activité éligible. Fortement conseillé pour les transmissions familiales.

**Abattement dirigeant partant en retraite (Art. 150-0 D ter) :**
Abattement fixe de 500 000 € sur la plus-value taxable sous conditions strictes (cession dans 2 ans du départ en retraite, direction effective depuis au moins 5 ans...).

**Utilisez notre simulateur gratuit de produit net de cession** pour estimer précisément votre net après impôts selon les différents scénarios fiscaux applicables à votre situation.`,
    contentEn: `The taxation of a securities sale (shares or stocks) is governed by the 30% flat tax (PFU) or the progressive income tax scale. Schemes allow for significantly reducing taxation.

**Standard regime:**
Capital gain = Sale price – Cost basis
PFU: 12.8% income tax + 17.2% social contributions = 30%

**Duration of ownership allowances (IR regime on option):**
- 50% if held between 2 and 8 years
- 65% if held > 8 years
These allowances only apply to the income tax base, not social contributions.

**Dutreil-Transmission scheme (Art. 787 B CGI):**
75% exemption from transfer taxes under conditions: collective conservation commitment 2 years, then individual 4 years, continuation of an eligible activity. Strongly recommended for family transfers.

**Retiring director allowance (Art. 150-0 D ter):**
Fixed €500,000 allowance on taxable capital gain under strict conditions (sale within 2 years of retirement, effective management for at least 5 years...).

**Use our free net sale proceeds simulator** to precisely estimate your net after taxes under the various tax scenarios applicable to your situation.`,
  },
];

export default function GuideCession() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <SEO pageName="GuideCession" />
      {/* Hero */}
      <section className="bg-[#FAF9F7] pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            {isFr ? 'Guide de cession 2025' : 'Sale Guide 2025'}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B4759] leading-tight mb-6">
            {isFr
              ? "Guide complet de la cession d'entreprise"
              : 'Complete guide to selling your business'}
          </h1>
          <p className="text-lg text-[#6B7A94] max-w-2xl mx-auto mb-8 leading-relaxed">
            {isFr
              ? "Tout ce qu'un dirigeant doit savoir pour préparer, valoriser et réussir la transmission de son entreprise — de la décision initiale au closing."
              : "Everything a business owner needs to know to prepare, value and successfully transfer their business — from the initial decision to closing."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Valuations')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-7 py-5 font-display font-semibold">
                <Calculator className="w-4 h-4 mr-2" />
                {isFr ? 'Estimer ma valorisation' : 'Estimate my valuation'}
              </Button>
            </Link>
            <Link to={createPageUrl('Targeting')}>
              <Button variant="outline" className="rounded-full px-7 py-5 font-display font-semibold border-[#3B4759] text-[#3B4759] hover:bg-[#3B4759] hover:text-white">
                <FileText className="w-4 h-4 mr-2" />
                {isFr ? 'Simuler le produit net' : 'Simulate net proceeds'}
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
                <span className="font-mono text-xs text-[#FF6B4A] font-bold">{isFr ? ch.numFr : ch.numEn}</span>
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
                <span className="font-mono text-sm font-bold text-[#FF6B4A] flex-shrink-0">{isFr ? ch.numFr : ch.numEn}</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3B4759]">{isFr ? ch.titleFr : ch.titleEn}</h2>
              </div>
              <div className="w-12 h-0.5 bg-[#FF6B4A] mb-6" />
              <div className="text-[#6B7A94] leading-relaxed space-y-1">
                {(isFr ? ch.contentFr : ch.contentEn).split('\n').map((line, li) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h3 key={li} className="font-display font-semibold text-[#3B4759] text-lg mt-6 mb-2">{line.replace(/\*\*/g, '')}</h3>;
                  }
                  if (line.startsWith('- ')) {
                    return <p key={li} className="flex gap-2 text-sm"><span className="text-[#FF6B4A] flex-shrink-0">•</span>{line.slice(2)}</p>;
                  }
                  if (line === '') return <div key={li} className="h-3" />;
                  return <p key={li} className="text-sm">{line}</p>;
                })}
              </div>
              {ch.id === 'valorisation' && (
                <div className="mt-8 p-5 bg-[#FFF4F1] rounded-xl border border-[#FFD8CC]">
                  <p className="text-sm font-medium text-[#FF6B4A] mb-2">{isFr ? 'Outil gratuit' : 'Free tool'}</p>
                  <p className="text-sm text-[#3B4759] mb-3">{isFr ? 'Obtenez une fourchette de valorisation en moins de 3 minutes.' : 'Get a valuation range in less than 3 minutes.'}</p>
                  <Link to={createPageUrl('Valuations')}>
                    <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full text-sm px-5 py-2 font-display font-semibold">
                      {isFr ? 'Valoriser mon entreprise' : 'Value my business'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              )}
              {ch.id === 'processus' && (
                <div className="mt-8 p-5 bg-[#FFF4F1] rounded-xl border border-[#FFD8CC]">
                  <p className="text-sm font-medium text-[#FF6B4A] mb-2">Riviqo Advisory</p>
                  <p className="text-sm text-[#3B4759] mb-3">{isFr ? "Sans accompagnement, chaque phase s'allonge : un dossier mal préparé peut ajouter 6 à 12 mois au processus. Pour les dirigeants qui souhaitent être accompagnés, Riviqo Advisory met à disposition un expert M&A dédié pour piloter et accélérer l'intégralité du processus de cession. Plateforme + expertise humaine." : "Without support, every phase takes longer: a poorly prepared file can add 6 to 12 months to the process. For owners who want support, Riviqo Advisory provides a dedicated M&A expert to drive and accelerate the entire sale process. Platform + human expertise."}</p>
                  <Link to={createPageUrl('Contact')}>
                    <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full text-sm px-5 py-2 font-display font-semibold">
                      {isFr ? 'Demander un devis' : 'Request a quote'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              )}
              {ch.id === 'fiscalite' && (
                <div className="mt-8 p-5 bg-[#FFF4F1] rounded-xl border border-[#FFD8CC]">
                  <p className="text-sm font-medium text-[#FF6B4A] mb-2">{isFr ? 'Outil gratuit' : 'Free tool'}</p>
                  <p className="text-sm text-[#3B4759] mb-3">{isFr ? 'Calculez votre produit net de cession après impôts selon vos paramètres.' : 'Calculate your net sale proceeds after taxes based on your parameters.'}</p>
                  <Link to={createPageUrl('Targeting')}>
                    <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full text-sm px-5 py-2 font-display font-semibold">
                      {isFr ? 'Simuler mon produit net' : 'Simulate my net proceeds'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
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
            {isFr ? 'Prêt à démarrer votre cession ?' : 'Ready to start your sale?'}
          </h2>
          <p className="text-[#B7C2D4] mb-8 max-w-xl mx-auto">
            {isFr
              ? "Créez votre compte et accédez à tous nos outils et experts pour préparer et réussir votre transmission."
              : "Create your account and access all our tools and experts to prepare and succeed in your transfer."}
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
                {isFr ? "Être accompagné par un expert M&A" : "Get M&A expert support"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
