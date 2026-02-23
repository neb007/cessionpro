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

  const formatCurrency = (value) =>
    new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(Number(value || 0));

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const steps = useMemo(
    () => [
      {
        id: 1,
        title: language === 'fr' ? 'Paramètres de cession' : 'Sale parameters',
        description:
          language === 'fr'
            ? 'Renseignez les paramètres économiques de la transaction.'
            : 'Enter economic transaction parameters.',
        fields: ['salePrice', 'purchasePrice', 'contributions', 'feesValue', 'repaidDebts']
      },
      {
        id: 2,
        title: language === 'fr' ? 'Fiscalité' : 'Tax assumptions',
        description:
          language === 'fr'
            ? 'Renseignez les hypothèses de régime fiscal et d’abattement.'
            : 'Enter tax regime and abatement assumptions.',
        fields: ['taxRegime', 'taxBracket', 'manualAbatementRate', 'feesMode', 'holdingMode']
      },
      {
        id: 3,
        title: language === 'fr' ? 'Contexte cédant' : 'Seller context',
        description:
          language === 'fr'
            ? 'Intégrez le contexte de durée de détention et de retraite.'
            : 'Include holding period and retirement context.',
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
  const canGoNext = currentStepConfig.fields.every((field) => String(formData[field] || '').trim() !== '');

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

  const recommendations = useMemo(() => {
    const list = [];
    if (result.effectiveTaxRate > 35) {
      list.push(
        language === 'fr'
          ? 'Priorité: examiner les leviers de structuration pour réduire le taux effectif global.'
          : 'Priority: review structuring levers to reduce effective global tax rate.'
      );
    }
    if (Number(formData.holdingDurationYears || 0) < 5) {
      list.push(
        language === 'fr'
          ? 'Priorité: analyser l’impact du calendrier de cession sur les abattements applicables.'
          : 'Priority: assess timing impact on applicable abatements.'
      );
    }
    if (list.length === 0) {
      list.push(
        language === 'fr'
          ? 'Profil équilibré: préparer plusieurs scénarios de négociation exprimés en net vendeur.'
          : 'Balanced profile: prepare multiple negotiation scenarios expressed in net proceeds.'
      );
    }
    return list;
  }, [formData.holdingDurationYears, language, result.effectiveTaxRate]);

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
              {language === 'fr' ? 'Outils · Net vendeur' : 'Tools · Net seller proceeds'}
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl leading-tight font-semibold max-w-4xl">
              {language === 'fr'
                ? 'Net vendeur après impôts : cadre d’analyse de la valeur réellement encaissée'
                : 'Net seller proceeds after tax: framework to assess real cash-in value'}
            </h1>
            <p className="mt-5 text-white/85 text-base sm:text-lg leading-8 max-w-3xl">
              {language === 'fr'
                ? 'Objectif: estimer le montant effectivement perçu après impôts, frais de transaction et passifs réglés, afin de piloter la stratégie de cession en valeur nette.'
                : 'Objective: estimate effectively received proceeds after taxes, transaction fees, and settled liabilities to steer a net-value sale strategy.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/85">
              <span className="inline-flex items-center border border-white/25 px-3 py-1 rounded-full">
                {language === 'fr' ? 'Scénarios fiscaux' : 'Tax scenarios'}
              </span>
              <span className="inline-flex items-center border border-white/25 px-3 py-1 rounded-full">
                {language === 'fr' ? 'Comparaison de régimes' : 'Regime comparison'}
              </span>
              <span className="inline-flex items-center border border-white/25 px-3 py-1 rounded-full">
                {language === 'fr' ? 'Pilotage du net encaissé' : 'Net proceeds steering'}
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
                <li><a href="#methode" className="underline underline-offset-2 hover:text-foreground">{language === 'fr' ? 'Méthodologie de calcul du net vendeur' : 'Net proceeds calculation methodology'}</a></li>
                <li><a href="#data" className="underline underline-offset-2 hover:text-foreground">{language === 'fr' ? 'Données à documenter' : 'Data to document'}</a></li>
                <li><a href="#lecture" className="underline underline-offset-2 hover:text-foreground">{language === 'fr' ? 'Lecture des résultats fiscaux' : 'Reading tax outcomes'}</a></li>
                <li><a href="#simulateur" className="underline underline-offset-2 hover:text-foreground">{language === 'fr' ? 'Simulation appliquée' : 'Applied simulation'}</a></li>
              </ol>
            </nav>

            <section id="methode" className="pt-10 scroll-mt-24">
              <h2 className="font-heading text-3xl leading-tight mb-4">
                {language === 'fr' ? 'Méthodologie de calcul du net vendeur' : 'Net proceeds calculation methodology'}
              </h2>
              <p className="text-muted-foreground text-[17px] leading-8 mb-4">
                {language === 'fr'
                  ? 'Le raisonnement part de la plus-value brute, applique les hypothèses fiscales pertinentes, puis intègre les coûts de transaction et les dettes réglées au closing.'
                  : 'The analysis starts from gross capital gain, applies relevant tax assumptions, then integrates transaction costs and liabilities settled at closing.'}
              </p>
              <p className="text-muted-foreground text-[17px] leading-8">
                {language === 'fr'
                  ? 'La finalité n’est pas un simple calcul d’impôt, mais une projection de trésorerie nette réellement disponible pour le cédant selon plusieurs scénarios.'
                  : 'The goal is not only tax computation but a projection of truly available net proceeds for the seller across scenarios.'}
              </p>
            </section>

            <section id="data" className="pt-10 scroll-mt-24">
              <h2 className="font-heading text-3xl leading-tight mb-4">
                {language === 'fr' ? 'Données à documenter' : 'Data to document'}
              </h2>
              <ul className="list-disc pl-5 text-muted-foreground text-[17px] leading-8 space-y-1">
                <li>{language === 'fr' ? 'Prix de cession, prix d’acquisition historique, apports et frais de transaction.' : 'Sale price, historical acquisition price, contributions, and transaction costs.'}</li>
                <li>{language === 'fr' ? 'Régime fiscal retenu, abattements potentiels et tranche d’imposition.' : 'Chosen tax regime, potential abatements, and tax bracket.'}</li>
                <li>{language === 'fr' ? 'Contexte personnel: durée de détention, situation retraite, mode de détention (direct/holding).' : 'Personal context: holding period, retirement status, ownership mode (direct/holding).'}</li>
              </ul>
            </section>

            <section id="lecture" className="pt-10 scroll-mt-24">
              <h2 className="font-heading text-3xl leading-tight mb-4">
                {language === 'fr' ? 'Lecture des résultats fiscaux' : 'Reading tax outcomes'}
              </h2>
              <p className="text-muted-foreground text-[17px] leading-8 mb-4">
                {language === 'fr'
                  ? 'Le taux effectif d’imposition permet d’arbitrer les options de structuration. Le net vendeur final constitue l’indicateur central pour piloter la négociation en valeur réellement encaissée.'
                  : 'The effective tax rate helps arbitrate structuring options. Final net proceeds remain the central indicator to drive negotiation on truly received value.'}
              </p>
              <p className="text-muted-foreground text-[17px] leading-8">
                {language === 'fr'
                  ? 'L’analyse comparative des scénarios permet de décider entre optimisation immédiate, ajustement de calendrier ou revue de structure.'
                  : 'Scenario comparison supports decisions between immediate optimization, timing adjustment, or structural review.'}
              </p>
            </section>

            <section id="simulateur" className="pt-10 scroll-mt-24">
              <h2 className="font-heading text-3xl leading-tight mb-3">
                {language === 'fr' ? 'Simulation appliquée à votre dossier' : 'Applied simulation for your case'}
              </h2>
              <p className="text-muted-foreground text-[17px] leading-8 mb-6">
                {language === 'fr'
                  ? 'Le module ci-dessous transforme vos hypothèses en projection nette après fiscalité et frais.'
                  : 'The module below converts your assumptions into a net projection after taxes and fees.'}
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
                      ['salePrice', language === 'fr' ? 'Prix de cession (€)' : 'Sale price (€)', language === 'fr' ? 'Prix brut de transaction.' : 'Gross transaction price.'],
                      ['purchasePrice', language === 'fr' ? 'Prix d’acquisition initial (€)' : 'Initial purchase price (€)', language === 'fr' ? 'Valeur historique d’acquisition.' : 'Historical acquisition value.'],
                      ['contributions', language === 'fr' ? 'Apports réalisés (€)' : 'Contributions made (€)', language === 'fr' ? 'Apports en capital complémentaires.' : 'Additional capital contributions.'],
                      ['feesValue', language === 'fr' ? 'Frais de cession' : 'Selling fees', language === 'fr' ? 'Honoraires et coûts de transaction.' : 'Advisory and transaction costs.'],
                      ['repaidDebts', language === 'fr' ? 'Dettes remboursées (€)' : 'Repaid debts (€)', language === 'fr' ? 'Passif réglé au closing.' : 'Liabilities settled at closing.']
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
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Mode frais' : 'Fees mode', language === 'fr' ? 'Saisie en pourcentage ou en montant.' : 'Input as percent or amount.')}</Label>
                      <Select value={formData.feesMode} onValueChange={(v) => handleChange('feesMode', v)}>
                        <SelectTrigger className="mt-2 border-border"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percent">%</SelectItem>
                          <SelectItem value="amount">€</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Régime fiscal' : 'Tax regime', language === 'fr' ? 'PFU ou barème progressif.' : 'Flat tax or progressive regime.')}</Label>
                      <Select value={formData.taxRegime} onValueChange={(v) => handleChange('taxRegime', v)}>
                        <SelectTrigger className="mt-2 border-border"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pfu">PFU</SelectItem>
                          <SelectItem value="bareme">Barème progressif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Tranche d’imposition (%)' : 'Tax bracket (%)', language === 'fr' ? 'Tranche marginale pour scénario barème.' : 'Marginal bracket for progressive scenario.')}</Label>
                      <Input className="mt-2 border-border font-mono" value={formData.taxBracket} onChange={(e) => handleChange('taxBracket', e.target.value)} />
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Abattement manuel (%)' : 'Manual abatement (%)', language === 'fr' ? 'Abattement complémentaire le cas échéant.' : 'Additional abatement if applicable.')}</Label>
                      <Input className="mt-2 border-border font-mono" value={formData.manualAbatementRate} onChange={(e) => handleChange('manualAbatementRate', e.target.value)} />
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Mode de détention' : 'Holding mode', language === 'fr' ? 'Détention directe ou via holding.' : 'Direct ownership or holding structure.')}</Label>
                      <Select value={formData.holdingMode} onValueChange={(v) => handleChange('holdingMode', v)}>
                        <SelectTrigger className="mt-2 border-border"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direct">{language === 'fr' ? 'Direct' : 'Direct'}</SelectItem>
                          <SelectItem value="holding">Holding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : null}

                {currentStep === 3 ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Durée de détention (ans)' : 'Holding duration (years)', language === 'fr' ? 'Durée de détention des titres cédés.' : 'Holding period of sold shares/assets.')}</Label>
                      <Input className="mt-2 border-border font-mono" value={formData.holdingDurationYears} onChange={(e) => handleChange('holdingDurationYears', e.target.value)} />
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Âge du cédant' : 'Seller age', language === 'fr' ? 'Paramètre utilisé pour les hypothèses retraite.' : 'Used for retirement assumptions.')}</Label>
                      <Input className="mt-2 border-border font-mono" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} />
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Départ retraite prévu' : 'Retirement planned', language === 'fr' ? 'Active les hypothèses retraite.' : 'Activates retirement assumptions.')}</Label>
                      <Select value={formData.retirementPlanned} onValueChange={(v) => handleChange('retirementPlanned', v)}>
                        <SelectTrigger className="mt-2 border-border"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{language === 'fr' ? 'Oui' : 'Yes'}</SelectItem>
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
                  tool="net_seller"
                  simulationInput={formData}
                  simulationResult={result}
                  preview={(
                    <div className="text-sm text-foreground space-y-1">
                      <p>{language === 'fr' ? 'Net vendeur estimé' : 'Estimated seller net'} : <span className="font-mono">***</span></p>
                      <p>{language === 'fr' ? 'Impôts totaux' : 'Total taxes'} : <span className="font-mono">***</span></p>
                      <p>{language === 'fr' ? 'Taux effectif' : 'Effective rate'} : <span className="font-mono">**%</span></p>
                    </div>
                  )}
                  full={(
                    <div className="text-sm text-foreground space-y-2">
                      <p>{language === 'fr' ? 'Net vendeur estimé' : 'Estimated seller net'} : <span className="font-mono">{formatCurrency(result.netSeller)}</span></p>
                      <p>{language === 'fr' ? 'Plus-value imposable' : 'Taxable capital gain'} : <span className="font-mono">{formatCurrency(result.taxableCapitalGain)}</span></p>
                      <p>{language === 'fr' ? 'Impôts totaux' : 'Total taxes'} : <span className="font-mono">{formatCurrency(result.totalTaxes)}</span></p>
                      <p>{language === 'fr' ? 'Frais' : 'Fees'} : <span className="font-mono">{formatCurrency(result.feesAmount)}</span></p>
                      <p>{language === 'fr' ? 'Taux effectif' : 'Effective rate'} : <span className="font-mono">{result.effectiveTaxRate.toFixed(1)}%</span></p>
                      <div className="pt-2 border-t border-border">
                        <p className="font-medium mb-1">{language === 'fr' ? 'Priorités d’analyse' : 'Analysis priorities'}</p>
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
                  ? 'Riviqo accompagne l’optimisation de structure et la préparation de négociation pour maximiser le net encaissé dans un cadre conforme.'
                  : 'Riviqo supports structure optimization and negotiation preparation to maximize net proceeds within a compliant framework.'}
              </p>
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  {language === 'fr' ? 'Échanger avec un expert' : 'Discuss with an expert'}
                </Button>
              </Link>
            </section>

            <p className="mt-8 text-xs text-muted-foreground">
              {language === 'fr'
                ? 'Simulation indicative, non constitutive d’un conseil fiscal, juridique ou patrimonial.'
                : 'Indicative simulation, not tax, legal or wealth-management advice.'}
            </p>
          </article>
        </main>
      </div>
    </TooltipProvider>
  );
}
