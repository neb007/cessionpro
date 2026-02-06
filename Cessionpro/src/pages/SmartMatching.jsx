import React, { useState } from 'react';
import { Zap, TrendingUp, Star, MapPin, DollarSign } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import SmartMatchingBanner from '@/components/layout/SmartMatchingBanner';

export default function SmartMatching() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isPurchased] = useState(false); // TODO: Get from user subscription data

  // Mock data - compatibilité matches
  const mockMatches = [
    {
      id: 1,
      company: 'Tech Solutions SARL',
      location: 'Paris, Île-de-France',
      score: 95,
      profile: 'Acheteur Stratégique',
      budget: '500k - 2M €',
      interests: ['Tech', 'SaaS', 'Fintech']
    },
    {
      id: 2,
      company: 'Groupe Expansion SA',
      location: 'Lyon, Rhône-Alpes',
      score: 88,
      profile: 'Investisseur',
      budget: '1M - 5M €',
      interests: ['Services', 'Commerce', 'Manufacturing']
    },
    {
      id: 3,
      company: 'Capital Partners LLC',
      location: 'Bordeaux, Aquitaine',
      score: 85,
      profile: 'Holding Familiale',
      budget: '200k - 1.5M €',
      interests: ['Retail', 'Immobilier', 'Services']
    },
    {
      id: 4,
      company: 'Industrial Ventures GmbH',
      location: 'Marseille, PACA',
      score: 82,
      profile: 'Acheteur Industriel',
      budget: '2M - 10M €',
      interests: ['Manufacturing', 'Logistics', 'Distribution']
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8F6D] flex items-center justify-center shadow-lg shadow-[#FF6B4A]/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#3B4759]">Smart Matching</h1>
            <p className="text-[#6B7A94]">
              {language === 'fr' 
                ? 'Trouvez les repreneurs et acheteurs idéaux pour votre entreprise'
                : 'Find the ideal buyers and acquirers for your business'}
            </p>
          </div>
        </div>
      </div>

      {/* Banner - Service Presentation */}
      {!isPurchased && (
        <div className="mb-8">
          <SmartMatchingBanner isPurchased={false} />
        </div>
      )}

      {/* Service Status */}
      {isPurchased ? (
        <>
          {/* Matches List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#3B4759]">
                {language === 'fr' ? 'Vos Matchs' : 'Your Matches'} ({mockMatches.length})
              </h2>
              <button className="px-4 py-2 bg-[#FF6B4A] hover:bg-[#FF5A3A] text-white rounded-lg transition-colors text-sm font-medium">
                {language === 'fr' ? 'Filtrer' : 'Filter'}
              </button>
            </div>

            {mockMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#3B4759] mb-2">
                      {match.company}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-[#6B7A94]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {match.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {match.budget}
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Score */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] opacity-20"></div>
                      <span className="text-2xl font-bold text-[#FF6B4A] z-10">
                        {match.score}%
                      </span>
                    </div>
                    <span className="text-xs text-[#6B7A94] mt-2">
                      {language === 'fr' ? 'Compatibilité' : 'Match Score'}
                    </span>
                  </div>
                </div>

                {/* Profile & Interests */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {match.profile}
                  </span>
                  {match.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-[#6B7A94] rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button className="w-full py-2 border border-[#FF6B4A] text-[#FF6B4A] hover:bg-[#FF6B4A]/5 rounded-lg font-medium transition-colors text-sm">
                  {language === 'fr' ? 'Établir le contact' : 'Make Contact'}
                </button>
              </div>
            ))}
          </div>

          {/* Alerts Setup */}
          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              {language === 'fr' ? 'Alertes Quotidiennes' : 'Daily Alerts'}
            </h3>
            <p className="text-blue-700 mb-4">
              {language === 'fr'
                ? 'Activez les alertes pour recevoir les nouveaux matchs chaque jour'
                : 'Enable alerts to receive new matches daily'}
            </p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
              {language === 'fr' ? 'Activer les Alertes' : 'Enable Alerts'}
            </button>
          </div>
        </>
      ) : (
        // Not Purchased - CTA
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-[#FF6B4A]/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-[#FF6B4A]" />
            </div>
            <h2 className="text-2xl font-bold text-[#3B4759] mb-2">
              {language === 'fr'
                ? 'Débloquez Smart Matching'
                : 'Unlock Smart Matching'}
            </h2>
            <p className="text-[#6B7A94] max-w-lg mx-auto">
              {language === 'fr'
                ? 'Obtenez une liste automatique et ciblée de repreneurs/acheteurs qualifiés adaptée à votre profil'
                : 'Get an automatic and targeted list of qualified buyers/acquirers tailored to your profile'}
            </p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] hover:from-[#FF5A3A] hover:to-[#FF7F5D] text-white rounded-lg font-medium transition-all shadow-lg shadow-[#FF6B4A]/25">
            {language === 'fr' ? 'Découvrir les Plans' : 'View Pricing'}
          </button>
        </div>
      )}
    </div>
  );
}
