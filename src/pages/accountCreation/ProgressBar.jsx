import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ currentStep, totalSteps }) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8 space-y-3">
      {/* Progress Percentage */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-charcoal">
          Profil complété
        </h3>
        <span className="text-sm font-semibold text-primary">
          {progressPercentage.toFixed(0)}%
        </span>
      </div>

      {/* Progress Bar Background */}
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        {/* Progress Bar Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
        />
      </div>

      {/* Step Indicators */}
      <div className="flex gap-2 justify-center">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{
              scale: i < currentStep ? 1 : 0.8,
              opacity: i < currentStep ? 1 : 0.5,
            }}
            className={`h-2 rounded-full transition-all ${
              i < currentStep
                ? 'bg-primary w-6'
                : 'bg-gray-300 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
