import React from 'react';
import { motion } from 'framer-motion';
import { Target, Briefcase, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Step1Objective({ onSelectObjective, onEmailSignup, isLoading }) {
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal">
          Quel est votre objectif ?
        </h1>
      </motion.div>

      {/* Objective Cards */}
      <motion.div
        variants={itemVariants}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Buyer Card */}
        <motion.button
          onClick={() => onSelectObjective('buyer')}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group text-center"
        >
          <div className="bg-white rounded-lg shadow-md hover:shadow-hover transition-all duration-300 p-4 sm:p-6 border-2 border-transparent hover:border-primary cursor-pointer h-full">
            <div className="space-y-3 sm:space-y-4 flex flex-col items-center">
              {/* Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h2 className="font-display text-lg sm:text-xl font-bold text-charcoal group-hover:text-primary transition-colors">
                  Acheter
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  Acquéreur cherchant à reprendre une entreprise
                </p>
              </div>

              {/* Button */}
              <div className="flex items-center gap-2 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                <span>Continuer</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </motion.button>

        {/* Seller Card */}
        <motion.button
          onClick={() => onSelectObjective('seller')}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group text-center"
        >
          <div className="bg-white rounded-lg shadow-md hover:shadow-hover transition-all duration-300 p-4 sm:p-6 border-2 border-transparent hover:border-primary cursor-pointer h-full">
            <div className="space-y-3 sm:space-y-4 flex flex-col items-center">
              {/* Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h2 className="font-display text-lg sm:text-xl font-bold text-charcoal group-hover:text-primary transition-colors">
                  Vendre
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  Cédant proposant son entreprise à la reprise
                </p>
              </div>

              {/* Button */}
              <div className="flex items-center gap-2 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                <span>Continuer</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Divider */}
      <motion.div variants={itemVariants} className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-muted-foreground">
            Inscription rapide
          </span>
        </div>
      </motion.div>

      {/* Social Login Buttons */}
      <motion.div variants={itemVariants} className="space-y-3">
        {/* Email Signup */}
        <Button
          onClick={() => onEmailSignup('email')}
          disabled={isLoading}
          variant="outline"
          className="w-full h-12 border-2 border-charcoal/20 text-charcoal hover:bg-gray-50 transition-all"
        >
          <Mail className="w-5 h-5 mr-2" />
          <span className="font-semibold">Continuer avec Email</span>
        </Button>

        {/* Google Signup */}
        <Button
          onClick={() => onEmailSignup('google')}
          disabled={isLoading}
          variant="outline"
          className="w-full h-12 border-2 border-charcoal/20 text-charcoal hover:bg-gray-50 transition-all"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="font-semibold">Continuer avec Google</span>
        </Button>
      </motion.div>

      {/* Login Link */}
      <motion.div variants={itemVariants} className="text-center pt-4 border-t border-gray-200">
        <p className="text-charcoal/60">
          Vous avez déjà un compte ?{' '}
          <a href="/login" className="text-primary font-semibold hover:underline">
            Se connecter
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
