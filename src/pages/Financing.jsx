// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { createPageUrl } from '@/utils';
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Info, Users } from 'lucide-react';
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
import SEO from '@/components/SEO';

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

const BENEFITS_FR = [
  'Statut de faisabilité bancaire : Finançable / Sous conditions / Risqué',
  'DSCR, dette maximale supportable et mensualité projetés',
  'Axes de correction personnalisés pour sécuriser votre montage'
];
const BENEFITS_EN = [
  'Bankability status: Financeable / Conditional / Risky',
  'DSCR, maximum sustainable debt and projected monthly payment',
  'Personalized correction priorities to secure your structure'
];

export default function Financing() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const hasStartedRef = useRef(false);
  const simulatorRef = useRef(null);

  const simulation = useMemo(() => computeFinancing(formData), [formData]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat(isFr ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(Number(value || 0));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const steps = useMemo(
    () => [
      {
        id: 1,
        title: isFr ? 'Cible & performance' : 'Target & performance',
        description: isFr
          ? 'Renseignez les fondamentaux économiques de la cible.'
          : "Provide the target's core economic fundamentals.",
        fields: ['acquisitionPrice', 'revenue', 'ebitda', 'netIncome', 'existingDebt', 'bfr', 'futureInvestments']
      },
      {
        id: 2,
        title: isFr ? 'Montage financier' : 'Financing structure',
        description: isFr
          ? 'Définissez la structure de financement et les paramètres de dette.'
          : 'Define financing structure and debt parameters.',
        fields: [
          'personalContribution', 'mobilizableAssets', 'investorsAmount', 'aidsAmount',
          'earnOutAmount', 'sellerCreditPct', 'loanDurationYears', 'interestRate', 'managerSalaryTarget'
        ]
      },
      {
        id: 3,
        title: isFr ? 'Profil repreneur' : 'Buyer profile',
        description: isFr
          ? 'Précisez les critères qualitatifs souvent examinés par les financeurs.'
          : 'Specify qualitative criteria commonly reviewed by lenders.',
        fields: ['sectorExperience', 'personalGuarantee']
      }
    ],
    [isFr]
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
      list.push(isFr
        ? "Priorité : renforcer la part d'apport pour sécuriser le ratio de couverture de dette."
        : 'Priority: increase equity contribution to secure debt coverage.');
    }
    if (simulation.alerts.includes('dette_excessive')) {
      list.push(isFr
        ? 'Priorité : recalibrer levier et durée afin de réduire la tension de remboursement.'
        : 'Priority: recalibrate leverage and tenor to reduce repayment stress.');
    }
    if (list.length === 0) {
      list.push(isFr
        ? 'Montage cohérent : formaliser un dossier bancaire complet avant mise en concurrence.'
        : 'Consistent structure: formalize a complete lender dossier before market sounding.');
    }
    return list;
  }, [isFr, simulation.alerts, simulation.indicators.dscr]);

  const withTooltip = (label, hint) => (
    <span className="inline-flex items-center gap-1.5">
      <span>{label}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF0ED] text-[#FF6B4A] hover:bg-[#FFD5C7]"
            aria-label={isFr ? 'Aide' : 'Help'}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-[#3B4759] text-white">{hint}</TooltipContent>
      </Tooltip>
    </span>
  );

  const nextSteps = (
    <div className="mt-6 pt-5 border-t border-[#EDE6E0]">
      <p className="text-xs font-bold uppercase tracking-widest text-[#6B7A94] mb-3 font-display">
        {isFr ? 'Étapes suivantes' : 'Next steps'}
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        <Link to={createPageUrl('AccountCreation')}>
          <div className="rounded-xl p-3 text-center border border-[#FFD5C7] bg-[#FFF0ED] hover:bg-[#FFE5DD] transition-colors cursor-pointer">
            <p className="text-xs font-semibold text-[#FF6B4A] font-display">{isFr ? 'Créer un compte' : 'Create account'}</p>
            <p className="text-[11px] text-[#FF6B4A]/70 mt-0.5">{isFr ? 'Accès complet gratuit' : 'Free full access'}</p>
          </div>
        </Link>
        <Link to={createPageUrl('Contact')}>
          <div className="rounded-xl p-3 text-center border border-[#EDE6E0] bg-white hover:bg-[#FAF9F7] transition-colors cursor-pointer">
            <p className="text-xs font-semibold text-[#3B4759] font-display">{isFr ? 'Parler à un expert' : 'Talk to an expert'}</p>
            <p className="text-[11px] text-[#6B7A94] mt-0.5">Riviqo Advisory</p>
          </div>
        </Link>
        <Link to={createPageUrl('Annonces')}>
          <div className="rounded-xl p-3 text-center border border-[#EDE6E0] bg-white hover:bg-[#FAF9F7] transition-colors cursor-pointer">
            <p className="text-xs font-semibold text-[#3B4759] font-display">{isFr ? 'Voir les annonces' : 'Browse listings'}</p>
            <p className="text-[11px] text-[#6B7A94] mt-0.5">{isFr ? 'Annonces vérifiées' : 'Verified listings'}</p>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={120}>
      <div className="min-h-screen bg-white">
        <SEO pageName="Financing" />
        {/* HERO */}
        <section className="bg-[#FAF9F7] py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0ED] text-[#FF6B4A] text-xs font-semibold uppercase tracking-wider font-display">
                {isFr ? 'Outil M&A · Gratuit' : 'M&A Tool · Free'}
              </span>
              <span className="text-xs text-[#6B7A94]">
                {isFr ? 'Outils · Financement de reprise' : 'Tools · Acquisition financing'}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B4759] leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
              {isFr
                ? 'Votre projet de reprise est-il finançable ?'
                : 'Is your acquisition project financeable?'}
            </h1>

            <p className="text-lg text-[#6B7A94] mb-6 leading-relaxed" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {isFr
                ? "Calculez votre DSCR, votre capacité d'emprunt et le cash-flow post-reprise — avant de solliciter les banques."
                : 'Calculate your DSCR, borrowing capacity and post-acquisition cash flow — before approaching banks.'}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 text-sm text-[#6B7A94] mb-8" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              <Users className="w-4 h-4 text-[#FF6B4A]" />
              <span className="font-semibold text-[#3B4759]">1 500+</span>
              <span>{isFr ? 'repreneurs ont testé leur montage' : 'buyers tested their structure'}</span>
              <span className="text-[#C8BDB5]">·</span>
              <span>{isFr ? 'Gratuit' : 'Free'}</span>
              <span className="text-[#C8BDB5]">·</span>
              <span>{isFr ? 'Confidentiel' : 'Confidential'}</span>
            </div>

            <ul className="space-y-3 mb-8">
              {(isFr ? BENEFITS_FR : BENEFITS_EN).map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-[#3B4759]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <CheckCircle2 className="w-5 h-5 text-[#FF6B4A] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={scrollToSimulator}
              className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold shadow-md"
            >
              {isFr ? 'Tester mon montage' : 'Test my structure'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* SIMULATEUR */}
        <section ref={simulatorRef} id="simulateur" className="py-14 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl border border-[#EDE6E0] overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-[#EDE6E0]">
                <h2 className="font-display text-xl font-bold text-[#3B4759] mb-1">
                  {isFr ? 'Simulateur de financement de reprise' : 'Acquisition financing simulator'}
                </h2>
                <p className="text-sm text-[#6B7A94]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {isFr
                    ? 'Complétez les 3 étapes pour obtenir votre analyse de faisabilité.'
                    : 'Complete the 3 steps to receive your feasibility analysis.'}
                </p>
              </div>

              <div className="px-6 py-6">
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {steps.map((step) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setCurrentStep(step.id)}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all font-display ${
                          step.id === currentStep
                            ? 'bg-[#FFF0ED] text-[#FF6B4A] border border-[#FFD5C7]'
                            : 'bg-white text-[#6B7A94] border border-[#EDE6E0] hover:border-[#FFD5C7] hover:text-[#FF6B4A]'
                        }`}
                      >
                        {isFr ? 'Étape' : 'Step'} {step.id} — {step.title}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={globalCompletion} className="flex-1 h-1.5 bg-[#EDE6E0] [&>div]:bg-[#FF6B4A]" />
                    <span className="text-xs text-[#6B7A94] whitespace-nowrap font-display">
                      {isFr ? `Étape ${currentStep}/3` : `Step ${currentStep}/3`} · {globalCompletion}%
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#6B7A94] mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {currentStepConfig.description}
                </p>

                {/* Step 1 */}
                {currentStep === 1 ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {[
                      ['acquisitionPrice', isFr ? "Prix d'acquisition (€)" : 'Acquisition price (€)', isFr ? 'Prix cible de transaction.' : 'Target transaction price.'],
                      ['revenue', isFr ? 'CA (€)' : 'Revenue (€)', isFr ? "Chiffre d'affaires annuel." : 'Annual revenue.'],
                      ['ebitda', 'EBITDA (€)', isFr ? 'Capacité opérationnelle de génération de cash.' : 'Operating cash generation capacity.'],
                      ['netIncome', isFr ? 'Résultat net (€)' : 'Net income (€)', isFr ? 'Résultat net courant.' : 'Current net income.'],
                      ['existingDebt', isFr ? 'Dettes existantes (€)' : 'Existing debt (€)', isFr ? 'Dette financière actuelle de la cible.' : 'Current target financial debt.'],
                      ['bfr', isFr ? 'BFR (€)' : 'Working capital (€)', isFr ? 'Besoin en fonds de roulement.' : 'Working-capital requirement.'],
                      ['futureInvestments', isFr ? 'Investissements futurs (€)' : 'Future investments (€)', isFr ? 'CAPEX post-reprise.' : 'Post-acquisition CAPEX.']
                    ].map(([field, label, hint]) => (
                      <div key={field}>
                        <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(label, hint)}</Label>
                        <Input className="mt-1.5 border-[#EDE6E0] focus-visible:ring-[#FF6B4A] font-mono text-sm" value={formData[field]} onChange={(e) => handleChange(field, e.target.value)} placeholder="0" />
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Step 2 */}
                {currentStep === 2 ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {[
                      ['personalContribution', isFr ? 'Apport personnel (€)' : 'Personal contribution (€)', isFr ? 'Part en fonds propres.' : 'Equity contribution.'],
                      ['mobilizableAssets', isFr ? 'Patrimoine mobilisable (€)' : 'Mobilizable assets (€)', isFr ? 'Actifs mobilisables en support.' : 'Assets mobilizable as support.'],
                      ['investorsAmount', isFr ? 'Investisseurs (€)' : 'Investors (€)', isFr ? 'Part investisseurs/associés.' : 'Investor/partner contribution.'],
                      ['aidsAmount', isFr ? 'Aides (€)' : 'Aids (€)', isFr ? 'Subventions et dispositifs publics.' : 'Grants and public support.'],
                      ['earnOutAmount', 'Earn-out (€)', isFr ? 'Paiement différé conditionnel.' : 'Conditional deferred payment.'],
                      ['sellerCreditPct', isFr ? 'Crédit vendeur (%)' : 'Seller credit (%)', isFr ? 'Quote-part vendeur.' : 'Seller-financed share.'],
                      ['loanDurationYears', isFr ? 'Durée prêt (ans)' : 'Loan tenor (years)', isFr ? 'Durée de remboursement.' : 'Repayment tenor.'],
                      ['interestRate', isFr ? 'Taux (%)' : 'Rate (%)', isFr ? 'Taux nominal de dette.' : 'Nominal debt rate.'],
                      ['managerSalaryTarget', isFr ? 'Rémunération dirigeant cible (€)' : 'Target manager compensation (€)', isFr ? 'Rémunération annuelle envisagée.' : 'Target annual compensation.']
                    ].map(([field, label, hint]) => (
                      <div key={field}>
                        <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(label, hint)}</Label>
                        <Input className="mt-1.5 border-[#EDE6E0] focus-visible:ring-[#FF6B4A] font-mono text-sm" value={formData[field]} onChange={(e) => handleChange(field, e.target.value)} placeholder="0" />
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Step 3 */}
                {currentStep === 3 ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Expérience sectorielle' : 'Sector experience', isFr ? "Critère d'appréciation de risque bancaire." : 'Lender risk-assessment criterion.')}</Label>
                      <Select value={formData.sectorExperience} onValueChange={(v) => handleChange('sectorExperience', v)}>
                        <SelectTrigger className="mt-1.5 border-[#EDE6E0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{isFr ? 'Oui' : 'Yes'}</SelectItem>
                          <SelectItem value="no">{isFr ? 'Non' : 'No'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Garantie personnelle' : 'Personal guarantee', isFr ? 'Possibilité de garantie additionnelle.' : 'Availability of additional guarantee.')}</Label>
                      <Select value={formData.personalGuarantee} onValueChange={(v) => handleChange('personalGuarantee', v)}>
                        <SelectTrigger className="mt-1.5 border-[#EDE6E0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{isFr ? 'Possible' : 'Possible'}</SelectItem>
                          <SelectItem value="no">{isFr ? 'Non' : 'No'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : null}

                {/* Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="border-[#EDE6E0] text-[#6B7A94] rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {isFr ? 'Précédent' : 'Previous'}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-[#6B7A94] text-sm"
                      onClick={() => { setFormData(INITIAL_FORM_DATA); setCurrentStep(1); }}
                    >
                      {isFr ? 'Réinitialiser' : 'Reset'}
                    </Button>
                    {currentStep < steps.length && (
                      <Button
                        type="button"
                        onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
                        disabled={!canGoNext}
                        className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full font-display font-semibold"
                      >
                        {isFr ? 'Étape suivante' : 'Next step'}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* ToolLeadGate */}
                <ToolLeadGate
                  language={language}
                  tool="financing"
                  simulationInput={formData}
                  simulationResult={simulation}
                  preview={(
                    <div className="space-y-2 text-sm">
                      <p className="font-display font-semibold text-[#3B4759] mb-3">
                        {isFr ? 'Aperçu de votre analyse :' : 'Preview of your analysis:'}
                      </p>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Statut de faisabilité' : 'Feasibility status'}</span>
                        <span className="font-mono font-bold text-[#FF6B4A] bg-[#FFF0ED] px-2 py-0.5 rounded">●●●●●</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">DSCR</span>
                        <span className="font-mono text-[#6B7A94]">●.●●</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-[#6B7A94]">{isFr ? 'Dette max supportable' : 'Max sustainable debt'}</span>
                        <span className="font-mono text-[#6B7A94]">●●● €</span>
                      </div>
                    </div>
                  )}
                  full={(
                    <div className="space-y-2 text-sm">
                      <p className="font-display font-semibold text-[#3B4759] mb-3">
                        {isFr ? 'Votre analyse de faisabilité :' : 'Your feasibility analysis:'}
                      </p>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Statut' : 'Status'}</span>
                        <span className={`font-semibold text-sm px-2 py-0.5 rounded font-display ${
                          simulation.status === 'Finançable' ? 'bg-green-50 text-green-700' :
                          simulation.status === 'Sous conditions' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-red-50 text-red-700'
                        }`}>{simulation.status}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">DSCR</span>
                        <span className="font-mono text-[#3B4759]">{simulation.indicators.dscr.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Mensualité' : 'Monthly payment'}</span>
                        <span className="font-mono text-[#3B4759]">{formatCurrency(simulation.monthlyPayment)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Cash annuel disponible' : 'Annual cash available'}</span>
                        <span className="font-mono text-[#3B4759]">{formatCurrency(simulation.annualCashAvailable)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Dette max supportable' : 'Max sustainable debt'}</span>
                        <span className="font-mono text-[#3B4759]">{formatCurrency(simulation.indicators.debtMax)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-[#6B7A94]">{isFr ? 'Apport recommandé' : 'Recommended equity'}</span>
                        <span className="font-mono font-bold text-[#FF6B4A]">{formatCurrency(simulation.indicators.minContributionRecommended)}</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#EDE6E0] bg-[#FAF9F7] rounded-xl p-3">
                        <p className="font-display font-semibold text-[#3B4759] mb-2 text-xs uppercase tracking-wider">
                          {isFr ? "Axes d'ajustement" : 'Adjustment priorities'}
                        </p>
                        <ul className="space-y-1.5">
                          {recommendations.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-xs text-[#6B7A94]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {nextSteps}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        {/* MÉTHODOLOGIE — Accordéon */}
        <section className="py-12 bg-[#FAF9F7]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-xl font-bold text-[#3B4759] mb-4">
              {isFr ? 'Comment fonctionne cet outil ?' : 'How does this tool work?'}
            </h2>
            <div className="space-y-0 rounded-xl border border-[#EDE6E0] bg-white overflow-hidden">
              {[
                {
                  title: isFr ? 'Méthodologie de bancabilité' : 'Bankability methodology',
                  content: isFr
                    ? "L'analyse repose sur trois tests : adéquation du montage de financement, robustesse du ratio de couverture de dette (DSCR), et maintien d'un niveau de liquidité compatible avec l'exploitation courante. La décision ne se limite pas à un oui/non bancaire — elle s'inscrit dans une gradation de risque à anticiper avant la phase de sollicitation des financeurs."
                    : "The analysis relies on three tests: financing-structure adequacy, debt-coverage robustness (DSCR), and sufficient operating liquidity. The decision is not only a binary lender approval — it falls within a risk/conditions continuum to anticipate before lender outreach."
                },
                {
                  title: isFr ? 'Données de montage' : 'Structure data',
                  content: isFr
                    ? "Prix d'acquisition, EBITDA, dettes existantes, BFR et capex projetés. Composition des sources : apport, dette senior, crédit vendeur, investisseurs et aides. Paramètres de soutenabilité : taux, durée, charge annuelle de dette, rémunération cible."
                    : "Acquisition price, EBITDA, existing debt, working capital and projected capex. Source composition: equity, senior debt, seller note, investors and grants. Sustainability parameters: rate, tenor, annual debt service, target compensation."
                },
                {
                  title: isFr ? 'Lecture des indicateurs' : 'Reading indicators',
                  content: isFr
                    ? "Le DSCR qualifie la capacité à absorber la dette (cible : ≥ 1,2). Le niveau de dette maximale supportable encadre l'effet de levier. Le cash-flow disponible post-reprise mesure la marge de sécurité réelle. Ces indicateurs servent à arbitrer : augmentation de l'apport, ajustement de la durée, ou révision du prix de reprise."
                    : "DSCR qualifies debt-absorption capacity (target: ≥ 1.2). Maximum sustainable debt frames leverage. Post-acquisition available cash-flow measures real safety margin. These indicators support structuring decisions: more equity, tenor adjustment, or acquisition-price revision."
                }
              ].map((item, i) => (
                <details key={i} className={i > 0 ? 'border-t border-[#EDE6E0]' : ''}>
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none text-sm font-semibold text-[#3B4759] hover:bg-[#FAF9F7] transition-colors font-display">
                    {item.title}
                    <ChevronRight className="w-4 h-4 text-[#6B7A94] transition-transform [[open]_&]:rotate-90" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#6B7A94] leading-relaxed" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {item.content}
                  </div>
                </details>
              ))}
            </div>
            <p className="mt-6 text-xs text-[#6B7A94]">
              {isFr
                ? "Simulation indicative, non constitutive d'un conseil bancaire, fiscal ou juridique."
                : "Indicative simulation, not banking, tax or legal advice."}
            </p>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}
