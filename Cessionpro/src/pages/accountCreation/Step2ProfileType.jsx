import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PROFILE_TYPES = [
  {
    id: 'professional',
    label: 'Professionnel / Indépendant',
    description: 'Chef d\'entreprise, indépendant, entrepreneur',
    icon: User,
  },
  {
    id: 'consulting',
    label: 'Cabinet de Conseil en M&A',
    description: 'Conseil en fusion-acquisition, stratégie',
    icon: Building2,
  },
  {
    id: 'investment_fund',
    label: 'Fonds d\'Investissement',
    description: 'Fonds de capital-investissement',
    icon: TrendingUp,
  },
];

export default function Step2ProfileType({
  onNext,
  onBack,
  formData,
  setFormData,
  isLoading,
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const handleProfileTypeSelect = (profileType) => {
    setFormData({ ...formData, profileType });
  };

  const isValid = formData.profileType;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Section 1: Profile Type */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-charcoal mb-4">
            Quel est votre profil ?
          </h3>
        </div>

        <div className="grid gap-4">
          {PROFILE_TYPES.map((profile) => {
            const Icon = profile.icon;
            const isSelected = formData.profileType === profile.id;

            return (
              <motion.button
                key={profile.id}
                onClick={() => handleProfileTypeSelect(profile.id)}
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`text-left transition-all duration-300 rounded-lg p-5 border-2 ${
                  isSelected
                    ? 'bg-primary/5 border-primary shadow-glow'
                    : 'bg-white border-gray-200 hover:border-primary/50 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-charcoal group-hover:bg-primary/10'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold transition-colors ${
                      isSelected ? 'text-primary' : 'text-charcoal'
                    }`}>
                      {profile.label}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile.description}
                    </p>
                  </div>

                  {/* Checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0"
                    >
                      <span className="text-sm font-bold">✓</span>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex gap-3 pt-3">
        <Button
          onClick={onNext}
          disabled={!isValid || isLoading}
          className="w-full h-12 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuer
        </Button>
      </motion.div>
    </motion.div>
  );
}
