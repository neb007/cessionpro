// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { createPageUrl } from '@/utils';
import Logo from '@/components/Logo';
import { BarChart3, ChevronLeft, ChevronRight, Info, Sparkles } from 'lucide-react';
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
            ? 'Définissez votre modèle et votre trajectoire de croissance.'
            : 'Define your model and expected growth trajectory.',
        fields: ['businessModel', 'growthRate']
      },
      {
        id: 2,
        title: language === 'fr' ? 'Données financières' : 'Financials',
        description:
          language === 'fr'
            ? 'Saisissez les agrégats clés de performance et de bilan.'
            : 'Enter core P&L and balance-sheet aggregates.',
        fields: ['revenue', 'ebitda', 'netIncome', 'ownerSalary', 'equity', 'cash', 'debt']
      },
      {
        id: 3,
        title: language === 'fr' ? 'Qualité & risque' : 'Quality & risk',
        description:
          language === 'fr'
            ? 'Ajustez la valorisation selon les facteurs de risque opérationnels.'
            : 'Refine valuation with operational risk factors.',
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

  const currentStepCompletion = useMemo(() => {
    const fields = currentStepConfig.fields;
    const filled = fields.filter((field) => String(formData[field] || '').trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [currentStepConfig, formData]);

  const canGoNext = currentStepConfig.fields.every((field) => String(formData[field] || '').trim() !== '');

  const recommendations = useMemo(() => {
    const list = [];

    if (valuation.details.qualityMultiplier < 1) {
      list.push(
        language === 'fr'
          ? 'Réduisez la dépendance dirigeant pour limiter la décote de risque.'
          : 'Reduce owner dependency to lower risk discount.'
      );
    }
    if (Number(formData.debt || 0) > Number(formData.cash || 0)) {
      list.push(
        language === 'fr'
          ? 'Rééquilibrez dette/trésorerie pour améliorer la valeur des titres.'
          : 'Rebalance debt/cash to improve equity value.'
      );
    }
    if (Number(formData.growthRate || 0) < 5) {
      list.push(
        language === 'fr'
          ? 'Documentez un plan de croissance 3 ans pour soutenir la borne haute (DCF).'
          : 'Document a 3-year growth plan to support the high DCF range.'
      );
    }
    if (list.length === 0) {
      list.push(
        language === 'fr'
          ? 'Vos fondamentaux sont cohérents. Préparez un mémo investisseur pour accélérer les discussions.'
          : 'Your fundamentals are consistent. Prepare an investor memo to accelerate discussions.'
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
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F2EE] text-[#6B7A94] hover:bg-[#ECE6DF]"
            aria-label={language === 'fr' ? 'Aide' : 'Help'}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-[#3B4759] text-white">{hint}</TooltipContent>
      </Tooltip>
    </span>
  );

  return (
    <TooltipProvider delayDuration={120}>
      <div className="min-h-screen bg-[#FAF9F7] py-10">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className="bg-[#FFF0ED] text-[#FF6B4A] border border-[#FFD8CC] hover:bg-[#FFF0ED]">
                {language === 'fr' ? 'Article de blog' : 'Blog article'}
              </Badge>
              <Badge variant="outline" className="border-[#E7DDD5] text-[#6B7A94]">
                {language === 'fr' ? 'Outil intégré' : 'Integrated tool'}
              </Badge>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759] leading-tight mb-4">
              {language === 'fr'
                ? "Valorisation d'entreprise : guide complet pour estimer et défendre un prix de cession"
                : 'Business valuation: complete guide to estimate and defend a sale price'}
            </h1>

            <p className="text-[#6B7A94] leading-relaxed max-w-4xl">
              {language === 'fr'
                ? "Vous êtes dirigeant et vous préparez une cession ? Cette page est conçue comme un article de fond avec un simulateur intégré. Vous suivez la méthode, puis vous appliquez immédiatement les calculs à votre propre dossier."
                : 'Are you preparing a sale process as an owner-manager? This page is built as a long-form article with an integrated simulator. You follow the method, then immediately apply calculations to your own case.'}
            </p>
          </header>

          <div className="grid xl:grid-cols-12 gap-12 items-start">
            <article className="xl:col-span-7 text-[#3B4759] leading-relaxed">
              <nav className="text-sm text-[#6B7A94] border-l-2 border-[#FF6B4A]/30 pl-4 mb-8">
                <p className="font-medium text-[#3B4759] mb-2">{language === 'fr' ? 'Sommaire' : 'Contents'}</p>
                <div className="space-y-1">
                  <a href="#methode" className="block hover:text-[#FF6B4A]">
                    {language === 'fr' ? '1. Méthodes de valorisation' : '1. Valuation methods'}
                  </a>
                  <a href="#donnees" className="block hover:text-[#FF6B4A]">
                    {language === 'fr' ? '2. Données à préparer' : '2. Data to prepare'}
                  </a>
                  <a href="#lecture" className="block hover:text-[#FF6B4A]">
                    {language === 'fr' ? '3. Lire les résultats' : '3. Reading results'}
                  </a>
                  <a href="#cas" className="block hover:text-[#FF6B4A]">
                    {language === 'fr' ? '4. Cas pratique' : '4. Practical case'}
                  </a>
                  <a href="#faq" className="block hover:text-[#FF6B4A]">
                    {language === 'fr' ? '5. FAQ stratégique' : '5. Strategic FAQ'}
                  </a>
                </div>
              </nav>

              <section id="methode" className="scroll-mt-24 mb-10">
                <h2 className="font-display text-2xl font-semibold mb-3">
                  {language === 'fr' ? 'Les 3 méthodes qui structurent une valorisation crédible' : 'The 3 methods behind a credible valuation'}
                </h2>
                <p className="text-[#6B7A94] mb-3">
                  {language === 'fr'
                    ? "Une valorisation professionnelle ne repose jamais sur un seul chiffre. Elle croise trois angles : le patrimoine existant, la réalité du marché transactionnel, et la capacité future à générer du cash."
                    : 'A professional valuation never relies on a single number. It combines three angles: current asset base, transaction market reality, and future cash generation capacity.'}
                </p>
                <h3 className="font-semibold text-lg mb-1">{language === 'fr' ? 'Approche patrimoniale' : 'Asset-based approach'}</h3>
                <p className="text-[#6B7A94] mb-3">
                  {language === 'fr'
                    ? 'Elle pose le socle de sécurité et sert de référence défensive dans les discussions.'
                    : 'It sets a defensive floor and provides a security baseline in negotiations.'}
                </p>
                <h3 className="font-semibold text-lg mb-1">{language === 'fr' ? 'Approche marché (multiples)' : 'Market approach (multiples)'}</h3>
                <p className="text-[#6B7A94] mb-3">
                  {language === 'fr'
                    ? 'Elle replace votre entreprise dans les niveaux de prix réellement observés sur des actifs comparables.'
                    : 'It positions your company within real pricing observed on comparable assets.'}
                </p>
                <h3 className="font-semibold text-lg mb-1">{language === 'fr' ? 'Approche rentabilité (DCF simplifié)' : 'Profitability approach (simplified DCF)'}</h3>
                <p className="text-[#6B7A94]">
                  {language === 'fr'
                    ? 'Elle valorise le potentiel futur et soutient la borne haute si la trajectoire est démontrable.'
                    : 'It values future potential and supports the upper range when trajectory is demonstrable.'}
                </p>
              </section>

              <section id="donnees" className="scroll-mt-24 mb-10">
                <h2 className="font-display text-2xl font-semibold mb-3">
                  {language === 'fr' ? 'Les données qui influencent réellement votre prix' : 'The data that truly impacts your price'}
                </h2>
                <p className="text-[#6B7A94] mb-3">
                  {language === 'fr'
                    ? "La qualité des entrées est le principal facteur de crédibilité de la sortie. Les écarts de valorisation proviennent souvent d'un EBE non retraité, d'une croissance non justifiée, ou d'un risque opérationnel sous-estimé."
                    : 'Input quality is the main driver of output credibility. Valuation gaps often come from non-normalized EBITDA, unsupported growth assumptions, or underestimated operational risk.'}
                </p>
                <ul className="list-disc pl-5 text-[#6B7A94] space-y-1">
                  <li>{language === 'fr' ? 'CA, EBITDA, résultat net, capitaux propres, trésorerie, dette.' : 'Revenue, EBITDA, net income, equity, cash, debt.'}</li>
                  <li>{language === 'fr' ? 'Rémunération dirigeant retraitée sur une base normative.' : 'Owner compensation normalized on a market basis.'}</li>
                  <li>{language === 'fr' ? 'Scoring qualitatif : dépendance, concentration client, récurrence.' : 'Qualitative scoring: dependency, client concentration, recurrence.'}</li>
                </ul>
              </section>

              <section id="lecture" className="scroll-mt-24 mb-10">
                <h2 className="font-display text-2xl font-semibold mb-3">
                  {language === 'fr' ? 'Comment interpréter la fourchette de résultat' : 'How to interpret the output range'}
                </h2>
                <p className="text-[#6B7A94]">
                  {language === 'fr'
                    ? "La borne basse vous protège, la médiane reflète la zone de marché, et la borne haute matérialise un potentiel à défendre avec des preuves concrètes. Le bon usage consiste à justifier la logique, pas seulement afficher un montant."
                    : 'The low range protects your position, the median reflects market territory, and the high range captures upside that must be supported by proof. Good usage means defending logic, not just showing a number.'}
                </p>
              </section>

              <section id="cas" className="scroll-mt-24 mb-10">
                <h2 className="font-display text-2xl font-semibold mb-3">
                  {language === 'fr' ? 'Cas pratique : préparation de cession en 9 mois' : 'Practical case: 9-month sale preparation'}
                </h2>
                <p className="text-[#6B7A94]">
                  {language === 'fr'
                    ? "Un dirigeant de PME B2B simule son dossier et constate un écart fort entre médiane et borne haute. Plan d'action : réduire la dépendance commerciale au fondateur, formaliser un plan de croissance 3 ans, et optimiser le couple dette/trésorerie. Résultat attendu : une valorisation mieux défendable en négociation."
                    : 'A B2B SME owner runs the simulation and sees a wide gap between median and high range. Action plan: reduce founder commercial dependency, formalize a 3-year growth plan, and optimize debt/cash balance. Expected result: a more defensible valuation in negotiation.'}
                </p>
              </section>

              <section id="faq" className="scroll-mt-24 mb-10">
                <h2 className="font-display text-2xl font-semibold mb-4">
                  {language === 'fr' ? 'FAQ stratégique' : 'Strategic FAQ'}
                </h2>
                <div className="space-y-2">
                  {[
                    {
                      qFr: 'Pourquoi une fourchette plutôt qu’un chiffre unique ?',
                      aFr: 'Parce qu’une transaction se négocie. Une fourchette encadre les scénarios et protège votre stratégie de discussion.',
                      qEn: 'Why a range instead of a single number?',
                      aEn: 'Because a transaction is negotiated. A range frames scenarios and protects your discussion strategy.'
                    },
                    {
                      qFr: 'Le simulateur remplace-t-il une expertise ?',
                      aFr: 'Non. Il structure une base solide. Pour une opération engageante, une revue expert reste nécessaire.',
                      qEn: 'Does the simulator replace expert advice?',
                      aEn: 'No. It structures a solid baseline. For material deals, expert review remains necessary.'
                    },
                    {
                      qFr: 'Que faire si la borne haute est très éloignée ?',
                      aFr: 'Renforcez les preuves de votre trajectoire (pipeline, récurrence, organisation) avant d’ancrer ce niveau en négociation.',
                      qEn: 'What if the high range is far above the median?',
                      aEn: 'Strengthen evidence of your trajectory (pipeline, recurrence, organization) before anchoring that level in negotiations.'
                    }
                  ].map((faq) => (
                    <details key={faq.qFr} className="group py-2 border-b border-[#EFE5DF]">
                      <summary className="cursor-pointer list-none font-medium text-[#3B4759]">
                        {language === 'fr' ? faq.qFr : faq.qEn}
                      </summary>
                      <p className="mt-2 text-sm text-[#6B7A94] leading-relaxed">
                        {language === 'fr' ? faq.aFr : faq.aEn}
                      </p>
                    </details>
                  ))}
                </div>
              </section>

              <section className="pt-2 mb-6">
                <h2 className="font-display text-xl font-semibold text-[#3B4759] mb-2">
                  {language === 'fr' ? 'Un accompagnement humain, de A à Z' : 'Human support, end-to-end'}
                </h2>
                <p className="text-[#6B7A94] mb-4">
                  {language === 'fr'
                    ? 'De la première analyse à la signature, Riviqo vous accompagne avec un expert dédié pour votre acquisition ou votre cession.'
                    : 'From first analysis to signature, Riviqo supports your acquisition or sale with a dedicated expert.'}
                </p>
                <Link to={createPageUrl('Contact')}>
                  <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white">
                    {language === 'fr' ? 'Contacter un expert' : 'Contact an expert'}
                  </Button>
                </Link>
              </section>

              <p className="text-xs text-[#6B7A94]">
                {language === 'fr'
                  ? 'Simulation indicative, non constitutive d’un conseil fiscal, juridique ou financier. Les hypothèses doivent être validées avec vos conseils. Données traitées de manière confidentielle et conforme RGPD.'
                  : 'Indicative simulation, not financial, tax or legal advice. Assumptions must be validated with your advisors. Data is processed confidentially in line with GDPR.'}
              </p>
            </article>

            <aside className="xl:col-span-5 xl:sticky xl:top-24 self-start">
              <div className="rounded-2xl border border-[#EADFD8] bg-white p-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-[#FF6B4A] text-sm font-medium mb-2">
                    <Sparkles className="w-4 h-4" />
                    {language === 'fr' ? 'Simulateur intégré' : 'Integrated simulator'}
                  </div>
                  <p className="text-sm text-[#6B7A94]">
                    {language === 'fr'
                      ? 'Utilisez l’outil pendant votre lecture pour produire votre fourchette en temps réel.'
                      : 'Use the tool while reading to generate your range in real time.'}
                  </p>
                </div>

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
                    <div>
                      <Label>
                        {withTooltip(
                          language === 'fr' ? 'Modèle économique' : 'Business model',
                          language === 'fr'
                            ? 'Sélectionnez le modèle principal pour appliquer les bons multiples sectoriels.'
                            : 'Select the main model to apply relevant market multiples.'
                        )}
                      </Label>
                      <Select value={formData.businessModel} onValueChange={(v) => handleChange('businessModel', v)}>
                        <SelectTrigger className="mt-2 border-[#EADFD8]">
                          <SelectValue placeholder={language === 'fr' ? 'Sélectionner' : 'Select'} />
                        </SelectTrigger>
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
                      <Label>
                        {withTooltip(
                          language === 'fr' ? 'Croissance estimée (%)' : 'Estimated growth (%)',
                          language === 'fr'
                            ? 'Taux de croissance projeté à 3-5 ans utilisé pour le DCF.'
                            : '3-5 year projected growth rate used in DCF.'
                        )}
                      </Label>
                      <Input
                        className="mt-2 border-[#EADFD8]"
                        value={formData.growthRate}
                        onChange={(e) => handleChange('growthRate', e.target.value)}
                        placeholder=""
                      />
                    </div>
                  </div>
                ) : null}

                {currentStep === 2 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      ['revenue', language === 'fr' ? 'CA (€)' : 'Revenue (€)', language === 'fr' ? 'Chiffre d’affaires annuel HT.' : 'Annual revenue excluding tax.'],
                      ['ebitda', 'EBITDA (€)', language === 'fr' ? 'Rentabilité opérationnelle avant amortissements.' : 'Operating profitability before depreciation.'],
                      ['netIncome', language === 'fr' ? 'Résultat net (€)' : 'Net income (€)', language === 'fr' ? 'Résultat net courant utilisé pour le rendement.' : 'Current net income used for yield approach.'],
                      ['ownerSalary', language === 'fr' ? 'Rémunération dirigeant (€)' : 'Owner salary (€)', language === 'fr' ? 'Rémunération annuelle actuelle du dirigeant.' : 'Current annual owner compensation.'],
                      ['equity', language === 'fr' ? 'Capitaux propres (€)' : 'Equity (€)', language === 'fr' ? 'Fonds propres comptables (socle patrimonial).' : 'Book equity (asset floor).'],
                      ['cash', language === 'fr' ? 'Trésorerie (€)' : 'Cash (€)', language === 'fr' ? 'Trésorerie disponible au moment de la cession.' : 'Available cash at transaction time.'],
                      ['debt', language === 'fr' ? 'Dettes (€)' : 'Debt (€)', language === 'fr' ? 'Dettes financières reprises ou à déduire.' : 'Financial debt to deduct from equity value.']
                    ].map(([field, label, hint]) => (
                      <div key={field}>
                        <Label>{withTooltip(label, hint)}</Label>
                        <Input
                          className="mt-2 font-mono border-[#EADFD8]"
                          value={formData[field]}
                          onChange={(e) => handleChange(field, e.target.value)}
                          placeholder=""
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {currentStep === 3 ? (
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label>
                        {withTooltip(
                          language === 'fr' ? 'Dépendance dirigeant' : 'Owner dependency',
                          language === 'fr'
                            ? 'Mesure la dépendance de la performance à la personne du dirigeant.'
                            : 'Measures dependence of performance on the owner.'
                        )}
                      </Label>
                      <Select value={formData.dependencyRisk} onValueChange={(v) => handleChange('dependencyRisk', v)}>
                        <SelectTrigger className="mt-2 border-[#EADFD8]"><SelectValue placeholder={language === 'fr' ? 'Choisir' : 'Select'} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">{language === 'fr' ? 'Élevée' : 'High'}</SelectItem>
                          <SelectItem value="medium">{language === 'fr' ? 'Modérée' : 'Medium'}</SelectItem>
                          <SelectItem value="low">{language === 'fr' ? 'Faible' : 'Low'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>
                        {withTooltip(
                          language === 'fr' ? 'Concentration client' : 'Client concentration',
                          language === 'fr' ? 'Risque lié au poids des plus gros clients.' : 'Risk linked to top-client concentration.'
                        )}
                      </Label>
                      <Select value={formData.clientConcentration} onValueChange={(v) => handleChange('clientConcentration', v)}>
                        <SelectTrigger className="mt-2 border-[#EADFD8]"><SelectValue placeholder={language === 'fr' ? 'Choisir' : 'Select'} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">{language === 'fr' ? 'Forte' : 'High'}</SelectItem>
                          <SelectItem value="medium">{language === 'fr' ? 'Moyenne' : 'Medium'}</SelectItem>
                          <SelectItem value="low">{language === 'fr' ? 'Faible' : 'Low'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>
                        {withTooltip(
                          language === 'fr' ? 'Récurrence CA' : 'Revenue recurrence',
                          language === 'fr'
                            ? 'Part de revenus récurrents (abonnements, contrats, etc.).'
                            : 'Share of recurring revenue (subscriptions, contracts, etc.).'
                        )}
                      </Label>
                      <Select value={formData.revenueRecurrence} onValueChange={(v) => handleChange('revenueRecurrence', v)}>
                        <SelectTrigger className="mt-2 border-[#EADFD8]"><SelectValue placeholder={language === 'fr' ? 'Choisir' : 'Select'} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">{language === 'fr' ? 'Forte' : 'High'}</SelectItem>
                          <SelectItem value="medium">{language === 'fr' ? 'Moyenne' : 'Medium'}</SelectItem>
                          <SelectItem value="low">{language === 'fr' ? 'Faible' : 'Low'}</SelectItem>
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

                <div className="pt-4 border-t border-[#EFE5DF]">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-[#FF6B4A]" />
                    <p className="font-display font-semibold text-[#3B4759]">
                      {language === 'fr' ? 'Résultat de valorisation' : 'Valuation result'}
                    </p>
                  </div>

                  <ToolLeadGate
                    language={language}
                    tool="valuation"
                    simulationInput={formData}
                    simulationResult={valuation}
                    preview={(
                      <div className="grid gap-3">
                        <div className="rounded-xl p-4 bg-[#FFF6F3] border border-[#FFD8CC]">
                          <p className="text-xs text-[#6B7A94] uppercase">{language === 'fr' ? 'Borne basse' : 'Low range'}</p>
                          <p className="font-mono text-2xl font-bold text-[#3B4759]">***</p>
                        </div>
                        <div className="rounded-xl p-4 bg-white border-2 border-[#FF6B4A]">
                          <p className="text-xs text-[#6B7A94] uppercase">{language === 'fr' ? 'Valeur médiane' : 'Median value'}</p>
                          <p className="font-mono text-2xl font-bold text-[#FF6B4A]">***</p>
                        </div>
                        <div className="rounded-xl p-4 bg-[#F5FAFF] border border-[#D8E9FF]">
                          <p className="text-xs text-[#6B7A94] uppercase">{language === 'fr' ? 'Borne haute' : 'High range'}</p>
                          <p className="font-mono text-2xl font-bold text-[#3B4759]">***</p>
                        </div>
                      </div>
                    )}
                    full={(
                      <Tabs defaultValue="summary" className="w-full">
                        <TabsList className="grid grid-cols-3 w-full bg-[#F5F2EE]">
                          <TabsTrigger value="summary">{language === 'fr' ? 'Synthèse' : 'Summary'}</TabsTrigger>
                          <TabsTrigger value="details">{language === 'fr' ? 'Détails' : 'Details'}</TabsTrigger>
                          <TabsTrigger value="actions">{language === 'fr' ? 'Actions' : 'Actions'}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="summary" className="space-y-3 mt-4">
                          <div className="rounded-xl p-4 bg-[#FFF6F3] border border-[#FFD8CC] transition-all hover:shadow-sm">
                            <p className="text-xs text-[#6B7A94] uppercase">{language === 'fr' ? 'Borne basse' : 'Low range'}</p>
                            <p className="font-mono text-2xl font-bold text-[#3B4759]">{formatCurrency(valuation.low)}</p>
                          </div>
                          <div className="rounded-xl p-4 bg-white border-2 border-[#FF6B4A] transition-all hover:-translate-y-0.5 hover:shadow-md">
                            <p className="text-xs text-[#6B7A94] uppercase">{language === 'fr' ? 'Valeur médiane' : 'Median value'}</p>
                            <p className="font-mono text-2xl font-bold text-[#FF6B4A]">{formatCurrency(valuation.mid)}</p>
                          </div>
                          <div className="rounded-xl p-4 bg-[#F5FAFF] border border-[#D8E9FF] transition-all hover:shadow-sm">
                            <p className="text-xs text-[#6B7A94] uppercase">{language === 'fr' ? 'Borne haute' : 'High range'}</p>
                            <p className="font-mono text-2xl font-bold text-[#3B4759]">{formatCurrency(valuation.high)}</p>
                          </div>
                        </TabsContent>

                        <TabsContent value="details" className="mt-4">
                          <div className="rounded-xl bg-[#FAF9F7] p-4 border border-[#EFEAE6] text-sm text-[#3B4759] space-y-2">
                            <p>MUX qualité: <span className="font-mono">{valuation.details.qualityMultiplier.toFixed(2)}</span></p>
                            <p>EBE retraité: <span className="font-mono">{formatCurrency(valuation.details.ebitdaAdjusted)}</span></p>
                            <p>Taux capitalisation ajusté: <span className="font-mono">{(valuation.details.capRateAdjusted * 100).toFixed(1)}%</span></p>
                            <div className="pt-2">
                              <div className="flex items-center justify-between text-xs text-[#6B7A94] mb-1">
                                <span>{language === 'fr' ? 'Score qualité' : 'Quality score'}</span>
                                <span>{Math.min(100, Math.round(valuation.details.qualityMultiplier * 65))}%</span>
                              </div>
                              <Progress
                                value={Math.min(100, Math.round(valuation.details.qualityMultiplier * 65))}
                                className="h-2 bg-[#EFE5DF] [&>div]:bg-[#FF6B4A]"
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="actions" className="mt-4">
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
                        </TabsContent>
                      </Tabs>
                    )}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
