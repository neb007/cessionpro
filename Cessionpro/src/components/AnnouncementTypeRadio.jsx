import React from 'react';
import { Building2, Search } from 'lucide-react';

export default function AnnouncementTypeRadio({
  announcementType,
  onChange,
  language,
  disabled = false
}) {
  return (
    <div className="mb-8 flex-shrink-0">
      <fieldset className="space-y-4" disabled={disabled}>
        <legend className="text-sm font-semibold text-gray-900">
          {language === 'fr' ? 'Type d\'annonce' : 'Announcement Type'}
        </legend>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sell Option */}
          <label className={`relative flex items-center p-4 rounded-lg border-2 transition-all ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          } ${
            announcementType === 'sale'
              ? 'border-primary bg-primary/5'
              : `border-gray-200 bg-white ${!disabled ? 'hover:border-gray-300' : ''}`
          }`}>
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                announcementType === 'sale'
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              }`}>
                {announcementType === 'sale' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className={`w-5 h-5 ${announcementType === 'sale' ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`font-medium ${announcementType === 'sale' ? 'text-gray-900' : 'text-gray-700'}`}>
                  {language === 'fr' ? 'Cession' : 'Sale'}
                </span>
              </div>
            </div>
            <input
              type="radio"
              name="announcement-type"
              value="sale"
              checked={announcementType === 'sale'}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
          </label>

          {/* Acquisition Option */}
          <label className={`relative flex items-center p-4 rounded-lg border-2 transition-all ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          } ${
            announcementType === 'search'
              ? 'border-primary bg-primary/5'
              : `border-gray-200 bg-white ${!disabled ? 'hover:border-gray-300' : ''}`
          }`}>
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                announcementType === 'search'
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              }`}>
                {announcementType === 'search' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Search className={`w-5 h-5 ${announcementType === 'search' ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`font-medium ${announcementType === 'search' ? 'text-gray-900' : 'text-gray-700'}`}>
                  {language === 'fr' ? 'Acquisition' : 'Acquisition'}
                </span>
              </div>
            </div>
            <input
              type="radio"
              name="announcement-type"
              value="search"
              checked={announcementType === 'search'}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
          </label>
        </div>
      </fieldset>
    </div>
  );
}
