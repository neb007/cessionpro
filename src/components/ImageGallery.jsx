import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { uploadBusinessImage } from '@/services/imageService';
import { Button } from '@/components/ui/button';

export default function ImageGallery({
  images,
  onImagesChange,
  defaultImage,
  maxPhotos = 3,
  sectorLabel = '',
  userEmail = '',
  language = 'fr',
  disabled = false
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Compter les photos utilisateur (non-défaut)
  const userPhotosCount = images.filter(img => !img.isDefault).length;
  const canDeleteDefault = userPhotosCount > 0;
  const photosRemaining = maxPhotos - userPhotosCount;
  const isPhotoLimitReached = userPhotosCount >= maxPhotos;

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Vérifier la limite
    if (userPhotosCount + files.length > maxPhotos) {
      setError(
        language === 'fr'
          ? `Vous pouvez ajouter au maximum ${maxPhotos} photos`
          : `You can add maximum ${maxPhotos} photos`
      );
      return;
    }

    setError('');
    setUploading(true);

    try {
      const uploadedImages = [];
      for (const file of files) {
        // Valider la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(language === 'fr' ? 'Image trop grande (max 5MB)' : 'Image too large (max 5MB)');
          continue;
        }

        // Valider le type
        if (!file.type.startsWith('image/')) {
          setError(language === 'fr' ? 'Seulement les images sont acceptées' : 'Only images are accepted');
          continue;
        }

        const uploadedImage = await uploadBusinessImage(file, null, userEmail);
        uploadedImages.push(uploadedImage);
      }

      if (uploadedImages.length > 0) {
        onImagesChange([...images, ...uploadedImages]);
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(language === 'fr' ? 'Erreur lors du upload' : 'Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    setError('');
  };

  const getImageLabel = (img, index) => {
    if (img.isDefault) {
      return language === 'fr' ? 'Image par défaut' : 'Default image';
    }
    return language === 'fr' ? `Photo ${index}` : `Photo ${index}`;
  };

  return (
    <div className="space-y-4">
      {/* Photo counter and info */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {language === 'fr' ? 'Galerie photo' : 'Photo gallery'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {userPhotosCount}/{maxPhotos} {language === 'fr' ? 'photos utilisée(s)' : 'photos used'}
          </p>
        </div>
        {isPhotoLimitReached && (
          <div className="px-2 py-1 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
            {language === 'fr' ? 'Limite atteinte' : 'Limit reached'}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <AnimatePresence>
          {images.map((img, idx) => {
            const isDeletable = img.isDefault ? canDeleteDefault : true;
            const showDeleteTooltip = img.isDefault && !canDeleteDefault;

            return (
              <motion.div
                key={`${img.url}-${idx}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                {/* Image Container */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={img.url}
                    alt={getImageLabel(img, idx + 1)}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                    {/* Label */}
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex px-2 py-1 bg-black/60 text-white text-xs rounded">
                        {getImageLabel(img, idx + 1)}
                      </span>
                      {img.isDefault && (
                        <span className="ml-1 inline-flex px-2 py-1 bg-blue-600/80 text-white text-xs rounded">
                          {language === 'fr' ? 'Défaut' : 'Default'}
                        </span>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeImage(idx)}
                      disabled={!isDeletable}
                      title={
                        showDeleteTooltip
                          ? language === 'fr'
                            ? 'Ajoutez une photo avant de supprimer celle-ci'
                            : 'Add a photo before deleting this one'
                          : ''
                      }
                      className={`relative z-10 p-2 rounded-full transition-all ${
                        isDeletable
                          ? 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Upload Button */}
        {!isPhotoLimitReached && (
          <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading || disabled}
              className="hidden"
            />

            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500 text-center px-2">
                  {language === 'fr' ? 'Ajouter' : 'Add'} {language === 'fr' ? 'photo(s)' : 'photo(s)'}
                </span>
              </>
            )}
          </label>
        )}
      </div>

    </div>
  );
}
