import React from 'react';
import { motion } from 'framer-motion';
import { Target, Briefcase, Mail, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

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

        {/* LinkedIn Signup */}
        <Button
          onClick={() => onEmailSignup('linkedin')}
          disabled={isLoading}
          className="w-full h-12 bg-[#0A66C2] hover:bg-[#095399] text-white transition-all"
        >
          <Linkedin className="w-5 h-5 mr-2" />
          <span className="font-semibold">Continuer avec LinkedIn</span>
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
