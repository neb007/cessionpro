import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, AlertCircle } from 'lucide-react';
import { computeListingCompletionScore } from '@/utils/listingCompletionScore';

export default function FormProgress({
  formData,
  language = 'fr',
  announcementType = 'sale'
}) {
  const completion = computeListingCompletionScore(formData, language, announcementType);
  const progress = completion.score;

  // Sections de complétude
  const sections = [
    {
      name: language === 'fr' ? 'Général' : 'General',
      fields: ['title', 'sector', 'location', 'description'],
      required: ['title', 'sector', 'location']
    },
    {
      name: language === 'fr' ? 'Financier' : 'Financial',
      fields: ['asking_price', 'annual_revenue', 'ebitda', 'employees', 'year_founded'],
      required: ['asking_price']
    },
    {
      name: language === 'fr' ? 'Photos' : 'Images',
      fields: ['images'],
      required: []
    },
    {
      name: language === 'fr' ? 'Marché' : 'Market',
      fields: ['market_position', 'competitive_advantages', 'growth_opportunities'],
      required: []
    }
  ];

  const getSectionProgress = (section) => {
    const completed = section.fields.filter(field => {
      if (field === 'images') return formData[field]?.length > 0;
      return formData[field];
    }).length;
    return Math.round((completed / section.fields.length) * 100);
  };

  const isRequiredComplete = (section) => {
    return section.required.every(field => formData[field]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-900">
            {language === 'fr' ? 'Complétude du formulaire' : 'Form Completion'}
          </p>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sections.map((section, idx) => {
          const sectionProgress = getSectionProgress(section);
          const isComplete = sectionProgress === 100;
          const isRequired = section.required.length > 0;
          const hasRequiredFields = isRequiredComplete(section);

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                isComplete
                  ? 'bg-green-50 border-green-200'
                  : isRequired && !hasRequiredFields
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isComplete ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : isRequired && !hasRequiredFields ? (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-300" />
                )}
                <p className="text-xs font-medium text-gray-900 truncate">
                  {section.name}
                </p>
              </div>
              <p className={`text-xs font-semibold ${
                isComplete
                  ? 'text-green-700'
                  : isRequired && !hasRequiredFields
                    ? 'text-red-700'
                    : 'text-gray-600'
              }`}>
                {sectionProgress}%
              </p>
            </div>
          );
        })}
      </div>

      {/* Info Message */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 {language === 'fr'
            ? 'Complétez tous les champs requis (*) pour publier votre annonce'
            : 'Complete all required fields (*) to publish your listing'}
        </p>
      </div>
    </div>
  );
}
