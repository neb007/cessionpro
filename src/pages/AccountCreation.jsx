import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import ProgressBar from './accountCreation/ProgressBar';
import Step1Objective from './accountCreation/Step1Objective';
import Step2ProfileType from './accountCreation/Step2ProfileType';
import Step3ContactInfo from './accountCreation/Step3ContactInfo';
import Logo from '@/components/Logo';

const TOTAL_STEPS = 3;

export default function AccountCreation() {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();

  // State Management
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Step 1
    userGoal: '', // 'buyer' or 'seller'
    
    // Step 2
    profileType: '', // 'professional', 'consulting', 'investment_fund'
    transactionSize: '', // 'less_1m', '1_5m', '5_10m', 'more_10m'
    
    // Step 3
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    password: '',
    confirmPassword: '',
    sectors: [], // Array of selected sectors
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/Annonces');
    }
  }, [isAuthenticated, user, navigate]);

  // Handle Step 1: Select Objective
  const handleSelectObjective = (objective) => {
    setFormData({ ...formData, userGoal: objective });
    setCurrentStep(2);
  };

  // Handle Email/LinkedIn signup
  const handleEmailSignup = (method) => {
    // Este se puede expandir para LinkedIn OAuth en el futuro
    if (method === 'email') {
      setCurrentStep(2);
    } else if (method === 'linkedin') {
      // TODO: Implement LinkedIn OAuth
      console.log('LinkedIn signup not yet implemented');
    }
  };

  // Handle Next Step
  const handleNext = async () => {
    if (currentStep === TOTAL_STEPS) {
      // Final step - Create account
      await handleCreateAccount();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle Previous Step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Create Account
  const handleCreateAccount = async () => {
    try {
      setError('');
      setIsLoading(true);

      // Validate required fields
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.company.trim()) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      if (formData.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }

      // Construct email from first name and last name (or use a simple format)
      // Note: In production, you might want to ask for email instead
      const email = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@cessionpro.local`.replace(/\s+/g, '');

      // Register with Supabase
      const result = await register(email, formData.password);

      if (result?.user) {
        // TODO: Save additional profile data to database
        // This would include: firstName, lastName, company, phone, userGoal, profileType, transactionSize, sectors
        
        // For now, navigate to home after successful registration
        setTimeout(() => {
          navigate('/Annonces');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const pageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const transition = {
    x: { type: 'spring', stiffness: 300, damping: 30 },
    opacity: { duration: 0.3 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/30 rounded-full filter blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Card Container */}
          <div className="bg-white rounded-lg shadow-2xl p-8 sm:p-12 space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Logo size="md" showText={false} />
            </div>

            {/* Progress Bar */}
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

            {/* Step Content with Animation */}
            <AnimatePresence mode="wait" custom={currentStep}>
              <motion.div
                key={currentStep}
                custom={currentStep}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                {currentStep === 1 && (
                  <Step1Objective
                    onSelectObjective={handleSelectObjective}
                    onEmailSignup={handleEmailSignup}
                    isLoading={isLoading}
                  />
                )}

                {currentStep === 2 && (
                  <Step2ProfileType
                    onNext={handleNext}
                    onBack={handleBack}
                    formData={formData}
                    setFormData={setFormData}
                    isLoading={isLoading}
                  />
                )}

                {currentStep === 3 && (
                  <Step3ContactInfo
                    onNext={handleNext}
                    onBack={handleBack}
                    formData={formData}
                    setFormData={setFormData}
                    isLoading={isLoading}
                    error={error}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8 text-white/60 text-xs">
            <p>Vos données sont sécurisées et chiffrées</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
