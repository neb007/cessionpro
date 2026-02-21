// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CircleHelp, Search, Sparkles, X, Save } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { billingService } from '@/services/billingService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DEFAULT_SMART_MATCHING_ALERTS,
  DEFAULT_SMART_MATCHING_CRITERIA,
  SMART_MATCHING_BUSINESS_TYPES,
  SMART_MATCHING_BUYER_PROFILE_TYPES,
  SMART_MATCHING_LOCATIONS,
  SMART_MATCHING_SECTORS,
  getSmartMatchingAlertPreferences,
  getSmartMatchingCriteria,
  saveSmartMatchingAlertPreferences,
  saveSmartMatchingCriteria,
} from '@/services/smartMatchingNotificationService';

const NUDGE_KEY_PREFIX = 'smartmatching:alerts:nudge';
const LOCATION_SUGGESTION_LIMIT = 8;

const normalize = (value) => String(value || '').trim().toLowerCase();

function InfoTip({ content }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="Aide">
            <CircleHelp className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs text-xs">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function getLocationLabel(value) {
  return SMART_MATCHING_LOCATIONS.find((location) => location.value === value)?.label || value;
}

function getLocationSuggestions(query, selectedValues = []) {
  const q = normalize(query);
  const selectedSet = new Set(selectedValues || []);

  const list = SMART_MATCHING_LOCATIONS
    .filter((location) => !selectedSet.has(location.value))
    .filter((location) => (q ? normalize(location.label).includes(q) : true));

  return list.slice(0, LOCATION_SUGGESTION_LIMIT);
}

function getSectorLabel(value) {
  return SMART_MATCHING_SECTORS.find((sector) => sector.value === value)?.label || value;
}

