import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import BusinessCard from '@/components/ui/BusinessCard';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Favorites() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const favs = await base44.entities.Favorite.filter({ user_email: user.email });
      setFavorites(favs);

      if (favs.length > 0) {
        const allBusinesses = await base44.entities.Business.list();
        const favBusinesses = allBusinesses.filter(b => favs.some(f => f.business_id === b.id));
        setBusinesses(favBusinesses);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toggleFavorite = async (businessId) => {
    const fav = favorites.find(f => f.business_id === businessId);
    if (fav) {
      await base44.entities.Favorite.delete(fav.id);
      setFavorites(favorites.filter(f => f.id !== fav.id));
      setBusinesses(businesses.filter(b => b.id !== businessId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {t('my_favorites')}
          </h1>
          <p className="text-gray-500">
            {businesses.length} {language === 'fr' ? 'entreprises sauvegardées' : 'saved businesses'}
          </p>
        </div>

        {/* Content */}
        {businesses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-rose-300" />
            </div>
            <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
              {t('no_favorites')}
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              {language === 'fr' 
                ? 'Explorez les annonces et ajoutez vos entreprises préférées aux favoris'
                : 'Browse listings and add your favorite businesses to favorites'}
            </p>
            <Button onClick={() => navigate(createPageUrl('Annonces'))}>
              <Search className="w-4 h-4 mr-2" />
              {t('businesses')}
            </Button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {businesses.map((business) => (
                <motion.div
                  key={business.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <BusinessCard
                    business={business}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}