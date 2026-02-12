import { base44 } from '@/api/base44Client';
import { supabase } from '@/api/supabaseClient';

/**
 * Check if user has photo credits available
 * Returns true if user has photos remaining or if it's the first photo (free)
 */
export const checkPhotoCreditsAvailable = async (isAdditionalPhoto = false) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return false;
    }

    // Get user's remaining photo balance
    const { data, error } = await supabase
      .from('profiles')
      .select('photos_remaining_balance')
      .eq('id', user.id)
      .single();

    if (error) {
      // Default to allowing one photo if profile doesn't exist yet
      return !isAdditionalPhoto;
    }

    // If it's the first photo (not additional), always allow (1 free photo per listing)
    if (!isAdditionalPhoto) {
      return true;
    }

    // For additional photos, check balance
    return (data?.photos_remaining_balance || 0) > 0;
  } catch (err) {
    console.error('Error checking photo credits:', err);
    return false;
  }
};

/**
 * Upload une image vers Supabase et l'enregistre en base
 * Now checks for photo credits before upload
 */
export const uploadBusinessImage = async (file, businessId, userEmail, isAdditionalPhoto = false) => {
  try {
    // Check in credits if it's an additional photo
    if (isAdditionalPhoto) {
      const hasCredits = await checkPhotoCreditsAvailable(true);
      if (!hasCredits) {
        throw new Error('NO_PHOTO_CREDITS');
      }
    }

    // Upload vers Supabase Storage
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    // Deduct photo credit if it's additional
    if (isAdditionalPhoto) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('photos_remaining_balance')
          .eq('id', user.id)
          .single();

        const newBalance = Math.max(0, (data?.photos_remaining_balance || 1) - 1);

        await supabase
          .from('profiles')
          .update({ photos_remaining_balance: newBalance })
          .eq('id', user.id);

        // Log the transaction
        await supabase.from('credit_logs').insert([{
          user_id: user.id,
          credit_type: 'photos',
          amount_change: -1,
          previous_balance: data?.photos_remaining_balance || 1,
          new_balance: newBalance,
          reason: 'Photo upload for business ' + businessId
        }]);
      }
    }

    // Optionnel: Enregistrer métadonnées dans business_images table
    // (Si la table existe dans votre setup)
    // await base44.entities.BusinessImage?.create({
    //   business_id: businessId,
    //   user_email: userEmail,
    //   image_url: file_url,
    //   file_size: file.size,
    //   display_order: 1,
    //   is_default: false
    // });

    return {
      url: file_url,
      isDefault: false,
      fileName: file.name,
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload plusieurs images en batch
 */
export const uploadMultipleImages = async (files, businessId, userEmail) => {
  try {
    const uploadedImages = [];
    
    for (const file of files) {
      const image = await uploadBusinessImage(file, businessId, userEmail);
      uploadedImages.push(image);
    }

    return uploadedImages;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

/**
 * Obtenir les images d'une annonce
 */
export const getBusinessImages = async (businessId) => {
  try {
    // Optionnel: Si table business_images existe
    // const images = await base44.entities.BusinessImage?.filter({
    //   business_id: businessId
    // });
    // return images || [];
    return [];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

/**
 * Supprimer une image
 */
export const deleteBusinessImage = async (imageUrl) => {
  try {
    // Optionnel: Supprimer de Supabase Storage
    // const path = imageUrl.split('/').pop();
    // await base44.integrations.Core.DeleteFile({ path });
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};