export default function SmartMatchingNotifications() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [criteriaProfile, setCriteriaProfile] = useState('buyer');
  const [cessionCriteria, setCessionCriteria] = useState(DEFAULT_SMART_MATCHING_CRITERIA); // mode buyer
  const [acquisitionCriteria, setAcquisitionCriteria] = useState(DEFAULT_SMART_MATCHING_CRITERIA); // mode seller
  const [alerts, setAlerts] = useState(DEFAULT_SMART_MATCHING_ALERTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasSmartMatching, setHasSmartMatching] = useState(false);
  const [showSetupTooltip, setShowSetupTooltip] = useState(false);

  const [cessionLocationQuery, setCessionLocationQuery] = useState('');
  const [acquisitionLocationQuery, setAcquisitionLocationQuery] = useState('');
  const [showCessionLocationSuggestions, setShowCessionLocationSuggestions] = useState(false);
  const [showAcquisitionLocationSuggestions, setShowAcquisitionLocationSuggestions] = useState(false);

  const cessionLocationSuggestions = useMemo(
    () => getLocationSuggestions(cessionLocationQuery, cessionCriteria.locations),
    [cessionLocationQuery, cessionCriteria.locations]
  );

  const acquisitionLocationSuggestions = useMemo(
    () => getLocationSuggestions(acquisitionLocationQuery, acquisitionCriteria.buyerLocations),
    [acquisitionLocationQuery, acquisitionCriteria.buyerLocations]
  );

  const nudgeKey = useMemo(
    () => `${NUDGE_KEY_PREFIX}:${user?.id || 'guest'}`,
    [user?.id]
  );

  useEffect(() => {
    setCessionCriteria(getSmartMatchingCriteria(user?.id, 'buyer'));
    setAcquisitionCriteria(getSmartMatchingCriteria(user?.id, 'seller'));
    setAlerts(getSmartMatchingAlertPreferences(user?.id));
  }, [user?.id]);

  useEffect(() => {
    const resolveSmartMatchingAccess = async () => {
      if (!user?.id) return;

      try {
        const data = await billingService.getMyActiveServices(10);
        const activeFeatureCodes = new Set(
          (data?.entitlements || [])
            .filter((item) => item?.entitlement_type === 'feature' && item?.status === 'active')
            .map((item) => item.product_code)
        );

        const hasFeature = activeFeatureCodes.has('smart_matching');
        setHasSmartMatching(hasFeature);

        if (hasFeature && typeof window !== 'undefined') {
          const alreadySeenNudge = window.localStorage.getItem(nudgeKey) === '1';
          if (!alreadySeenNudge) {
            setShowSetupTooltip(true);
          }
        }
      } catch {
        setHasSmartMatching(false);
      }
    };

    resolveSmartMatchingAccess();
  }, [nudgeKey, user?.id]);

  const helperText = {
    profile:
      language === 'fr'
        ? 'Acheteur: configure les annonces cession. Vendeur: configure les annonces acquisition. Cabinet: configure les deux.'
        : 'Buyer: configure sell-side listings. Seller: configure acquisition listings. Advisor: configure both.',
    frequency:
      language === 'fr'
        ? 'Quotidienne: vérification chaque jour. Hebdomadaire: récap une fois par semaine. Désactivée: aucun envoi.'
        : 'Daily: checked every day. Weekly: digest once per week. Disabled: no sends.',
    noEmail:
      language === 'fr'
        ? 'Les notifications sont envoyées uniquement lorsqu’un nouveau match qualifié est détecté selon vos critères.'
        : 'Notifications are sent only when a new qualified match is detected based on your criteria.',
  };

  const setCessionField = (field, value) => {
    setCessionCriteria((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const setAcquisitionField = (field, value) => {
    setAcquisitionCriteria((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const toggleArrayValue = (setter, field, value) => {
    setter((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [field]: next };
    });
    setSaved(false);
  };

  const addArrayValue = (setter, field, value) => {
    setter((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      if (current.includes(value)) return prev;
      return { ...prev, [field]: [...current, value] };
    });
    setSaved(false);
  };

  const removeArrayValue = (setter, field, value) => {
    setter((prev) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      return { ...prev, [field]: current.filter((item) => item !== value) };
    });
    setSaved(false);
  };

  const handleDismissNudge = () => {
    setShowSetupTooltip(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(nudgeKey, '1');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (criteriaProfile === 'cabinet') {
        saveSmartMatchingCriteria(user?.id, 'buyer', cessionCriteria);
        saveSmartMatchingCriteria(user?.id, 'seller', acquisitionCriteria);
      } else if (criteriaProfile === 'buyer') {
        saveSmartMatchingCriteria(user?.id, 'buyer', cessionCriteria);
      } else {
        saveSmartMatchingCriteria(user?.id, 'seller', acquisitionCriteria);
      }

      saveSmartMatchingAlertPreferences(user?.id, alerts);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const renderSectorsField = ({
    label,
    values,
    onAdd,
    onRemove,
  }) => (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <Select onValueChange={(value) => value && onAdd(value)}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder={language === 'fr' ? 'Choisir un secteur' : 'Choose a sector'} />
        </SelectTrigger>
        <SelectContent>
          {SMART_MATCHING_SECTORS.filter((sector) => !values.includes(sector.value)).length > 0 ? (
            SMART_MATCHING_SECTORS
              .filter((sector) => !values.includes(sector.value))
              .map((sector) => (
                <SelectItem key={sector.value} value={sector.value}>{sector.label}</SelectItem>
              ))
          ) : (
            <div className="px-3 py-2 text-xs text-gray-500">
              {language === 'fr' ? 'Tous les secteurs sont déjà sélectionnés' : 'All sectors are already selected'}
            </div>
          )}
        </SelectContent>
      </Select>

      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 text-xs font-semibold text-[#FF6B4A]"
            >
              {getSectorLabel(value)}
              <button
                type="button"
                onClick={() => onRemove(value)}
                className="hover:text-[#FF5A3A]"
                aria-label={language === 'fr' ? 'Retirer' : 'Remove'}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderLocationField = ({
    label,
    selectedValues,
    query,
    setQuery,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    onAdd,
    onRemove,
    emptyText,
  }) => (
    <div className="relative">
      <Label className="mb-2 block">{label}</Label>
      <div className="relative">
        <Input
          value={query}
          onFocus={() => setShowSuggestions(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowSuggestions(false);
              setQuery('');
            }, 120);
          }}
          placeholder={language === 'fr' ? 'Saisir une localisation...' : 'Type a location...'}
          className="pr-9"
        />
        <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      {showSuggestions && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-56 overflow-y-auto">
          {suggestions.length > 0 ? (
            suggestions.map((location) => (
              <button
                key={location.value}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onAdd(location.value);
                  setQuery('');
                }}
                className="w-full px-3 py-2 text-left text-sm text-[#3B4759] hover:bg-gray-100"
              >
                {location.label}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">{emptyText}</div>
          )}
        </div>
      )}

      {selectedValues.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedValues.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 text-xs font-semibold text-[#FF6B4A]"
            >
              {getLocationLabel(value)}
              <button
                type="button"
                onClick={() => onRemove(value)}
                className="hover:text-[#FF5A3A]"
                aria-label={language === 'fr' ? 'Retirer' : 'Remove'}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderCessionBlock = ({ title }) => (
    <div className="space-y-4 rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[#3B4759]">{title}</h4>
        <InfoTip
          content={language === 'fr'
            ? 'Critères appliqués aux annonces cession (vendeurs).'
            : 'Criteria applied to sell-side listings.'}
        />
      </div>

      {renderSectorsField({
        label: language === 'fr' ? 'Secteurs' : 'Sectors',
        values: cessionCriteria.sectors || [],
        onAdd: (value) => addArrayValue(setCessionCriteria, 'sectors', value),
        onRemove: (value) => removeArrayValue(setCessionCriteria, 'sectors', value),
      })}

      {renderLocationField({
        label: language === 'fr' ? 'Localisations cibles' : 'Target locations',
        selectedValues: cessionCriteria.locations || [],
        query: cessionLocationQuery,
        setQuery: setCessionLocationQuery,
        suggestions: cessionLocationSuggestions,
        showSuggestions: showCessionLocationSuggestions,
        setShowSuggestions: setShowCessionLocationSuggestions,
        onAdd: (value) => addArrayValue(setCessionCriteria, 'locations', value),
        onRemove: (value) => removeArrayValue(setCessionCriteria, 'locations', value),
        emptyText: language === 'fr' ? 'Aucune localisation trouvée' : 'No location found',
      })}

      <div>
        <Label>{language === 'fr' ? 'Type de cession proposée' : 'Sell-side business type'}</Label>
        <Select
          value={cessionCriteria.sellerBusinessType || undefined}
          onValueChange={(value) => setCessionField('sellerBusinessType', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder={language === 'fr' ? 'Choisir un type' : 'Choose a type'} />
          </SelectTrigger>
          <SelectContent>
            {SMART_MATCHING_BUSINESS_TYPES.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>{language === 'fr' ? 'Budget min (€)' : 'Min budget (€)'}</Label>
          <Input className="mt-2" type="number" value={cessionCriteria.minPrice} onChange={(e) => setCessionField('minPrice', e.target.value)} />
        </div>
        <div>
          <Label>{language === 'fr' ? 'Budget max (€)' : 'Max budget (€)'}</Label>
          <Input className="mt-2" type="number" value={cessionCriteria.maxPrice} onChange={(e) => setCessionField('maxPrice', e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>{language === 'fr' ? 'Effectifs min' : 'Min employees'}</Label>
          <Input className="mt-2" type="number" value={cessionCriteria.minEmployees} onChange={(e) => setCessionField('minEmployees', e.target.value)} />
        </div>
        <div>
          <Label>{language === 'fr' ? 'Effectifs max' : 'Max employees'}</Label>
          <Input className="mt-2" type="number" value={cessionCriteria.maxEmployees} onChange={(e) => setCessionField('maxEmployees', e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>{language === 'fr' ? 'Année min' : 'Min year'}</Label>
          <Input className="mt-2" type="number" value={cessionCriteria.minYear} onChange={(e) => setCessionField('minYear', e.target.value)} />
        </div>
        <div>
          <Label>{language === 'fr' ? 'Année max' : 'Max year'}</Label>
          <Input className="mt-2" type="number" value={cessionCriteria.maxYear} onChange={(e) => setCessionField('maxYear', e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>{language === 'fr' ? 'CA min (€)' : 'Min revenue (€)'}</Label>
          <Input className="mt-2" type="number" value={cessionCriteria.minCA} onChange={(e) => setCessionField('minCA', e.target.value)} />
        </div>
        <div>
          <Label>{language === 'fr' ? 'CA max (€)' : 'Max revenue (€)'}</Label>
          <Input className="mt-2" type="number" value={cessionCriteria.maxCA} onChange={(e) => setCessionField('maxCA', e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>{language === 'fr' ? 'EBITDA min (€)' : 'Min EBITDA (€)'}</Label>
          <Input className="mt-2" type="number" value={cessionCriteria.minEBITDA} onChange={(e) => setCessionField('minEBITDA', e.target.value)} />
        </div>
        <div>
          <Label>{language === 'fr' ? 'EBITDA max (€)' : 'Max EBITDA (€)'}</Label>
          <Input className="mt-2" type="number" value={cessionCriteria.maxEBITDA} onChange={(e) => setCessionField('maxEBITDA', e.target.value)} />
        </div>
      </div>
    </div>
  );

  const renderAcquisitionBlock = ({ title }) => (
    <div className="space-y-4 rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[#3B4759]">{title}</h4>
        <InfoTip
          content={language === 'fr'
            ? 'Critères appliqués aux annonces acquisition (repreneurs).'
            : 'Criteria applied to acquisition listings (buyers).'}
        />
      </div>

      {renderSectorsField({
        label: language === 'fr' ? 'Secteurs d’intérêt acquéreur' : 'Buyer interested sectors',
        values: acquisitionCriteria.buyerSectorsInterested || [],
        onAdd: (value) => addArrayValue(setAcquisitionCriteria, 'buyerSectorsInterested', value),
        onRemove: (value) => removeArrayValue(setAcquisitionCriteria, 'buyerSectorsInterested', value),
      })}

      {renderLocationField({
        label: language === 'fr' ? 'Localisations acquéreur' : 'Buyer locations',
        selectedValues: acquisitionCriteria.buyerLocations || [],
        query: acquisitionLocationQuery,
        setQuery: setAcquisitionLocationQuery,
        suggestions: acquisitionLocationSuggestions,
        showSuggestions: showAcquisitionLocationSuggestions,
        setShowSuggestions: setShowAcquisitionLocationSuggestions,
        onAdd: (value) => addArrayValue(setAcquisitionCriteria, 'buyerLocations', value),
        onRemove: (value) => removeArrayValue(setAcquisitionCriteria, 'buyerLocations', value),
        emptyText: language === 'fr' ? 'Aucune localisation trouvée' : 'No location found',
      })}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>{language === 'fr' ? 'Budget acheteur min (€)' : 'Min buyer budget (€)'}</Label>
          <Input className="mt-2" type="number" value={acquisitionCriteria.buyerBudgetMin} onChange={(e) => setAcquisitionField('buyerBudgetMin', e.target.value)} />
        </div>
        <div>
          <Label>{language === 'fr' ? 'Budget acheteur max (€)' : 'Max buyer budget (€)'}</Label>
          <Input className="mt-2" type="number" value={acquisitionCriteria.buyerBudgetMax} onChange={(e) => setAcquisitionField('buyerBudgetMax', e.target.value)} />
        </div>
      </div>

      <div>
        <Label>{language === 'fr' ? 'Capacité d’investissement disponible (€)' : 'Available investment capacity (€)'}</Label>
        <Input className="mt-2" type="number" value={acquisitionCriteria.buyerInvestmentAvailable} onChange={(e) => setAcquisitionField('buyerInvestmentAvailable', e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>{language === 'fr' ? 'Effectifs cibles min' : 'Min target employees'}</Label>
          <Input className="mt-2" type="number" value={acquisitionCriteria.buyerEmployeesMin} onChange={(e) => setAcquisitionField('buyerEmployeesMin', e.target.value)} />
        </div>
        <div>
          <Label>{language === 'fr' ? 'Effectifs cibles max' : 'Max target employees'}</Label>
          <Input className="mt-2" type="number" value={acquisitionCriteria.buyerEmployeesMax} onChange={(e) => setAcquisitionField('buyerEmployeesMax', e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>{language === 'fr' ? 'CA cible min (€)' : 'Min target revenue (€)'}</Label>
          <Input className="mt-2" type="number" value={acquisitionCriteria.buyerRevenueMin} onChange={(e) => setAcquisitionField('buyerRevenueMin', e.target.value)} />
        </div>
        <div>
          <Label>{language === 'fr' ? 'CA cible max (€)' : 'Max target revenue (€)'}</Label>
          <Input className="mt-2" type="number" value={acquisitionCriteria.buyerRevenueMax} onChange={(e) => setAcquisitionField('buyerRevenueMax', e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>{language === 'fr' ? 'Type de profil acquéreur' : 'Buyer profile type'}</Label>
          <Select
            value={acquisitionCriteria.buyerProfileType || undefined}
            onValueChange={(value) => setAcquisitionField('buyerProfileType', value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={language === 'fr' ? 'Choisir un profil' : 'Choose a profile'} />
            </SelectTrigger>
            <SelectContent>
              {SMART_MATCHING_BUYER_PROFILE_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{language === 'fr' ? 'Type de cession recherchée' : 'Business type sought'}</Label>
          <Select
            value={acquisitionCriteria.businessTypeSought || undefined}
            onValueChange={(value) => setAcquisitionField('businessTypeSought', value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={language === 'fr' ? 'Choisir un type' : 'Choose a type'} />
            </SelectTrigger>
            <SelectContent>
              {SMART_MATCHING_BUSINESS_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-2 space-y-6">
      <Card className="border-0 shadow-sm bg-gradient-to-r from-[#FFF6F3] to-white">
        <CardHeader>
          <CardTitle className="font-display flex items-center justify-between gap-3 text-[#3B4759]">
            <span className="inline-flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#FF6B4A]" />
              {language === 'fr' ? 'Notification Smart Matching' : 'Smart Matching Notifications'}
            </span>

            {hasSmartMatching && (
              <TooltipProvider>
                <Tooltip open={showSetupTooltip}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setShowSetupTooltip((prev) => !prev)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FF6B4A]/10 text-[#FF6B4A]"
                      aria-label={language === 'fr' ? 'Aide configuration' : 'Configuration help'}
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs text-xs">
                    <div className="space-y-2">
                      <p>
                        {language === 'fr'
                          ? 'Smart Matching est actif. Configurez vos notifications maintenant pour exploiter les nouveaux matchs dès leur publication.'
                          : 'Smart Matching is active. Configure notifications now to capture new matches as soon as they are published.'}
                      </p>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleDismissNudge}>
                        {language === 'fr' ? 'Compris' : 'Got it'}
                      </Button>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#4B5563]">
            {language === 'fr'
              ? 'Configurez vos critères par profil et votre fréquence d’alerte dans une interface claire, orientée usage quotidien.'
              : 'Configure profile-based criteria and alert frequency in a clear, daily-use interface.'}
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-[#3B4759] text-base inline-flex items-center gap-2">
            {language === 'fr' ? 'Critères de recherche' : 'Search criteria'}
            <InfoTip content={helperText.profile} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label>{language === 'fr' ? 'Profil' : 'Profile'}</Label>
            <Select value={criteriaProfile} onValueChange={setCriteriaProfile}>
              <SelectTrigger className="mt-2 max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">{language === 'fr' ? 'Acheteur' : 'Buyer'}</SelectItem>
                <SelectItem value="seller">{language === 'fr' ? 'Vendeur' : 'Seller'}</SelectItem>
                <SelectItem value="cabinet">{language === 'fr' ? 'Cabinet acheteur/vendeur' : 'Advisor buyer/seller'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {criteriaProfile === 'buyer' && renderCessionBlock({
            title: language === 'fr' ? 'Annonces Cession' : 'Sell-side listings',
          })}

          {criteriaProfile === 'seller' && renderAcquisitionBlock({
            title: language === 'fr' ? 'Annonces Acquisition' : 'Acquisition listings',
          })}

          {criteriaProfile === 'cabinet' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#FF6B4A]/20 bg-[#FFF6F3] px-3 py-3 text-xs text-[#7C2D12] space-y-1">
                <p className="font-semibold">
                  {language === 'fr' ? 'Parcours cabinet (vente + achat)' : 'Advisor workflow (sell + buy)'}
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>
                    {language === 'fr'
                      ? 'Renseignez Annonces Acquisition pour qualifier les repreneurs publiés en acquisition.'
                      : 'Set Acquisition listings to qualify buyers published in acquisition mode.'}
                  </li>
                  <li>
                    {language === 'fr'
                      ? 'Renseignez Annonces Cession pour sourcer les entreprises publiées en cession.'
                      : 'Set Sell-side listings to source businesses published in sale mode.'}
                  </li>
                  <li>
                    {language === 'fr'
                      ? 'Enregistrez: les deux blocs sont sauvegardés simultanément.'
                      : 'Save: both blocks are stored simultaneously.'}
                  </li>
                </ol>
              </div>

              {renderAcquisitionBlock({
                title: language === 'fr' ? 'Annonces Acquisition' : 'Acquisition listings',
              })}

              {renderCessionBlock({
                title: language === 'fr' ? 'Annonces Cession' : 'Sell-side listings',
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-[#3B4759] text-base inline-flex items-center gap-2">
            {language === 'fr' ? 'Notifications email' : 'Email notifications'}
            <InfoTip content={helperText.frequency} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#3B4759]">
                {language === 'fr' ? 'Activer les alertes Smart Matching' : 'Enable Smart Matching alerts'}
              </p>
              <p className="text-xs text-gray-500">{helperText.noEmail}</p>
            </div>
            <Switch
              checked={alerts.enabled}
              onCheckedChange={(value) => {
                setAlerts((prev) => ({
                  ...prev,
                  enabled: value,
                  frequency: value ? (prev.frequency === 'disabled' ? 'daily' : prev.frequency) : 'disabled',
                }));
                setSaved(false);
              }}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>{language === 'fr' ? 'Fréquence' : 'Frequency'}</Label>
              <Select
                value={alerts.frequency}
                onValueChange={(value) => {
                  setAlerts((prev) => ({ ...prev, frequency: value }));
                  setSaved(false);
                }}
                disabled={!alerts.enabled}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{language === 'fr' ? 'Quotidienne' : 'Daily'}</SelectItem>
                  <SelectItem value="weekly">{language === 'fr' ? 'Hebdomadaire' : 'Weekly'}</SelectItem>
                  <SelectItem value="disabled">{language === 'fr' ? 'Désactivée' : 'Disabled'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-xl border border-[#FF6B4A]/20 bg-[#FFF6F3] px-3 py-2 text-xs text-[#7C2D12]">
            {helperText.noEmail}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-[#FF6B4A] hover:bg-[#FF5A3A]">
          <Save className="w-4 h-4 mr-2" />
          {saved
            ? language === 'fr' ? 'Enregistré' : 'Saved'
            : language === 'fr' ? 'Enregistrer mes notifications' : 'Save notifications'}
        </Button>
      </div>
    </div>
  );
}
