import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SECTORS = [
  'Technology',
  'Industrie',
  'Santé',
  'Construction',
  'Retail',
  'Logistique',
  'Services',
  'Hospitality',
  'Manufacturing',
  'Agriculture',
  'Autre',
];

export default function Step3ContactInfo({
  onNext,
  onBack,
  formData,
  setFormData,
  isLoading,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touched, setTouched] = useState({});

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Password strength calculation
  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return Math.min(strength, 5);
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setFormData({ ...formData, password: pwd });
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setTouched({ ...touched, [field]: true });
  };

  const toggleSector = (sector) => {
    const current = formData.sectors || [];
    if (current.includes(sector)) {
      setFormData({ ...formData, sectors: current.filter(s => s !== sector) });
    } else if (current.length < 3) {
      setFormData({ ...formData, sectors: [...current, sector] });
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    const texts = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    return texts[passwordStrength];
  };

  // Validation
  const firstNameError = touched.firstName && !formData.firstName.trim();
  const lastNameError = touched.lastName && !formData.lastName.trim();
  const companyError = touched.company && !formData.company.trim();
  const passwordError = touched.password && formData.password.length < 8;
  const passwordMatchError =
    touched.confirmPassword &&
    formData.password &&
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword;

  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.company.trim() &&
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword;

  const selectedSectorCount = (formData.sectors || []).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="font-display text-base sm:text-lg font-bold text-charcoal">
          Vos Informations
        </h2>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="destructive" className="border-red-200 bg-red-50 py-2">
            <AlertCircle className="h-3 w-3 text-red-600" />
            <AlertDescription className="text-red-700 text-xs mt-1">
              {error}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Section 1: Personal Information (Required) */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="mb-0">
          <h3 className="font-display text-sm font-semibold text-charcoal">
            Informations <span className="text-primary">*</span>
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-charcoal font-medium">
              Prénom <span className="text-primary">*</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              onBlur={() => setTouched({ ...touched, firstName: true })}
              placeholder="Votre prénom"
              disabled={isLoading}
              className={`rounded-lg border-2 bg-gray-50 px-4 py-3 text-charcoal focus:bg-white focus:outline-none transition-all ${
                firstNameError
                  ? 'border-red-300'
                  : 'border-gray-200 focus:border-primary'
              }`}
            />
            {firstNameError && (
              <p className="text-red-500 text-xs">Le prénom est obligatoire</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-charcoal font-medium">
              Nom <span className="text-primary">*</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              onBlur={() => setTouched({ ...touched, lastName: true })}
              placeholder="Votre nom"
              disabled={isLoading}
              className={`rounded-lg border-2 bg-gray-50 px-4 py-3 text-charcoal focus:bg-white focus:outline-none transition-all ${
                lastNameError
                  ? 'border-red-300'
                  : 'border-gray-200 focus:border-primary'
              }`}
            />
            {lastNameError && (
              <p className="text-red-500 text-xs">Le nom est obligatoire</p>
            )}
          </div>
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company" className="text-charcoal font-medium">
            Société <span className="text-primary">*</span>
          </Label>
          <Input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => handleFieldChange('company', e.target.value)}
            onBlur={() => setTouched({ ...touched, company: true })}
            placeholder="Nom de votre entreprise"
            disabled={isLoading}
            className={`rounded-lg border-2 bg-gray-50 px-4 py-3 text-charcoal focus:bg-white focus:outline-none transition-all ${
              companyError
                ? 'border-red-300'
                : 'border-gray-200 focus:border-primary'
            }`}
          />
          {companyError && (
            <p className="text-red-500 text-xs">
              La société est obligatoire (nécessaire pour créer une annonce)
            </p>
          )}
        </div>

        {/* Phone (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-charcoal font-medium">
            Téléphone
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="+33 6 12 34 56 78"
            disabled={isLoading}
            className="rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-charcoal focus:border-primary focus:bg-white focus:outline-none transition-all"
          />
        </div>
      </motion.div>

      {/* Section 2: Security (Required) */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-charcoal mb-4">
            Sécurité <span className="text-primary">*</span>
          </h3>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-charcoal font-medium">
            Mot de passe <span className="text-primary">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handlePasswordChange}
              onBlur={() => setTouched({ ...touched, password: true })}
              placeholder="Au moins 8 caractères"
              disabled={isLoading}
              className={`rounded-lg border-2 bg-gray-50 px-4 py-3 pr-12 text-charcoal focus:bg-white focus:outline-none transition-all ${
                passwordError
                  ? 'border-red-300'
                  : 'border-gray-200 focus:border-primary'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-charcoal transition"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Sécurité du mot de passe</span>
                <span
                  className={`font-medium ${
                    passwordStrength <= 2
                      ? 'text-red-600'
                      : passwordStrength <= 3
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                >
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {passwordError && (
            <p className="text-red-500 text-xs">
              Le mot de passe doit contenir au moins 8 caractères
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-charcoal font-medium">
            Confirmer le mot de passe <span className="text-primary">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
              onBlur={() => setTouched({ ...touched, confirmPassword: true })}
              placeholder="Confirmez votre mot de passe"
              disabled={isLoading}
              className={`rounded-lg border-2 bg-gray-50 px-4 py-3 pr-12 text-charcoal focus:bg-white focus:outline-none transition-all ${
                passwordMatchError
                  ? 'border-red-300'
                  : 'border-gray-200 focus:border-primary'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-charcoal transition"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {passwordMatchError && (
            <p className="text-red-500 text-xs">
              Les mots de passe ne correspondent pas
            </p>
          )}
        </div>
      </motion.div>

      {/* Section 3: Sector Interests */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div>
          <h3 className="font-display text-sm font-semibold text-charcoal">
            Secteurs
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {SECTORS.map((sector) => {
            const isSelected = (formData.sectors || []).includes(sector);
            const isDisabled = selectedSectorCount >= 3 && !isSelected;

            return (
              <motion.button
                key={sector}
                onClick={() => !isDisabled && toggleSector(sector)}
                disabled={isDisabled || isLoading}
                whileHover={!isDisabled ? { scale: 1.05 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-charcoal hover:bg-primary/10 hover:border-primary'
                }`}
              >
                {isSelected && <span className="mr-2">✓</span>}
                {sector}
              </motion.button>
            );
          })}
        </div>

        {selectedSectorCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm text-charcoal"
          >
            <span className="font-semibold">{selectedSectorCount}/3</span> secteur(s) sélectionné(s)
          </motion.div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex gap-3 pt-3">
        <Button
          onClick={onNext}
          disabled={!isFormValid || isLoading}
          className="w-full h-12 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Créer mon Compte
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
