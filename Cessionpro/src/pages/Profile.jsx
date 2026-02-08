import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  User, 
  Building2, 
  Phone, 
  MapPin,
  Save,
  Loader2,
  X,
  Plus,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DicebearAvatar } from '@/components/messages/DicebearAvatar';

const SECTORS = ['technology', 'retail', 'hospitality', 'manufacturing', 'services', 'healthcare', 'construction', 'transport', 'agriculture', 'other'];

export default function Profile() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    user_type: 'buyer',
    first_name: '',
    last_name: '',
    company_name: '',
    phone: '',
    bio: '',
    location: '',
    avatar_url: '',
    sectors_interest: [],
    budget_min: '',
    budget_max: '',
    experience: '',
    visible_in_directory: true,
    preferred_language: 'fr',
    notification_emails_enabled: true
  });

  useEffect(() => {
    loadUser();
  }, [user]);

  const loadUser = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setFormData({
        user_type: user.user_type || 'buyer',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        company_name: user.company_name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        avatar_url: user.avatar_url || '',
        sectors_interest: user.sectors_interest || [],
        budget_min: user.budget_min?.toString() || '',
        budget_max: user.budget_max?.toString() || '',
        experience: user.experience || '',
        visible_in_directory: user.visible_in_directory !== false,
        preferred_language: user.preferred_language || 'fr',
        notification_emails_enabled: user.notification_emails_enabled !== false
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const toggleSector = (sector) => {
    const current = formData.sectors_interest;
    if (current.includes(sector)) {
      handleChange('sectors_interest', current.filter(s => s !== sector));
    } else {
      handleChange('sectors_interest', [...current, sector]);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleChange('avatar_url', file_url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = {
        ...formData,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        role: formData.user_type, // Map user_type to role field
      };

      console.log('Saving profile data:', data);
      await base44.auth.updateMe(data);
      setSaved(true);
      console.log('Profile saved successfully');
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('Error saving profile:', e);
      alert(language === 'fr' ? 'Erreur lors de la sauvegarde du profil' : 'Error saving profile');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isBuyer = formData.user_type === 'buyer' || formData.user_type === 'both';

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
            {t('edit_profile')}
          </h1>
        </div>

        <div className="space-y-6">
          {/* Avatar & Basic Info */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <DicebearAvatar 
                    email={user?.email} 
                    name={user?.full_name} 
                    size="xxl"
                    className="shadow-md"
                  />
                  <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-gray-900">
                    {user?.full_name}
                  </h2>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>{language === 'fr' ? 'Type de profil' : 'Profile type'}</Label>
                  <Select value={formData.user_type} onValueChange={(v) => handleChange('user_type', v)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">{t('buyer')}</SelectItem>
                      <SelectItem value="seller">{t('seller')}</SelectItem>
                      <SelectItem value="both">{t('both')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{language === 'fr' ? 'Langue préférée' : 'Preferred language'}</Label>
                  <Select value={formData.preferred_language} onValueChange={(v) => handleChange('preferred_language', v)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {language === 'fr' ? 'Informations de contact' : 'Contact Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>{t('company_name')}</Label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    placeholder={language === 'fr' ? 'Nom de votre société' : 'Your company name'}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>{t('phone')}</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>{t('location')}</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder={language === 'fr' ? 'Ville, Région' : 'City, Region'}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>{t('bio')}</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder={language === 'fr' ? 'Présentez-vous en quelques mots...' : 'Tell us about yourself...'}
                  className="mt-2 min-h-24"
                />
              </div>

              <div>
                <Label>{t('experience')}</Label>
                <Textarea
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  placeholder={language === 'fr' ? 'Décrivez votre expérience professionnelle...' : 'Describe your professional experience...'}
                  className="mt-2 min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          {/* Buyer Preferences */}
          {isBuyer && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  {language === 'fr' ? 'Critères de recherche' : 'Search Criteria'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>{t('budget_range')} (€)</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Input
                        type="number"
                        value={formData.budget_min}
                        onChange={(e) => handleChange('budget_min', e.target.value)}
                        placeholder="Min"
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={formData.budget_max}
                        onChange={(e) => handleChange('budget_max', e.target.value)}
                        placeholder="Max"
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">{t('sectors_interest')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {SECTORS.map(sector => (
                      <button
                        key={sector}
                        onClick={() => toggleSector(sector)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          formData.sectors_interest.includes(sector)
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {t(sector)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{t('visible_directory')}</p>
                    <p className="text-sm text-gray-500">
                      {language === 'fr' 
                        ? "Votre profil sera visible dans l'annuaire des repreneurs" 
                        : 'Your profile will be visible in the buyers directory'}
                    </p>
                  </div>
                  <Switch
                    checked={formData.visible_in_directory}
                    onCheckedChange={(v) => handleChange('visible_in_directory', v)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Messaging Settings */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-transparent">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                📧 {language === 'fr' ? 'Paramètres Messagerie' : 'Messaging Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl backdrop-blur-sm">
                <div>
                  <p className="font-medium text-gray-900">
                    {language === 'fr' ? 'Notifications par Email' : 'Email Notifications'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {language === 'fr' 
                      ? 'Recevoir un digest des messages toutes les 10 minutes' 
                      : 'Receive message digest every 10 minutes'}
                  </p>
                </div>
                <Switch
                  checked={formData.notification_emails_enabled}
                  onCheckedChange={(v) => handleChange('notification_emails_enabled', v)}
                />
              </div>
              {!formData.notification_emails_enabled && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800"
                >
                  {language === 'fr' 
                    ? '🔕 Les notifications email sont désactivées' 
                    : '🔕 Email notifications are disabled'}
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 min-w-40"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saved 
                ? (language === 'fr' ? 'Enregistré !' : 'Saved!') 
                : t('save')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}