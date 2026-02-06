import React from 'react';

export default function FormCompletionCircle({
  formData,
  language = 'fr',
  announcementType = 'sale'
}) {
  // Calculer le taux de complétude
  const calculateProgress = () => {
    let completedFields = 0;
    let totalFields = 0;

    // Champs requis
    const requiredFields = ['title', 'sector', 'asking_price', 'location'];
    requiredFields.forEach(field => {
      totalFields++;
      if (formData[field]) completedFields++;
    });

    // Champs optionnels mais recommandés
    const recommendedFields = [
      'description',
      'annual_revenue',
      'ebitda',
      'employees',
      'images'
    ];
    recommendedFields.forEach(field => {
      totalFields++;
      if (field === 'images' ? formData[field]?.length > 0 : formData[field]) {
        completedFields++;
      }
    });

    // Market info
    if (formData.market_position) completedFields++;
    if (formData.competitive_advantages) completedFields++;
    if (formData.growth_opportunities) completedFields++;
    totalFields += 3;

    return Math.round((completedFields / totalFields) * 100);
  };

  const progress = calculateProgress();
  const circumference = 2 * Math.PI * 45; // rayon = 45
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center justify-center py-6 mb-6">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Cercle SVG de progression */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Cercle de fond */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="8"
          />
          {/* Cercle de progression */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#ff6b4a"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.6s ease'
            }}
          />
        </svg>

        {/* Centre du cercle - Contenu */}
        <div className="relative z-10 text-center">
          <div className="text-3xl font-bold text-primary">
            {progress}%
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {language === 'fr' ? 'Formulaire' : 'Form'}
          </div>
        </div>
      </div>

      {/* Message informatif */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg w-full max-w-md">
        <p className="text-xs text-blue-700">
          💡 {language === 'fr'
            ? 'Complétez tous les champs requis (*) pour publier votre annonce'
            : 'Complete all required fields (*) to publish your listing'}
        </p>
      </div>
    </div>
  );
}
