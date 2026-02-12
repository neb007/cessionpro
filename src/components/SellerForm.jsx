import React, { useState, useEffect } from 'react';
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
import { X, Plus, Save, Send, Loader2, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FinancialYearsManager from '@/components/Financial/FinancialYearsManager';
import ImageGallery from '@/components/ImageGallery';
import PriceCalculator from '@/components/PriceCalculator';
import { getDefaultImageForSector } from '@/constants/defaultImages';
import { getRegionForFrenchCity } from '@/utils/frenchCitiesToRegions';
import { getDepartmentForFrenchCity } from '@/utils/frenchCitiesToDepartments';

const SECTORS = [
  'technology',
  'retail',
  'hospitality',
  'manufacturing',
  'services',
  'healthcare',
  'construction',
  'transport',
  'agriculture',
  'real_estate',
  'finance',
  'ecommerce',
  'beauty',
  'education',
  'events',
  'logistics',
  'food_beverage',
  'other'
];
const REASONS = ['retirement', 'new_project', 'health', 'relocation', 'other'];
const COUNTRIES = ['france', 'belgium', 'switzerland', 'luxembourg', 'germany', 'spain', 'italy', 'netherlands', 'portugal', 'other'];
const LEGAL_STRUCTURES = ['sarl', 'sas', 'sa', 'eurl', 'sasu', 'sci', 'snc', 'auto_entrepreneur', 'other'];
const BUSINESS_TYPES = ['entreprise', 'fond_de_commerce', 'franchise'];

export default function SellerForm({
  formData,
  onFormChange,
  onSubmit,
  saving,
  language,
  t,
  user,
  editingId
}) {
  const [newAsset, setNewAsset] = useState('');

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

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    
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

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
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
                  />
                </div>

                <div>
                  <Label>{t('description')}</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder={language === 'fr' ? 'Décrivez votre entreprise en détail...' : 'Describe your business in detail...'}
                    className="mt-2 min-h-32"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label><span className="text-red-500">*</span> {t('sector')}</Label>
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
                    <Label><span className="text-red-500">*</span> {language === 'fr' ? 'Type de Cession' : 'Business Type'}</Label>
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
                    <Label>{t('reason_for_sale')}</Label>
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
                </div>

                <div className="grid sm:grid-cols-4 gap-4">
                  <div>
                    <Label><span className="text-red-500">*</span> {t('location')}</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder={language === 'fr' ? 'Ville' : 'City'}
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label>{language === 'fr' ? 'Département' : 'Department'}</Label>
                    <Input
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      placeholder={language === 'fr' ? '75, 69, 13...' : '75, 69, 13...'}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>{language === 'fr' ? 'Région' : 'Region'}</Label>
                    <Input
                      value={formData.region}
                      onChange={(e) => handleChange('region', e.target.value)}
                      placeholder={language === 'fr' ? 'Île-de-France, Provence...' : 'Region name...'}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>{t('country')}</Label>
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
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                    <p className="text-sm text-amber-800">
                      {language === 'fr' 
                        ? 'Les informations financières ne peuvent pas être modifiées après la publication.' 
                        : 'Financial information cannot be modified after publication.'}
                    </p>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label><span className="text-red-500">*</span> {t('price')} (€)</Label>
                    <Input
                      type="number"
                      value={formData.asking_price}
                      onChange={(e) => handleChange('asking_price', e.target.value)}
                      placeholder="500000"
                      className="mt-2 font-mono"
                      required
                      disabled={!!editingId}
                    />
                  </div>

                  <div>
                    <Label>{t('annual_revenue')} (€)</Label>
                    <Input
                      type="number"
                      value={formData.annual_revenue}
                      onChange={(e) => handleChange('annual_revenue', e.target.value)}
                      placeholder="1000000"
                      className="mt-2 font-mono"
                      disabled={!!editingId}
                    />
                  </div>

                  <div>
                    <Label>EBITDA (€)</Label>
                    <Input
                      type="number"
                      value={formData.ebitda}
                      onChange={(e) => handleChange('ebitda', e.target.value)}
                      placeholder="200000"
                      className="mt-2 font-mono"
                      disabled={!!editingId}
                    />
                  </div>

                  <div>
                    <Label>{t('employees')}</Label>
                    <Input
                      type="number"
                      value={formData.employees}
                      onChange={(e) => handleChange('employees', e.target.value)}
                      placeholder="10"
                      className="mt-2 font-mono"
                      disabled={!!editingId}
                    />
                  </div>

                  <div>
                    <Label>{t('year_founded')}</Label>
                    <Input
                      type="number"
                      value={formData.year_founded}
                      onChange={(e) => handleChange('year_founded', e.target.value)}
                      placeholder="2010"
                      className="mt-2 font-mono"
                      disabled={!!editingId}
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
                    <Label>{language === 'fr' ? 'Structure juridique' : 'Legal Structure'}</Label>
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
                    <Label>{language === 'fr' ? 'Numéro SIREN/SIRET' : 'Registration Number'}</Label>
                    <Input
                      value={formData.registration_number}
                      onChange={(e) => handleChange('registration_number', e.target.value)}
                      placeholder="123 456 789 00012"
                      className="mt-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <Label>{language === 'fr' ? 'Baux commerciaux' : 'Commercial Leases'}</Label>
                  <Textarea
                    value={formData.lease_info}
                    onChange={(e) => handleChange('lease_info', e.target.value)}
                    placeholder={language === 'fr' ? 'Détails sur les baux (durée, loyer, conditions...)' : 'Lease details (duration, rent, conditions...)'}
                    className="mt-2 min-h-24"
                  />
                </div>

                <div>
                  <Label>{language === 'fr' ? 'Licences et autorisations' : 'Licenses & Permits'}</Label>
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
                  <Label>{language === 'fr' ? 'Positionnement sur le marché' : 'Market Position'}</Label>
                  <Textarea
                    value={formData.market_position}
                    onChange={(e) => handleChange('market_position', e.target.value)}
                    placeholder={language === 'fr' ? 'Décrivez la position de l\'entreprise sur son marché' : 'Describe the company\'s market position'}
                    className="mt-2 min-h-24"
                  />
                </div>

                <div>
                  <Label>{language === 'fr' ? 'Avantages concurrentiels' : 'Competitive Advantages'}</Label>
                  <Textarea
                    value={formData.competitive_advantages}
                    onChange={(e) => handleChange('competitive_advantages', e.target.value)}
                    placeholder={language === 'fr' ? 'Points forts et différenciateurs' : 'Key strengths and differentiators'}
                    className="mt-2 min-h-24"
                  />
                </div>

                <div>
                  <Label>{language === 'fr' ? 'Opportunités de développement' : 'Growth Opportunities'}</Label>
                  <Textarea
                    value={formData.growth_opportunities}
                    onChange={(e) => handleChange('growth_opportunities', e.target.value)}
                    placeholder={language === 'fr' ? 'Potentiel de croissance et axes de développement' : 'Growth potential and development opportunities'}
                    className="mt-2 min-h-24"
                  />
                </div>

                <div>
                  <Label>{language === 'fr' ? 'Description de la clientèle' : 'Customer Base'}</Label>
                  <Textarea
                    value={formData.customer_base}
                    onChange={(e) => handleChange('customer_base', e.target.value)}
                    placeholder={language === 'fr' ? 'Profil des clients, fidélité, diversification...' : 'Customer profile, loyalty, diversification...'}
                    className="mt-2 min-h-24"
                  />
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
                <CardTitle className="font-display">{t('upload_images')}</CardTitle>
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
                onClick={() => onSubmit('active')}
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
  );
}
