import React from 'react';
import { Award, Image, AlertCircle } from 'lucide-react';

/**
 * CreditDisplay Component
 * Shows user's remaining credits for photos and contacts
 */
export default function CreditDisplay({ credits, language = 'fr', onBuyClick }) {
  if (!credits) return null;

  const labels = language === 'fr' ? {
    photos: 'Photos restantes',
    contacts: 'Contacts disponibles',
    freePhoto: '1 photo gratuite par annonce',
    buyMore: 'Acheter plus'
  } : {
    photos: 'Remaining photos',
    contacts: 'Available contacts',
    freePhoto: '1 free photo per listing',
    buyMore: 'Buy more'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
      {/* Photo Credits */}
      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex-shrink-0">
          <Image className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600">{labels.photos}</p>
          <p className="text-lg font-bold text-blue-900">{credits.photos}</p>
          <p className="text-xs text-gray-500">{labels.freePhoto}</p>
        </div>
        {credits.photos === 1 && (
          <button
            onClick={() => onBuyClick?.('photos')}
            className="flex-shrink-0 px-2 py-1 text-xs font-semibold text-blue-600 bg-white border border-blue-300 rounded hover:bg-blue-50 transition-colors"
          >
            {labels.buyMore}
          </button>
        )}
      </div>

      {/* Contact Credits */}
      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex-shrink-0">
          <Award className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600">{labels.contacts}</p>
          <p className="text-lg font-bold text-green-900">{credits.contacts}</p>
          {credits.contacts === 0 && (
            <p className="text-xs text-red-600 font-medium">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Aucun crédit
            </p>
          )}
        </div>
        {credits.contacts === 0 && (
          <button
            onClick={() => onBuyClick?.('contacts')}
            className="flex-shrink-0 px-2 py-1 text-xs font-semibold text-green-600 bg-white border border-green-300 rounded hover:bg-green-50 transition-colors"
          >
            {labels.buyMore}
          </button>
        )}
      </div>
    </div>
  );
}
