// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { getProfile, updateProfile, updateBuyerProfile, updateSellerProfile } from '@/services/profileService';
import {
  DEFAULT_SMART_MATCHING_ALERTS,
  getSmartMatchingAlertFrequencyLabel,
  getSmartMatchingAlertPreferences,
} from '@/services/smartMatchingNotificationService';
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
  User, 
  Building2,
  Save,
  Loader2,
  X,
  Camera,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { resizeLogo, validateLogoFile, createPreviewUrl, revokePreviewUrl } from '@/utils/logoResizer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Profile() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [smartMatchingAlerts, setSmartMatchingAlerts] = useState(DEFAULT_SMART_MATCHING_ALERTS);
  
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
    vat_number: '',
    phone: '',
    location: '',
    avatar_url: '',
    logo_url: '',
    linkedin_url: '',
    preferred_language: 'fr',
    show_real_identity: true,
    is_buyer: false,
    is_seller: false,
    user_type: 'buyer'
  });

  useEffect(() => {
    loadUser();
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    setSmartMatchingAlerts(getSmartMatchingAlertPreferences(user.id));
  }, [user?.id]);

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
        vat_number: profile.vat_number || '',
        phone: profile.phone || '',
        location: profile.location || '',
        avatar_url: profile.avatar_url || '',
        logo_url: profile.logo_url || profile.avatar_url || '',
        linkedin_url: profile.linkedin_url || '',
        preferred_language: profile.preferred_language || 'fr',
        show_real_identity: profile.show_real_identity !== false,
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
            vat_number: user.vat_number || '',
            phone: user.phone || '',
            location: user.location || '',
            avatar_url: user.avatar_url || '',
            logo_url: user.avatar_url || '',
            linkedin_url: user.linkedin_url || '',
            preferred_language: user.preferred_language || 'fr',
            show_real_identity: user.show_real_identity !== false,
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
      // Upload to Supabase Storage
      const file = new File([logoPreview.blob], 'logo.webp', { type: 'image/webp' });
      const fileName = `${Date.now()}_logo.webp`;
      const { data, error } = await supabase.storage
        .from('Cession')
        .upload(fileName, file);
      if (error) throw error;
      const { data: publicUrl } = supabase.storage
        .from('Cession')
        .getPublicUrl(data.path);
      const fileUrl = publicUrl.publicUrl;

      handleChange('avatar_url', fileUrl);
      handleChange('logo_url', fileUrl);
      
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
      await supabase.auth.updateUser({
        data: {
          avatar_url: null,
          logo_url: null
        }
      });
      await supabase
        .from('business_logos')
        .update({ logo_url: null })
        .eq('seller_id', user.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error removing logo:', error);
      toast({ title: language === 'fr' ? 'Erreur lors de la suppression du logo' : 'Error removing logo', variant: 'destructive' });
    } finally {
      setProcessingLogo(false);
    }
  };

  const handleSubmit = async () => {
    const companyName = String(formData.company_name || '').trim();
    const vatNumber = String(formData.vat_number || '').trim();

    if (companyName && !vatNumber) {
      toast({
        title: language === 'fr'
          ? 'Le numéro de TVA est obligatoire si le champ société est renseigné.'
          : 'VAT number is required when company name is provided.',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      // First, save the profile with all fields
      const profileUpdateData = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        company_name: formData.company_name,
        vat_number: vatNumber || null,
        phone: formData.phone,
        location: formData.location,
        avatar_url: formData.avatar_url,
        logo_url: formData.logo_url || formData.avatar_url || null,
        linkedin_url: formData.linkedin_url,
        is_buyer: formData.is_buyer,
        is_seller: formData.is_seller,
        show_real_identity: formData.show_real_identity
      };

      // Update via Supabase profileService
      await updateProfile(user.id, profileUpdateData);

      const data = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        company_name: formData.company_name,
        vat_number: vatNumber || null,
        profile_type: formData.user_type,
        linkedin_url: formData.linkedin_url
      };

      // Update based on roles
      if (formData.is_buyer) {
        await updateBuyerProfile(user.id, {
          ...data,
          firstName: formData.first_name,
          lastName: formData.last_name
        });
      }

      if (formData.is_seller) {
        await updateSellerProfile(user.id, {
          firstName: formData.first_name,
          lastName: formData.last_name,
          companyName: formData.company_name,
          vatNumber: vatNumber || null,
          phone: formData.phone,
          profileType: formData.user_type
        });
      }

      await supabase.auth.updateUser({
        data: {
          full_name: `${formData.first_name} ${formData.last_name}`.trim(),
          first_name: formData.first_name,
          last_name: formData.last_name,
          company_name: formData.company_name,
          vat_number: vatNumber || null,
          phone: formData.phone,
          profile_type: formData.user_type,
          avatar_url: formData.avatar_url,
          logo_url: formData.logo_url || formData.avatar_url || null,
          show_real_identity: formData.show_real_identity
        }
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Reload profile
      await loadUser();
    } catch (e) {
      console.error('Error saving profile:', e);
      toast({ title: language === 'fr' ? 'Erreur lors de la sauvegarde du profil' : 'Error saving profile', variant: 'destructive' });
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

  return (
    <div className="py-4 lg:py-6">
      <div className="w-full max-w-none mx-0 px-0 sm:px-1 lg:px-2">
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
                      className="w-24 h-24 rounded-xl object-cover shadow-md bg-muted"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center shadow-md">
                      <Building2 className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  {formData.avatar_url && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      disabled={processingLogo}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-muted-foreground hover:text-foreground"
                      aria-label={language === 'fr' ? 'Supprimer le logo' : 'Remove logo'}
                      title={language === 'fr' ? 'Supprimer le logo' : 'Remove logo'}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    {formData.first_name} {formData.last_name}
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">{formData.company_name}</p>
                  <p className="text-muted-foreground text-sm">{user?.email}</p>
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
              <CardTitle className="font-heading flex items-center gap-2">
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

              <div className="grid sm:grid-cols-3 gap-4">
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
                  <Label>{language === 'fr' ? 'N° TVA' : 'VAT Number'}</Label>
                  <Input
                    value={formData.vat_number}
                    onChange={(e) => handleChange('vat_number', e.target.value.toUpperCase())}
                    placeholder="FR12345678901"
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
                <Label>{language === 'fr' ? 'URL LinkedIn' : 'LinkedIn URL'}</Label>
                <Input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/vous"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Messaging Settings */}
          <Card className="border-0 shadow-sm bg-primary/5">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                📧 {language === 'fr' ? 'Paramètres Messagerie' : 'Messaging Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl backdrop-blur-sm mb-4">
                <div>
                  <p className="font-medium text-foreground">
                    {language === 'fr' ? 'Afficher mon identité' : 'Show my identity'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fr'
                      ? 'Nom/prénom ou société visibles lors des messages'
                      : 'Your name/company is shown when sending messages'}
                  </p>
                </div>
                <Switch
                  checked={formData.show_real_identity}
                  onCheckedChange={(v) => handleChange('show_real_identity', v)}
                />
              </div>
              <div className="mt-4 p-4 bg-white/60 rounded-xl border border-primary/20">
                <p className="font-medium text-foreground">
                  {language === 'fr' ? 'Notification Smart Matching' : 'Smart Matching notifications'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'fr'
                    ? `Fréquence actuelle : ${getSmartMatchingAlertFrequencyLabel(smartMatchingAlerts.frequency, language)}`
                    : `Current frequency: ${getSmartMatchingAlertFrequencyLabel(smartMatchingAlerts.frequency, language)}`}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3"
                  onClick={() => navigate('/Settings?tab=smartmatching-notifications')}
                >
                  {language === 'fr' ? 'Configurer dans Paramètres' : 'Configure in Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 min-w-40"
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
              className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive flex items-center gap-2"
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
            <DialogTitle className="font-heading">
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
              
              <div className="text-center text-sm text-muted-foreground">
                <p>{logoPreview.width}x{logoPreview.height}px</p>
              </div>

              <Button
                onClick={uploadResizedLogo}
                disabled={processingLogo}
                className="w-full bg-primary hover:bg-primary/90"
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
