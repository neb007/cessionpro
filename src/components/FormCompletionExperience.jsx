// @ts-nocheck
import React from 'react';

export default function FormCompletionExperience({ completion, language = 'fr' }) {
  const score = completion?.score || 0;
  const tierLabel = completion?.tier?.label || (language === 'fr' ? 'Faible' : 'Low');
  const guidance =
    score < 40
      ? (language === 'fr' ? 'Commencez par les champs obligatoires.' : 'Start with required fields.')
      : score < 70
        ? (language === 'fr' ? 'Continuez, votre annonce devient solide.' : 'Keep going, your listing is getting stronger.')
        : score < 85
          ? (language === 'fr' ? 'Très bon niveau, peaufinez les détails.' : 'Very good level, refine details.')
          : (language === 'fr' ? 'Excellent niveau de complétude.' : 'Excellent completion level.');

  const ringStyle = {
    background: `conic-gradient(#f47e50 ${score * 3.6}deg, #e5e7eb 0deg)`
  };

  return (
    <div className="sticky top-2 z-20 rounded-xl border border-gray-200 bg-white/95 backdrop-blur p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
            {language === 'fr' ? 'Taux de complétude (live)' : 'Live completion rate'}
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold text-primary">{score}%</span>
            <span className={`text-sm font-semibold ${completion?.tier?.color || 'text-gray-700'}`}>
              {tierLabel}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">{guidance}</p>
          <p className="text-[11px] text-gray-500 mt-1">
            {language === 'fr' ? 'Mise à jour en direct à chaque champ renseigné.' : 'Updates live as each field is filled.'}
          </p>
        </div>

        <div className="relative w-20 h-20 rounded-full" style={ringStyle}>
          <div className="absolute inset-2 rounded-full bg-white border border-gray-100 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-800">{score}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
