import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { supabase } from '@/api/supabaseClient';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { getProfile, updateProfile, updateBuyerProfile, updateSellerProfile } from '@/services/profileService';
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
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DicebearAvatar } from '@/components/messages/DicebearAvatar';
import { resizeLogo, validateLogoFile, createPreviewUrl, revokePreviewUrl } from '@/utils/logoResizer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const SECTORS = ['technology', 'retail', 'hospitality', 'manufacturing', 'services', 'healthcare', 'construction', 'transport', 'agriculture', 'other'];

export default function Profile() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  // Logo processing states
  const [logoPreview, setLogoPreview] = useState(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [logoError, setLogoError] = useState(null);
  const [processingLogo, setProcessingLogo] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    company_name: '',
    phone: '',
    bio: '',
    location: '',
    avatar_url: '',
    logo_url: '',
    sectors_interest: [],
    budget_min: '',
    budget_max: '',
    experience: '',
    linkedin_url: '',
    message_vendeurs: '',
    visible_in_directory: true,
    preferred_language: 'fr',
    notification_emails_enabled: true,
    is_buyer: false,
    is_seller: false,
    user_type: 'buyer'
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
      // Load from Supabase profileService
      const profile = await getProfile(user.id);
      setProfileData(profile);
      
      // Determine user_type for dropdown based on is_buyer and is_seller
      let userType = 'buyer';
      if (profile.is_buyer && profile.is_seller) {
        userType = 'both';
      } else if (profile.is_seller) {
        userType = 'seller';
      } else {
        userType = 'buyer';
      }

      setFormData({
        email: profile.email || user?.email || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        company_name: profile.company_name || '',
        phone: profile.phone || '',
        bio: profile.aide_vendeur_description || profile.bio || '',
        location: profile.location || '',
        avatar_url: profile.avatar_url || '',
        logo_url: profile.logo_url || profile.avatar_url || '',
        sectors_interest: Array.isArray(profile.sectors) ? profile.sectors : [],
        budget_min: profile.budget_min?.toString() || '',
        budget_max: profile.budget_max?.toString() || '',
        experience: profile.experience_professionnelle || profile.experience || '',
        linkedin_url: profile.linkedin_url || '',
        message_vendeurs: profile.message_vendeurs || '',
        visible_in_directory: profile.visible_in_directory !== false,
        preferred_language: profile.preferred_language || 'fr',
        notification_emails_enabled: profile.notification_emails_enabled !== false,
        is_buyer: profile.is_buyer || false,
        is_seller: profile.is_seller || false,
        user_type: userType
      });
    } catch (e) {
      console.error('Error loading profile:', e);
      // Fallback to base44 if needed
      try {
        if (user) {
          setFormData({
            email: user.email || '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            company_name: user.company_name || '',
            phone: user.phone || '',
            bio: user.bio || '',
            location: user.location || '',
            avatar_url: user.avatar_url || '',
            logo_url: user.avatar_url || '',
            sectors_interest: user.sectors_interest || [],
            budget_min: user.budget_min?.toString() || '',
            budget_max: user.budget_max?.toString() || '',
            experience: user.experience || '',
            linkedin_url: user.linkedin_url || '',
            message_vendeurs: user.message_vendeurs || '',
            visible_in_directory: user.visible_in_directory !== false,
            preferred_language: user.preferred_language || 'fr',
            notification_emails_enabled: user.notification_emails_enabled !== false,
            is_buyer: true,
            is_seller: false,
            user_type: 'buyer'
          });
        }
      } catch (err) {
        console.error('Fallback error:', err);
      }
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    // Special handling for user_type dropdown to set is_buyer and is_seller
    if (field === 'user_type') {
      const isBuyer = value === 'buyer' || value === 'both';
      const isSeller = value === 'seller' || value === 'both';
      setFormData(prev => ({ 
        ...prev, 
        user_type: value,
        is_buyer: isBuyer,
        is_seller: isSeller
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
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
    
    setLogoError(null);
    setProcessingLogo(true);
    
    try {
      // Validate file
      const validation = validateLogoFile(file);
      if (!validation.valid) {
        setLogoError(validation.error);
        setProcessingLogo(false);
        return;
      }
      
      // Resize logo
      const resizeResult = await resizeLogo(file);
      
      // Create preview URL from blob
      const previewUrl = createPreviewUrl(resizeResult.blob);
      
      // Store preview for modal
      setLogoPreview({
        url: previewUrl,
        blob: resizeResult.blob,
        width: resizeResult.width,
        height: resizeResult.height
      });
      
      // Show modal
      setShowLogoModal(true);
      setProcessingLogo(false);
      
    } catch (error) {
      console.error('Error processing logo:', error);
      setLogoError(language === 'fr' 
        ? 'Erreur lors du traitement de l\'image' 
        : 'Error processing image');
      setProcessingLogo(false);
    }
  };

  const uploadResizedLogo = async () => {
    if (!logoPreview) return;
    
    setProcessingLogo(true);
    try {
      // Create a proper File from blob
      const file = new File([logoPreview.blob], 'logo.webp', { type: 'image/webp' });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      handleChange('avatar_url', file_url);
      handleChange('logo_url', file_url);
      
      // Clean up
      revokePreviewUrl(logoPreview.url);
      setLogoPreview(null);
      setShowLogoModal(false);
      setLogoError(null);
      
    } catch (error) {
      console.error('Error uploading logo:', error);
      setLogoError(language === 'fr' 
        ? 'Erreur lors de l\'upload' 
        : 'Error uploading image');
    } finally {
      setProcessingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    setProcessingLogo(true);
    try {
      handleChange('avatar_url', '');
      handleChange('logo_url', '');
      await updateProfile(user.id, { avatar_url: null, logo_url: null });
      await base44.auth.updateMe({ avatar_url: null });
      await supabase
        .from('business_logos')
        .update({ logo_url: null })
        .eq('seller_id', user.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error removing logo:', error);
      alert(language === 'fr' ? 'Erreur lors de la suppression du logo' : 'Error removing logo');
    } finally {
      setProcessingLogo(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // First, save the profile with all fields
      const profileUpdateData = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        company_name: formData.company_name,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        avatar_url: formData.avatar_url,
        logo_url: formData.logo_url || formData.avatar_url || null,
        sectors: formData.sectors_interest,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        experience_professionnelle: formData.experience,
        linkedin_url: formData.linkedin_url,
        aide_vendeur_description: formData.bio,
        is_buyer: formData.is_buyer,
        is_seller: formData.is_seller
      };

      // Update via Supabase profileService
      await updateProfile(user.id, profileUpdateData);
      console.log('Updating profile: ', profileUpdateData);

      const data = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        company_name: formData.company_name,
        sectors: formData.sectors_interest,
        profile_type: formData.user_type,
        transaction_size: formData.budget_max,
        motivation_reprise: formData.bio,
        experience_professionnelle: formData.experience,
        linkedin_url: '',
        aideVendeurDescription: formData.bio
      };

      // Update based on roles
      if (formData.is_buyer) {
        await updateBuyerProfile(user.id, {
          ...data,
          firstName: formData.first_name,
          lastName: formData.last_name,
          budgetMin: formData.budget_min,
          budgetMax: formData.budget_max,
          motivationReprise: formData.bio,
          experienceProfessionnelle: formData.experience
        });
      }

      if (formData.is_seller) {
        await updateSellerProfile(user.id, {
          firstName: formData.first_name,
          lastName: formData.last_name,
          companyName: formData.company_name,
          phone: formData.phone,
          profileType: formData.user_type,
          transactionSize: formData.budget_max
        });
      }

      // Also save via base44 for compatibility
      const base44Data = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        company_name: formData.company_name,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        avatar_url: formData.avatar_url,
        sectors_interest: formData.sectors_interest,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
        experience: formData.experience,
        visible_in_directory: formData.visible_in_directory,
        preferred_language: formData.preferred_language,
        notification_emails_enabled: formData.notification_emails_enabled,
        user_type: formData.user_type,
        role: formData.user_type
      };

      await base44.auth.updateMe(base44Data);
      
      setSaved(true);
      console.log('Profile saved successfully');
      setTimeout(() => setSaved(false), 3000);
      
      // Reload profile
      await loadUser();
    } catch (e) {
      console.error('Error saving profile:', e);
      alert(language === 'fr' ? 'Erreur lors de la sauvegarde du profil' : 'Error saving profile');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="py-10 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isBuyer = formData.is_buyer;
  const isSeller = formData.is_seller;

  return (
    <div className="py-4 lg:py-6">
      <div className="max-w-3xl mx-auto px-0 sm:px-2 lg:px-4">
        <div className="space-y-6">
          {/* Logo Entreprise & Basic Info */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  {formData.avatar_url ? (
                    <img 
                      src={formData.logo_url || formData.avatar_url}
                      alt="Logo"
                      className="w-24 h-24 rounded-xl object-cover shadow-md bg-gray-100"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gray-200 flex items-center justify-center shadow-md">
                      <Building2 className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  {formData.avatar_url && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      disabled={processingLogo}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-gray-500 hover:text-gray-700"
                      aria-label={language === 'fr' ? 'Supprimer le logo' : 'Remove logo'}
                      title={language === 'fr' ? 'Supprimer le logo' : 'Remove logo'}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
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
                <div className="flex-1">
                  <h2 className="font-display text-xl font-semibold text-gray-900">
                    {formData.first_name} {formData.last_name}
                  </h2>
                  <p className="text-gray-600 text-sm font-medium">{formData.company_name}</p>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>{language === 'fr' ? 'Type de profil' : 'Profile type'}</Label>
                  <Select value={formData.user_type || 'buyer'} onValueChange={(v) => handleChange('user_type', v)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">{t('buyer')}</SelectItem>
                      <SelectItem value="seller">{t('seller')}</SelectItem>
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
                  <Label>{language === 'fr' ? 'Prénom' : 'First Name'}</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    placeholder={language === 'fr' ? 'Jean' : 'John'}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>{language === 'fr' ? 'Nom' : 'Last Name'}</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    placeholder={language === 'fr' ? 'Dupont' : 'Smith'}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="vous@exemple.com"
                  className="mt-2"
                />
              </div>

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
                  {language === 'fr' ? 'Critères de recherche Acheteur' : 'Buyer Search Criteria'}
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

                <div>
                  <Label>{language === 'fr' ? 'URL LinkedIn' : 'LinkedIn URL'}</Label>
                  <Input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/vous"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>{language === 'fr' ? 'Message personnalisé pour vendeurs' : 'Personalized message for sellers'}</Label>
                  <Textarea
                    value={formData.message_vendeurs}
                    onChange={(e) => handleChange('message_vendeurs', e.target.value)}
                    placeholder={language === 'fr' 
                      ? 'Laissez un message que les vendeurs verront quand ils consultent votre profil...' 
                      : 'Leave a message that sellers will see when viewing your profile...'}
                    className="mt-2 min-h-20"
                  />
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
                      ? 'Recevoir une notification par email' 
                      : 'Receive email notification'}
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

          {/* Error Message */}
          {logoError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              {logoError}
            </motion.div>
          )}
        </div>
      </div>

      {/* Logo Preview Modal */}
      <Dialog open={showLogoModal} onOpenChange={setShowLogoModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {language === 'fr' ? 'Aperçu du logo' : 'Logo Preview'}
            </DialogTitle>
          </DialogHeader>

          {logoPreview && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={logoPreview.url}
                  alt="Logo preview"
                  className="max-h-64 max-w-full rounded-lg shadow-md"
                />
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>{logoPreview.width}x{logoPreview.height}px</p>
              </div>

              <Button
                onClick={uploadResizedLogo}
                disabled={processingLogo}
                className="w-full bg-gradient-to-r from-primary to-blue-600"
              >
                {processingLogo ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === 'fr' ? 'Upload...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {language === 'fr' ? 'Confirmer' : 'Confirm'}
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
