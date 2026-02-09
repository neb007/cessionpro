import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * PhotoLightbox Component
 * Full-screen image gallery with navigation
 */
export default function PhotoLightbox({
  images,
  isOpen,
  onClose,
  startIndex = 0,
  language = 'fr'
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  // Update currentIndex when startIndex changes
  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Main image container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full h-full flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center">
            {/* Current image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`Photo ${currentIndex + 1}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </AnimatePresence>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              title={language === 'fr' ? 'Fermer' : 'Close'}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                {/* Previous button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  className="absolute left-4 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10"
                  title={language === 'fr' ? 'Précédent' : 'Previous'}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>

                {/* Next button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="absolute right-4 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10"
                  title={language === 'fr' ? 'Suivant' : 'Next'}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </>
            )}

            {/* Image counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium"
            >
              {currentIndex + 1} / {images.length}
            </motion.div>

            {/* Thumbnail strip at bottom (optional, for better UX) */}
            {images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto pb-2"
              >
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentIndex
                        ? 'border-white ring-2 ring-white/50'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Info text at top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 text-white/70 text-sm"
        >
          {language === 'fr' ? (
            <>
              <p>Utilisez les flèches pour naviguer</p>
              <p>Appuyez sur Échap pour fermer</p>
            </>
          ) : (
            <>
              <p>Use arrow keys to navigate</p>
              <p>Press Escape to close</p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
