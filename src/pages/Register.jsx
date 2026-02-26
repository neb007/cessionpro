import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { validateEmail, calculatePasswordStrength, getPasswordStrengthColor, getPasswordStrengthTextColor, getPasswordStrengthText, AUTH_INPUT_CLASS } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

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

    if (password.length < 8) {
      setLocalError(language === 'fr' ? 'Le mot de passe doit contenir au moins 8 caractères' : 'Password must be at least 8 characters');
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
      // Error is already handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const translations = {
    fr: {
      title: 'Créer un compte Riviqo',
      subtitle: 'Rejoignez notre communauté de professionnels',
      email: 'Adresse email',
      emailPlaceholder: 'vous@exemple.com',
      password: 'Mot de passe',
      passwordPlaceholder: 'Au moins 8 caractères',
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
      passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
      passwordsMismatch: 'Les mots de passe ne correspondent pas',
      termsRequired: 'Veuillez accepter les conditions d\'utilisation',
      signingUp: 'Inscription en cours...',
      passwordStrength: 'Sécurité du mot de passe'
    },
    en: {
      title: 'Create a Riviqo Account',
      subtitle: 'Join our community of professionals',
      email: 'Email address',
      emailPlaceholder: 'you@example.com',
      password: 'Password',
      passwordPlaceholder: 'At least 8 characters',
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
      passwordTooShort: 'Password must be at least 8 characters',
      passwordsMismatch: 'Passwords do not match',
      termsRequired: 'Please accept the terms and conditions',
      signingUp: 'Signing up...',
      passwordStrength: 'Password strength'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl" />
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
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Logo size="md" showText={false} />
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                {t.title}
              </h1>
              <p className="text-muted-foreground text-sm">
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
                <Alert className="border-success/20 bg-success/10" role="alert">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success text-sm">
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
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/10" role="alert">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive text-sm">
                    {localError || authError?.message || t.registrationError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  {t.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={t.emailPlaceholder}
                  disabled={isLoading}
                  aria-invalid={!isEmailValid && email ? 'true' : undefined}
                  className={`${AUTH_INPUT_CLASS} ${
                    !isEmailValid && email ? 'border-destructive' : ''
                  }`}
                />
                {!isEmailValid && email && (
                  <p className="text-destructive text-xs mt-1">{t.invalidEmail}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  {t.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder={t.passwordPlaceholder}
                  disabled={isLoading}
                  className={AUTH_INPUT_CLASS}
                />
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{t.passwordStrength}</span>
                      <span className={`font-medium ${getPasswordStrengthTextColor(passwordStrength)}`}>
                        {getPasswordStrengthText(passwordStrength, language)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all ${getPasswordStrengthColor(passwordStrength)}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">
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
                  className={AUTH_INPUT_CLASS}
                />
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-destructive text-xs mt-1">{t.passwordsMismatch}</p>
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
                <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer font-normal">
                  {t.terms}
                </Label>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={isLoading || !isEmailValid || !agreedToTerms}
                aria-busy={isLoading}
                className="w-full text-white py-3 rounded-xl font-semibold shadow-hover flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'var(--gradient-coral)' }}
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
                <div className="w-full border-t border-border" />
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                {t.haveAccount}{' '}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:text-primary/80 transition"
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
