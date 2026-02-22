// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { Save, Send, Loader2, Search, X, Upload, FileText, Eye, Info } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';
import { getDefaultImageForSector } from '@/constants/defaultImages';
import { base44 } from '@/api/base44Client';
import { toast } from '@/components/ui/use-toast';
import { SECTORS } from '@/constants/sectors';

const BUSINESS_TYPES = ['entreprise', 'fond_de_commerce', 'franchise'];
const TITLE_MAX_LENGTH = 55;
const EUROPEAN_COUNTRIES = [
  { value: 'france', label: '🇫🇷 France' },
  { value: 'belgium', label: '🇧🇪 Belgique' },
  { value: 'switzerland', label: '🇨🇭 Suisse' },
  { value: 'germany', label: '🇩🇪 Allemagne' },
  { value: 'italy', label: '🇮🇹 Italie' },
  { value: 'spain', label: '🇪🇸 Espagne' },
  { value: 'netherlands', label: '🇳🇱 Pays-Bas' },
  { value: 'portugal', label: '🇵🇹 Portugal' },
  { value: 'austria', label: '🇦🇹 Autriche' },
  { value: 'poland', label: '🇵🇱 Pologne' },
  { value: 'czechia', label: '🇨🇿 Tchéquie' },
  { value: 'hungary', label: '🇭🇺 Hongrie' },
  { value: 'romania', label: '🇷🇴 Roumanie' },
  { value: 'greece', label: '🇬🇷 Grèce' },
  { value: 'sweden', label: '🇸🇪 Suède' },
  { value: 'denmark', label: '🇩🇰 Danemark' },
  { value: 'finland', label: '🇫🇮 Finlande' },
  { value: 'ireland', label: '🇮🇪 Irlande' },
  { value: 'luxembourg', label: '🇱🇺 Luxembourg' },
  { value: 'cyprus', label: '🇨🇾 Chypre' }
];

