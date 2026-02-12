import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Euro } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPrimaryImageUrl } from '@/utils/imageHelpers';

export default function LivePreview({
  formData,
  language = 'fr'
}) {
  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="sticky top-4"
    >
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white pb-3">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {language === 'fr' ? 'Aperçu' : 'Preview'}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Main Image */}
          {formData.images && formData.images.length > 0 ? (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={getPrimaryImageUrl({ images: formData.images, sector: formData.sector })}
                alt={formData.title}
                className="w-full h-full object-cover"
              />
              {formData.images.length > 1 && (
                <Badge className="absolute top-2 right-2 bg-black/70">
                  +{formData.images.length - 1}
                </Badge>
              )}
            </div>
          ) : (
            <div className="aspect-video rounded-lg bg-gray-200 flex items-center justify-center">
              <span className="text-sm text-gray-500">
                {language === 'fr' ? 'Aucune image' : 'No image'}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500">
              {language === 'fr' ? 'Titre' : 'Title'}
            </p>
            <p className="font-semibold text-gray-900 line-clamp-2 min-h-8">
              {formData.title || (language === 'fr' ? 'Titre non défini' : 'Title not set')}
            </p>
          </div>

          {/* Location & Sector */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {language === 'fr' ? 'Lieu' : 'Location'}
              </p>
              <p className="text-sm font-medium text-gray-900">
                {formData.location || '-'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">
                {language === 'fr' ? 'Secteur' : 'Sector'}
              </p>
              <p className="text-sm font-medium text-gray-900">
                {formData.sector ? formData.sector.charAt(0).toUpperCase() + formData.sector.slice(1) : '-'}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs text-gray-600 mb-1">
              {language === 'fr' ? 'Prix de vente' : 'Asking Price'}
            </p>
            <p className="text-2xl font-bold text-primary flex items-center gap-1">
              <Euro className="w-5 h-5" />
              {formatPrice(formData.asking_price) === '-' ? '?' : formatPrice(formData.asking_price)}
            </p>
          </div>

          {/* Description Preview */}
          {formData.description && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500">
                {language === 'fr' ? 'Description' : 'Description'}
              </p>
              <p className="text-sm text-gray-700 line-clamp-3">
                {formData.description}
              </p>
            </div>
          )}

          {/* Financial Summary */}
          {(formData.annual_revenue || formData.ebitda || formData.employees) && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <p className="text-xs font-semibold text-gray-900">
                {language === 'fr' ? 'Résumé financier' : 'Financial Summary'}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {formData.annual_revenue && (
                  <div>
                    <p className="text-gray-500">{language === 'fr' ? 'CA' : 'Revenue'}</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(formData.annual_revenue)}
                    </p>
                  </div>
                )}
                {formData.ebitda && (
                  <div>
                    <p className="text-gray-500">EBITDA</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(formData.ebitda)}
                    </p>
                  </div>
                )}
                {formData.employees && (
                  <div>
                    <p className="text-gray-500">
                      {language === 'fr' ? 'Équipe' : 'Team'}
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formData.employees} {language === 'fr' ? 'pers.' : 'ppl.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Completeness Indicator */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              {language === 'fr' ? 'Complétude' : 'Completeness'}
            </p>
            <div className="flex gap-1">
              {['title', 'sector', 'asking_price', 'location', 'description', 'images'].map((field) => (
                <div
                  key={field}
                  className={`h-2 flex-1 rounded-full ${
                    field === 'images'
                      ? formData[field]?.length > 0
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                      : formData[field]
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
