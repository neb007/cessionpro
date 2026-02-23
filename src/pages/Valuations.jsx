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
import { computeValuation } from '@/utils/simulatorsEngine';
import ToolLeadGate from '@/components/ToolLeadGate';
import { toolAnalyticsService } from '@/services/toolAnalyticsService';

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

export default function Valuations() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const hasStartedRef = useRef(false);

  const valuation = useMemo(() => computeValuation(formData), [formData]);

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
        title: language === 'fr' ? 'Profil activité' : 'Business profile',
        description:
          language === 'fr'
            ? 'Définissez votre modèle économique et votre hypothèse de croissance.'
            : 'Define your business model and growth assumption.',
        fields: ['businessModel', 'growthRate']
      },
      {
        id: 2,
        title: language === 'fr' ? 'Données financières' : 'Financial inputs',
        description:
          language === 'fr'
            ? 'Renseignez les agrégats financiers utilisés dans les méthodes de valorisation.'
            : 'Provide the financial aggregates used by valuation methods.',
        fields: ['revenue', 'ebitda', 'netIncome', 'ownerSalary', 'equity', 'cash', 'debt']
      },
      {
        id: 3,
        title: language === 'fr' ? 'Qualité & risque' : 'Quality & risk',
        description:
          language === 'fr'
            ? 'Ajustez les décotes/surcotes liées au profil opérationnel de l’entreprise.'
            : 'Adjust discounts/premiums linked to the operating profile.',
        fields: ['dependencyRisk', 'clientConcentration', 'revenueRecurrence']
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
      list.push(
        language === 'fr'
          ? 'Priorité: réduire la dépendance au dirigeant pour limiter la décote de risque.'
          : 'Priority: reduce owner dependency to limit risk discount.'
      );
    }
    if (Number(formData.debt || 0) > Number(formData.cash || 0)) {
      list.push(
        language === 'fr'
          ? 'Priorité: améliorer la position de trésorerie nette avant phase de négociation.'
          : 'Priority: improve net cash position before negotiation phase.'
      );
    }
    if (Number(formData.growthRate || 0) < 5) {
      list.push(
        language === 'fr'
          ? 'Priorité: formaliser un plan de croissance crédible sur 36 mois.'
          : 'Priority: formalize a credible 36-month growth plan.'
      );
    }
    if (list.length === 0) {
      list.push(
        language === 'fr'
          ? 'Fondamentaux cohérents: préparer un mémorandum d’équity story pour accélérer le process.'
          : 'Consistent fundamentals: prepare an equity-story memo to accelerate the process.'
      );
    }

    return list;
  }, [formData, language, valuation.details.qualityMultiplier]);

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
              {language === 'fr' ? 'Outils · Valorisation' : 'Tools · Valuation'}
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl leading-tight font-semibold max-w-4xl">
              {language === 'fr'
                ? 'Valorisation d’entreprise : cadre d’analyse pour une négociation structurée'
                : 'Business valuation: an analysis framework for structured negotiations'}
            </h1>
            <p className="mt-5 text-white/85 text-base sm:text-lg leading-8 max-w-3xl">
              {language === 'fr'
                ? 'Objectif: produire une fourchette défendable devant un acquéreur, un investisseur ou un conseil, en combinant approche patrimoniale, approche de marché et approche de rentabilité.'
                : 'Objective: produce a defensible range for buyers, investors, and advisors by combining asset, market, and profitability approaches.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/85">
              <span className="inline-flex items-center border border-white/25 px-3 py-1 rounded-full">
                {language === 'fr' ? 'Méthodologie multi-critères' : 'Multi-criteria methodology'}
              </span>
              <span className="inline-flex items-center border border-white/25 px-3 py-1 rounded-full">
                {language === 'fr' ? 'Simulation guidée' : 'Guided simulation'}
              </span>
              <span className="inline-flex items-center border border-white/25 px-3 py-1 rounded-full">
                {language === 'fr' ? 'Usage M&A PME/TPE' : 'SME/M&A use case'}
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
                <li><a href="#methode" className="underline underline-offset-2 hover:text-foreground">{language === 'fr' ? 'Méthodologie de valorisation' : 'Valuation methodology'}</a></li>
                <li><a href="#data" className="underline underline-offset-2 hover:text-foreground">{language === 'fr' ? 'Données à documenter' : 'Data to document'}</a></li>
                <li><a href="#lecture" className="underline underline-offset-2 hover:text-foreground">{language === 'fr' ? 'Lecture de la fourchette' : 'How to read the range'}</a></li>
                <li><a href="#simulateur" className="underline underline-offset-2 hover:text-foreground">{language === 'fr' ? 'Simulation appliquée' : 'Applied simulation'}</a></li>
              </ol>
            </nav>

            <section id="methode" className="pt-10 scroll-mt-24">
              <h2 className="font-heading text-3xl leading-tight mb-4">
                {language === 'fr' ? 'Méthodologie de valorisation' : 'Valuation methodology'}
              </h2>
              <p className="text-muted-foreground text-[17px] leading-8 mb-4">
                {language === 'fr'
                  ? 'La démarche retient trois axes complémentaires. Le premier est patrimonial: il fixe un socle défensif. Le second est transactionnel: il ancre la valeur dans les multiples observés. Le troisième est économique: il projette la capacité de génération de cash-flow.'
                  : 'The approach combines three complementary angles. First, asset-based for a defensive floor. Second, transactional for observed market multiples. Third, economic for forward cash-flow generation capacity.'}
              </p>
              <p className="text-muted-foreground text-[17px] leading-8">
                {language === 'fr'
                  ? 'En pratique, la valeur pertinente n’est pas un chiffre isolé mais une zone de négociation argumentée, dont la robustesse dépend de la qualité des hypothèses et des justificatifs fournis.'
                  : 'In practice, relevant value is not a single figure but a defended negotiation zone whose robustness depends on assumptions and supporting evidence.'}
              </p>
            </section>

            <section id="data" className="pt-10 scroll-mt-24">
              <h2 className="font-heading text-3xl leading-tight mb-4">
                {language === 'fr' ? 'Données à documenter' : 'Data to document'}
              </h2>
              <ul className="list-disc pl-5 text-muted-foreground text-[17px] leading-8 space-y-1">
                <li>{language === 'fr' ? 'Agrégats financiers: CA, EBITDA, résultat net, capitaux propres, trésorerie et dette nette.' : 'Financial aggregates: revenue, EBITDA, net income, equity, cash and net debt.'}</li>
                <li>{language === 'fr' ? 'Retraitements: normalisation de la rémunération dirigeant et éléments non récurrents.' : 'Adjustments: owner compensation normalization and non-recurring items.'}</li>
                <li>{language === 'fr' ? 'Qualité opérationnelle: dépendance dirigeant, concentration client, récurrence des revenus.' : 'Operational quality: owner dependency, client concentration, revenue recurrence.'}</li>
              </ul>
            </section>

            <section id="lecture" className="pt-10 scroll-mt-24">
              <h2 className="font-heading text-3xl leading-tight mb-4">
                {language === 'fr' ? 'Lecture de la fourchette de valeur' : 'Reading the valuation range'}
              </h2>
              <p className="text-muted-foreground text-[17px] leading-8 mb-4">
                {language === 'fr'
                  ? 'La borne basse représente une position prudente défendable. La valeur médiane constitue le point d’équilibre probable en négociation. La borne haute suppose une exécution maîtrisée du plan de création de valeur.'
                  : 'The low bound is a conservative defendable position. The median is the most likely negotiation balance point. The high bound assumes disciplined execution of the value-creation plan.'}
              </p>
              <p className="text-muted-foreground text-[17px] leading-8">
                {language === 'fr'
                  ? 'Cette lecture permet d’anticiper la stratégie de discussion: niveau d’ambition de prix, concessions possibles et priorités de préparation du dossier.'
                  : 'This reading helps anticipate discussion strategy: pricing ambition, possible concessions, and preparation priorities.'}
              </p>
            </section>

            <section id="simulateur" className="pt-10 scroll-mt-24">
              <h2 className="font-heading text-3xl leading-tight mb-3">
                {language === 'fr' ? 'Simulation appliquée à votre dossier' : 'Applied simulation for your case'}
              </h2>
              <p className="text-muted-foreground text-[17px] leading-8 mb-6">
                {language === 'fr'
                  ? 'Le module ci-dessous met en œuvre la méthodologie sur vos données et produit une sortie d’analyse opérationnelle.'
                  : 'The module below applies the methodology to your data and produces an operational analysis output.'}
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
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Modèle économique' : 'Business model', language === 'fr' ? 'Base sectorielle utilisée pour les multiples.' : 'Sector basis used for multiples.')}</Label>
                      <Select value={formData.businessModel} onValueChange={(v) => handleChange('businessModel', v)}>
                        <SelectTrigger className="mt-2 border-border"><SelectValue placeholder={language === 'fr' ? 'Sélectionner' : 'Select'} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="agence">Agence / ESN</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Croissance estimée (%)' : 'Estimated growth (%)', language === 'fr' ? 'Hypothèse utilisée pour la projection DCF.' : 'Assumption used for DCF projection.')}</Label>
                      <Input className="mt-2 border-border" value={formData.growthRate} onChange={(e) => handleChange('growthRate', e.target.value)} />
                    </div>
                  </div>
                ) : null}

                {currentStep === 2 ? (
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {[
                      ['revenue', language === 'fr' ? 'CA (€)' : 'Revenue (€)', language === 'fr' ? 'Chiffre d’affaires annuel HT.' : 'Annual revenue excluding tax.'],
                      ['ebitda', 'EBITDA (€)', language === 'fr' ? 'Performance opérationnelle.' : 'Operating performance.'],
                      ['netIncome', language === 'fr' ? 'Résultat net (€)' : 'Net income (€)', language === 'fr' ? 'Résultat net courant.' : 'Current net income.'],
                      ['ownerSalary', language === 'fr' ? 'Rémunération dirigeant (€)' : 'Owner salary (€)', language === 'fr' ? 'Rémunération annuelle dirigeant.' : 'Annual owner compensation.'],
                      ['equity', language === 'fr' ? 'Capitaux propres (€)' : 'Equity (€)', language === 'fr' ? 'Valeur comptable des fonds propres.' : 'Book value of equity.'],
                      ['cash', language === 'fr' ? 'Trésorerie (€)' : 'Cash (€)', language === 'fr' ? 'Disponibilités de trésorerie.' : 'Cash available.'],
                      ['debt', language === 'fr' ? 'Dettes (€)' : 'Debt (€)', language === 'fr' ? 'Dette financière nette à intégrer.' : 'Net financial debt to include.']
                    ].map(([field, label, hint]) => (
                      <div key={field}>
                        <Label>{withTooltip(label, hint)}</Label>
                        <Input className="mt-2 border-border font-mono" value={formData[field]} onChange={(e) => handleChange(field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                ) : null}

                {currentStep === 3 ? (
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Dépendance dirigeant' : 'Owner dependency', language === 'fr' ? 'Impact sur la décote de risque.' : 'Impact on risk discount.')}</Label>
                      <Select value={formData.dependencyRisk} onValueChange={(v) => handleChange('dependencyRisk', v)}>
                        <SelectTrigger className="mt-2 border-border"><SelectValue placeholder={language === 'fr' ? 'Choisir' : 'Select'} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">{language === 'fr' ? 'Élevée' : 'High'}</SelectItem>
                          <SelectItem value="medium">{language === 'fr' ? 'Modérée' : 'Medium'}</SelectItem>
                          <SelectItem value="low">{language === 'fr' ? 'Faible' : 'Low'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Concentration client' : 'Client concentration', language === 'fr' ? 'Poids des premiers clients.' : 'Weight of top clients.')}</Label>
                      <Select value={formData.clientConcentration} onValueChange={(v) => handleChange('clientConcentration', v)}>
                        <SelectTrigger className="mt-2 border-border"><SelectValue placeholder={language === 'fr' ? 'Choisir' : 'Select'} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">{language === 'fr' ? 'Forte' : 'High'}</SelectItem>
                          <SelectItem value="medium">{language === 'fr' ? 'Moyenne' : 'Medium'}</SelectItem>
                          <SelectItem value="low">{language === 'fr' ? 'Faible' : 'Low'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Récurrence CA' : 'Revenue recurrence', language === 'fr' ? 'Niveau de revenus contractuels/récurrents.' : 'Level of recurring/contracted revenue.')}</Label>
                      <Select value={formData.revenueRecurrence} onValueChange={(v) => handleChange('revenueRecurrence', v)}>
                        <SelectTrigger className="mt-2 border-border"><SelectValue placeholder={language === 'fr' ? 'Choisir' : 'Select'} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">{language === 'fr' ? 'Forte' : 'High'}</SelectItem>
                          <SelectItem value="medium">{language === 'fr' ? 'Moyenne' : 'Medium'}</SelectItem>
                          <SelectItem value="low">{language === 'fr' ? 'Faible' : 'Low'}</SelectItem>
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
                  tool="valuation"
                  simulationInput={formData}
                  simulationResult={valuation}
                  preview={(
                    <div className="text-sm text-foreground space-y-1">
                      <p>{language === 'fr' ? 'Borne basse' : 'Low range'} : <span className="font-mono">***</span></p>
                      <p>{language === 'fr' ? 'Valeur médiane' : 'Median value'} : <span className="font-mono">***</span></p>
                      <p>{language === 'fr' ? 'Borne haute' : 'High range'} : <span className="font-mono">***</span></p>
                    </div>
                  )}
                  full={(
                    <div className="text-sm text-foreground space-y-3">
                      <p>{language === 'fr' ? 'Borne basse' : 'Low range'} : <span className="font-mono">{formatCurrency(valuation.low)}</span></p>
                      <p>{language === 'fr' ? 'Valeur médiane' : 'Median value'} : <span className="font-mono">{formatCurrency(valuation.mid)}</span></p>
                      <p>{language === 'fr' ? 'Borne haute' : 'High range'} : <span className="font-mono">{formatCurrency(valuation.high)}</span></p>
                      <p>MUX qualité : <span className="font-mono">{valuation.details.qualityMultiplier.toFixed(2)}</span></p>
                      <p>EBE retraité : <span className="font-mono">{formatCurrency(valuation.details.ebitdaAdjusted)}</span></p>
                      <p>{language === 'fr' ? 'Taux de capitalisation ajusté' : 'Adjusted cap rate'} : <span className="font-mono">{(valuation.details.capRateAdjusted * 100).toFixed(1)}%</span></p>
                      <div className="pt-2 border-t border-border">
                        <p className="font-medium mb-1">{language === 'fr' ? 'Priorités de préparation' : 'Preparation priorities'}</p>
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
                  ? 'Riviqo accompagne la préparation de dossier, le cadrage de fourchette et la stratégie de négociation sur l’ensemble du process de cession/reprise.'
                  : 'Riviqo supports dossier preparation, valuation-range framing, and negotiation strategy throughout the sale/acquisition process.'}
              </p>
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  {language === 'fr' ? 'Échanger avec un expert' : 'Discuss with an expert'}
                </Button>
              </Link>
            </section>

            <p className="mt-8 text-xs text-muted-foreground">
              {language === 'fr'
                ? 'Simulation indicative, non constitutive d’un conseil fiscal, juridique ou financier.'
                : 'Indicative simulation, not financial, tax or legal advice.'}
            </p>
          </article>
        </main>
      </div>
    </TooltipProvider>
  );
}
