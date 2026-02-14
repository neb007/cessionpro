import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { 
  Laptop, 
  ShoppingBag, 
  Utensils, 
  Factory, 
  Briefcase, 
  Heart, 
  Building, 
  Truck, 
  Sprout,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const sectorIcons = {
  technology: Laptop,
  retail: ShoppingBag,
  hospitality: Utensils,
  manufacturing: Factory,
  services: Briefcase,
  healthcare: Heart,
  construction: Building,
  transport: Truck,
  agriculture: Sprout,
  other: MoreHorizontal,
};

const sectorColors = {
  technology: 'from-[#FF6B4A] to-[#FF8F6D]',
  retail: 'from-[#FF8F6D] to-[#FFA488]',
  hospitality: 'from-[#FFA488] to-[#FFB9A3]',
  manufacturing: 'from-[#5B9BD5] to-[#78B0E0]',
  services: 'from-[#66BB6A] to-[#81C784]',
  healthcare: 'from-[#FF6B4A] to-[#FF5A3A]',
  construction: 'from-[#FF8F6D] to-[#FF7F5D]',
  transport: 'from-[#4DB6AC] to-[#6BC5BF]',
  agriculture: 'from-[#9CCC65] to-[#AED581]',
  other: 'from-gray-400 to-gray-500',
};

export default function Categories() {
  const { t } = useLanguage();

  const sectors = [
    'technology',
    'retail',
    'hospitality',
    'manufacturing',
    'services',
    'healthcare',
    'construction',
    'transport',
    'agriculture',
    'other',
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-[#3B4759] mb-4">
            {t('language') === 'fr' ? 'Secteurs d\'activité' : 'Business Sectors'}
          </h1>
          <p className="text-lg text-[#111827] max-w-2xl mx-auto">
            {t('language') === 'fr' 
              ? 'Explorez les entreprises par secteur d\'activité'
              : 'Explore businesses by industry sector'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sectors.map((sector, index) => {
            const Icon = sectorIcons[sector];
            return (
              <motion.div
                key={sector}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={createPageUrl(`Annonces?sector=${sector}`)}>
                  <Card className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden h-full">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sectorColors[sector]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-display text-xl font-semibold text-[#3B4759] mb-2 group-hover:text-[#FF6B4A] transition-colors">
                        {t(sector)}
                      </h3>
                      <p className="text-sm text-[#111827]">
                        {t('language') === 'fr' ? 'Voir les annonces' : 'View listings'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}