import React from 'react';
import { Building2, Search } from 'lucide-react';

export default function AnnouncementTypeRadio({
  announcementType,
  onChange,
  language
}) {
  return (
    <div className="mb-8 flex-shrink-0">
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-gray-900">
          {language === 'fr' ? 'Type d\'annonce' : 'Announcement Type'}
        </legend>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sell Option */}
          <label className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
            announcementType === 'sale'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 bg-white hover:border-gray-300'
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
                  {language === 'fr' ? 'Je vends' : 'I\'m selling'}
                </span>
              </div>
            </div>
            <input
              type="radio"
              name="announcement-type"
              value="sale"
              checked={announcementType === 'sale'}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
          </label>

          {/* Buy Option */}
          <label className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
            announcementType === 'search'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 bg-white hover:border-gray-300'
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
                  {language === 'fr' ? 'Je cherche' : 'I\'m looking'}
                </span>
              </div>
            </div>
            <input
              type="radio"
              name="announcement-type"
              value="search"
              checked={announcementType === 'search'}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
          </label>
        </div>
      </fieldset>
    </div>
  );
}
