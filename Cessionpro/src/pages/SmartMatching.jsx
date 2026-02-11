import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, MapPin, DollarSign, Loader } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/api/supabaseClient';
import SmartMatchingBanner from '@/components/layout/SmartMatchingBanner';
import { calculateSmartMatchScore } from '@/services/smartMatchingEngine';

export default function SmartMatching() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isPurchased] = useState(true);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Charger les données depuis Supabase
  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          setMatches([]);
          setLoading(false);
          return;
        }

        // Récupérer toutes les annonces actives de Supabase
        const { data: listings, error: dbError } = await supabase
          .from('businesses')
          .select('*')
          .eq('status', 'active');

        if (dbError) {
          console.error('Supabase error:', dbError);
          throw dbError;
        }

        if (!listings || listings.length === 0) {
          // Si pas de vraies données, afficher les mocks
          setMatches(getMockMatches());
        } else if (listings.length === 1) {
          // Si une seule annonce, on ne peut pas faire de matching
          setMatches([]);
        } else {
          // Calculer les matches: la première annonce matched avec toutes les autres
          const selectedListing = listings[0];
          const allMatches = listings
            .filter(l => l.id !== selectedListing.id)
            .map(listing => ({
              ...listing,
              smartMatchScore: calculateSmartMatchScore(selectedListing, listing),
            }))
            .sort((a, b) => b.smartMatchScore.score - a.smartMatchScore.score);

          setMatches(allMatches);
        }
      } catch (err) {
        console.error('Error loading matches:', err);
        setError(err?.message || 'Une erreur est survenue');
        // Fallback to mock data on error
        setMatches(getMockMatches());
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [user]);

  const getScoreColor = (score) => {
    if (score >= 85) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: '🏆 Excellent' };
    if (score >= 70) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: '✅ Bon' };
    if (score >= 50) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: '⚠️ Acceptable' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: '❌ Faible' };
  };

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

      {/* Service Status */}
      {isPurchased ? (
        <>
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 animate-spin mx-auto text-[#FF6B4A] mb-4" />
              <p className="text-[#6B7A94]">{language === 'fr' ? 'Chargement...' : 'Loading...'}</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
              <p className="text-red-700">{language === 'fr' ? 'Erreur: ' : 'Error: '}{error}</p>
            </div>
          )}

          {/* No Matches */}
          {!loading && matches.length === 0 && !error && (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <p className="text-[#6B7A94]">
                {language === 'fr' 
                  ? 'Pas encore de match disponible. Revenez plus tard!'
                  : 'No matches available yet. Come back later!'}
              </p>
            </div>
          )}

          {/* Matches List */}
          {!loading && matches.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#3B4759]">
                  {language === 'fr' ? 'Vos Matchs' : 'Your Matches'} ({matches.length})
                </h2>
              </div>

              <div className="space-y-4">
                {matches.map((match) => {
                  const scoreColor = getScoreColor(match.smartMatchScore.score);
                  return (
                    <div
                      key={match.id}
                      className={`${scoreColor.bg} border ${scoreColor.border} rounded-lg p-6 hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#3B4759] mb-2">
                            {match.title || match.company}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-[#6B7A94]">
                            {match.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {match.location}
                              </div>
                            )}
                            {match.asking_price && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {(match.asking_price / 1000).toFixed(0)}k €
                              </div>
                            )}
                            {match.sector && (
                              <div>
                                <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                                  {match.sector}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Compatibility Score */}
                        <div className="flex flex-col items-center ml-4">
                          <div className={`relative w-16 h-16 flex items-center justify-center rounded-full ${scoreColor.bg} border-2 ${scoreColor.border}`}>
                            <span className={`text-2xl font-bold ${scoreColor.text}`}>
                              {match.smartMatchScore.score}%
                            </span>
                          </div>
                          <span className="text-xs text-[#6B7A94] mt-2 font-semibold">
                            {scoreColor.label}
                          </span>
                        </div>
                      </div>

                      {/* Explanation */}
                      {match.smartMatchScore.explanation && (
                        <p className="text-sm text-[#6B7A94] mb-4 italic">
                          {match.smartMatchScore.explanation}
                        </p>
                      )}

                      {/* Action Button */}
                      <button className={`w-full py-2 border-2 ${scoreColor.border} text-[#FF6B4A] hover:bg-[#FF6B4A]/5 rounded-lg font-medium transition-colors text-sm`}>
                        {language === 'fr' ? 'Voir les détails' : 'View Details'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
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
          </div>
        </div>
      )}
    </div>
  );
}
