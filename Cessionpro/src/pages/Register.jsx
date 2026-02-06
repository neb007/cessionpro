import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, authError, clearAuthError } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/Annonces');
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 5);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(value === '' || validateEmail(value));
    setLocalError('');
    clearAuthError();
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(calculatePasswordStrength(value));
    setLocalError('');
    clearAuthError();
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    const texts = {
      fr: ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'],
      en: ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong']
    };
    return texts[language][passwordStrength - 1];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    // Validation
    if (!email.trim()) {
      setLocalError(language === 'fr' ? 'Veuillez entrer votre email' : 'Please enter your email');
      return;
    }

    if (!isEmailValid) {
      setLocalError(language === 'fr' ? 'Veuillez entrer un email valide' : 'Please enter a valid email');
      return;
    }

    if (!password) {
      setLocalError(language === 'fr' ? 'Veuillez entrer un mot de passe' : 'Please enter a password');
      return;
    }

    if (password.length < 6) {
      setLocalError(language === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères' : 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError(language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setLocalError(language === 'fr' ? 'Veuillez accepter les conditions d\'utilisation' : 'Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      await register(email.trim(), password);
      
      const message = language === 'fr'
        ? 'Un email de confirmation a été envoyé. Veuillez vérifier votre boîte mail.'
        : 'A confirmation email has been sent. Please check your inbox.';
      
      setSuccessMessage(message);
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const translations = {
    fr: {
      title: 'Créer un compte CessionPro',
      subtitle: 'Rejoignez notre communauté de professionnels',
      email: 'Adresse email',
      emailPlaceholder: 'vous@exemple.com',
      password: 'Mot de passe',
      passwordPlaceholder: 'Au moins 6 caractères',
      confirmPassword: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Confirmer votre mot de passe',
      terms: 'J\'accepte les conditions d\'utilisation et la politique de confidentialité',
      signup: 'Créer mon compte',
      haveAccount: 'Vous avez déjà un compte ?',
      login: 'Se connecter',
      registrationError: 'Échec de l\'inscription',
      emailRequired: 'Veuillez entrer votre email',
      invalidEmail: 'Veuillez entrer un email valide',
      passwordRequired: 'Veuillez entrer un mot de passe',
      passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
      passwordsMismatch: 'Les mots de passe ne correspondent pas',
      termsRequired: 'Veuillez accepter les conditions d\'utilisation',
      signingUp: 'Inscription en cours...',
      passwordStrength: 'Sécurité du mot de passe'
    },
    en: {
      title: 'Create a CessionPro Account',
      subtitle: 'Join our community of professionals',
      email: 'Email address',
      emailPlaceholder: 'you@example.com',
      password: 'Password',
      passwordPlaceholder: 'At least 6 characters',
      confirmPassword: 'Confirm password',
      confirmPasswordPlaceholder: 'Confirm your password',
      terms: 'I accept the terms and conditions and privacy policy',
      signup: 'Create my account',
      haveAccount: 'Already have an account?',
      login: 'Sign in',
      registrationError: 'Registration failed',
      emailRequired: 'Please enter your email',
      invalidEmail: 'Please enter a valid email',
      passwordRequired: 'Please enter a password',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordsMismatch: 'Passwords do not match',
      termsRequired: 'Please accept the terms and conditions',
      signingUp: 'Signing up...',
      passwordStrength: 'Password strength'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B4759] via-[#2C3544] to-[#3B4759]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6B4A]/30 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF8F6D]/30 rounded-full filter blur-3xl" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Card Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
                {t.title}
              </h1>
              <p className="text-gray-500 text-sm">
                {t.subtitle}
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 text-sm">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Error Messages */}
            {(localError || authError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 text-sm">
                    {localError || authError?.message || t.registrationError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  {t.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={t.emailPlaceholder}
                  disabled={isLoading}
                  className={`rounded-xl border-2 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#FF6B4A] focus:bg-white focus:outline-none transition ${
                    !isEmailValid && email ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {!isEmailValid && email && (
                  <p className="text-red-500 text-xs mt-1">{t.invalidEmail}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  {t.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder={t.passwordPlaceholder}
                  disabled={isLoading}
                  className="rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#FF6B4A] focus:bg-white focus:outline-none transition"
                />
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{t.passwordStrength}</span>
                      <span className={`font-medium ${
                        passwordStrength <= 2 ? 'text-red-600' : 
                        passwordStrength <= 3 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
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
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  {t.confirmPassword}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setLocalError('');
                    clearAuthError();
                  }}
                  placeholder={t.confirmPasswordPlaceholder}
                  disabled={isLoading}
                  className="rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#FF6B4A] focus:bg-white focus:outline-none transition"
                />
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{t.passwordsMismatch}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={setAgreedToTerms}
                  disabled={isLoading}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer font-normal">
                  {t.terms}
                </Label>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={isLoading || !isEmailValid || !agreedToTerms}
                className="w-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] hover:from-[#FF5A3A] hover:to-[#FF7F5D] text-white py-3 rounded-xl font-semibold shadow-lg shadow-[#FF6B4A]/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.signingUp}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    {t.signup}
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                {t.haveAccount}{' '}
                <Link
                  to="/login"
                  className="font-semibold text-[#FF6B4A] hover:text-[#FF5A3A] transition"
                >
                  {t.login}
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-6 text-white/60 text-xs">
            <p>
              {language === 'fr'
                ? 'Vos données sont sécurisées et chiffrées'
                : 'Your data is secure and encrypted'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
