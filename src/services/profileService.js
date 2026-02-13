import { supabase } from '@/api/supabaseClient';

// ============================================
// PROFILE RETRIEVAL & UPDATE
// ============================================

/**
 * Get buyers or sellers profile with all details
 */
export const getProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Update profile information (text fields only)
 */
export const updateProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// ============================================
// DOCUMENT UPLOAD & MANAGEMENT
// ============================================

const BUCKET_NAME = 'profile';
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate file before upload
 */
const validateFile = (file) => {
  if (!file) throw new Error('Aucun fichier sélectionné');
  
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Format non autorisé. Utilisez PDF ou Word.');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Le fichier dépasse 5MB');
  }
  
  return true;
};

/**
 * Upload document (CV or Financing document)
 * @param {string} userId - User ID
 * @param {string} documentType - 'cv' or 'financing'
 * @param {File} file - File to upload
 * @returns {Promise<{url: string, name: string, path: string}>}
 */
export const uploadProfileDocument = async (userId, documentType, file) => {
  try {
    validateFile(file);

    // Create file path: profile/{userId}/cv/filename.pdf
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${documentType}_${timestamp}.${fileExtension}`;
    const filePath = `${userId}/${documentType}/${fileName}`;

    // Upload file to storage
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // Update profile with document URL and metadata
    const updateData = {
      [`${documentType}_document_url`]: publicUrl,
      [`${documentType}_document_name`]: file.name,
      [`${documentType}_uploaded_at`]: new Date().toISOString()
    };

    await updateProfile(userId, updateData);

    return {
      url: publicUrl,
      name: file.name,
      path: filePath
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

/**
 * Delete a profile document
 * @param {string} userId - User ID
 * @param {string} documentType - 'cv' or 'financing'
 */
export const deleteProfileDocument = async (userId, documentType) => {
  try {
    // Get current document URL to extract path
    const profile = await getProfile(userId);
    const docUrl = profile[`${documentType}_document_url`];

    if (!docUrl) {
      throw new Error('Aucun document à supprimer');
    }

    // Extract file path from URL
    // URL format: https://.../{bucket}/object/public/{userId}/{documentType}/{filename}
    const urlParts = docUrl.split(`/${BUCKET_NAME}/object/public/`);
    if (urlParts.length !== 2) {
      throw new Error('URL du document invalide');
    }

    const filePath = urlParts[1];

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (deleteError) throw deleteError;

    // Update profile to clear document references
    const updateData = {
      [`${documentType}_document_url`]: null,
      [`${documentType}_document_name`]: null,
      [`${documentType}_uploaded_at`]: null
    };

    await updateProfile(userId, updateData);

    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

/**
 * Get download URL for a profile document
 */
export const getDocumentDownloadUrl = async (userId, documentType) => {
  try {
    const profile = await getProfile(userId);
    const docUrl = profile[`${documentType}_document_url`];

    if (!docUrl) {
      return null;
    }

    return docUrl;
  } catch (error) {
    console.error('Error getting document URL:', error);
    throw error;
  }
};

// ============================================
// BUYER-SPECIFIC OPERATIONS
// ============================================

/**
 * Get buyer profile with all fields
 */
export const getBuyerProfile = async (userId) => {
  return getProfile(userId);
};

/**
 * Update buyer profile (includes buyer-specific fields)
 */
export const updateBuyerProfile = async (userId, buyerData) => {
  try {
    const profileData = {
      first_name: buyerData.firstName,
      last_name: buyerData.lastName,
      phone: buyerData.phone,
      sectors: buyerData.sectors,
      profile_type: buyerData.profileType,
      transaction_size: buyerData.transactionSize,
      motivation_reprise: buyerData.motivationReprise,
      experience_professionnelle: buyerData.experienceProfessionnelle,
      linkedin_url: buyerData.linkedinUrl,
      aide_vendeur_description: buyerData.aideVendeurDescription,
      is_buyer: true
    };

    return updateProfile(userId, profileData);
  } catch (error) {
    console.error('Error updating buyer profile:', error);
    throw error;
  }
};

// ============================================
// SELLER-SPECIFIC OPERATIONS
// ============================================

/**
 * Get seller profile
 */
export const getSellerProfile = async (userId) => {
  return getProfile(userId);
};

/**
 * Update seller profile (includes seller-specific fields)
 */
export const updateSellerProfile = async (userId, sellerData) => {
  try {
    const profileData = {
      first_name: sellerData.firstName,
      last_name: sellerData.lastName,
      company_name: sellerData.companyName,
      phone: sellerData.phone,
      profile_type: sellerData.profileType,
      transaction_size: sellerData.transactionSize,
      is_seller: true
    };

    return updateProfile(userId, profileData);
  } catch (error) {
    console.error('Error updating seller profile:', error);
    throw error;
  }
};

/**
 * Get all sellers (for buyers to browse)
 */
export const getAllSellers = async (filters = {}) => {
  try {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('is_seller', true);

    // Apply filters if needed
    if (filters.transactionSize) {
      query = query.eq('transaction_size', filters.transactionSize);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching sellers:', error);
    throw error;
  }
};

/**
 * Get all buyers (for sellers to browse)
 */
export const getAllBuyers = async (filters = {}) => {
  try {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('is_buyer', true);

    // Apply filters if needed
    if (filters.sectors && filters.sectors.length > 0) {
      // This would need a more complex query with .overlaps() in Supabase
      query = query.filter('sectors', 'ov', filters.sectors);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching buyers:', error);
    throw error;
  }
};

// ============================================
// ROLE MANAGEMENT (for hybrid profiles)
// ============================================

/**
 * Enable buyer role for a user
 */
export const enableBuyerRole = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_buyer: true })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error enabling buyer role:', error);
    throw error;
  }
};

/**
 * Enable seller role for a user
 */
export const enableSellerRole = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_seller: true })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error enabling seller role:', error);
    throw error;
  }
};

/**
 * Disable buyer role for a user (only if seller role is active)
 */
export const disableBuyerRole = async (userId) => {
  try {
    const profile = await getProfile(userId);
    
    // Can't disable buyer role if seller role is also disabled
    if (!profile.is_seller) {
      throw new Error('Impossible de désactiver le rôle acheteur si le rôle vendeur est inactif');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_buyer: false })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error disabling buyer role:', error);
    throw error;
  }
};

/**
 * Disable seller role for a user (only if buyer role is active)
 */
export const disableSellerRole = async (userId) => {
  try {
    const profile = await getProfile(userId);
    
    // Can't disable seller role if buyer role is also disabled
    if (!profile.is_buyer) {
      throw new Error('Impossible de désactiver le rôle vendeur si le rôle acheteur est inactif');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_seller: false })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error disabling seller role:', error);
    throw error;
  }
};

/**
 * Get user roles
 */
export const getUserRoles = async (userId) => {
  try {
    const profile = await getProfile(userId);
    return {
      isBuyer: profile.is_buyer,
      isSeller: profile.is_seller,
      isHybrid: profile.is_buyer && profile.is_seller
    };
  } catch (error) {
    console.error('Error getting user roles:', error);
    throw error;
  }
};
