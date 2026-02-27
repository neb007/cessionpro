import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { supabase } from '@/api/supabaseClient';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AnnouncementTypeRadio from '@/components/AnnouncementTypeRadio';
import FormStepper from '@/components/FormStepper';
import CompletionChecklist from '@/components/CompletionChecklist';
import SellerForm from '@/components/SellerForm';
import BuyerForm from '@/components/BuyerForm';
import { useAutoSave } from '@/hooks/useAutoSave';
import { normalizeImageArray } from '@/utils/imageHelpers';
import { generateUniqueReference } from '@/utils/referenceGenerator';
import { computeListingCompletionScore } from '@/utils/listingCompletionScore';
import { getDefaultImageForSector } from '@/constants/defaultImages';

const TITLE_MAX_LENGTH = 55;

const BUSINESS_FIELDS_SUPPORTED = true;

const SALE_REQUIRED_FIELDS = ['title', 'sector', 'business_type', 'asking_price', 'location'];
const SALE_TRACKED_FIELDS = [
  'title',
  'description',
  'sector',
  'business_type',
  'reason_for_sale',
  'seller_business_type',
  'location',
  'department',
  'region',
  'country',
  'asking_price',
  'annual_revenue',
  'ebitda',
  'employees',
  'year_founded',
  'legal_structure',
  'registration_number',
  'lease_info',
  'licenses',
  'market_position',
  'competitive_advantages',
  'growth_opportunities',
  'customer_base',
  'cession_details',
  'surface_area',
  'financial_years',
  'assets_included',
  'images'
];

const BUYER_REQUIRED_FIELDS = [
  'title',
  'description',
  'buyer_sectors_interested',
  'business_type_sought',
  'buyer_profile_type',
  'buyer_locations'
];

const BUYER_TRACKED_FIELDS = [
  'title',
  'description',
  'buyer_budget_min',
  'buyer_budget_max',
  'buyer_investment_available',
  'buyer_sectors_interested',
  'business_type_sought',
  'buyer_revenue_min',
  'buyer_revenue_max',
  'buyer_employees_min',
  'buyer_employees_max',
  'buyer_profile_type',
  'buyer_locations',
  'buyer_notes',
  'buyer_image',
  'buyer_document_url'
];

const SELLER_STEPS = [
  { label: "L'essentiel" },
  { label: 'Chiffres & finances' },
  { label: 'Positionnement' },
  { label: 'Photos & options' },
];

const BUYER_STEPS = [
  { label: 'Votre profil' },
  { label: 'Critères' },
  { label: 'Finalisation' },
];

const isFieldFilled = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value === 'string') return value.trim().length > 0;
  return Boolean(value);
};

const computeRawCompletion = (formData = {}, announcementType = 'sale') => {
  const requiredFields = announcementType === 'sale' ? SALE_REQUIRED_FIELDS : BUYER_REQUIRED_FIELDS;
  const trackedFields = announcementType === 'sale' ? SALE_TRACKED_FIELDS : BUYER_TRACKED_FIELDS;

  const requiredFilledCount = requiredFields.filter((field) => isFieldFilled(formData[field])).length;
  const trackedFilledCount = trackedFields.filter((field) => isFieldFilled(formData[field])).length;

  const requiredCompletion = Math.round((requiredFilledCount / Math.max(1, requiredFields.length)) * 100);
  const score = Math.round((trackedFilledCount / Math.max(1, trackedFields.length)) * 100);

  return {
    score,
    requiredCompletion,
    allRequiredFilled: requiredFilledCount === requiredFields.length,
    requiredFields,
    trackedFields,
    requiredFilledCount,
    trackedFilledCount
  };
};

