// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { createPageUrl } from '@/utils';
import Logo from '@/components/Logo';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Info, Sparkles, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { computeNetSeller } from '@/utils/simulatorsEngine';
import ToolLeadGate from '@/components/ToolLeadGate';
import { toolAnalyticsService } from '@/services/toolAnalyticsService';

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

export default function Targeting() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const hasStartedRef = useRef(false);

  const result = useMemo(() => computeNetSeller(formData), [formData]);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const formatCurrency = (value) =>
    new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(Number(value || 0));

  const alertLabels = {
    optimisation_fiscale_possible: language === 'fr' ? 'Optimisation fiscale possible' : 'Tax optimization possible',
    vente_via_holding_a_etudier: language === 'fr' ? 'Vente via holding à étudier' : 'Holding sale should be considered',
    depart_retraite_a_anticiper: language === 'fr' ? 'Départ retraite à anticiper' : 'Retirement timing to anticipate',
    risque_sur_imposition: language === 'fr' ? 'Risque de sur-imposition' : 'Over-taxation risk'
  };

  const steps = useMemo(
    () => [
      {
        id: 1,
        title: language === 'fr' ? 'Paramètres de vente' : 'Sale parameters',
        description:
          language === 'fr'
            ? 'Renseignez les bases économiques de la cession.'
            : 'Enter the core economic assumptions of the sale.',
        fields: ['salePrice', 'purchasePrice', 'contributions', 'feesValue', 'repaidDebts']
      },
      {
        id: 2,
        title: language === 'fr' ? 'Fiscalité & régime' : 'Tax & regime',
        description:
          language === 'fr'
            ? 'Définissez les hypothèses fiscales de calcul du net.'
            : 'Define tax assumptions used to compute net proceeds.',
        fields: ['taxRegime', 'taxBracket', 'manualAbatementRate', 'feesMode', 'holdingMode']
      },
      {
        id: 3,
        title: language === 'fr' ? 'Situation personnelle' : 'Personal context',
        description:
          language === 'fr'
            ? 'Précisez la durée de détention et le contexte retraite.'
            : 'Specify holding period and retirement context.',
        fields: ['holdingDurationYears', 'age', 'retirementPlanned']
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

  const currentStepCompletion = useMemo(() => {
    const fields = currentStepConfig.fields;
    const filled = fields.filter((field) => String(formData[field] || '').trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [currentStepConfig, formData]);

  const canGoNext = currentStepConfig.fields.every((field) => String(formData[field] || '').trim() !== '');

  const recommendations = useMemo(() => {
    const list = [];

    if (result.effectiveTaxRate > 35) {
      list.push(
        language === 'fr'
          ? 'Étudiez une optimisation du mode de détention pour réduire le taux effectif.'
          : 'Review ownership setup to reduce effective tax rate.'
      );
    }
    if (Number(formData.holdingDurationYears || 0) < 5) {
      list.push(
        language === 'fr'
          ? 'Anticipez le calendrier de cession pour maximiser les abattements potentiels.'
          : 'Plan the exit timeline to maximize potential abatements.'
      );
    }
    if (Number(formData.repaidDebts || 0) > Number(formData.salePrice || 0) * 0.2) {
      list.push(
        language === 'fr'
          ? 'Négociez le traitement de la dette au closing pour protéger le net vendeur.'
          : 'Negotiate debt treatment at closing to protect net proceeds.'
      );
    }
    if (list.length === 0) {
      list.push(
        language === 'fr'
          ? 'Votre structure est équilibrée. Formalisez plusieurs scénarios de négociation.'
          : 'Your structure looks balanced. Formalize multiple negotiation scenarios.'
      );
    }

    return list;
  }, [formData.holdingDurationYears, formData.repaidDebts, formData.salePrice, language, result.effectiveTaxRate]);

  const withTooltip = (label, hint) => (
    <span className="inline-flex items-center gap-1.5">
      <span>{label}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F2EE] text-[#6B7A94] hover:bg-[#ECE6DF]"
            aria-label={language === 'fr' ? 'Aide' : 'Help'}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-[#3B4759] text-white">
          {hint}
        </TooltipContent>
      </Tooltip>
    </span>
  );

  return (
    <TooltipProvider delayDuration={120}>
      <div className="min-h-screen py-10 bg-[#FAF9F7]">
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 mb-8 -mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2">
                <Logo size="sm" showText={false} />
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  to={createPageUrl('Outils')}
                  className="text-[#3B4759] hover:text-primary transition-colors"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}
                >
                  {language === 'fr' ? 'Outils' : 'Tools'}
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/Login"
                  className="text-gray-900 hover:text-gray-700 font-medium transition-colors px-4 py-2"
                  style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}
                >
                  {language === 'fr' ? 'Se connecter' : 'Login'}
                </Link>
                <Link to="/AccountCreation">
                  <Button
                    className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-white"
                    style={{ fontFamily: 'Sora, sans-serif', fontWeight: 500, fontSize: '14px' }}
                  >
                    {language === 'fr' ? 'Créer un compte' : 'Sign up'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl font-bold text-[#3B4759]">
              {language === 'fr' ? 'Simulateur net vendeur après impôts' : 'Seller net after tax simulator'}
            </h1>
          </div>
          <p className="text-sm text-[#6B7A94]">
            {language === 'fr'
              ? 'Projetez votre net encaissé après fiscalité, frais et dettes remboursées.'
              : 'Project your net proceeds after taxes, fees and debt repayment.'}
          </p>

          <Card className="border border-[#F2E8E2] bg-white shadow-sm">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-[#FF6B4A] text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {language === 'fr' ? 'Accompagnement dédié' : 'Dedicated support'}
              </div>
              <p className="text-sm text-[#3B4759] sm:text-right">
                {language === 'fr'
                  ? 'De la première analyse à la signature, Riviqo vous accompagne pour votre acquisition ou votre cession.'
                  : 'From first analysis to signature, Riviqo supports your acquisition or sale.'}
              </p>
            </CardContent>
          </Card>

          <div className="grid xl:grid-cols-12 gap-6">
            <div className="xl:col-span-4 space-y-4">
              <Card className="border border-[#F2E8E2] bg-white shadow-sm">
                <CardContent className="p-5">
                  <p className="font-display text-lg font-semibold text-[#3B4759] mb-2">
                    {language === 'fr' ? 'Pourquoi cet outil' : 'Why this tool'}
                  </p>
                  <p className="text-sm text-[#6B7A94] leading-relaxed">
                    {language === 'fr'
                      ? 'Ce simulateur vous permet d’anticiper le montant réellement encaissé après fiscalité et frais de transaction.'
                      : 'This simulator helps anticipate actual net proceeds after tax and transaction fees.'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-[#F2E8E2] bg-white shadow-sm">
                <CardContent className="p-5">
                  <p className="font-display text-lg font-semibold text-[#3B4759] mb-3">
                    {language === 'fr' ? 'Ce qui est comparé' : 'What is compared'}
                  </p>
                  <ul className="space-y-2 text-sm text-[#3B4759]">
                    <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF6B4A]" />{language === 'fr' ? 'Scénario PFU (flat tax)' : 'PFU (flat tax) scenario'}</li>
                    <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF6B4A]" />{language === 'fr' ? 'Scénario barème progressif' : 'Progressive tax scenario'}</li>
                    <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF6B4A]" />{language === 'fr' ? 'Impact retraite / abattements / dette au closing' : 'Impact of retirement, abatements, and closing debt'}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-[#F2E8E2] bg-[#FFF8F5] shadow-sm">
                <CardContent className="p-5">
                  <p className="font-display text-lg font-semibold text-[#3B4759] mb-2">
                    {language === 'fr' ? 'Interprétation rapide' : 'Quick interpretation'}
                  </p>
                  <p className="text-sm text-[#6B7A94] leading-relaxed">
                    {language === 'fr'
                      ? 'Le net vendeur est votre base de négociation réelle. Les alertes montrent les leviers à activer avant la signature.'
                      : 'Net seller proceeds are your real negotiation baseline. Alerts highlight levers to activate before signing.'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="xl:col-span-8">
              <div className="grid lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3 border border-[#F2E8E2] shadow-sm bg-white">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[#3B4759]">
                      {language === 'fr' ? 'Parcours guidé' : 'Guided flow'}
                    </p>
                    <Badge className="bg-[#FFF0ED] text-[#FF6B4A] hover:bg-[#FFF0ED] border border-[#FFD8CC]">
                      {globalCompletion}% {language === 'fr' ? 'complété' : 'completed'}
                    </Badge>
                  </div>
                  <Progress value={globalCompletion} className="h-2 bg-[#FFE7DF] [&>div]:bg-[#FF6B4A]" />
                  <div className="grid sm:grid-cols-3 gap-2">
                    {steps.map((step) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setCurrentStep(step.id)}
                        className={`rounded-lg border px-3 py-2 text-left transition-all ${
                          step.id === currentStep
                            ? 'border-[#FF6B4A] bg-[#FFF3EF] shadow-sm'
                            : 'border-[#EFE5DF] bg-white hover:border-[#FFD8CC]'
                        }`}
                      >
                        <p className="text-xs text-[#6B7A94]">
                          {language === 'fr' ? 'Étape' : 'Step'} {step.id}
                        </p>
                        <p className="text-sm font-medium text-[#3B4759]">{step.title}</p>
                      </button>
                    ))}
                  </div>
                  <div className="rounded-xl border border-[#EFE5DF] bg-[#FCFBFA] p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="font-medium text-[#3B4759]">{currentStepConfig.title}</p>
                      <span className="text-xs text-[#6B7A94]">{currentStepCompletion}%</span>
                    </div>
                    <p className="text-xs text-[#6B7A94]">{currentStepConfig.description}</p>
                  </div>
                </div>

                {currentStep === 1 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      ['salePrice', language === 'fr' ? 'Prix de cession (€)' : 'Sale price (€)', language === 'fr' ? 'Prix de vente brut négocié avec l’acquéreur.' : 'Gross sale price negotiated with the buyer.'],
                      ['purchasePrice', language === 'fr' ? 'Prix d’acquisition initial (€)' : 'Initial acquisition price (€)', language === 'fr' ? 'Prix payé à l’origine pour acquérir les titres/fonds.' : 'Original purchase price of shares/assets.'],
                      ['contributions', language === 'fr' ? 'Apports réalisés (€)' : 'Contributions made (€)', language === 'fr' ? 'Apports complémentaires injectés dans la société.' : 'Additional capital contributions made over time.'],
                      ['feesValue', language === 'fr' ? 'Frais de cession' : 'Selling fees', language === 'fr' ? 'Honoraires et coûts liés à la transaction.' : 'Advisory and transaction-related costs.'],
                      ['repaidDebts', language === 'fr' ? 'Dettes remboursées (€)' : 'Repaid debts (€)', language === 'fr' ? 'Dettes à rembourser au closing.' : 'Debt to repay at closing.']
                    ].map(([field, label, hint]) => (
                      <div key={field}>
                        <Label>{withTooltip(label, hint)}</Label>
                        <Input className="mt-2 font-mono border-[#EADFD8]" value={formData[field]} onChange={(e) => handleChange(field, e.target.value)} placeholder="" />
                      </div>
                    ))}
                  </div>
                ) : null}

                {currentStep === 2 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Mode frais' : 'Fees mode', language === 'fr' ? 'Choisissez si les frais sont saisis en pourcentage ou montant fixe.' : 'Choose whether fees are entered as a percentage or fixed amount.')}</Label>
                      <Select value={formData.feesMode} onValueChange={(v) => handleChange('feesMode', v)}>
                        <SelectTrigger className="mt-2 border-[#EADFD8]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percent">%</SelectItem>
                          <SelectItem value="amount">€</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Régime fiscal' : 'Tax regime', language === 'fr' ? 'Comparez PFU et barème progressif selon votre profil.' : 'Compare flat tax and progressive tax according to your profile.')}</Label>
                      <Select value={formData.taxRegime} onValueChange={(v) => handleChange('taxRegime', v)}>
                        <SelectTrigger className="mt-2 border-[#EADFD8]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pfu">PFU</SelectItem>
                          <SelectItem value="bareme">Barème progressif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Tranche imposition (%)' : 'Tax bracket (%)', language === 'fr' ? 'Tranche marginale utilisée pour le scénario barème.' : 'Marginal bracket used for progressive tax scenario.')}</Label>
                      <Input className="mt-2 font-mono border-[#EADFD8]" value={formData.taxBracket} onChange={(e) => handleChange('taxBracket', e.target.value)} placeholder="" />
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Abattement manuel (%)' : 'Manual abatement (%)', language === 'fr' ? 'Abattement additionnel si applicable à votre situation.' : 'Additional abatement rate if applicable to your case.')}</Label>
                      <Input className="mt-2 font-mono border-[#EADFD8]" value={formData.manualAbatementRate} onChange={(e) => handleChange('manualAbatementRate', e.target.value)} placeholder="" />
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Mode de détention' : 'Holding mode', language === 'fr' ? 'Détention directe ou via holding, avec impacts fiscaux potentiels.' : 'Direct or holding ownership with potential tax impact.')}</Label>
                      <Select value={formData.holdingMode} onValueChange={(v) => handleChange('holdingMode', v)}>
                        <SelectTrigger className="mt-2 border-[#EADFD8]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direct">{language === 'fr' ? 'Direct' : 'Direct'}</SelectItem>
                          <SelectItem value="holding">Holding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : null}

                {currentStep === 3 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Durée détention (ans)' : 'Holding duration (years)', language === 'fr' ? 'Durée de détention des titres/fonds cédés.' : 'Holding period of shares/assets sold.')}</Label>
                      <Input className="mt-2 font-mono border-[#EADFD8]" value={formData.holdingDurationYears} onChange={(e) => handleChange('holdingDurationYears', e.target.value)} placeholder="" />
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Âge' : 'Age', language === 'fr' ? 'Âge du cédant pour les hypothèses retraite.' : 'Seller age for retirement-related assumptions.')}</Label>
                      <Input className="mt-2 font-mono border-[#EADFD8]" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} placeholder="" />
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Départ retraite prévu' : 'Retirement planned', language === 'fr' ? 'Permet d’activer les hypothèses d’exonération retraite.' : 'Activates retirement exemption assumptions.')}</Label>
                      <Select value={formData.retirementPlanned} onValueChange={(v) => handleChange('retirementPlanned', v)}>
                        <SelectTrigger className="mt-2 border-[#EADFD8]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{language === 'fr' ? 'Oui' : 'Yes'}</SelectItem>
                          <SelectItem value="no">{language === 'fr' ? 'Non' : 'No'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="border-[#EADFD8] text-[#3B4759]"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {language === 'fr' ? 'Précédent' : 'Previous'}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-[#6B7A94]"
                      onClick={() => {
                        setFormData(INITIAL_FORM_DATA);
                        setCurrentStep(1);
                      }}
                    >
                      {language === 'fr' ? 'Réinitialiser' : 'Reset'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
                      disabled={currentStep === steps.length || !canGoNext}
                      className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white"
                    >
                      {language === 'fr' ? 'Suivant' : 'Next'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

                <Card className="lg:col-span-2 border border-[#F2E8E2] shadow-sm bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#FF6B4A]" />
                  <p className="font-display font-semibold text-[#3B4759]">
                    {language === 'fr' ? 'Résultat net vendeur' : 'Seller net result'}
                  </p>
                </div>

                <ToolLeadGate
                  language={language}
                  tool="net_seller"
                  simulationInput={formData}
                  simulationResult={result}
                  preview={(
                    <div className="space-y-3">
                      <div className="rounded-xl bg-white border-2 border-[#FF6B4A] p-4">
                        <p className="text-xs text-[#6B7A94] uppercase">{language === 'fr' ? 'Net vendeur estimé' : 'Estimated seller net'}</p>
                        <p className="font-mono text-2xl font-bold text-[#FF6B4A]">***</p>
                      </div>
                      <div className="rounded-xl bg-[#FAF9F7] border border-[#EFEAE6] p-4 text-sm text-[#3B4759] space-y-1">
                        <p>{language === 'fr' ? 'Impôts totaux' : 'Total taxes'}: <span className="font-mono">***</span></p>
                        <p>{language === 'fr' ? 'Taux effectif' : 'Effective rate'}: <span className="font-mono">**%</span></p>
                      </div>
                    </div>
                  )}
                  full={(
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid grid-cols-3 w-full bg-[#F5F2EE]">
                        <TabsTrigger value="summary">{language === 'fr' ? 'Synthèse' : 'Summary'}</TabsTrigger>
                        <TabsTrigger value="scenarios">{language === 'fr' ? 'Scénarios' : 'Scenarios'}</TabsTrigger>
                        <TabsTrigger value="actions">{language === 'fr' ? 'Actions' : 'Actions'}</TabsTrigger>
                      </TabsList>

                      <TabsContent value="summary" className="space-y-4 mt-4">
                        <div className="rounded-xl bg-white border-2 border-[#FF6B4A] p-4">
                          <p className="text-xs text-[#6B7A94] uppercase">{language === 'fr' ? 'Net vendeur estimé' : 'Estimated seller net'}</p>
                          <p className="font-mono text-2xl font-bold text-[#FF6B4A]">{formatCurrency(result.netSeller)}</p>
                        </div>

                        <div className="rounded-xl bg-[#FAF9F7] border border-[#EFEAE6] p-4 text-sm text-[#3B4759] space-y-1">
                          <p>{language === 'fr' ? 'Plus-value imposable' : 'Taxable capital gain'}: <span className="font-mono">{formatCurrency(result.taxableCapitalGain)}</span></p>
                          <p>{language === 'fr' ? 'Impôts totaux' : 'Total taxes'}: <span className="font-mono">{formatCurrency(result.totalTaxes)}</span></p>
                          <p>{language === 'fr' ? 'Frais' : 'Fees'}: <span className="font-mono">{formatCurrency(result.feesAmount)}</span></p>
                          <p>{language === 'fr' ? 'Taux effectif' : 'Effective rate'}: <span className="font-mono">{result.effectiveTaxRate.toFixed(1)}%</span></p>
                        </div>
                      </TabsContent>

                      <TabsContent value="scenarios" className="mt-4">
                        <div className="rounded-xl bg-white border border-[#EFEAE6] p-4 text-xs text-[#6B7A94] space-y-1">
                          <p>PFU: <span className="font-mono">{formatCurrency(result.scenarios.pfu.netSeller)}</span></p>
                          <p>Barème: <span className="font-mono">{formatCurrency(result.scenarios.bareme.netSeller)}</span></p>
                          <p>{language === 'fr' ? 'Scénario retraite' : 'Retirement scenario'}: <span className="font-mono">{formatCurrency(result.scenarios.retraite.netSeller)}</span></p>
                        </div>
                      </TabsContent>

                      <TabsContent value="actions" className="mt-4 space-y-3">
                        <div className="rounded-xl border border-[#EFE5DF] bg-white p-4 space-y-3">
                          <div className="inline-flex items-center gap-2 text-[#FF6B4A] text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            {language === 'fr' ? 'Recommandations prioritaires' : 'Priority recommendations'}
                          </div>
                          <ul className="space-y-2 text-sm text-[#3B4759]">
                            {recommendations.map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          {result.alerts.length === 0 ? (
                            <div className="inline-flex items-center gap-2 text-green-700 text-sm">
                              <CheckCircle2 className="w-4 h-4" />
                              {language === 'fr' ? 'Aucune alerte majeure' : 'No major alert'}
                            </div>
                          ) : (
                            result.alerts.map((alert) => (
                              <div key={alert} className="inline-flex items-center gap-2 text-amber-700 text-sm mr-2">
                                <AlertTriangle className="w-4 h-4" />
                                {alertLabels[alert] || alert}
                              </div>
                            ))
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                />
              </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Card className="border border-[#F2E8E2] bg-white shadow-sm">
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-display text-lg font-semibold text-[#3B4759]">
                  {language === 'fr' ? 'Un accompagnement humain, de A à Z' : 'Human support, end-to-end'}
                </p>
                <p className="text-sm text-[#6B7A94] mt-1">
                  {language === 'fr'
                    ? 'De la première analyse à la signature, Riviqo vous accompagne avec un expert dédié pour votre acquisition ou votre cession.'
                    : 'From first analysis to signature, Riviqo supports your acquisition or sale with a dedicated expert.'}
                </p>
              </div>
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white whitespace-nowrap">
                  {language === 'fr' ? 'Contacter un expert' : 'Contact an expert'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-[#F2E8E2] shadow-sm bg-white">
            <CardContent className="p-4 text-xs text-[#6B7A94]">
              {language === 'fr'
                ? 'Simulation indicative, non constitutive d’un conseil fiscal, juridique ou patrimonial.'
                : 'Indicative simulation, not tax, legal or wealth-management advice.'}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