const FRENCH_DEPARTMENTS = [
  { value: '01', label: '01 - Ain' },
  { value: '02', label: '02 - Aisne' },
  { value: '03', label: '03 - Allier' },
  { value: '04', label: '04 - Alpes-de-Haute-Provence' },
  { value: '05', label: '05 - Hautes-Alpes' },
  { value: '06', label: '06 - Alpes-Maritimes' },
  { value: '07', label: '07 - Ardèche' },
  { value: '08', label: '08 - Ardennes' },
  { value: '09', label: '09 - Ariège' },
  { value: '10', label: '10 - Aube' },
  { value: '11', label: '11 - Aude' },
  { value: '12', label: '12 - Aveyron' },
  { value: '13', label: '13 - Bouches-du-Rhône' },
  { value: '14', label: '14 - Calvados' },
  { value: '15', label: '15 - Cantal' },
  { value: '16', label: '16 - Charente' },
  { value: '17', label: '17 - Charente-Maritime' },
  { value: '18', label: '18 - Cher' },
  { value: '19', label: '19 - Corrèze' },
  { value: '2a', label: '2A - Corse-du-Sud' },
  { value: '2b', label: '2B - Haute-Corse' },
  { value: '21', label: '21 - Côte-d\'Or' },
  { value: '22', label: '22 - Côtes-d\'Armor' },
  { value: '23', label: '23 - Creuse' },
  { value: '24', label: '24 - Dordogne' },
  { value: '25', label: '25 - Doubs' },
  { value: '26', label: '26 - Drôme' },
  { value: '27', label: '27 - Eure' },
  { value: '28', label: '28 - Eure-et-Loir' },
  { value: '29', label: '29 - Finistère' },
  { value: '30', label: '30 - Gard' },
  { value: '31', label: '31 - Haute-Garonne' },
  { value: '32', label: '32 - Gers' },
  { value: '33', label: '33 - Gironde' },
  { value: '34', label: '34 - Hérault' },
  { value: '35', label: '35 - Ille-et-Vilaine' },
  { value: '36', label: '36 - Indre' },
  { value: '37', label: '37 - Indre-et-Loire' },
  { value: '38', label: '38 - Isère' },
  { value: '39', label: '39 - Jura' },
  { value: '40', label: '40 - Landes' },
  { value: '41', label: '41 - Loir-et-Cher' },
  { value: '42', label: '42 - Loire' },
  { value: '43', label: '43 - Haute-Loire' },
  { value: '44', label: '44 - Loire-Atlantique' },
  { value: '45', label: '45 - Loiret' },
  { value: '46', label: '46 - Lot' },
  { value: '47', label: '47 - Lot-et-Garonne' },
  { value: '48', label: '48 - Lozère' },
  { value: '49', label: '49 - Maine-et-Loire' },
  { value: '50', label: '50 - Manche' },
  { value: '51', label: '51 - Marne' },
  { value: '52', label: '52 - Haute-Marne' },
  { value: '53', label: '53 - Mayenne' },
  { value: '54', label: '54 - Meurthe-et-Moselle' },
  { value: '55', label: '55 - Meuse' },
  { value: '56', label: '56 - Morbihan' },
  { value: '57', label: '57 - Moselle' },
  { value: '58', label: '58 - Nièvre' },
  { value: '59', label: '59 - Nord' },
  { value: '60', label: '60 - Oise' },
  { value: '61', label: '61 - Orne' },
  { value: '62', label: '62 - Pas-de-Calais' },
  { value: '63', label: '63 - Puy-de-Dôme' },
  { value: '64', label: '64 - Pyrénées-Atlantiques' },
  { value: '65', label: '65 - Hautes-Pyrénées' },
  { value: '66', label: '66 - Pyrénées-Orientales' },
  { value: '67', label: '67 - Bas-Rhin' },
  { value: '68', label: '68 - Haut-Rhin' },
  { value: '69', label: '69 - Rhône' },
  { value: '70', label: '70 - Haute-Saône' },
  { value: '71', label: '71 - Saône-et-Loire' },
  { value: '72', label: '72 - Sarthe' },
  { value: '73', label: '73 - Savoie' },
  { value: '74', label: '74 - Haute-Savoie' },
  { value: '75', label: '75 - Paris' },
  { value: '76', label: '76 - Seine-Maritime' },
  { value: '77', label: '77 - Seine-et-Marne' },
  { value: '78', label: '78 - Yvelines' },
  { value: '79', label: '79 - Deux-Sèvres' },
  { value: '80', label: '80 - Somme' },
  { value: '81', label: '81 - Tarn' },
  { value: '82', label: '82 - Tarn-et-Garonne' },
  { value: '83', label: '83 - Var' },
  { value: '84', label: '84 - Vaucluse' },
  { value: '85', label: '85 - Vendée' },
  { value: '86', label: '86 - Vienne' },
  { value: '87', label: '87 - Haute-Vienne' },
  { value: '88', label: '88 - Vosges' },
  { value: '89', label: '89 - Yonne' },
  { value: '90', label: '90 - Territoire de Belfort' },
  { value: '91', label: '91 - Essonne' },
  { value: '92', label: '92 - Hauts-de-Seine' },
  { value: '93', label: '93 - Seine-Saint-Denis' },
  { value: '94', label: '94 - Val-de-Marne' },
  { value: '95', label: '95 - Val-d\'Oise' }
];

// Get label for location value
const getLocationLabel = (value) => {
  const dept = FRENCH_DEPARTMENTS.find(d => d.value === value);
  if (dept) return dept.label;
  const country = EUROPEAN_COUNTRIES.find(c => c.value === value);
  if (country) return country.label;
  return value;
};

