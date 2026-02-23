// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { createPageUrl } from '@/utils';
import Logo from '@/components/Logo';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Info, PiggyBank, Sparkles } from 'lucide-react';
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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(Number(value || 0));

  const statusStyle =
    simulation.status === 'Finançable'
      ? 'bg-green-100 text-green-700'
      : simulation.status === 'Sous conditions'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-red-100 text-red-700';

  const alertLabels = {
    apport_insuffisant: language === 'fr' ? 'Apport insuffisant' : 'Insufficient contribution',
    rentabilite_trop_faible: language === 'fr' ? 'Rentabilité trop faible' : 'Profitability too low',
    risque_bancaire: language === 'fr' ? 'Risque bancaire' : 'Banking risk',
    dette_excessive: language === 'fr' ? 'Dette excessive' : 'Excessive debt',
    salaire_non_viable: language === 'fr' ? 'Salaire non viable' : 'Salary not viable'
  };

  const steps = useMemo(
    () => [
      {
        id: 1,
        title: language === 'fr' ? 'Cible & performance' : 'Target & performance',
        description:
          language === 'fr'
            ? 'Définissez le profil financier de l’entreprise visée.'
            : 'Define the financial profile of the target company.',
        fields: ['acquisitionPrice', 'revenue', 'ebitda', 'netIncome', 'existingDebt', 'bfr', 'futureInvestments']
      },
      {
        id: 2,
        title: language === 'fr' ? 'Montage financier' : 'Financing structure',
        description:
          language === 'fr'
            ? 'Renseignez vos sources de financement et paramètres de dette.'
            : 'Enter your financing sources and debt parameters.',
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
            ? 'Précisez les éléments qualitatifs appréciés par les banques.'
            : 'Specify qualitative elements usually assessed by lenders.',
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

  const currentStepCompletion = useMemo(() => {
    const fields = currentStepConfig.fields;
    const filled = fields.filter((field) => String(formData[field] || '').trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [currentStepConfig, formData]);

  const canGoNext = currentStepConfig.fields.every((field) => String(formData[field] || '').trim() !== '');

  const recommendations = useMemo(() => {
    const list = [];

    if (simulation.indicators.dscr < 1.2) {
      list.push(
        language === 'fr'
          ? 'Renforcez l’apport initial pour améliorer le DSCR et la bancabilité.'
          : 'Increase upfront equity to improve DSCR and bankability.'
      );
    }
    if (simulation.alerts.includes('dette_excessive')) {
      list.push(
        language === 'fr'
          ? 'Allongez la durée de prêt ou réduisez le levier pour limiter la pression de remboursement.'
          : 'Extend loan tenor or reduce leverage to limit repayment pressure.'
      );
    }
    if (simulation.alerts.includes('salaire_non_viable')) {
      list.push(
        language === 'fr'
          ? 'Ajustez la rémunération dirigeant cible pendant la phase de transition.'
          : 'Adjust manager target compensation during transition period.'
      );
    }
    if (list.length === 0) {
      list.push(
        language === 'fr'
          ? 'Le montage est cohérent. Préparez un mémo bancaire synthétique pour accélérer les discussions.'
          : 'The structure is consistent. Prepare a concise lender memo to speed up discussions.'
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
          <div className="mb-2">
            <h1 className="font-display text-3xl font-bold text-[#3B4759] mb-2">
              {language === 'fr' ? 'Simulateur financement de reprise' : 'Acquisition financing simulator'}
            </h1>
            <p className="text-sm text-[#6B7A94]">
              {language === 'fr'
                ? 'Renseignez vos hypothèses pour évaluer la faisabilité du montage et votre capacité d’endettement.'
                : 'Fill in your assumptions to assess deal feasibility and debt capacity.'}
            </p>
          </div>

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
                      ? 'Ce simulateur structure votre projet de reprise et met en évidence la faisabilité bancaire avant d’ouvrir les discussions.'
                      : 'This simulator structures your acquisition plan and highlights bankability before opening lender discussions.'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-[#F2E8E2] bg-white shadow-sm">
                <CardContent className="p-5">
                  <p className="font-display text-lg font-semibold text-[#3B4759] mb-3">
                    {language === 'fr' ? 'Ce qui est analysé' : 'What is analyzed'}
                  </p>
                  <ul className="space-y-2 text-sm text-[#3B4759]">
                    <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF6B4A]" />{language === 'fr' ? 'Répartition du montage (apport, dette, crédit vendeur)' : 'Structure split (equity, debt, seller note)'}</li>
                    <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF6B4A]" />{language === 'fr' ? 'Capacité d’endettement et DSCR' : 'Debt capacity and DSCR'}</li>
                    <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF6B4A]" />{language === 'fr' ? 'Cash-flow annuel post-reprise' : 'Post-acquisition annual cash flow'}</li>
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
                      ? 'Un statut finançable + DSCR robuste renforcent votre dossier. Les alertes indiquent les points à corriger avant le tour de table.'
                      : 'A financeable status with robust DSCR strengthens your case. Alerts show what to fix before lender outreach.'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="xl:col-span-8">
              <div className="grid lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3 border border-[#F2E8E2] shadow-sm bg-white">
              <CardContent className="p-6 space-y-6">
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
                      ['acquisitionPrice', language === 'fr' ? 'Prix acquisition (€)' : 'Acquisition price (€)', language === 'fr' ? 'Prix total envisagé pour racheter l’entreprise cible.' : 'Total target acquisition price.'],
                      ['revenue', language === 'fr' ? 'CA (€)' : 'Revenue (€)', language === 'fr' ? 'Chiffre d’affaires annuel de la cible.' : 'Target annual revenue.'],
                      ['ebitda', 'EBITDA (€)', language === 'fr' ? 'Capacité opérationnelle à générer du cash avant amortissements.' : 'Operational cash generation before depreciation.'],
                      ['netIncome', language === 'fr' ? 'Résultat net (€)' : 'Net income (€)', language === 'fr' ? 'Résultat net annuel après charges et impôts.' : 'Annual net profit after costs and tax.'],
                      ['existingDebt', language === 'fr' ? 'Dettes existantes (€)' : 'Existing debt (€)', language === 'fr' ? 'Dettes financières déjà portées par la cible.' : 'Existing financial debt held by the target.'],
                      ['bfr', language === 'fr' ? 'BFR (€)' : 'Working capital (€)', language === 'fr' ? 'Besoin en fonds de roulement estimé.' : 'Estimated working-capital requirement.'],
                      ['futureInvestments', language === 'fr' ? 'Investissements futurs (€)' : 'Future investments (€)', language === 'fr' ? 'CAPEX ou dépenses stratégiques post-reprise.' : 'Post-acquisition CAPEX or strategic investments.']
                    ].map(([field, label, hint]) => (
                      <div key={field}>
                        <Label>{withTooltip(label, hint)}</Label>
                        <Input
                          className="mt-2 font-mono border-[#EADFD8] focus-visible:ring-[#FF6B4A]"
                          value={formData[field]}
                          onChange={(e) => handleChange(field, e.target.value)}
                          placeholder=""
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {currentStep === 2 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      ['personalContribution', language === 'fr' ? 'Apport personnel (€)' : 'Personal contribution (€)', language === 'fr' ? 'Montant injecté directement par le repreneur.' : 'Amount invested directly by the buyer.'],
                      ['mobilizableAssets', language === 'fr' ? 'Patrimoine mobilisable (€)' : 'Mobilizable assets (€)', language === 'fr' ? 'Actifs personnels mobilisables en complément.' : 'Personal assets that can support financing.'],
                      ['investorsAmount', language === 'fr' ? 'Investisseurs (€)' : 'Investors (€)', language === 'fr' ? 'Montants potentiels d’associés ou investisseurs.' : 'Potential contribution from partners/investors.'],
                      ['aidsAmount', language === 'fr' ? 'Aides (€)' : 'Aids (€)', language === 'fr' ? 'Subventions ou dispositifs publics estimés.' : 'Estimated grants or public support.'],
                      ['earnOutAmount', 'Earn-out (€)', language === 'fr' ? 'Paiement différé conditionné aux performances futures.' : 'Deferred payment linked to future performance.'],
                      ['sellerCreditPct', language === 'fr' ? 'Crédit vendeur (%)' : 'Seller credit (%)', language === 'fr' ? 'Part du prix financée par le vendeur.' : 'Share of price financed by the seller.'],
                      ['loanDurationYears', language === 'fr' ? 'Durée prêt (ans)' : 'Loan duration (years)', language === 'fr' ? 'Durée de remboursement de la dette bancaire.' : 'Bank debt repayment duration.'],
                      ['interestRate', language === 'fr' ? 'Taux (%)' : 'Rate (%)', language === 'fr' ? 'Taux d’intérêt nominal annuel estimé.' : 'Estimated annual nominal interest rate.'],
                      ['managerSalaryTarget', language === 'fr' ? 'Salaire dirigeant cible (€)' : 'Manager target salary (€)', language === 'fr' ? 'Rémunération annuelle souhaitée du dirigeant repreneur.' : 'Desired annual compensation for the buyer-manager.']
                    ].map(([field, label, hint]) => (
                      <div key={field}>
                        <Label>{withTooltip(label, hint)}</Label>
                        <Input
                          className="mt-2 font-mono border-[#EADFD8] focus-visible:ring-[#FF6B4A]"
                          value={formData[field]}
                          onChange={(e) => handleChange(field, e.target.value)}
                          placeholder=""
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {currentStep === 3 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Expérience secteur' : 'Sector experience', language === 'fr' ? 'L’expérience sectorielle améliore souvent l’accès au crédit.' : 'Industry experience often improves access to debt financing.')}</Label>
                      <Select value={formData.sectorExperience} onValueChange={(v) => handleChange('sectorExperience', v)}>
                        <SelectTrigger className="mt-2 border-[#EADFD8]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{language === 'fr' ? 'Oui' : 'Yes'}</SelectItem>
                          <SelectItem value="no">{language === 'fr' ? 'Non' : 'No'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{withTooltip(language === 'fr' ? 'Garantie personnelle' : 'Personal guarantee', language === 'fr' ? 'Une garantie personnelle peut sécuriser l’accord bancaire.' : 'A personal guarantee can secure bank approval.')}</Label>
                      <Select value={formData.personalGuarantee} onValueChange={(v) => handleChange('personalGuarantee', v)}>
                        <SelectTrigger className="mt-2 border-[#EADFD8]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">{language === 'fr' ? 'Possible' : 'Possible'}</SelectItem>
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
                  <PiggyBank className="w-5 h-5 text-[#FF6B4A]" />
                  <p className="font-display font-semibold text-[#3B4759]">
                    {language === 'fr' ? 'Résultats financement' : 'Financing results'}
                  </p>
                </div>

                <ToolLeadGate
                  language={language}
                  tool="financing"
                  simulationInput={formData}
                  simulationResult={simulation}
                  preview={(
                    <div className="space-y-3">
                      <Badge className={statusStyle}>{language === 'fr' ? 'Aperçu verrouillé' : 'Locked preview'}</Badge>
                      <div className="rounded-xl bg-[#FAF9F7] border border-[#EFEAE6] p-4 text-sm text-[#3B4759] space-y-1.5">
                        <p>{language === 'fr' ? 'Mensualité estimée' : 'Estimated monthly'}: <span className="font-mono">***</span></p>
                        <p>DSCR: <span className="font-mono">**</span></p>
                        <p>{language === 'fr' ? 'Dette max' : 'Max debt'}: <span className="font-mono">***</span></p>
                      </div>
                    </div>
                  )}
                  full={(
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid grid-cols-3 w-full bg-[#F5F2EE]">
                        <TabsTrigger value="summary">{language === 'fr' ? 'Synthèse' : 'Summary'}</TabsTrigger>
                        <TabsTrigger value="structure">{language === 'fr' ? 'Montage' : 'Structure'}</TabsTrigger>
                        <TabsTrigger value="actions">{language === 'fr' ? 'Actions' : 'Actions'}</TabsTrigger>
                      </TabsList>

                      <TabsContent value="summary" className="space-y-4 mt-4">
                        <Badge className={statusStyle}>{simulation.status}</Badge>
                        <div className="rounded-xl bg-[#FAF9F7] border border-[#EFEAE6] p-4 text-sm text-[#3B4759] space-y-2">
                          <p>{language === 'fr' ? 'Mensualité' : 'Monthly payment'}: <span className="font-mono">{formatCurrency(simulation.monthlyPayment)}</span></p>
                          <p>{language === 'fr' ? 'Cash annuel' : 'Annual cash'}: <span className="font-mono">{formatCurrency(simulation.annualCashAvailable)}</span></p>
                          <p>DSCR: <span className="font-mono">{simulation.indicators.dscr.toFixed(2)}</span></p>
                          <p>{language === 'fr' ? 'Dette max' : 'Max debt'}: <span className="font-mono">{formatCurrency(simulation.indicators.debtMax)}</span></p>
                          <p>{language === 'fr' ? 'Apport recommandé' : 'Recommended equity'}: <span className="font-mono">{formatCurrency(simulation.indicators.minContributionRecommended)}</span></p>
                        </div>
                      </TabsContent>

                      <TabsContent value="structure" className="mt-4">
                        <div className="rounded-xl bg-white border border-[#EFEAE6] p-4">
                          <p className="font-medium text-[#3B4759] mb-2">{language === 'fr' ? 'Montage recommandé' : 'Recommended structure'}</p>
                          <div className="text-xs text-[#6B7A94] space-y-1">
                            <p>{language === 'fr' ? 'Apport' : 'Equity'}: <span className="font-mono">{formatCurrency(simulation.montage.personalContribution)}</span></p>
                            <p>{language === 'fr' ? 'Dette bancaire' : 'Bank debt'}: <span className="font-mono">{formatCurrency(simulation.montage.bankDebt)}</span></p>
                            <p>{language === 'fr' ? 'Crédit vendeur' : 'Seller note'}: <span className="font-mono">{formatCurrency(simulation.montage.sellerCredit)}</span></p>
                            <p>Mezzanine: <span className="font-mono">{formatCurrency(simulation.montage.mezzanine)}</span></p>
                          </div>
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
                          {simulation.alerts.length === 0 ? (
                            <div className="inline-flex items-center gap-2 text-green-700 text-sm">
                              <CheckCircle2 className="w-4 h-4" />
                              {language === 'fr' ? 'Aucune alerte majeure' : 'No major alert'}
                            </div>
                          ) : (
                            simulation.alerts.map((alert) => (
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
                ? 'Simulation indicative, non constitutive d’un conseil bancaire, fiscal ou juridique.'
                : 'Indicative simulation, not banking, tax or legal advice.'}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