export default function CreateBusiness() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    // Seller fields
    title: '',
    description: '',
    sector: '',
    asking_price: '',
    annual_revenue: '',
    ebitda: '',
    employees: '',
    location: '',
    country: 'france',
    department: '',
    region: '',
    year_founded: '',
    reason_for_sale: '',
    seller_business_type: '',
    confidential: false,
    hide_location: false,
    assets_included: [],
    images: [],
    status: 'pending',
    legal_structure: '',
    registration_number: '',
    lease_info: '',
    licenses: '',
    financial_years: [],
    market_position: '',
    competitive_advantages: '',
    growth_opportunities: '',
    customer_base: '',
    cession_details: '',
    surface_area: '',
    show_cession_details: false,
    show_surface_area: false,
    buyer_image: [],
    business_type: '',
    reference_number: '',
    // Buyer specific fields
    buyer_budget_min: '',
    buyer_budget_max: '',
    buyer_sectors_interested: [],
    buyer_locations: [],
    buyer_employees_min: '',
    buyer_employees_max: '',
    buyer_revenue_min: '',
    buyer_revenue_max: '',
    buyer_investment_available: '',
    buyer_profile_type: '',
    buyer_notes: '',
    business_type_sought: '',
    buyer_document_url: '',
    buyer_document_name: ''
  });
  
  const [announcementType, setAnnouncementType] = useState('sale');
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = announcementType === 'sale' ? SELLER_STEPS : BUYER_STEPS;
  
  // Auto-save hook
 const { saveDraftNow, loadDraft, hasDraft } = useAutoSave(formData, 'createBusinessDraft', 30000);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check for edit mode
      const urlParams = new URLSearchParams(window.location.search);
      const editId = urlParams.get('edit');
        if (editId && user) {
        const businesses = await base44.entities.Business.filter({ id: editId });
        if (businesses && businesses.length > 0) {
          const business = businesses[0];
          // Check if user is the owner (compare seller_id)
          if (business.seller_id === user.id) {
            setEditingId(editId);
            setAnnouncementType(business.type === 'acquisition' ? 'search' : 'sale');
            const normalizedImages = normalizeImageArray(business.images || []).map((url) => ({
              url,
              isDefault: false
            }));

            setFormData({
              // Seller fields
              title: business.title || '',
              description: business.description || '',
              sector: business.sector || '',
              asking_price: business.asking_price?.toString() || '',
              annual_revenue: business.annual_revenue?.toString() || '',
              ebitda: business.ebitda?.toString() || '',
              employees: business.employees?.toString() || '',
              location: business.location || '',
              country: business.country || 'france',
              department: business.department || '',
              region: business.region || '',
              year_founded: business.year_founded?.toString() || '',
              reason_for_sale: business.reason_for_sale || '',
              seller_business_type: business.seller_business_type || '',
              confidential: business.confidential || false,
              hide_location: business.hide_location || false,
              assets_included: business.assets_included || [],
              images: normalizedImages,
              status: business.status || 'pending',
              legal_structure: business.legal_structure || '',
              registration_number: business.registration_number || '',
              lease_info: business.lease_info || '',
              licenses: business.licenses || '',
              financial_years: business.financial_years || [],
              market_position: business.market_position || '',
              competitive_advantages: business.competitive_advantages || '',
              growth_opportunities: business.growth_opportunities || '',
              customer_base: business.customer_base || '',
              cession_details: business.cession_details || '',
              surface_area: business.surface_area || '',
              show_cession_details: business.show_cession_details || false,
              show_surface_area: business.show_surface_area || false,
              buyer_image: normalizeImageArray(business.buyer_image || []).map((url) => ({
                url,
                isDefault: false
              })),
              business_type: business.business_type || '',
              reference_number: business.reference_number || '',
              // Buyer fields
              buyer_budget_min: business.buyer_budget_min?.toString() || '',
              buyer_budget_max: business.buyer_budget_max?.toString() || '',
              buyer_sectors_interested: business.buyer_sectors_interested || [],
              buyer_locations: business.buyer_locations || [],
              buyer_employees_min: business.buyer_employees_min?.toString() || '',
              buyer_employees_max: business.buyer_employees_max?.toString() || '',
              buyer_revenue_min: business.buyer_revenue_min?.toString() || '',
              buyer_revenue_max: business.buyer_revenue_max?.toString() || '',
              buyer_investment_available: business.buyer_investment_available?.toString() || '',
              buyer_profile_type: business.buyer_profile_type || '',
              buyer_notes: business.buyer_notes || '',
              business_type_sought: business.business_type_sought || '',
              buyer_document_url: business.buyer_document_url || '',
              buyer_document_name: business.buyer_document_name || ''
            });
          } else {
            console.error('User is not the owner of this business');
          }
        }
      }
    } catch (e) {
      console.error('Error loading business:', e);
    }
    setLoading(false);
  };

  const handleFormChange = (updatedFormData) => {
    const nextTitle = typeof updatedFormData?.title === 'string'
      ? updatedFormData.title.slice(0, TITLE_MAX_LENGTH)
      : updatedFormData?.title;

    setFormData({
      ...updatedFormData,
      title: nextTitle
    });
  };

  const completion = computeListingCompletionScore(formData, language, announcementType);
  const rawCompletion = computeRawCompletion(formData, announcementType);

  useEffect(() => {
    console.debug('[completion-indicator-diagnosis]', {
      announcementType,
      weightedScore: completion?.score ?? 0,
      rawScoreAllFields: rawCompletion.score,
      requiredCompletionPercent: rawCompletion.requiredCompletion,
      allRequiredFilled: rawCompletion.allRequiredFilled,
      requiredFields: rawCompletion.requiredFields,
      requiredMissingFields: rawCompletion.requiredFields.filter((field) => !isFieldFilled(formData[field]))
    });
  }, [announcementType, completion?.score, formData, rawCompletion]);

  const openPublishPreview = () => {
    setChecklistOpen(true);
  };

  const handleSubmit = async (status) => {
    // Validation
    if (announcementType === 'sale') {
      if (!formData.title || !formData.sector || !formData.asking_price || !formData.location) {
        alert(language === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill all required fields');
        return;
      }
    } else {
      if (!formData.title) {
        alert(language === 'fr' ? 'Veuillez remplir le titre' : 'Please fill in the title');
        return;
      }
    }

    setSaving(true);
    try {
      // Fetch user profile to get logo data
      let userLogo = null;
      if (user?.id) {
        try {
          const { data: profileData } = await supabase
          .from('profiles')
          .select('logo_url, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            userLogo = profileData.logo_url || profileData.avatar_url;
          }
        } catch (error) {
          console.log('No profile logo found:', error);
        }
      }

      // Only include seller/business fields, filter out buyer-specific fields
      const isSaleAnnouncement = announcementType === 'sale';

      const baseData = {
        title: formData.title,
        description: formData.description,
        sector: formData.sector,
        asking_price: parseFloat(formData.asking_price) || 0,
        annual_revenue: formData.annual_revenue ? parseFloat(formData.annual_revenue) : null,
        ebitda: formData.ebitda ? parseFloat(formData.ebitda) : null,
        employees: formData.employees ? parseInt(formData.employees) : null,
        location: formData.location,
        country: formData.country,
        department: formData.department,
        region: formData.region,
        year_founded: formData.year_founded ? parseInt(formData.year_founded) : null,
        reason_for_sale: formData.reason_for_sale,
        seller_business_type: formData.seller_business_type || null,
        confidential: formData.confidential,
        hide_location: formData.hide_location,
        assets_included: formData.assets_included,
        images: normalizeImageArray(formData.images),
        legal_structure: formData.legal_structure,
        registration_number: formData.registration_number,
        lease_info: formData.lease_info,
        licenses: formData.licenses,
        financial_years: formData.financial_years,
        market_position: formData.market_position,
        competitive_advantages: formData.competitive_advantages,
        growth_opportunities: formData.growth_opportunities,
        customer_base: formData.customer_base,
        cession_details: formData.cession_details,
        surface_area: formData.surface_area,
        show_cession_details: formData.show_cession_details,
        show_surface_area: formData.show_surface_area,
        seller_id: user?.id,  // Use user ID instead of email
        seller_email: user?.email || null,
        status: status === 'draft' ? 'draft' : 'pending'
      };

      if (!BUSINESS_FIELDS_SUPPORTED) {
        delete baseData.cession_details;
        delete baseData.surface_area;
        delete baseData.show_cession_details;
        delete baseData.show_surface_area;
      }

      const data = {
        ...baseData,
        business_type: formData.business_type || null,
        reference_number: formData.reference_number || null,
        type: isSaleAnnouncement ? 'cession' : 'acquisition',
        // Add buyer-specific fields if this is an acquisition announcement
        ...(
          !isSaleAnnouncement && {
            buyer_budget_min: formData.buyer_budget_min ? parseFloat(formData.buyer_budget_min) : null,
            buyer_budget_max: formData.buyer_budget_max ? parseFloat(formData.buyer_budget_max) : null,
            buyer_sectors_interested: formData.buyer_sectors_interested || [],
            buyer_locations: formData.buyer_locations || [],
            buyer_employees_min: formData.buyer_employees_min ? parseInt(formData.buyer_employees_min) : null,
            buyer_employees_max: formData.buyer_employees_max ? parseInt(formData.buyer_employees_max) : null,
            buyer_revenue_min: formData.buyer_revenue_min ? parseFloat(formData.buyer_revenue_min) : null,
            buyer_revenue_max: formData.buyer_revenue_max ? parseFloat(formData.buyer_revenue_max) : null,
            buyer_investment_available: formData.buyer_investment_available ? parseFloat(formData.buyer_investment_available) : null,
            buyer_profile_type: formData.buyer_profile_type || null,
            buyer_notes: formData.buyer_notes || '',
            business_type_sought: formData.business_type_sought || null,
            buyer_document_url: formData.buyer_document_url || null,
            buyer_document_name: formData.buyer_document_name || null,
          }
        ),
      };

      if (isSaleAnnouncement && (!Array.isArray(data.images) || data.images.length === 0)) {
        data.images = [getDefaultImageForSector(formData.sector)];
      }

      console.log('Saving business with data:', data);

      if (editingId) {
        console.log('Updating business:', editingId);
        await base44.entities.Business.update(editingId, data);
      } else {
        console.log('Creating new business');

        let result = null;
        let lastCreateError = null;
        for (let attempt = 0; attempt < 3; attempt += 1) {
          const referenceNumber = await generateUniqueReference();
          try {
            result = await base44.entities.Business.create({
              ...data,
              reference_number: referenceNumber
            });
            break;
          } catch (createError) {
            lastCreateError = createError;
            const message = String(createError?.message || '').toLowerCase();
            if (!message.includes('reference_number')) {
              throw createError;
            }
          }
        }

        if (!result && lastCreateError) {
          throw lastCreateError;
        }

        console.log('Business created successfully:', result);
        
        // Save logo info to Supabase business_logos table
        if (result?.id && userLogo) {
          try {
            const { supabase } = await import('@/api/supabaseClient');
            await supabase.from('business_logos').insert({
              business_id: result.id,
              seller_id: user.id,
              logo_url: userLogo
            });
            console.log('Logo saved to business_logos table');
          } catch (logoError) {
            console.log('Could not save logo to business_logos:', logoError);
          }
        }
      }

      // Add a small delay to ensure data is persisted
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force refresh by adding a timestamp parameter
      const timestamp = Date.now();
      navigate(createPageUrl(`MyListings?refresh=${timestamp}`));
    } catch (e) {
      console.error('Error saving business:', e);
      alert(language === 'fr' ? 'Erreur lors de la sauvegarde' : 'Error saving');
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

  return (
    <div className="min-h-screen flex flex-col py-3 sm:py-6 md:py-8">
      <div className="w-full px-2 sm:px-4 md:px-8 lg:px-12 flex flex-col">
        {/* Header */}
        <div className="mb-4 flex-shrink-0">
          <button
            onClick={() => navigate(createPageUrl('MyListings'))}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('my_listings')}
          </button>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
            {editingId ? t('edit_listing') : t('create_listing')}
          </h1>
          
          {/* Display badges when editing */}
          {editingId && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span 
                style={{ 
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: 'white',
                  backgroundColor: '#f47e50',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  display: 'inline-block'
                }}
              >
                {announcementType === 'sale' ? (language === 'fr' ? 'Cession' : 'Sale') : (language === 'fr' ? 'Acquisition' : 'Acquisition')}
              </span>
              {formData.business_type && (
                <span 
                  style={{ 
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: 'white',
                    backgroundColor: '#f47e50',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}
                >
                  {t(formData.business_type)}
                </span>
              )}
              {formData.reference_number && (
                <span 
                  style={{ 
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: 'white',
                    backgroundColor: '#f47e50',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}
                >
                  {formData.reference_number}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Announcement Type Radio */}
        <AnnouncementTypeRadio
          announcementType={announcementType}
          onChange={(type) => {
            setAnnouncementType(type);
            setCurrentStep(0);
          }}
          language={language}
          disabled={!!editingId}
          hideOption={null}
        />

        {/* Step Progress */}
        <FormStepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />

        {/* Conditional Form Rendering */}
        {announcementType === 'sale' ? (
          <SellerForm
            formData={formData}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            onPreviewPublish={openPublishPreview}
            saving={saving}
            language={language}
            t={t}
            user={user}
            editingId={editingId}
            completion={rawCompletion}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        ) : (
          <BuyerForm
            formData={formData}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            onPreviewPublish={openPublishPreview}
            saving={saving}
            language={language}
            t={t}
            user={user}
            editingId={editingId}
            completion={rawCompletion}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        )}

        {/* Completion Checklist Dialog */}
        <CompletionChecklist
          open={checklistOpen}
          onOpenChange={setChecklistOpen}
          formData={formData}
          announcementType={announcementType}
          completion={completion}
          onPublish={() => {
            setChecklistOpen(false);
            handleSubmit('pending');
          }}
          language={language}
        />
      </div>
    </div>
  );
}
