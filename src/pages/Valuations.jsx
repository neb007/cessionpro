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
import { computeValuation } from '@/utils/simulatorsEngine';
import ToolLeadGate from '@/components/ToolLeadGate';
import { toolAnalyticsService } from '@/services/toolAnalyticsService';
import SEO from '@/components/SEO';

const INITIAL_FORM_DATA = {
  businessModel: '',
  revenue: '',
  ebitda: '',
  netIncome: '',
  ownerSalary: '',
  equity: '',
  cash: '',
  debt: '',
  growthRate: '',
  dependencyRisk: '',
  clientConcentration: '',
  revenueRecurrence: ''
};

const BENEFITS_FR = [
  'Fourchette basse / médiane / haute issue de 3 méthodes reconnues',
  'Score de qualité opérationnelle et facteurs de décote / surcote',
  'Priorités de préparation pour maximiser votre valeur de cession'
];
const BENEFITS_EN = [
  'Low / median / high range from 3 recognized methods',
  'Operational quality score and discount/premium factors',
  'Preparation priorities to maximize your exit value'
];

export default function Valuations() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const hasStartedRef = useRef(false);
  const simulatorRef = useRef(null);

  const valuation = useMemo(() => computeValuation(formData), [formData]);

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
        title: isFr ? 'Profil activité' : 'Business profile',
        description: isFr
          ? 'Définissez votre modèle économique et votre hypothèse de croissance.'
          : 'Define your business model and growth assumption.',
        fields: ['businessModel', 'growthRate']
      },
      {
        id: 2,
        title: isFr ? 'Données financières' : 'Financial inputs',
        description: isFr
          ? 'Renseignez les agrégats financiers utilisés dans les méthodes de valorisation.'
          : 'Provide the financial aggregates used by valuation methods.',
        fields: ['revenue', 'ebitda', 'netIncome', 'ownerSalary', 'equity', 'cash', 'debt']
      },
      {
        id: 3,
        title: isFr ? 'Qualité & risque' : 'Quality & risk',
        description: isFr
          ? 'Ajustez les décotes/surcotes liées au profil opérationnel de l\'entreprise.'
          : 'Adjust discounts/premiums linked to the operating profile.',
        fields: ['dependencyRisk', 'clientConcentration', 'revenueRecurrence']
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
      tool: 'valuation',
      metadata: { page: 'Valuations' }
    });
  }, []);

  useEffect(() => {
    if (globalCompletion > 0 && !hasStartedRef.current) {
      hasStartedRef.current = true;
      void toolAnalyticsService.track('tool_started', {
        tool: 'valuation',
        step: currentStep,
        metadata: { completion: globalCompletion }
      });
    }
  }, [currentStep, globalCompletion]);

  const currentStepConfig = steps[currentStep - 1];
  const canGoNext = currentStepConfig.fields.every((field) => String(formData[field] || '').trim() !== '');

  const recommendations = useMemo(() => {
    const list = [];
    if (valuation.details.qualityMultiplier < 1) {
      list.push(isFr
        ? 'Priorité : réduire la dépendance au dirigeant pour limiter la décote de risque.'
        : 'Priority: reduce owner dependency to limit risk discount.');
    }
    if (Number(formData.debt || 0) > Number(formData.cash || 0)) {
      list.push(isFr
        ? 'Priorité : améliorer la position de trésorerie nette avant phase de négociation.'
        : 'Priority: improve net cash position before negotiation phase.');
    }
    if (Number(formData.growthRate || 0) < 5) {
      list.push(isFr
        ? 'Priorité : formaliser un plan de croissance crédible sur 36 mois.'
        : 'Priority: formalize a credible 36-month growth plan.');
    }
    if (list.length === 0) {
      list.push(isFr
        ? "Fondamentaux cohérents : préparer un mémorandum d'equity story pour accélérer le process."
        : 'Consistent fundamentals: prepare an equity-story memo to accelerate the process.');
    }
    return list;
  }, [formData, isFr, valuation.details.qualityMultiplier]);

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
      <div className="bg-white">
        <SEO pageName="Valuations" />
        {/* HERO */}
        <section className="bg-[#FAF9F7] py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0ED] text-[#FF6B4A] text-xs font-semibold uppercase tracking-wider font-display">
                {isFr ? 'Outil M&A · Gratuit' : 'M&A Tool · Free'}
              </span>
              <span className="text-xs text-[#6B7A94]">
                {isFr ? 'Outils · Valorisation' : 'Tools · Valuation'}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B4759] leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
              {isFr
                ? "Quelle est la valeur de marché de votre entreprise aujourd'hui ?"
                : "What is your business's market value today?"}
            </h1>

            <p className="text-lg text-[#6B7A94] mb-6 leading-relaxed" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {isFr
                ? 'Fourchette de valorisation défendable en 5 minutes — méthodes Bercy, multiples sectoriels et DCF.'
                : 'Defensible valuation range in 5 minutes — Bercy, sector multiples and DCF methods.'}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 text-sm text-[#6B7A94] mb-8" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              <Users className="w-4 h-4 text-[#FF6B4A]" />
              <span className="font-semibold text-[#3B4759]">3 200+</span>
              <span>{isFr ? 'valorisations réalisées' : 'valuations completed'}</span>
              <span className="text-[#C8BDB5]">·</span>
              <span>{isFr ? 'Méthodes utilisées par les cabinets M&A' : 'Methods used by M&A firms'}</span>
              <span className="text-[#C8BDB5]">·</span>
              <span>{isFr ? 'Gratuit' : 'Free'}</span>
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
              {isFr ? 'Valoriser mon entreprise' : 'Value my business'}
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
                  {isFr ? "Outil de valorisation d'entreprise" : 'Business valuation tool'}
                </h2>
                <p className="text-sm text-[#6B7A94]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {isFr
                    ? 'Complétez les 3 étapes pour obtenir votre fourchette de valorisation.'
                    : 'Complete the 3 steps to receive your valuation range.'}
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
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Modèle économique' : 'Business model', isFr ? 'Base sectorielle utilisée pour les multiples.' : 'Sector basis used for multiples.')}</Label>
                      <Select value={formData.businessModel} onValueChange={(v) => handleChange('businessModel', v)}>
                        <SelectTrigger className="mt-1.5 border-[#EDE6E0]"><SelectValue placeholder={isFr ? 'Sélectionner' : 'Select'} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="agence">Agence / ESN</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="other">{isFr ? 'Autre' : 'Other'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Croissance estimée (%)' : 'Estimated growth (%)', isFr ? 'Hypothèse utilisée pour la projection DCF.' : 'Assumption used for DCF projection.')}</Label>
                      <Input className="mt-1.5 border-[#EDE6E0] focus-visible:ring-[#FF6B4A] font-mono text-sm" value={formData.growthRate} onChange={(e) => handleChange('growthRate', e.target.value)} placeholder="5" />
                    </div>
                  </div>
                ) : null}

                {/* Step 2 */}
                {currentStep === 2 ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {[
                      ['revenue', isFr ? 'CA (€)' : 'Revenue (€)', isFr ? "Chiffre d'affaires annuel HT." : 'Annual revenue excluding tax.'],
                      ['ebitda', 'EBITDA (€)', isFr ? 'Performance opérationnelle.' : 'Operating performance.'],
                      ['netIncome', isFr ? 'Résultat net (€)' : 'Net income (€)', isFr ? 'Résultat net courant.' : 'Current net income.'],
                      ['ownerSalary', isFr ? 'Rémunération dirigeant (€)' : 'Owner salary (€)', isFr ? 'Rémunération annuelle dirigeant.' : 'Annual owner compensation.'],
                      ['equity', isFr ? 'Capitaux propres (€)' : 'Equity (€)', isFr ? 'Valeur comptable des fonds propres.' : 'Book value of equity.'],
                      ['cash', isFr ? 'Trésorerie (€)' : 'Cash (€)', isFr ? 'Disponibilités de trésorerie.' : 'Cash available.'],
                      ['debt', isFr ? 'Dettes (€)' : 'Debt (€)', isFr ? 'Dette financière nette à intégrer.' : 'Net financial debt to include.']
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
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Dépendance dirigeant' : 'Owner dependency', isFr ? 'Impact sur la décote de risque.' : 'Impact on risk discount.')}</Label>
                      <Select value={formData.dependencyRisk} onValueChange={(v) => handleChange('dependencyRisk', v)}>
                        <SelectTrigger className="mt-1.5 border-[#EDE6E0]"><SelectValue placeholder={isFr ? 'Choisir' : 'Select'} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">{isFr ? 'Élevée' : 'High'}</SelectItem>
                          <SelectItem value="medium">{isFr ? 'Modérée' : 'Medium'}</SelectItem>
                          <SelectItem value="low">{isFr ? 'Faible' : 'Low'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Concentration client' : 'Client concentration', isFr ? 'Poids des premiers clients.' : 'Weight of top clients.')}</Label>
                      <Select value={formData.clientConcentration} onValueChange={(v) => handleChange('clientConcentration', v)}>
                        <SelectTrigger className="mt-1.5 border-[#EDE6E0]"><SelectValue placeholder={isFr ? 'Choisir' : 'Select'} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">{isFr ? 'Forte' : 'High'}</SelectItem>
                          <SelectItem value="medium">{isFr ? 'Moyenne' : 'Medium'}</SelectItem>
                          <SelectItem value="low">{isFr ? 'Faible' : 'Low'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Récurrence CA' : 'Revenue recurrence', isFr ? 'Niveau de revenus contractuels/récurrents.' : 'Level of recurring/contracted revenue.')}</Label>
                      <Select value={formData.revenueRecurrence} onValueChange={(v) => handleChange('revenueRecurrence', v)}>
                        <SelectTrigger className="mt-1.5 border-[#EDE6E0]"><SelectValue placeholder={isFr ? 'Choisir' : 'Select'} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">{isFr ? 'Forte' : 'High'}</SelectItem>
                          <SelectItem value="medium">{isFr ? 'Moyenne' : 'Medium'}</SelectItem>
                          <SelectItem value="low">{isFr ? 'Faible' : 'Low'}</SelectItem>
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
                  tool="valuation"
                  simulationInput={formData}
                  simulationResult={valuation}
                  preview={(
                    <div className="space-y-2 text-sm">
                      <p className="font-display font-semibold text-[#3B4759] mb-3">
                        {isFr ? 'Aperçu de votre fourchette :' : 'Preview of your range:'}
                      </p>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Borne basse' : 'Low range'}</span>
                        <span className="font-mono text-[#6B7A94]">●●● €</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Valeur médiane' : 'Median value'}</span>
                        <span className="font-mono font-bold text-[#FF6B4A] bg-[#FFF0ED] px-2 py-0.5 rounded">●●● €</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-[#6B7A94]">{isFr ? 'Borne haute' : 'High range'}</span>
                        <span className="font-mono text-[#6B7A94]">●●● €</span>
                      </div>
                    </div>
                  )}
                  full={(
                    <div className="space-y-2 text-sm">
                      <p className="font-display font-semibold text-[#3B4759] mb-3">
                        {isFr ? 'Votre fourchette de valorisation :' : 'Your valuation range:'}
                      </p>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Borne basse' : 'Low range'}</span>
                        <span className="font-mono text-[#3B4759]">{formatCurrency(valuation.low)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Valeur médiane' : 'Median value'}</span>
                        <span className="font-mono font-bold text-[#FF6B4A]">{formatCurrency(valuation.mid)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Borne haute' : 'High range'}</span>
                        <span className="font-mono text-[#3B4759]">{formatCurrency(valuation.high)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Score qualité (MUX)' : 'Quality score (MUX)'}</span>
                        <span className="font-mono text-[#3B4759]">{valuation.details.qualityMultiplier.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-[#6B7A94]">{isFr ? 'EBITDA retraité' : 'Adjusted EBITDA'}</span>
                        <span className="font-mono text-[#3B4759]">{formatCurrency(valuation.details.ebitdaAdjusted)}</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#EDE6E0] bg-[#FAF9F7] rounded-xl p-3">
                        <p className="font-display font-semibold text-[#3B4759] mb-2 text-xs uppercase tracking-wider">
                          {isFr ? 'Priorités de préparation' : 'Preparation priorities'}
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
                  title: isFr ? 'Méthodologie de valorisation' : 'Valuation methodology',
                  content: isFr
                    ? "La démarche retient trois axes complémentaires. Le premier est patrimonial : il fixe un socle défensif. Le second est transactionnel : il ancre la valeur dans les multiples observés sur le marché. Le troisième est économique : il projette la capacité de génération de cash-flow sur 5 ans."
                    : "The approach combines three complementary angles. First, asset-based for a defensive floor. Second, transactional for observed market multiples. Third, economic for forward cash-flow generation capacity over 5 years."
                },
                {
                  title: isFr ? 'Données à documenter' : 'Data to document',
                  content: isFr
                    ? "Agrégats financiers : CA, EBITDA, résultat net, capitaux propres, trésorerie et dette nette. Retraitements : normalisation de la rémunération dirigeant et éléments non récurrents. Qualité opérationnelle : dépendance dirigeant, concentration client, récurrence des revenus."
                    : "Financial aggregates: revenue, EBITDA, net income, equity, cash and net debt. Adjustments: owner compensation normalization and non-recurring items. Operational quality: owner dependency, client concentration, revenue recurrence."
                },
                {
                  title: isFr ? 'Lecture de la fourchette' : 'Reading the range',
                  content: isFr
                    ? "La borne basse représente une position prudente défendable. La valeur médiane constitue le point d'équilibre probable en négociation. La borne haute suppose une exécution maîtrisée du plan de création de valeur. Cette lecture permet d'anticiper la stratégie de discussion : niveau d'ambition de prix et priorités de préparation."
                    : "The low bound is a conservative defendable position. The median is the most likely negotiation balance point. The high bound assumes disciplined execution of the value-creation plan. This reading helps anticipate discussion strategy: pricing ambition and preparation priorities."
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
                ? "Simulation indicative, non constitutive d'un conseil fiscal, juridique ou financier."
                : "Indicative simulation, not financial, tax or legal advice."}
            </p>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}
