// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { X, Plus, Save, Send, Loader2, Building2, Eye, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FinancialYearsManager from '@/components/Financial/FinancialYearsManager';
import ImageGallery from '@/components/ImageGallery';
import { getDefaultImageForSector } from '@/constants/defaultImages';
import { getRegionForFrenchCity } from '@/utils/frenchCitiesToRegions';
import { toast } from '@/components/ui/use-toast';
import { SECTORS } from '@/constants/sectors';
const REASONS = ['retirement', 'new_project', 'health', 'relocation', 'other'];
const COUNTRIES = ['france', 'belgium', 'switzerland', 'luxembourg', 'germany', 'spain', 'italy', 'netherlands', 'portugal', 'other'];
const LEGAL_STRUCTURES = ['sarl', 'sas', 'sa', 'eurl', 'sasu', 'sci', 'snc', 'auto_entrepreneur', 'other'];
const BUSINESS_TYPES = ['entreprise', 'fond_de_commerce', 'franchise'];
const TITLE_MAX_LENGTH = 55;

export default function SellerForm({
  formData,
  onFormChange,
  onSubmit,
  onPreviewPublish,
  saving,
  language,
  t,
  user,
  editingId,
  completion
}) {
  const [newAsset, setNewAsset] = useState('');
  const [focusIndicator, setFocusIndicator] = useState(null);
  const publishToastRef = useRef(null);
  const publishToastTimerRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const completionScore = Math.max(0, Math.min(100, Number(completion?.score || 0)));
  const requiredCompletionScore = Math.max(0, Math.min(100, Number(completion?.requiredCompletion || 0)));
  const allRequiredFilled = Boolean(completion?.allRequiredFilled);
  const isHighCompletion = completionScore >= 69 && allRequiredFilled;
  const activeRingColor = isHighCompletion ? '#22c55e' : '#ef4444';
  const activeShadowClass = isHighCompletion
    ? 'shadow-[0_2px_10px_rgba(34,197,94,0.28)]'
    : 'shadow-[0_2px_10px_rgba(239,68,68,0.28)]';
  const activeTextClass = isHighCompletion ? 'text-green-700' : 'text-red-700';
  const publishMessage = language === 'fr'
    ? "Votre annonce est en cours de validation. Elle sera publiée après validation par la plateforme."
    : 'Your listing is under review and will be published after platform validation.';

  const clearPublishToast = () => {
    if (publishToastTimerRef.current) {
      clearTimeout(publishToastTimerRef.current);
      publishToastTimerRef.current = null;
    }
    if (publishToastRef.current) {
      publishToastRef.current.dismiss();
      publishToastRef.current = null;
    }
  };

  const showPublishToast = () => {
    clearPublishToast();
    const toastInstance = toast({
      title: language === 'fr' ? 'Annonce envoyée' : 'Listing submitted',
      description: publishMessage
    });
    publishToastRef.current = toastInstance;
    publishToastTimerRef.current = setTimeout(() => {
      toastInstance.dismiss();
      publishToastRef.current = null;
      publishToastTimerRef.current = null;
    }, 6000);
  };

  const isTrackableField = (target) => {
    if (!target || typeof target.matches !== 'function') return false;

    if (target.matches('input')) {
      const inputType = String(target.getAttribute('type') || 'text').toLowerCase();
      return !['button', 'submit', 'reset', 'hidden', 'file', 'checkbox', 'radio'].includes(inputType);
    }

    return target.matches('textarea, [role="combobox"], [contenteditable="true"]');
  };

  const updateFocusIndicator = (target) => {
    if (!target || typeof target.getBoundingClientRect !== 'function') return;
    if (!scrollAreaRef.current?.contains(target)) return;
    if (!isTrackableField(target)) {
      setFocusIndicator(null);
      return;
    }

    const rect = target.getBoundingClientRect();
    const top = Math.max(20, Math.min(rect.top + (rect.height / 2), window.innerHeight - 20));
    const indicatorSize = 32;
    const insetRight = 8;
    const rawLeft = rect.right - indicatorSize - insetRight;
    const minInsideField = rect.left + 4;
    const leftInsideField = Math.max(minInsideField, rawLeft);
    const left = Math.max(8, Math.min(leftInsideField, window.innerWidth - indicatorSize - 8));

    setFocusIndicator({ top, left });
  };

  const handleFormFocusCapture = (event) => {
    const target = event?.target;
    updateFocusIndicator(target);
  };

  const handleFormClickCapture = (event) => {
    const target = event?.target;
    if (!target?.closest) return;
    const focusableTarget = target.closest('input, textarea, [role="combobox"], [contenteditable="true"]');
    if (isTrackableField(focusableTarget)) {
      updateFocusIndicator(focusableTarget);
    }
  };

  const handleFormScroll = () => {
    const activeElement = document.activeElement;
    if (activeElement && scrollAreaRef.current?.contains(activeElement) && isTrackableField(activeElement)) {
      updateFocusIndicator(activeElement);
    }
  };

  const handleFormBlurCapture = (event) => {
    const nextFocusedElement = event?.relatedTarget;
    if (nextFocusedElement && scrollAreaRef.current?.contains(nextFocusedElement)) {
      return;
    }

    requestAnimationFrame(() => {
      const activeElement = document.activeElement;
      if (activeElement && scrollAreaRef.current?.contains(activeElement) && isTrackableField(activeElement)) {
        updateFocusIndicator(activeElement);
        return;
      }
      setFocusIndicator(null);
    });
  };

  // Auto-generate region for France when location changes
  useEffect(() => {
    if (formData.country === 'france' && formData.location && !formData.region) {
      const detectedRegion = getRegionForFrenchCity(formData.location);
      if (detectedRegion) {
        const updatedData = { ...formData, region: detectedRegion };
        onFormChange(updatedData);
      }
    }
  }, [formData.location, formData.country]);

  useEffect(() => () => {
    clearPublishToast();
  }, []);

  useEffect(() => {
    console.debug('[completion-indicator-form]', {
      form: 'seller',
      completionScore,
      requiredCompletionScore,
      allRequiredFilled,
      isHighCompletion
    });
  }, [completionScore, requiredCompletionScore, allRequiredFilled, isHighCompletion]);

  const handleChange = (field, value) => {
    const nextValue = field === 'title' && typeof value === 'string'
      ? value.slice(0, TITLE_MAX_LENGTH)
      : value;

    const updatedData = { ...formData, [field]: nextValue };
    
    if (field === 'sector' && value) {
      const defaultImageUrl = getDefaultImageForSector(value);
      const hasDefaultImage = updatedData.images.some(img => img.isDefault);
      
      if (!hasDefaultImage) {
        updatedData.images = [
          {
            url: defaultImageUrl,
            isDefault: true
          },
          ...updatedData.images.filter(img => !img.isDefault)
        ];
      }
    }
    
    onFormChange(updatedData);
  };

  const handleImagesChange = (newImages) => {
    onFormChange({ ...formData, images: newImages });
  };

  const addAsset = () => {
    if (!newAsset.trim()) return;
    handleChange('assets_included', [...formData.assets_included, newAsset.trim()]);
    setNewAsset('');
  };

  const removeAsset = (index) => {
    const newAssets = [...formData.assets_included];
    newAssets.splice(index, 1);
    handleChange('assets_included', newAssets);
  };

  const withTooltip = (label, hint) => (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5">
        <span>{label}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              aria-label={language === 'fr' ? 'Aide' : 'Help'}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {hint}
          </TooltipContent>
        </Tooltip>
      </span>
    </div>
  );

  return (
    <TooltipProvider delayDuration={120}>
      <div className="w-full flex flex-col h-full overflow-hidden">
        <div
          ref={scrollAreaRef}
          onFocusCapture={handleFormFocusCapture}
          onClickCapture={handleFormClickCapture}
          onBlurCapture={handleFormBlurCapture}
          onScroll={handleFormScroll}
          className="relative flex-1 overflow-y-auto pr-4 scrollbar-hide"
        >
          {focusIndicator && (
            <div
              className="pointer-events-none fixed z-[70] -translate-y-1/2 transition-all duration-150 ease-out"
              style={{ top: `${focusIndicator.top}px`, left: `${focusIndicator.left}px` }}
            >
              <div
                className={`h-8 w-8 rounded-full p-[2px] ${activeShadowClass}`}
                style={{ background: `conic-gradient(${activeRingColor} ${completionScore * 3.6}deg, #e5e7eb 0deg)` }}
              >
                <div className="h-full w-full rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center">
                  <span className={`text-[9px] font-bold leading-none ${activeTextClass}`}>{completionScore}</span>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4 md:space-y-6">
            {/* Main Form */}
            <div className="space-y-4 md:space-y-6">
            {/* Basic Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  {language === 'fr' ? 'Informations générales' : 'General Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>{t('title')} *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder={language === 'fr' ? 'Ex: Restaurant gastronomique Paris 8ème' : 'Ex: Gourmet restaurant Paris 8th'}
                    className="mt-2"
                    maxLength={TITLE_MAX_LENGTH}
                  />
                  <p className="text-[11px] text-gray-500 mt-1 text-right">
                    {(formData.title || '').length}/{TITLE_MAX_LENGTH}
                  </p>
                </div>

                <div>
                  <Label>{withTooltip(t('description'), language === 'fr' ? 'Décrivez clairement l’activité et ses atouts.' : 'Describe the business clearly and highlight strengths.')}</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder={language === 'fr' ? 'Décrivez votre entreprise en détail...' : 'Describe your business in detail...'}
                    className="mt-2 min-h-32"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{withTooltip(<><span className="text-red-500">*</span> {t('sector')}</>, language === 'fr' ? 'Secteur principal de votre activité.' : 'Primary sector of your business.')}</Label>
                    <Select value={formData.sector} onValueChange={(v) => handleChange('sector', v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={t('filter_by_sector')} />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTORS.map(s => (
                          <SelectItem key={s} value={s}>{t(s)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{withTooltip(<><span className="text-red-500">*</span> {language === 'fr' ? 'Type de Cession' : 'Business Type'}</>, language === 'fr' ? 'Nature de la transaction proposée.' : 'Nature of transaction proposed.')}</Label>
                    <Select value={formData.business_type} onValueChange={(v) => handleChange('business_type', v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={language === 'fr' ? 'Sélectionner un type' : 'Select type'} />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map(bt => (
                          <SelectItem key={bt} value={bt}>
                            {bt === 'entreprise' ? (language === 'fr' ? 'Entreprise' : 'Company') : 
                             bt === 'fond_de_commerce' ? (language === 'fr' ? 'Fond de Commerce' : 'Business Fund') :
                             (language === 'fr' ? 'Franchise' : 'Franchise')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{withTooltip(t('reason_for_sale'), language === 'fr' ? 'Pourquoi vous cédez cette activité.' : 'Why you are selling this business.')}</Label>
                    <Select value={formData.reason_for_sale} onValueChange={(v) => handleChange('reason_for_sale', v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={t('reason_for_sale')} />
                      </SelectTrigger>
                      <SelectContent>
                        {REASONS.map(r => (
                          <SelectItem key={r} value={r}>{t(r)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{withTooltip(language === 'fr' ? 'Type de cession proposée' : 'Sell-side business type', language === 'fr' ? 'Type juridique/commercial de la cession.' : 'Commercial/legal sell-side type.')}</Label>
                    <Select value={formData.seller_business_type || ''} onValueChange={(v) => handleChange('seller_business_type', v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={language === 'fr' ? 'Sélectionner un type' : 'Select type'} />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map(bt => (
                          <SelectItem key={bt} value={bt}>
                            {bt === 'entreprise' ? (language === 'fr' ? 'Entreprise' : 'Company') :
                             bt === 'fond_de_commerce' ? (language === 'fr' ? 'Fond de Commerce' : 'Business Fund') :
                             (language === 'fr' ? 'Franchise' : 'Franchise')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-4 gap-4">
                  <div>
                    <Label>{withTooltip(<><span className="text-red-500">*</span> {t('location')}</>, language === 'fr' ? 'Ville principale de l’activité.' : 'Main city of the activity.')}</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder={language === 'fr' ? 'Ville' : 'City'}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label>{withTooltip(language === 'fr' ? 'Département' : 'Department', language === 'fr' ? 'Code ou nom du département.' : 'Department code or name.')}</Label>
                    <Input
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      placeholder={language === 'fr' ? '75, 69, 13...' : '75, 69, 13...'}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>{withTooltip(language === 'fr' ? 'Région' : 'Region', language === 'fr' ? 'Région administrative.' : 'Administrative region.')}</Label>
                    <Input
                      value={formData.region}
                      onChange={(e) => handleChange('region', e.target.value)}
                      placeholder={language === 'fr' ? 'Île-de-France, Provence...' : 'Region name...'}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>{withTooltip(t('country'), language === 'fr' ? 'Pays principal de l’activité.' : 'Primary country of operation.')}</Label>
                    <Select value={formData.country} onValueChange={(v) => handleChange('country', v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(c => (
                          <SelectItem key={c} value={c}>{t(c)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{language === 'fr' ? 'Masquer la localisation' : 'Hide Location'}</p>
                    <p className="text-sm text-gray-500">
                      {language === 'fr' ? "Masquer la ville, département et région dans l'annonce" : 'Hide city, department and region in listing'}
                    </p>
                  </div>
                  <Switch
                    checked={formData.hide_location}
                    onCheckedChange={(v) => handleChange('hide_location', v)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Financial Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-display">
                  {language === 'fr' ? 'Informations financières de base' : 'Basic Financial Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingId && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                    <p className="text-sm text-blue-800">
                      {language === 'fr'
                        ? 'Vous pouvez modifier les informations financières même après publication.'
                        : 'You can edit financial information even after publication.'}
                    </p>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{withTooltip(<><span className="text-red-500">*</span> {t('price')} (€)</>, language === 'fr' ? 'Prix demandé pour la cession.' : 'Asking price for the transfer.')}</Label>
                    <Input
                      type="number"
                      value={formData.asking_price}
                      onChange={(e) => handleChange('asking_price', e.target.value)}
                      placeholder="500000"
                      className="mt-2 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <Label>{withTooltip(`${t('annual_revenue')} (€)`, language === 'fr' ? 'Chiffre d’affaires annuel le plus représentatif.' : 'Most representative annual revenue.')}</Label>
                    <Input
                      type="number"
                      value={formData.annual_revenue}
                      onChange={(e) => handleChange('annual_revenue', e.target.value)}
                      placeholder="1000000"
                      className="mt-2 font-mono"
                    />
                  </div>

                  <div>
                    <Label>{withTooltip('EBITDA (€)', language === 'fr' ? 'Résultat opérationnel avant amortissements.' : 'Operating result before depreciation/amortization.')}</Label>
                    <Input
                      type="number"
                      value={formData.ebitda}
                      onChange={(e) => handleChange('ebitda', e.target.value)}
                      placeholder="200000"
                      className="mt-2 font-mono"
                    />
                  </div>

                  <div>
                    <Label>{withTooltip(t('employees'), language === 'fr' ? 'Nombre total de collaborateurs.' : 'Total number of employees.')}</Label>
                    <Input
                      type="number"
                      value={formData.employees}
                      onChange={(e) => handleChange('employees', e.target.value)}
                      placeholder="10"
                      className="mt-2 font-mono"
                    />
                  </div>

                  <div>
                    <Label>{withTooltip(t('year_founded'), language === 'fr' ? 'Année de création de l’activité.' : 'Year of business creation.')}</Label>
                    <Input
                      type="number"
                      value={formData.year_founded}
                      onChange={(e) => handleChange('year_founded', e.target.value)}
                      placeholder="2010"
                      className="mt-2 font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-display">
                  {language === 'fr' ? 'Informations légales et administratives' : 'Legal & Administrative Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{withTooltip(language === 'fr' ? 'Structure juridique' : 'Legal Structure', language === 'fr' ? 'Forme juridique de l’entreprise.' : 'Legal form of the company.')}</Label>
                    <Select value={formData.legal_structure} onValueChange={(v) => handleChange('legal_structure', v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={language === 'fr' ? 'Sélectionner' : 'Select'} />
                      </SelectTrigger>
                      <SelectContent>
                        {LEGAL_STRUCTURES.map(s => (
                          <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{withTooltip(language === 'fr' ? 'Numéro SIREN/SIRET' : 'Registration Number', language === 'fr' ? 'Identifiant d’immatriculation.' : 'Business registration identifier.')}</Label>
                    <Input
                      value={formData.registration_number}
                      onChange={(e) => handleChange('registration_number', e.target.value)}
                      placeholder="123 456 789 00012"
                      className="mt-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <Label>{withTooltip(language === 'fr' ? 'Baux commerciaux' : 'Commercial Leases', language === 'fr' ? 'Conditions de bail: loyer, durée, clauses.' : 'Lease terms: rent, duration, clauses.')}</Label>
                  <Textarea
                    value={formData.lease_info}
                    onChange={(e) => handleChange('lease_info', e.target.value)}
                    placeholder={language === 'fr' ? 'Détails sur les baux (durée, loyer, conditions...)' : 'Lease details (duration, rent, conditions...)'}
                    className="mt-2 min-h-24"
                  />
                </div>

                <div>
                  <Label>{withTooltip(language === 'fr' ? 'Licences et autorisations' : 'Licenses & Permits', language === 'fr' ? 'Autorisations nécessaires à l’exploitation.' : 'Authorizations required to operate.')}</Label>
                  <Textarea
                    value={formData.licenses}
                    onChange={(e) => handleChange('licenses', e.target.value)}
                    placeholder={language === 'fr' ? 'Licences nécessaires pour exploiter l\'activité' : 'Required licenses to operate the business'}
                    className="mt-2 min-h-24"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Market & Strategic Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-display">
                  {language === 'fr' ? 'Positionnement et opportunités' : 'Market Position & Opportunities'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{withTooltip(language === 'fr' ? 'Positionnement sur le marché' : 'Market Position', language === 'fr' ? 'Comment votre entreprise se distingue.' : 'How your company is positioned.')}</Label>
                  <Textarea
                    value={formData.market_position}
                    onChange={(e) => handleChange('market_position', e.target.value)}
                    placeholder={language === 'fr' ? 'Décrivez la position de l\'entreprise sur son marché' : 'Describe the company\'s market position'}
                    className="mt-2 min-h-24"
                  />
                </div>

                <div>
                  <Label>{withTooltip(language === 'fr' ? 'Avantages concurrentiels' : 'Competitive Advantages', language === 'fr' ? 'Forces qui vous différencient.' : 'Differentiating strengths.')}</Label>
                  <Textarea
                    value={formData.competitive_advantages}
                    onChange={(e) => handleChange('competitive_advantages', e.target.value)}
                    placeholder={language === 'fr' ? 'Points forts et différenciateurs' : 'Key strengths and differentiators'}
                    className="mt-2 min-h-24"
                  />
                </div>

                <div>
                  <Label>{withTooltip(language === 'fr' ? 'Opportunités de développement' : 'Growth Opportunities', language === 'fr' ? 'Pistes de croissance futures.' : 'Future growth levers.')}</Label>
                  <Textarea
                    value={formData.growth_opportunities}
                    onChange={(e) => handleChange('growth_opportunities', e.target.value)}
                    placeholder={language === 'fr' ? 'Potentiel de croissance et axes de développement' : 'Growth potential and development opportunities'}
                    className="mt-2 min-h-24"
                  />
                </div>

                <div>
                  <Label>{withTooltip(language === 'fr' ? 'Description de la clientèle' : 'Customer Base', language === 'fr' ? 'Typologie et fidélité des clients.' : 'Customer typology and loyalty.')}</Label>
                  <Textarea
                    value={formData.customer_base}
                    onChange={(e) => handleChange('customer_base', e.target.value)}
                    placeholder={language === 'fr' ? 'Profil des clients, fidélité, diversification...' : 'Customer profile, loyalty, diversification...'}
                    className="mt-2 min-h-24"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Optional Display Fields */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-display">
                  {language === 'fr' ? 'Champs optionnels pour l\'annonce' : 'Optional fields for listing'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>{withTooltip(language === 'fr' ? 'Détails concernant la cession' : 'Cession details', language === 'fr' ? 'Précisions utiles pour les repreneurs.' : 'Useful details for buyers.')}</Label>
                  <Textarea
                    value={formData.cession_details}
                    onChange={(e) => handleChange('cession_details', e.target.value)}
                    placeholder={language === 'fr' ? 'Ajoutez des détails si besoin...' : 'Add details if needed...'}
                    className="mt-2 min-h-24"
                  />
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">
                        {language === 'fr' ? 'Afficher dans l\'annonce' : 'Show in listing'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {language === 'fr' ? 'Activez pour publier ce champ' : 'Enable to publish this field'}
                      </p>
                    </div>
                    <Switch
                      checked={formData.show_cession_details}
                      onCheckedChange={(v) => handleChange('show_cession_details', v)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>{withTooltip(language === 'fr' ? 'Taille de la surface' : 'Surface area', language === 'fr' ? 'Surface exploitable (m²).' : 'Usable floor area (sqm).')}</Label>
                  <Input
                    value={formData.surface_area}
                    onChange={(e) => handleChange('surface_area', e.target.value)}
                    placeholder={language === 'fr' ? 'Ex: 120 m²' : 'Ex: 120 m²'}
                    className="mt-2"
                  />
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">
                        {language === 'fr' ? 'Afficher dans l\'annonce' : 'Show in listing'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {language === 'fr' ? 'Activez pour publier ce champ' : 'Enable to publish this field'}
                      </p>
                    </div>
                    <Switch
                      checked={formData.show_surface_area}
                      onCheckedChange={(v) => handleChange('show_surface_area', v)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Years */}
            <FinancialYearsManager
              financialYears={formData.financial_years}
              onChange={(years) => handleChange('financial_years', years)}
              language={language}
              editingId={editingId}
            />

            {/* Assets */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-display">{t('assets_included')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newAsset}
                    onChange={(e) => setNewAsset(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAsset()}
                    placeholder={language === 'fr' ? 'Ex: Stock, Équipements, Clientèle...' : 'Ex: Stock, Equipment, Customer base...'}
                  />
                  <Button onClick={addAsset} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.assets_included.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {formData.assets_included.map((asset, idx) => (
                        <motion.span
                          key={asset}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {asset}
                          <button onClick={() => removeAsset(idx)} className="hover:text-primary/60">
                            <X className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-display">
                  {withTooltip(t('upload_images'), language === 'fr' ? 'Ajoutez des photos pour renforcer la confiance des acheteurs.' : 'Add photos to build buyer trust.')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageGallery
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                  defaultImage={formData.sector ? getDefaultImageForSector(formData.sector) : ''}
                  maxPhotos={5}
                  sectorLabel={formData.sector}
                  userEmail={user?.email}
                  language={language}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => onSubmit('draft')}
                variant="outline"
                disabled={saving}
                className="flex-1 py-6"
              >
                <Save className="w-4 h-4 mr-2" />
                {t('save_draft')}
              </Button>
              <Button
                onClick={() => {
                  if (typeof onPreviewPublish === 'function') {
                    onPreviewPublish();
                  }
                }}
                variant="outline"
                disabled={saving}
                className="flex-1 py-6"
              >
                <Eye className="w-4 h-4 mr-2" />
                {language === 'fr' ? 'Preview' : 'Preview'}
              </Button>
              <Button
                onClick={() => {
                  if (typeof onPreviewPublish === 'function') {
                    onPreviewPublish();
                  } else {
                    onSubmit('active');
                    showPublishToast();
                  }
                }}
                disabled={saving}
                className="flex-1 py-6 bg-primary text-white hover:bg-primary/90"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {t('publish')}
              </Button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