export default function BuyerForm({
  formData,
  onFormChange,
  onSubmit,
  onPreviewPublish,
  saving,
  language,
  t,
  user,
  editingId
}) {
  const [locationInput, setLocationInput] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const publishToastRef = useRef(null);
  const publishToastTimerRef = useRef(null);
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

  const handleChange = (field, value) => {
    const nextValue = field === 'title' && typeof value === 'string'
      ? value.slice(0, TITLE_MAX_LENGTH)
      : value;
    onFormChange({ ...formData, [field]: nextValue });
  };

  const addLocation = (value) => {
    if (value && !formData.buyer_locations.includes(value)) {
      handleChange('buyer_locations', [...formData.buyer_locations, value]);
      setLocationInput('');
      setShowLocationDropdown(false);
    }
  };

  const removeLocation = (value) => {
    handleChange('buyer_locations', formData.buyer_locations.filter(loc => loc !== value));
  };

  const handleDocumentUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingDocument(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleChange('buyer_document_url', file_url);
      handleChange('buyer_document_name', file.name);
    } catch (error) {
      console.error('Error uploading document:', error);
      alert(language === 'fr' ? 'Erreur lors du téléchargement' : 'Error uploading document');
    } finally {
      setUploadingDocument(false);
    }
  };

  const removeDocument = () => {
    handleChange('buyer_document_url', '');
    handleChange('buyer_document_name', '');
  };

  useEffect(() => () => {
    clearPublishToast();
  }, []);

  // Filter locations based on input
  const getFilteredLocations = () => {
    if (!locationInput.trim()) {
      return [];
    }
    const searchTerm = locationInput.toLowerCase();
    const depts = FRENCH_DEPARTMENTS.filter(dept => 
      dept.label.toLowerCase().includes(searchTerm) && 
      !formData.buyer_locations.includes(dept.value)
    ).slice(0, 5);
    
    const countries = EUROPEAN_COUNTRIES.filter(country => 
      country.label.toLowerCase().includes(searchTerm) &&
      !formData.buyer_locations.includes(country.value)
    ).slice(0, 5);
    
    return [...depts, ...countries];
  };

  const filteredLocations = getFilteredLocations();

  const withTooltip = (label, hint) => (
    <div className="flex items-center gap-1.5">
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
        <TooltipContent>{hint}</TooltipContent>
      </Tooltip>
    </div>
  );

  // Auto-generate default image based on first selected sector
  useEffect(() => {
    if (formData.buyer_sectors_interested && formData.buyer_sectors_interested.length > 0) {
      const firstSector = formData.buyer_sectors_interested[0];
      const defaultImageUrl = getDefaultImageForSector(firstSector);
      
      // Only set default if no custom image is uploaded
      const hasCustomImage = formData.buyer_image && formData.buyer_image.some(img => !img.isDefault);
      if (!hasCustomImage) {
        handleChange('buyer_image', [
          {
            url: defaultImageUrl,
            isDefault: true
          }
        ]);
      }
    }
  }, [formData.buyer_sectors_interested]);

  return (
    <TooltipProvider delayDuration={120}>
      <div className="w-full flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
          <div className="space-y-4 md:space-y-6">
            {/* Main Form */}
            <div className="space-y-4 md:space-y-6">
            {/* Basic Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              {language === 'fr' ? 'Informations générale' : 'General Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label><span className="text-red-500">*</span> {t('title')}</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder={language === 'fr' ? 'Ex: Cherche entreprise tech ou restaurant' : 'Ex: Looking for tech or restaurant business'}
                className="mt-2"
                maxLength={TITLE_MAX_LENGTH}
                required
              />
              <p className="text-[11px] text-gray-500 mt-1 text-right">
                {(formData.title || '').length}/{TITLE_MAX_LENGTH}
              </p>
            </div>

            <div>
              <Label>{withTooltip(<><span className="text-red-500">*</span> {t('description')}</>, language === 'fr' ? 'Présentez votre profil et objectifs de reprise.' : 'Describe your buyer profile and objectives.')}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder={language === 'fr' ? 'Décrivez votre profil et vos objectifs...' : 'Describe your profile and objectives...'}
                className="mt-2 min-h-32"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">
              {language === 'fr' ? 'Budget' : 'Budget'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>{withTooltip(language === 'fr' ? 'Budget minimum (€)' : 'Minimum Budget (€)', language === 'fr' ? 'Montant minimal envisagé pour l’opération.' : 'Minimum expected budget for the deal.')}</Label>
                <Input
                  type="number"
                  value={formData.buyer_budget_min}
                  onChange={(e) => handleChange('buyer_budget_min', e.target.value)}
                  placeholder="100000"
                  className="mt-2 font-mono"
                />
              </div>
              <div>
                <Label>{withTooltip(language === 'fr' ? 'Budget maximum (€)' : 'Maximum Budget (€)', language === 'fr' ? 'Montant maximal cible pour l’opération.' : 'Maximum target budget for the deal.')}</Label>
                <Input
                  type="number"
                  value={formData.buyer_budget_max}
                  onChange={(e) => handleChange('buyer_budget_max', e.target.value)}
                  placeholder="1000000"
                  className="mt-2 font-mono"
                />
              </div>
            </div>
            <div>
              <Label>{withTooltip(language === 'fr' ? 'Financement disponible (€)' : 'Investment Available (€)', language === 'fr' ? 'Capacité de financement mobilisable rapidement.' : 'Funding capacity available quickly.')}</Label>
              <Input
                type="number"
                value={formData.buyer_investment_available}
                onChange={(e) => handleChange('buyer_investment_available', e.target.value)}
                placeholder="500000"
                className="mt-2 font-mono"
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Criteria */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">
              <span className="text-red-500">*</span> {language === 'fr' ? 'Critères de recherche' : 'Search Criteria'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{withTooltip(<><span className="text-red-500">*</span> {language === 'fr' ? 'Secteurs d\'intérêt' : 'Interested Sectors'}</>, language === 'fr' ? 'Sélectionnez les secteurs cibles.' : 'Select your target sectors.')}</Label>
              <div className="grid grid-cols-2 gap-2">
                {SECTORS.map(sector => (
                  <label key={sector} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.buyer_sectors_interested.includes(sector)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleChange('buyer_sectors_interested', [...formData.buyer_sectors_interested, sector]);
                        } else {
                          handleChange('buyer_sectors_interested', formData.buyer_sectors_interested.filter(s => s !== sector));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{t(sector)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>{withTooltip(<><span className="text-red-500">*</span> {language === 'fr' ? 'Type de Cession recherché' : 'Business Type Sought'}</>, language === 'fr' ? 'Type d’actif que vous souhaitez acquérir.' : 'Type of asset you seek to acquire.')}</Label>
              <Select value={formData.business_type_sought} onValueChange={(v) => handleChange('business_type_sought', v)}>
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

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>{withTooltip(language === 'fr' ? 'CA minimum (€)' : 'Minimum Revenue (€)', language === 'fr' ? 'Seuil minimal de chiffre d’affaires recherché.' : 'Minimum revenue threshold desired.')}</Label>
                <Input
                  type="number"
                  value={formData.buyer_revenue_min}
                  onChange={(e) => handleChange('buyer_revenue_min', e.target.value)}
                  placeholder="500000"
                  className="mt-2 font-mono"
                />
              </div>
              <div>
                <Label>{withTooltip(language === 'fr' ? 'CA maximum (€)' : 'Maximum Revenue (€)', language === 'fr' ? 'Seuil maximal de chiffre d’affaires recherché.' : 'Maximum revenue threshold desired.')}</Label>
                <Input
                  type="number"
                  value={formData.buyer_revenue_max}
                  onChange={(e) => handleChange('buyer_revenue_max', e.target.value)}
                  placeholder="5000000"
                  className="mt-2 font-mono"
                />
              </div>
              <div>
                <Label>{withTooltip(language === 'fr' ? 'Nombre d\'employés min' : 'Minimum Employees', language === 'fr' ? 'Taille d’équipe minimale.' : 'Minimum team size.')}</Label>
                <Input
                  type="number"
                  value={formData.buyer_employees_min}
                  onChange={(e) => handleChange('buyer_employees_min', e.target.value)}
                  placeholder="5"
                  className="mt-2 font-mono"
                />
              </div>
              <div>
                <Label>{withTooltip(language === 'fr' ? 'Nombre d\'employés max' : 'Maximum Employees', language === 'fr' ? 'Taille d’équipe maximale.' : 'Maximum team size.')}</Label>
                <Input
                  type="number"
                  value={formData.buyer_employees_max}
                  onChange={(e) => handleChange('buyer_employees_max', e.target.value)}
                  placeholder="50"
                  className="mt-2 font-mono"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buyer Profile */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">
              {language === 'fr' ? 'Profil d\'acheteur' : 'Buyer Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{withTooltip(<><span className="text-red-500">*</span> {language === 'fr' ? 'Type de profil' : 'Profile Type'}</>, language === 'fr' ? 'Votre posture d’acquéreur.' : 'Your acquisition profile.')}</Label>
              <Select value={formData.buyer_profile_type} onValueChange={(v) => handleChange('buyer_profile_type', v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={language === 'fr' ? 'Sélectionner' : 'Select'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">{language === 'fr' ? 'Reprise personnelle' : 'Individual Buyout'}</SelectItem>
                  <SelectItem value="investor">{language === 'fr' ? 'Investisseur' : 'Investor'}</SelectItem>
                  <SelectItem value="pe_fund">{language === 'fr' ? 'Fonds de capital-investissement' : 'PE Fund'}</SelectItem>
                  <SelectItem value="company">{language === 'fr' ? 'Entreprise' : 'Company'}</SelectItem>
                  <SelectItem value="other">{language === 'fr' ? 'Autre' : 'Other'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Label>{withTooltip(<><span className="text-red-500">*</span> {language === 'fr' ? 'Lieux d\'intérêt' : 'Interested Locations'}</>, language === 'fr' ? 'Zones géographiques cibles.' : 'Target geographic areas.')}</Label>
              <Input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onFocus={() => setShowLocationDropdown(true)}
                placeholder={language === 'fr' ? 'Tapez un département ou un pays (ex: 75, Paris, France)' : 'Type a department or country (ex: 75, Paris, France)'}
                className="mt-2"
              />
              
              {/* Autocomplete Dropdown */}
              {showLocationDropdown && locationInput.trim() && filteredLocations.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {filteredLocations.map((item, idx) => (
                    <button
                      key={`${item.value}-${idx}`}
                      onClick={() => addLocation(item.value)}
                      className="w-full text-left px-4 py-2.5 hover:bg-primary/5 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-sm text-gray-900">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Display selected locations */}
              {formData.buyer_locations && formData.buyer_locations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.buyer_locations.map(loc => (
                    <div
                      key={loc}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {getLocationLabel(loc)}
                      <button
                        onClick={() => removeLocation(loc)}
                        className="ml-1 hover:text-primary/60"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>{withTooltip(language === 'fr' ? 'Notes et critères additionnels' : 'Additional Notes & Criteria', language === 'fr' ? 'Ajoutez vos préférences fines pour améliorer le matching.' : 'Add detailed preferences to improve matching.')}</Label>
              <Textarea
                value={formData.buyer_notes}
                onChange={(e) => handleChange('buyer_notes', e.target.value)}
                placeholder={language === 'fr' ? 'Décrivez vos préférences d\'acquisition, points d\'importance...' : 'Describe your acquisition preferences, important points...'}
                className="mt-2 min-h-32"
              />
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload - Single Photo */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">
              {language === 'fr' ? 'Photo de Profil' : 'Profile Photo'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageGallery
              images={formData.buyer_image || []}
              onImagesChange={(images) => handleChange('buyer_image', images)}
              maxPhotos={1}
              defaultImage={formData.buyer_sectors_interested && formData.buyer_sectors_interested.length > 0 ? getDefaultImageForSector(formData.buyer_sectors_interested[0]) : ''}
              sectorLabel={formData.buyer_sectors_interested && formData.buyer_sectors_interested.length > 0 ? formData.buyer_sectors_interested[0] : ''}
              userEmail={user?.email}
              language={language}
            />
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">
              {language === 'fr' ? 'Document (CV ou autre)' : 'Document (CV or other)'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.buyer_document_url ? (
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <a
                  href={formData.buyer_document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {formData.buyer_document_name || (language === 'fr' ? 'Document joint' : 'Attached document')}
                  </span>
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeDocument}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex items-center gap-2 text-primary hover:text-primary/80 cursor-pointer">
                {uploadingDocument ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{language === 'fr' ? 'Uploader un document' : 'Upload a document'}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentUpload}
                  disabled={uploadingDocument}
                  className="hidden"
                />
              </label>
            )}
            <p className="text-xs text-gray-500">
              {language === 'fr'
                ? 'Formats acceptés : PDF, DOC, DOCX.'
                : 'Accepted formats: PDF, DOC, DOCX.'}
            </p>
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
