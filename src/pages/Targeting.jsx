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
import { computeNetSeller } from '@/utils/simulatorsEngine';
import ToolLeadGate from '@/components/ToolLeadGate';
import { toolAnalyticsService } from '@/services/toolAnalyticsService';
import SEO from '@/components/SEO';

const INITIAL_FORM_DATA = {
  salePrice: '',
  purchasePrice: '',
  contributions: '',
  feesMode: 'percent',
  feesValue: '',
  repaidDebts: '',
  holdingDurationYears: '',
  age: '',
  retirementPlanned: 'no',
  taxBracket: '',
  holdingMode: 'direct',
  manualAbatementRate: '',
  taxRegime: 'pfu'
};

const BENEFITS_FR = [
  'Votre montant net réellement disponible après impôts et frais',
  'Comparaison optimisée PFU vs barème progressif',
  'Recommandations personnalisées sur les leviers de structuration'
];
const BENEFITS_EN = [
  'Your actual net amount available after taxes and fees',
  'Optimized comparison: flat tax (PFU) vs progressive bracket',
  'Personalized recommendations on structuring levers'
];

export default function Targeting() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const hasStartedRef = useRef(false);
  const simulatorRef = useRef(null);

  const result = useMemo(() => computeNetSeller(formData), [formData]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat(isFr ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(Number(value || 0));

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const steps = useMemo(
    () => [
      {
        id: 1,
        title: isFr ? 'Paramètres de cession' : 'Sale parameters',
        description: isFr
          ? 'Renseignez les paramètres économiques de la transaction.'
          : 'Enter economic transaction parameters.',
        fields: ['salePrice', 'purchasePrice', 'contributions', 'feesValue', 'repaidDebts']
      },
      {
        id: 2,
        title: isFr ? 'Fiscalité' : 'Tax assumptions',
        description: isFr
          ? 'Renseignez les hypothèses de régime fiscal et d\'abattement.'
          : 'Enter tax regime and abatement assumptions.',
        fields: ['taxRegime', 'taxBracket', 'manualAbatementRate', 'feesMode', 'holdingMode']
      },
      {
        id: 3,
        title: isFr ? 'Contexte cédant' : 'Seller context',
        description: isFr
          ? 'Intégrez le contexte de durée de détention et de retraite.'
          : 'Include holding period and retirement context.',
        fields: ['holdingDurationYears', 'age', 'retirementPlanned']
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
      tool: 'net_seller',
      metadata: { page: 'Targeting' }
    });
  }, []);

  useEffect(() => {
    if (globalCompletion > 0 && !hasStartedRef.current) {
      hasStartedRef.current = true;
      void toolAnalyticsService.track('tool_started', {
        tool: 'net_seller',
        step: currentStep,
        metadata: { completion: globalCompletion }
      });
    }
  }, [currentStep, globalCompletion]);

  const currentStepConfig = steps[currentStep - 1];
  const canGoNext = currentStepConfig.fields.every((field) => String(formData[field] || '').trim() !== '');

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

  const recommendations = useMemo(() => {
    const list = [];
    if (result.effectiveTaxRate > 35) {
      list.push(isFr
        ? 'Priorité : examiner les leviers de structuration pour réduire le taux effectif global.'
        : 'Priority: review structuring levers to reduce effective global tax rate.');
    }
    if (Number(formData.holdingDurationYears || 0) < 5) {
      list.push(isFr
        ? 'Priorité : analyser l\'impact du calendrier de cession sur les abattements applicables.'
        : 'Priority: assess timing impact on applicable abatements.');
    }
    if (list.length === 0) {
      list.push(isFr
        ? 'Profil équilibré : préparer plusieurs scénarios de négociation exprimés en produit net.'
        : 'Balanced profile: prepare multiple negotiation scenarios expressed in net proceeds.');
    }
    return list;
  }, [formData.holdingDurationYears, isFr, result.effectiveTaxRate]);

  const nextSteps = (
    <div className="mt-6 pt-5 border-t border-[#EDE6E0]">
      <p className="text-xs font-bold uppercase tracking-widest text-[#6B7A94] mb-3 font-display">
        {isFr ? 'Étapes suivantes' : 'Next steps'}
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        <Link to={createPageUrl('AccountCreation')}>
          <div className="rounded-xl p-3 text-center border border-[#FFD5C7] bg-[#FFF0ED] hover:bg-[#FFE5DD] transition-colors cursor-pointer">
            <p className="text-xs font-semibold text-[#FF6B4A] font-display">
              {isFr ? 'Créer un compte' : 'Create account'}
            </p>
            <p className="text-[11px] text-[#FF6B4A]/70 mt-0.5">{isFr ? 'Accès complet gratuit' : 'Free full access'}</p>
          </div>
        </Link>
        <Link to={createPageUrl('Contact')}>
          <div className="rounded-xl p-3 text-center border border-[#EDE6E0] bg-white hover:bg-[#FAF9F7] transition-colors cursor-pointer">
            <p className="text-xs font-semibold text-[#3B4759] font-display">
              {isFr ? 'Parler à un expert' : 'Talk to an expert'}
            </p>
            <p className="text-[11px] text-[#6B7A94] mt-0.5">{isFr ? 'Riviqo Advisory' : 'Riviqo Advisory'}</p>
          </div>
        </Link>
        <Link to={createPageUrl('Annonces')}>
          <div className="rounded-xl p-3 text-center border border-[#EDE6E0] bg-white hover:bg-[#FAF9F7] transition-colors cursor-pointer">
            <p className="text-xs font-semibold text-[#3B4759] font-display">
              {isFr ? 'Voir les annonces' : 'Browse listings'}
            </p>
            <p className="text-[11px] text-[#6B7A94] mt-0.5">{isFr ? 'Dossiers vérifiés' : 'Verified listings'}</p>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={120}>
      <div className="min-h-screen bg-white">
        <SEO pageName="Targeting" />
        {/* HERO */}
        <section className="bg-[#FAF9F7] py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0ED] text-[#FF6B4A] text-xs font-semibold uppercase tracking-wider font-display">
                {isFr ? 'Outil M&A · Gratuit' : 'M&A Tool · Free'}
              </span>
              <span className="text-xs text-[#6B7A94]">
                {isFr ? 'Outils · Produit net de cession' : 'Tools · Net sale proceeds'}
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B4759] leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
              {isFr
                ? 'Combien allez-vous réellement encaisser après la vente de votre entreprise ?'
                : 'How much will you actually receive after selling your business?'}
            </h1>

            {/* Sous-titre */}
            <p className="text-lg text-[#6B7A94] mb-6 leading-relaxed" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {isFr
                ? 'Estimez votre produit net de cession après fiscalité, frais et dettes — en 5 minutes.'
                : 'Estimate your net sale proceeds after taxes, fees and debts — in 5 minutes.'}
            </p>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-1.5 text-sm text-[#6B7A94] mb-8" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              <Users className="w-4 h-4 text-[#FF6B4A]" />
              <span className="font-semibold text-[#3B4759]">2 800+</span>
              <span>{isFr ? 'simulations réalisées' : 'simulations completed'}</span>
              <span className="text-[#C8BDB5]">·</span>
              <span>{isFr ? '5 min' : '5 min'}</span>
              <span className="text-[#C8BDB5]">·</span>
              <span>{isFr ? 'Gratuit' : 'Free'}</span>
              <span className="text-[#C8BDB5]">·</span>
              <span>{isFr ? '100% confidentiel' : '100% confidential'}</span>
            </div>

            {/* Bénéfices */}
            <ul className="space-y-3 mb-8">
              {(isFr ? BENEFITS_FR : BENEFITS_EN).map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-[#3B4759]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <CheckCircle2 className="w-5 h-5 text-[#FF6B4A] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              onClick={scrollToSimulator}
              className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold shadow-md"
            >
              {isFr ? 'Calculer mon produit net' : 'Calculate my net proceeds'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* SIMULATEUR */}
        <section ref={simulatorRef} id="simulateur" className="py-14 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl border border-[#EDE6E0] overflow-hidden">
              {/* Header card */}
              <div className="px-6 pt-6 pb-4 border-b border-[#EDE6E0]">
                <h2 className="font-display text-xl font-bold text-[#3B4759] mb-1">
                  {isFr ? 'Simulateur de produit net de cession' : 'Net sale proceeds simulator'}
                </h2>
                <p className="text-sm text-[#6B7A94]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {isFr
                    ? 'Complétez les 3 étapes pour obtenir votre estimation détaillée.'
                    : 'Complete the 3 steps to receive your detailed estimate.'}
                </p>
              </div>

              <div className="px-6 py-6">
                {/* Step pills + progress */}
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
                      ['salePrice', isFr ? 'Prix de cession (€)' : 'Sale price (€)', isFr ? 'Prix brut de transaction.' : 'Gross transaction price.'],
                      ['purchasePrice', isFr ? "Prix d'acquisition initial (€)" : 'Initial purchase price (€)', isFr ? "Valeur historique d'acquisition." : 'Historical acquisition value.'],
                      ['contributions', isFr ? 'Apports réalisés (€)' : 'Contributions made (€)', isFr ? 'Apports en capital complémentaires.' : 'Additional capital contributions.'],
                      ['feesValue', isFr ? 'Frais de cession' : 'Selling fees', isFr ? 'Honoraires et coûts de transaction.' : 'Advisory and transaction costs.'],
                      ['repaidDebts', isFr ? 'Dettes remboursées (€)' : 'Repaid debts (€)', isFr ? 'Passif réglé au closing.' : 'Liabilities settled at closing.']
                    ].map(([field, label, hint]) => (
                      <div key={field}>
                        <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(label, hint)}</Label>
                        <Input
                          className="mt-1.5 border-[#EDE6E0] focus-visible:ring-[#FF6B4A] font-mono text-sm"
                          value={formData[field]}
                          onChange={(e) => handleChange(field, e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Step 2 */}
                {currentStep === 2 ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Mode frais' : 'Fees mode', isFr ? 'Saisie en pourcentage ou en montant.' : 'Input as percent or amount.')}</Label>
                      <Select value={formData.feesMode} onValueChange={(v) => handleChange('feesMode', v)}>
                        <SelectTrigger className="mt-1.5 border-[#EDE6E0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percent">%</SelectItem>
                          <SelectItem value="amount">€</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Régime fiscal' : 'Tax regime', isFr ? 'PFU ou barème progressif.' : 'Flat tax or progressive regime.')}</Label>
                      <Select value={formData.taxRegime} onValueChange={(v) => handleChange('taxRegime', v)}>
                        <SelectTrigger className="mt-1.5 border-[#EDE6E0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pfu">PFU</SelectItem>
                          <SelectItem value="bareme">{isFr ? 'Barème progressif' : 'Progressive bracket'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? "Tranche d'imposition (%)" : 'Tax bracket (%)', isFr ? 'Tranche marginale pour scénario barème.' : 'Marginal bracket for progressive scenario.')}</Label>
                      <Input className="mt-1.5 border-[#EDE6E0] focus-visible:ring-[#FF6B4A] font-mono text-sm" value={formData.taxBracket} onChange={(e) => handleChange('taxBracket', e.target.value)} placeholder="30" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Abattement manuel (%)' : 'Manual abatement (%)', isFr ? 'Abattement complémentaire le cas échéant.' : 'Additional abatement if applicable.')}</Label>
                      <Input className="mt-1.5 border-[#EDE6E0] focus-visible:ring-[#FF6B4A] font-mono text-sm" value={formData.manualAbatementRate} onChange={(e) => handleChange('manualAbatementRate', e.target.value)} placeholder="0" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Mode de détention' : 'Holding mode', isFr ? 'Détention directe ou via holding.' : 'Direct ownership or holding structure.')}</Label>
                      <Select value={formData.holdingMode} onValueChange={(v) => handleChange('holdingMode', v)}>
                        <SelectTrigger className="mt-1.5 border-[#EDE6E0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direct">{isFr ? 'Direct' : 'Direct'}</SelectItem>
                          <SelectItem value="holding">Holding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : null}

                {/* Step 3 */}
                {currentStep === 3 ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Durée de détention (ans)' : 'Holding duration (years)', isFr ? 'Durée de détention des titres cédés.' : 'Holding period of sold shares/assets.')}</Label>
                      <Input className="mt-1.5 border-[#EDE6E0] focus-visible:ring-[#FF6B4A] font-mono text-sm" value={formData.holdingDurationYears} onChange={(e) => handleChange('holdingDurationYears', e.target.value)} placeholder="5" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Âge du cédant' : 'Seller age', isFr ? "Paramètre utilisé pour les hypothèses retraite." : 'Used for retirement assumptions.')}</Label>
                      <Input className="mt-1.5 border-[#EDE6E0] focus-visible:ring-[#FF6B4A] font-mono text-sm" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} placeholder="55" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-[#3B4759]">{withTooltip(isFr ? 'Départ retraite prévu' : 'Retirement planned', isFr ? "Active les hypothèses retraite." : 'Activates retirement assumptions.')}</Label>
                      <Select value={formData.retirementPlanned} onValueChange={(v) => handleChange('retirementPlanned', v)}>
                        <SelectTrigger className="mt-1.5 border-[#EDE6E0]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{isFr ? 'Oui' : 'Yes'}</SelectItem>
                          <SelectItem value="no">{isFr ? 'Non' : 'No'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : null}

                {/* Navigation steps */}
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
                  tool="net_seller"
                  simulationInput={formData}
                  simulationResult={result}
                  preview={(
                    <div className="space-y-2 text-sm">
                      <p className="font-display font-semibold text-[#3B4759] mb-3">
                        {isFr ? 'Aperçu de votre résultat :' : 'Preview of your result:'}
                      </p>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Produit net de cession estimé' : 'Estimated net sale proceeds'}</span>
                        <span className="font-mono font-bold text-[#FF6B4A] bg-[#FFF0ED] px-2 py-0.5 rounded">●●● €</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Impôts totaux' : 'Total taxes'}</span>
                        <span className="font-mono text-[#6B7A94]">●●● €</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-[#6B7A94]">{isFr ? 'Taux effectif d\'imposition' : 'Effective tax rate'}</span>
                        <span className="font-mono text-[#6B7A94]">●● %</span>
                      </div>
                    </div>
                  )}
                  full={(
                    <div className="space-y-2 text-sm">
                      <p className="font-display font-semibold text-[#3B4759] mb-3">
                        {isFr ? 'Votre produit net de cession :' : 'Your net sale proceeds:'}
                      </p>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Produit net de cession estimé' : 'Estimated net proceeds'}</span>
                        <span className="font-mono font-bold text-[#FF6B4A]">{formatCurrency(result.netSeller)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Plus-value imposable' : 'Taxable capital gain'}</span>
                        <span className="font-mono text-[#3B4759]">{formatCurrency(result.taxableCapitalGain)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Impôts totaux' : 'Total taxes'}</span>
                        <span className="font-mono text-[#3B4759]">{formatCurrency(result.totalTaxes)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#EDE6E0]">
                        <span className="text-[#6B7A94]">{isFr ? 'Frais de transaction' : 'Transaction fees'}</span>
                        <span className="font-mono text-[#3B4759]">{formatCurrency(result.feesAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-[#6B7A94]">{isFr ? "Taux effectif d'imposition" : 'Effective tax rate'}</span>
                        <span className="font-mono text-[#3B4759]">{result.effectiveTaxRate.toFixed(1)}%</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#EDE6E0] bg-[#FAF9F7] rounded-xl p-3">
                        <p className="font-display font-semibold text-[#3B4759] mb-2 text-xs uppercase tracking-wider">
                          {isFr ? 'Recommandations personnalisées' : 'Personalized recommendations'}
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
                  title: isFr ? 'Méthodologie de calcul' : 'Calculation methodology',
                  content: isFr
                    ? "Le raisonnement part de la plus-value brute, applique les hypothèses fiscales pertinentes, puis intègre les coûts de transaction et les dettes réglées au closing. La finalité n'est pas un simple calcul d'impôt, mais une projection de trésorerie nette réellement disponible selon plusieurs scénarios."
                    : "The analysis starts from gross capital gain, applies relevant tax assumptions, then integrates transaction costs and liabilities settled at closing. The goal is not only tax computation but a projection of truly available net proceeds across scenarios."
                },
                {
                  title: isFr ? 'Données à documenter' : 'Data to document',
                  content: isFr
                    ? "Prix de cession, prix d'acquisition historique, apports et frais de transaction. Régime fiscal retenu, abattements potentiels et tranche d'imposition. Contexte personnel : durée de détention, situation retraite, mode de détention (direct/holding)."
                    : "Sale price, historical acquisition price, contributions, and transaction costs. Chosen tax regime, potential abatements, and tax bracket. Personal context: holding period, retirement status, ownership mode (direct/holding)."
                },
                {
                  title: isFr ? 'Lecture des résultats' : 'Reading results',
                  content: isFr
                    ? "Le taux effectif d'imposition permet d'arbitrer les options de structuration. Le produit net de cession final constitue l'indicateur central pour piloter la négociation en valeur réellement encaissée. L'analyse comparative des scénarios permet de décider entre optimisation immédiate, ajustement de calendrier ou revue de structure."
                    : "The effective tax rate helps arbitrate structuring options. Final net proceeds remain the central indicator to drive negotiation on truly received value. Scenario comparison supports decisions between immediate optimization, timing adjustment, or structural review."
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
                ? "Simulation indicative, non constitutive d'un conseil fiscal, juridique ou patrimonial."
                : "Indicative simulation, not tax, legal or wealth-management advice."}
            </p>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}
