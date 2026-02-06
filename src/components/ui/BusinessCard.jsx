import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MapPin, Eye, Lock, Heart, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { motion } from 'framer-motion';
import { getDefaultImageForSector } from '@/constants/defaultImages';

const sectorColors = {
  technology: 'bg-[#FFE5DF] text-[#FF6B4A]',
  retail: 'bg-[#FFE5DF] text-[#FF8F6D]',
  hospitality: 'bg-[#FFF3E0] text-[#FFA488]',
  manufacturing: 'bg-[#E3F2FD] text-[#5B9BD5]',
  services: 'bg-[#E8F5E9] text-[#66BB6A]',
  healthcare: 'bg-[#FFE5DF] text-[#FF6B4A]',
  construction: 'bg-[#FFE5DF] text-[#FF8F6D]',
  transport: 'bg-[#E0F2F1] text-[#4DB6AC]',
  agriculture: 'bg-[#F1F8E9] text-[#9CCC65]',
  other: 'bg-gray-100 text-[#6B7A94]',
};

export default function BusinessCard({ business, isFavorite, onToggleFavorite }) {
  const { t, language } = useLanguage();
  
  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = () => {
    console.log(`[BusinessCard] ${business.title} - images RAW:`, business.images);
    console.log(`[BusinessCard] TYPE:`, typeof business.images);
    
    let imagesArray = business.images;
    
    // Handle if images is a JSON string
    if (typeof imagesArray === 'string') {
      console.log('[BusinessCard] Parsing JSON string...');
      try {
        imagesArray = JSON.parse(imagesArray);
        console.log('[BusinessCard] Parsed OK:', imagesArray);
      } catch (e) {
        console.warn('[BusinessCard] Parse failed:', e);
        imagesArray = [];
      }
    }
    
    // Ensure it's an array
    if (!Array.isArray(imagesArray)) {
      console.log('[BusinessCard] Not an array');
      imagesArray = [];
    }
    
    console.log('[BusinessCard] Final array:', imagesArray);
    
    if (imagesArray.length > 0) {
      // If it's an object with url property
      if (typeof imagesArray[0] === 'object' && imagesArray[0].url) {
        console.log('[BusinessCard] Returning URL from object:', imagesArray[0].url);
        return imagesArray[0].url;
      }
      // If it's a string URL
      if (typeof imagesArray[0] === 'string') {
        console.log('[BusinessCard] Returning URL from string:', imagesArray[0]);
        return imagesArray[0];
      }
    }
    
    console.log('[BusinessCard] Using default image');
    // Fallback to default image based on sector
    return getDefaultImageForSector(business.sector);
  };

  const isCession = business.type === 'cession';
  const imageUrl = getImageUrl();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-white h-full flex flex-col">
        {/* Image Section with Category and Views */}
        <Link to={createPageUrl(`BusinessDetails?id=${business.id}`)}>
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
            <img
              src={imageUrl}
              alt={business.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Category badge (Top Left) */}
            <div className="absolute top-3 left-3">
              <Badge className={`${sectorColors[business.sector] || sectorColors.other} border-0 font-medium`}>
                {t(business.sector)}
              </Badge>
            </div>
            
            {/* Views with Eye Icon (Top Right) */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs text-gray-700 font-medium">
              <Eye className="w-3.5 h-3.5" />
              <span className="font-mono">{business.views_count || 0}</span>
            </div>
          </div>
        </Link>
        
        <CardContent className="p-4 sm:p-5 flex flex-col flex-grow">
          {/* Title with Favorite Button */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <Link to={createPageUrl(`BusinessDetails?id=${business.id}`)} className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-base sm:text-lg text-[#3B4759] group-hover:text-[#FF6B4A] transition-colors line-clamp-2">
                {business.title}
              </h3>
            </Link>
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite(business.id);
                }}
                className={`p-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                  isFavorite 
                    ? 'bg-rose-50 text-rose-500' 
                    : 'bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
          
          {/* Location with Verified Badge and Reference */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex items-center text-sm text-gray-500 flex-1 min-w-0">
              <MapPin className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{business.location}</span>
            </div>
          </div>

          {/* Verified Badge and Reference on same line */}
          <div className="flex items-center gap-2 mb-4 text-xs">
            {business.verified && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
                ✓ {language === 'fr' ? 'Vérifié' : 'Verified'}
              </Badge>
            )}
            {business.reference_number && (
              <span className="font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded text-xs">
                {business.reference_number}
              </span>
            )}
          </div>
          
          {/* Financial Info */}
          <div className="pt-3 border-t border-gray-100 mt-auto">
            <p className="text-xs text-[#8A98AD] uppercase tracking-wider mb-2">
              {language === 'fr' ? 'Prix' : 'Price'}
            </p>
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-lg font-bold text-[#FF6B4A]">
                {formatPrice(business.asking_price)}
              </p>
              
              {/* Show CA only for cessions with annual_revenue */}
              {isCession && business.annual_revenue && (
                <div className="text-right">
                  <p className="text-xs text-[#8A98AD] uppercase tracking-wider">
                    CA
                  </p>
                  <p className="font-mono text-sm font-semibold text-[#5B9BD5]">
                    {formatPrice(business.annual_revenue)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Offer Type Badge at Bottom */}
          {business.type && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Badge className={business.type === 'cession' 
                ? 'bg-blue-50 text-blue-700 border-0 text-xs' 
                : 'bg-purple-50 text-purple-700 border-0 text-xs'
              }>
                {business.type === 'cession' 
                  ? (language === 'fr' ? 'Offre Cession' : 'Sale Offer')
                  : (language === 'fr' ? 'Offre Acquisition' : 'Acquisition Offer')
                }
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
