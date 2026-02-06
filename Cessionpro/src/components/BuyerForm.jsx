import React from 'react';
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
import { Save, Send, Loader2, Search } from 'lucide-react';

const SECTORS = ['technology', 'retail', 'hospitality', 'manufacturing', 'services', 'healthcare', 'construction', 'transport', 'agriculture', 'other'];
const BUSINESS_TYPES = ['entreprise', 'fond_de_commerce', 'franchise'];

export default function BuyerForm({
  formData,
  onFormChange,
  onSubmit,
  saving,
  language,
  t
}) {
  const handleChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
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
              <Search className="w-5 h-5 text-primary" />
              {language === 'fr' ? 'Informations générale' : 'General Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>{t('title')} *</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder={language === 'fr' ? 'Ex: Cherche entreprise tech ou restaurant' : 'Ex: Looking for tech or restaurant business'}
                className="mt-2"
              />
            </div>

            <div>
              <Label>{t('description')}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder={language === 'fr' ? 'Décrivez votre profil et vos objectifs...' : 'Describe your profile and objectives...'}
                className="mt-2 min-h-32"
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
                <Label>{language === 'fr' ? 'Budget minimum (€)' : 'Minimum Budget (€)'}</Label>
                <Input
                  type="number"
                  value={formData.buyer_budget_min}
                  onChange={(e) => handleChange('buyer_budget_min', e.target.value)}
                  placeholder="100000"
                  className="mt-2 font-mono"
                />
              </div>
              <div>
                <Label>{language === 'fr' ? 'Budget maximum (€)' : 'Maximum Budget (€)'}</Label>
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
              <Label>{language === 'fr' ? 'Financement disponible (€)' : 'Investment Available (€)'}</Label>
              <Input
                type="number"
                value={formData.buyer_investment_available}
                onChange={(e) => handleChange('buyer_investment_available', e.target.value)}
                placeholder="500000"
                className="mt-2 font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                {language === 'fr' ? 'Montant que vous pouvez investir immédiatement' : 'Amount you can invest immediately'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Business Criteria */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">
              {language === 'fr' ? 'Critères de recherche' : 'Search Criteria'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{language === 'fr' ? 'Secteurs d\'intérêt' : 'Interested Sectors'}</Label>
              <p className="text-xs text-gray-500 mb-2">
                {language === 'fr' ? 'Sélectionnez les secteurs' : 'Select sectors of interest'}
              </p>
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
              <Label>{language === 'fr' ? 'Type de Cession recherché' : 'Business Type Sought'}</Label>
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
                <Label>{language === 'fr' ? 'CA minimum (€)' : 'Minimum Revenue (€)'}</Label>
                <Input
                  type="number"
                  value={formData.buyer_revenue_min}
                  onChange={(e) => handleChange('buyer_revenue_min', e.target.value)}
                  placeholder="500000"
                  className="mt-2 font-mono"
                />
              </div>
              <div>
                <Label>{language === 'fr' ? 'CA maximum (€)' : 'Maximum Revenue (€)'}</Label>
                <Input
                  type="number"
                  value={formData.buyer_revenue_max}
                  onChange={(e) => handleChange('buyer_revenue_max', e.target.value)}
                  placeholder="5000000"
                  className="mt-2 font-mono"
                />
              </div>
              <div>
                <Label>{language === 'fr' ? 'Nombre d\'employés min' : 'Minimum Employees'}</Label>
                <Input
                  type="number"
                  value={formData.buyer_employees_min}
                  onChange={(e) => handleChange('buyer_employees_min', e.target.value)}
                  placeholder="5"
                  className="mt-2 font-mono"
                />
              </div>
              <div>
                <Label>{language === 'fr' ? 'Nombre d\'employés max' : 'Maximum Employees'}</Label>
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
              <Label>{language === 'fr' ? 'Type de profil' : 'Profile Type'}</Label>
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

            <div>
              <Label>{language === 'fr' ? 'Lieux d\'intérêt' : 'Interested Locations'}</Label>
              <Input
                value={formData.buyer_locations.join(', ')}
                onChange={(e) => handleChange('buyer_locations', e.target.value.split(',').map(l => l.trim()).filter(l => l))}
                placeholder={language === 'fr' ? 'Ex: Paris, Lyon, Marseille' : 'Ex: Paris, Lyon, Marseille'}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                {language === 'fr' ? 'Séparées par des virgules' : 'Separated by commas'}
              </p>
            </div>

            <div>
              <Label>{language === 'fr' ? 'Notes et critères additionnels' : 'Additional Notes & Criteria'}</Label>
              <Textarea
                value={formData.buyer_notes}
                onChange={(e) => handleChange('buyer_notes', e.target.value)}
                placeholder={language === 'fr' ? 'Décrivez vos préférences d\'acquisition, points d\'importance...' : 'Describe your acquisition preferences, important points...'}
                className="mt-2 min-h-32"
              />
            </div>
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
