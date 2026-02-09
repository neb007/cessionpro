import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Grid3x3, X } from 'lucide-react';
import { getBusinessImageList } from '@/utils/imageHelpers';
import PhotoLightbox from './PhotoLightbox';

/**
 * BentoPhotoGallery Component
 * Displays photos in a Bento-style grid layout (like Airbnb)
 * - Full-width container with fixed 300px height
 * - Left side: 1 large main image (50%)
 * - Right side: 2x2 grid of 4 thumbnails (50%)
 * - For 0 photos: elegant placeholder
 * - For 1 photo: full-width single image
 * - For 5+ photos: standard Bento layout
 * - For 15+ photos: overlay "+X photos" on 4th image
 */
export default function BentoPhotoGallery({ business, language = 'fr' }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  // Get all images
  const images = getBusinessImageList(business);
  const photoCount = images.length;

  // Determine layout based on photo count
  const showBento = photoCount >= 5;
  const showSingle = photoCount === 1;
  const showEmpty = photoCount === 0;

  // Handle placeholder click
  if (showEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50"
        style={{ height: '250px' }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-12 h-12 text-primary/40" />
            </div>
            <p className="text-gray-500 text-sm">
              {language === 'fr' ? 'Aucune photo disponible' : 'No photos available'}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Single image layout
  if (showSingle) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full rounded-3xl overflow-hidden bg-gray-100 cursor-pointer group"
        style={{ height: '250px' }}
        onClick={() => {
          setLightboxStartIndex(0);
          setLightboxOpen(true);
        }}
      >
        <img
          src={images[0]}
          alt="Business"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <PhotoLightbox
          images={images}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          startIndex={lightboxStartIndex}
          language={language}
        />
      </motion.div>
    );
  }

  // Bento layout (5+ photos)
  if (showBento) {
    const mainImage = images[0];
    const thumbnails = images.slice(1, 5); // Get 4 thumbnails
    const remainingCount = Math.max(0, photoCount - 5);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full rounded-3xl overflow-hidden"
        style={{ height: '250px' }}
      >
        {/* Main container with gap */}
        <div className="w-full h-full flex gap-2">
          {/* Left side - Main image (50%) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-1 rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group"
            onClick={() => {
              setLightboxStartIndex(0);
              setLightboxOpen(true);
            }}
          >
            <img
              src={mainImage}
              alt="Main"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </motion.div>

          {/* Right side - 2x2 grid (50%) */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            {thumbnails.map((img, idx) => {
              const imageIndex = idx + 1; // Adjust for main image
              const isLastThumbnail = idx === 3; // Last one (bottom-right)
              const showOverlay = isLastThumbnail && remainingCount > 0;

              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group"
                  onClick={() => {
                    setLightboxStartIndex(imageIndex);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay for remaining photos */}
                  {showOverlay && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/70 transition-colors duration-300"
                    >
                      <div className="text-center">
                        <Grid3x3 className="w-6 h-6 text-white mb-2 mx-auto" />
                        <p className="text-white font-semibold text-sm">
                          +{remainingCount}
                        </p>
                        <p className="text-white/80 text-xs mt-1">
                          {language === 'fr' ? 'Voir plus' : 'View more'}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Hover overlay indicator */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Lightbox */}
        <PhotoLightbox
          images={images}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          startIndex={lightboxStartIndex}
          language={language}
        />
      </motion.div>
    );
  }

  // Layout for 2-4 photos (simple grid)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full rounded-3xl overflow-hidden"
      style={{ height: '250px' }}
    >
      <div className="w-full h-full flex gap-2">
        {/* Main image */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex-1 rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group"
          onClick={() => {
            setLightboxStartIndex(0);
            setLightboxOpen(true);
          }}
        >
          <img
            src={images[0]}
            alt="Main"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </motion.div>

        {/* Side thumbnails */}
        <div className="w-1/3 flex flex-col gap-2">
          {images.slice(1).map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="flex-1 rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group"
              onClick={() => {
                setLightboxStartIndex(idx + 1);
                setLightboxOpen(true);
              }}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <PhotoLightbox
        images={images}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        startIndex={lightboxStartIndex}
        language={language}
      />
    </motion.div>
  );
}
