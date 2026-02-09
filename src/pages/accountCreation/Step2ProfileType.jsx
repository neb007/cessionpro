import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building2, TrendingUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const TRANSACTION_SIZES = [
  { value: 'less_1m', label: 'Moins de 1M€' },
  { value: '1_5m', label: '1M€ - 5M€' },
  { value: '5_10m', label: '5M€ - 10M€' },
  { value: 'more_10m', label: 'Plus de 10M€' },
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

  const handleTransactionSizeChange = (transactionSize) => {
    setFormData({ ...formData, transactionSize });
  };

  const isValid = formData.profileType && formData.transactionSize;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">
          Profil et Segmentation
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Ces informations nous aident à personnaliser votre expérience
        </p>
      </motion.div>

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

      {/* Section 2: Transaction Size */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <label className="font-display text-lg font-semibold text-charcoal block mb-4">
            Taille habituelle de vos transactions
          </label>
          <p className="text-sm text-muted-foreground mb-4">
            Cette information nous aide à optimiser nos recommandations
          </p>
        </div>

        <Select
          value={formData.transactionSize}
          onValueChange={handleTransactionSizeChange}
          disabled={isLoading}
        >
          <SelectTrigger className="rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-charcoal focus:border-primary focus:outline-none transition-colors h-12">
            <SelectValue placeholder="Sélectionnez une taille de transaction" />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_SIZES.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Transaction Size Badge (Visual Feedback) */}
        {formData.transactionSize && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <p className="text-sm text-charcoal">
              <span className="font-semibold">Sélection :</span>{' '}
              <span className="text-primary">
                {TRANSACTION_SIZES.find(s => s.value === formData.transactionSize)?.label}
              </span>
            </p>
          </motion.div>
        )}
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
