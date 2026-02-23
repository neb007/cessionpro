// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { createPageUrl } from '@/utils';
import Logo from '@/components/Logo';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { computeFinancing } from '@/utils/simulatorsEngine';
import ToolLeadGate from '@/components/ToolLeadGate';
import { toolAnalyticsService } from '@/services/toolAnalyticsService';

const INITIAL_FORM_DATA = {
  acquisitionPrice: '',
  revenue: '',
  ebitda: '',
  netIncome: '',
  existingDebt: '',
  bfr: '',
  futureInvestments: '',
  personalContribution: '',
  mobilizableAssets: '',
  investorsAmount: '',
  aidsAmount: '',
  earnOutAmount: '',
  sellerCreditPct: '',
  loanDurationYears: '',
  interestRate: '',
  managerSalaryTarget: '',
  sectorExperience: 'yes',
  personalGuarantee: 'yes'
};

export default function Financing() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const hasStartedRef = useRef(false);

  const simulation = useMemo(() => computeFinancing(formData), [formData]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(Number(value || 0));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const steps = useMemo(
    () => [
      {
        id: 1,
        title: language === 'fr' ? 'Cible & performance' : 'Target & performance',
        description:
          language === 'fr'
            ? 'Renseignez les fondamentaux économiques de la cible.'
            : 'Provide the target’s core economic fundamentals.',
        fields: ['acquisitionPrice', 'revenue', 'ebitda', 'netIncome', 'existingDebt', 'bfr', 'futureInvestments']
      },
      {
        id: 2,
        title: language === 'fr' ? 'Montage financier' : 'Financing structure',
        description:
          language === 'fr'
            ? 'Définissez la structure de financement et les paramètres de dette.'
            : 'Define financing structure and debt parameters.',
        fields: [
          'personalContribution',
          'mobilizableAssets',
          'investorsAmount',
          'aidsAmount',
          'earnOutAmount',
          'sellerCreditPct',
          'loanDurationYears',
          'interestRate',
          'managerSalaryTarget'
        ]
      },
      {
        id: 3,
        title: language === 'fr' ? 'Profil repreneur' : 'Buyer profile',
        description:
          language === 'fr'
            ? 'Précisez les critères qualitatifs souvent examinés par les financeurs.'
            : 'Specify qualitative criteria commonly reviewed by lenders.',
        fields: ['sectorExperience', 'personalGuarantee']
      }
    ],
    [language]
  );

  const allFields = useMemo(() => steps.flatMap((step) => step.fields), [steps]);
  const globalCompletion = useMemo(() => {
    const filled = allFields.filter((field) => String(formData[field] || '').trim() !== '').length;
    return Math.round((filled / allFields.length) * 100);
  }, [allFields, formData]);

  useEffect(() => {
    void toolAnalyticsService.track('tool_view', {
      tool: 'financing',
      metadata: { page: 'Financing' }
    });
  }, []);

  useEffect(() => {
    if (globalCompletion > 0 && !hasStartedRef.current) {
      hasStartedRef.current = true;
      void toolAnalyticsService.track('tool_started', {
        tool: 'financing',
        step: currentStep,
        metadata: { completion: globalCompletion }
      });
    }
  }, [currentStep, globalCompletion]);

  const currentStepConfig = steps[currentStep - 1];
  const canGoNext = currentStepConfig.fields.every((field) => String(formData[field] || '').trim() !== '');

  const recommendations = useMemo(() => {
    const list = [];
    if (simulation.indicators.dscr < 1.2) {
      list.push(
        language === 'fr'
          ? 'Priorité: renforcer la part d’apport pour sécuriser le ratio de couverture de dette.'
          : 'Priority: increase equity contribution to secure debt coverage.'
      );
    }
    if (simulation.alerts.includes('dette_excessive')) {
      list.push(
        language === 'fr'
          ? 'Priorité: recalibrer levier et durée afin de réduire la tension de remboursement.'
          : 'Priority: recalibrate leverage and tenor to reduce repayment stress.'
      );
    }
    if (list.length === 0) {
      list.push(
        language === 'fr'
          ? 'Montage cohérent: formaliser un dossier bancaire complet avant mise en concurrence.'
          : 'Consistent structure: formalize a complete lender dossier before market sounding.'
      );
    }
    return list;
  }, [language, simulation.alerts, simulation.indicators.dscr]);

  const withTooltip = (label, hint) => (
    <span className="inline-flex items-center gap-1.5">
      <span>{label}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-light text-muted-foreground hover:bg-primary-light/70"
            aria-label={language === 'fr' ? 'Aide' : 'Help'}
        >
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-charcoal text-white">{hint}</TooltipContent>
      </Tooltip>
    </span>
  );

  return (
    <TooltipProvider delayDuration={120}>
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2">
                <Logo size="sm" showText={false} />
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  to={createPageUrl('Outils')}
                  className="font-heading text-foreground hover:text-primary transition-colors"
                  
              >
                  {language === 'fr' ? 'Outils' : 'Tools'}
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/Login"
                  className="font-heading text-foreground hover:text-primary transition-colors px-4 py-2"
                  
              >
                  {language === 'fr' ? 'Se connecter' : 'Login'}
                </Link>
                <Link to="/AccountCreation">
                  <Button
                    className="bg-primary hover:bg-primary-hover text-primary-foreground font-heading"
                    
                >
                    {language === 'fr' ? 'Créer un compte' : 'Sign up'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <header className="text-primary-foreground" style={{ background: 'var(--gradient-hero)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
            <p className="text-sm text-white/80 mb-4">
              {language === 'fr' ? 'Outils · Financement de reprise' : 'Tools · Acquisition financing'}
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl leading-tight font-semibold max-w-4xl">
              {language === 'fr'
                ? 'Financement de reprise : cadre d’analyse de la bancabilité'
                : 'Acquisition financing: a bankability analysis framework'}
            </h1>
            <p className="mt-5 text-white/85 text-base sm:text-lg leading-8 max-w-3xl">
              {language === 'fr'
                ? 'Objectif: vérifier la soutenabilité du montage, quantifier la pression de remboursement et sécuriser la trajectoire de cash-flow post-reprise.'
                : 'Objective: validate structure sustainability, quantify debt pressure, and secure post-acquisition cash-flow trajectory.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/85">
              <span className="inline-flex items-center border border-white/25 px-3 py-1 rounded-full">
                {language === 'fr' ? 'Test DSCR' : 'DSCR stress test'}
              </span>
              <span className="inline-flex items-center border border-white/25 px-3 py-1 rounded-full">
                {language === 'fr' ? 'Montage multi-sources' : 'Multi-source structure'}
              </span>
              <span className="inline-flex items-center border border-white/25 px-3 py-1 rounded-full">
                {language === 'fr' ? 'Décision bancaire' : 'Lender decision framing'}
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <article className="max-w-3xl mx-auto text-foreground">
            <nav className="pb-8 border-b border-border">
              <h2 className="font-heading text-2xl mb-4">
                {language === 'fr' ? 'Sommaire de la note' : 'Contents'}
              </h2>
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                <li><a href="#methode" className="underline underline-offset-2 hover:text-foreground">{language === 'fr' ? 'Méthodologie de bancabilité' : 'Bankability methodology'}</a></li>
                <li><a href="#data" className="underline underline-offset-2 hover:text-foreground">{language === 'fr' ? 'Données de montage' : 'Structure data'}</a></li>
                <li><a href="#lecture" className="underline underline-offset-2 hover:text-foreground">{language === 'fr' ? 'Lecture des indicateurs' : 'Indicator interpretation'}</a></li>
                <li><a href="#simulateur" className="underline underline-offset-2 hover:text-foreground">{language === 'fr' ? 'Simulation appliquée' : 'Applied simulation'}</a></li>
              </ol>
            </nav>

            <section id="methode" className="pt-10 scroll-mt-24">
              <h2 className="font-heading text-3xl leading-tight mb-4">
                {language === 'fr' ? 'Méthodologie de bancabilité' : 'Bankability methodology'}
              </h2>
              <p className="text-muted-foreground text-[17px] leading-8 mb-4">
                {language === 'fr'
                  ? 'L’analyse repose sur trois tests: adéquation du montage de financement, robustesse du ratio de couverture de dette, et maintien d’un niveau de liquidité compatible avec l’exploitation courante.'
                  : 'The analysis relies on three tests: financing-structure adequacy, debt-coverage robustness, and sufficient operating liquidity.'}
              </p>
              <p className="text-muted-foreground text-[17px] leading-8">
                {language === 'fr'
                  ? 'La décision ne se limite pas à un “oui/non” bancaire. Elle s’inscrit dans une gradation de risque et de conditions, à anticiper avant la phase de sollicitation des financeurs.'
                  : 'The decision is not only a binary lender approval. It falls within a risk/conditions continuum to anticipate before lender outreach.'}
              </p>
            </section>

            <section id="data" className="pt-10 scroll-mt-24">
              <h2 className="font-heading text-3xl leading-tight mb-4">
                {language === 'fr' ? 'Données de montage à documenter' : 'Structure data to document'}
              </h2>
              <ul className="list-disc pl-5 text-muted-foreground text-[17px] leading-8 space-y-1">
                <li>{language === 'fr' ? 'Prix d’acquisition, EBITDA, dettes existantes, BFR et capex projetés.' : 'Acquisition price, EBITDA, existing debt, working capital and projected capex.'}</li>
                <li>{language === 'fr' ? 'Composition des sources: apport, dette senior, crédit vendeur, investisseurs et aides.' : 'Source composition: equity, senior debt, seller note, investors and grants.'}</li>
                <li>{language === 'fr' ? 'Paramètres de soutenabilité: taux, durée, charge annuelle de dette, rémunération cible.' : 'Sustainability parameters: rate, tenor, annual debt service, target compensation.'}</li>
              </ul>
            </section>

            <section id="lecture" className="pt-10 scroll-mt-24">
              <h2 className="font-heading text-3xl leading-tight mb-4">
                {language === 'fr' ? 'Lecture des indicateurs de faisabilité' : 'Reading feasibility indicators'}
              </h2>
              <p className="text-muted-foreground text-[17px] leading-8 mb-4">
                {language === 'fr'
                  ? 'Le DSCR qualifie la capacité à absorber la dette. Le niveau de dette maximale supportable encadre l’effet de levier. Le cash-flow disponible post-reprise mesure la marge de sécurité réelle.'
                  : 'DSCR qualifies debt-absorption capacity. Maximum sustainable debt frames leverage. Post-acquisition available cash-flow measures real safety margin.'}
              </p>
              <p className="text-muted-foreground text-[17px] leading-8">
                {language === 'fr'
                  ? 'Ces indicateurs servent à arbitrer la structuration: augmentation de l’apport, ajustement de la durée, ou révision du prix de reprise.'
                  : 'These indicators support structuring decisions: more equity, tenor adjustment, or acquisition-price revision.'}
              </p>
            </section>

            <section id="simulateur" className="pt-10 scroll-mt-24">
              <h2 className="font-heading text-3xl leading-tight mb-3">
                {language === 'fr' ? 'Simulation appliquée à votre dossier' : 'Applied simulation for your case'}
              </h2>
              <p className="text-muted-foreground text-[17px] leading-8 mb-6">
                {language === 'fr'
                  ? 'Le module ci-dessous traduit vos hypothèses en statut de faisabilité, indicateurs de risque et axes de correction.'
                  : 'The module below translates assumptions into feasibility status, risk indicators, and correction priorities.'}
              </p>

              <div className="border border-border bg-white/80 px-4 sm:px-6 py-6">
                <div className="mb-5">
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === 'fr' ? `Avancement de saisie: ${globalCompletion}%` : `Input progress: ${globalCompletion}%`}
                  </p>
                  <Progress value={globalCompletion} className="h-1.5 bg-primary-light [&>div]:bg-primary" />
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {steps.map((step) => (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setCurrentStep(step.id)}
                      className={`px-3 py-1.5 text-sm border ${step.id === currentStep ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
                  >
                      {language === 'fr' ? 'Étape' : 'Step'} {step.id} — {step.title}
                    </button>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mb-4">{currentStepConfig.description}</p>

                {currentStep === 1 ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {[
                      ['acquisitionPrice', language === 'fr' ? 'Prix d’acquisition (€)' : 'Acquisition price (€)', language === 'fr' ? 'Prix cible de transaction.' : 'Target transaction price.'],
                      ['revenue', language === 'fr' ? 'CA (€)' : 'Revenue (€)', language === 'fr' ? 'Chiffre d’affaires annuel.' : 'Annual revenue.'],
                      ['ebitda', 'EBITDA (€)', language === 'fr' ? 'Capacité opérationnelle de génération de cash.' : 'Operating cash generation capacity.'],
                      ['netIncome', language === 'fr' ? 'Résultat net (€)' : 'Net income (€)', language === 'fr' ? 'Résultat net courant.' : 'Current net income.'],
                      ['existingDebt', language === 'fr' ? 'Dettes existantes (€)' : 'Existing debt (€)', language === 'fr' ? 'Dette financière actuelle de la cible.' : 'Current target financial debt.'],
                      ['bfr', language === 'fr' ? 'BFR (€)' : 'Working capital (€)', language === 'fr' ? 'Besoin en fonds de roulement.' : 'Working-capital requirement.'],
                      ['futureInvestments', language === 'fr' ? 'Investissements futurs (€)' : 'Future investments (€)', language === 'fr' ? 'CAPEX post-reprise.' : 'Post-acquisition CAPEX.']
                    ].map(([field, label, hint]) => (
                      <div key={field}>
                        <Label>{withTooltip(label, hint)}</Label>
                        <Input className="mt-2 border-border font-mono" value={formData[field]} onChange={(e) => handleChange(field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                ) : null}

                {currentStep === 2 ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {[
                      ['personalContribution', language === 'fr' ? 'Apport personnel (€)' : 'Personal contribution (€)', language === 'fr' ? 'Part en fonds propres.' : 'Equity contribution.'],
                      ['mobilizableAssets', language === 'fr' ? 'Patrimoine mobilisable (€)' : 'Mobilizable assets (€)', language === 'fr' ? 'Actifs mobilisables en support.' : 'Assets mobilizable as support.'],
                      ['investorsAmount', language === 'fr' ? 'Investisseurs (€)' : 'Investors (€)', language === 'fr' ? 'Part investisseurs/associés.' : 'Investor/partner contribution.'],
                      ['aidsAmount', language === 'fr' ? 'Aides (€)' : 'Aids (€)', language === 'fr' ? 'Subventions et dispositifs publics.' : 'Grants and public support.'],
                      ['earnOutAmount', 'Earn-out (€)', language === 'fr' ? 'Paiement différé conditionnel.' : 'Conditional deferred payment.'],
                      ['sellerCreditPct', language === 'fr' ? 'Crédit vendeur (%)' : 'Seller credit (%)', language === 'fr' ? 'Quote-part vendeur.' : 'Seller-financed share.'],
                      ['loanDurationYears', language === 'fr' ? 'Durée prêt (ans)' : 'Loan tenor (years)', language === 'fr' ? 'Durée de remboursement.' : 'Repayment tenor.'],
                      ['interestRate', language === 'fr' ? 'Taux (%)' : 'Rate (%)', language === 'fr' ? 'Taux nominal de dette.' : 'Nominal debt rate.'],
                      ['managerSalaryTarget', language === 'fr' ? 'Rémunération dirigeant cible (€)' : 'Target manager compensation (€)', language === 'fr' ? 'Rémunération annuelle envisagée.' : 'Target annual compensation.']
                    ].map(([field, label, hint]) => (
                      <div key={field}>
                        <Label>{withTooltip(label, hint)}</Label>
                        <Input className="mt-2 border-border font-mono" value={formData[field]} onChange={(e) => handleChange(field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                ) : null}

                {currentStep === 3 ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Expérience sectorielle' : 'Sector experience', language === 'fr' ? 'Critère d’appréciation de risque bancaire.' : 'Lender risk-assessment criterion.')}</Label>
                      <Select value={formData.sectorExperience} onValueChange={(v) => handleChange('sectorExperience', v)}>
                        <SelectTrigger className="mt-2 border-border"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{language === 'fr' ? 'Oui' : 'Yes'}</SelectItem>
                          <SelectItem value="no">{language === 'fr' ? 'Non' : 'No'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Garantie personnelle' : 'Personal guarantee', language === 'fr' ? 'Possibilité de garantie additionnelle.' : 'Availability of additional guarantee.')}</Label>
                      <Select value={formData.personalGuarantee} onValueChange={(v) => handleChange('personalGuarantee', v)}>
                        <SelectTrigger className="mt-2 border-border"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{language === 'fr' ? 'Possible' : 'Possible'}</SelectItem>
                          <SelectItem value="no">{language === 'fr' ? 'Non' : 'No'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))} disabled={currentStep === 1} className="border-border text-foreground">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {language === 'fr' ? 'Précédent' : 'Previous'}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" className="text-muted-foreground" onClick={() => { setFormData(INITIAL_FORM_DATA); setCurrentStep(1); }}>
                      {language === 'fr' ? 'Réinitialiser' : 'Reset'}
                    </Button>
                    <Button type="button" onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))} disabled={currentStep === steps.length || !canGoNext} className="bg-primary hover:bg-primary-hover text-primary-foreground">
                      {language === 'fr' ? 'Suivant' : 'Next'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <ToolLeadGate
                  language={language}
                  tool="financing"
                  simulationInput={formData}
                  simulationResult={simulation}
                  preview={(
                    <div className="text-sm text-foreground space-y-1">
                      <p>{language === 'fr' ? 'Statut de faisabilité' : 'Feasibility status'} : <span className="font-mono">***</span></p>
                      <p>DSCR : <span className="font-mono">**</span></p>
                      <p>{language === 'fr' ? 'Dette max supportable' : 'Max sustainable debt'} : <span className="font-mono">***</span></p>
                    </div>
                  )}
                  full={(
                    <div className="text-sm text-foreground space-y-2">
                      <p>{language === 'fr' ? 'Statut' : 'Status'} : <span className="font-semibold">{simulation.status}</span></p>
                      <p>DSCR : <span className="font-mono">{simulation.indicators.dscr.toFixed(2)}</span></p>
                      <p>{language === 'fr' ? 'Mensualité' : 'Monthly payment'} : <span className="font-mono">{formatCurrency(simulation.monthlyPayment)}</span></p>
                      <p>{language === 'fr' ? 'Cash annuel disponible' : 'Annual cash available'} : <span className="font-mono">{formatCurrency(simulation.annualCashAvailable)}</span></p>
                      <p>{language === 'fr' ? 'Dette maximale supportable' : 'Maximum sustainable debt'} : <span className="font-mono">{formatCurrency(simulation.indicators.debtMax)}</span></p>
                      <p>{language === 'fr' ? 'Apport recommandé' : 'Recommended equity'} : <span className="font-mono">{formatCurrency(simulation.indicators.minContributionRecommended)}</span></p>
                      <div className="pt-2 border-t border-border">
                        <p className="font-medium mb-1">{language === 'fr' ? 'Priorités d’ajustement' : 'Adjustment priorities'}</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {recommendations.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                />
              </div>
            </section>

            <section className="pt-10 border-t border-border mt-10">
              <h2 className="font-heading text-2xl mb-3">
                {language === 'fr' ? 'Accompagnement expert' : 'Expert support'}
              </h2>
              <p className="text-muted-foreground text-[17px] leading-8 mb-5">
                {language === 'fr'
                  ? 'Riviqo accompagne la structuration de dette, la préparation du dossier bancaire et la négociation des conditions de financement.'
                  : 'Riviqo supports debt structuring, lender-dossier preparation, and financing-terms negotiation.'}
              </p>
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  {language === 'fr' ? 'Échanger avec un expert' : 'Discuss with an expert'}
                </Button>
              </Link>
            </section>

            <p className="mt-8 text-xs text-muted-foreground">
              {language === 'fr'
                ? 'Simulation indicative, non constitutive d’un conseil bancaire, fiscal ou juridique.'
                : 'Indicative simulation, not banking, tax or legal advice.'}
            </p>
          </article>
        </main>
      </div>
    </TooltipProvider>
  );
}
