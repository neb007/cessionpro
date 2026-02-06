import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PasswordReset() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, updatePassword, clearAuthError, authError } = useAuth();
  const { language } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('request'); // 'request' or 'reset'
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Check if we have token from email link (password reset flow)
    const token = searchParams.get('token');
    if (token) {
      setStep('reset');
    }
  }, [searchParams]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(value === '' || validateEmail(value));
    setLocalError('');
    clearAuthError();
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setLocalError(language === 'fr' ? 'Veuillez entrer votre email' : 'Please enter your email');
      return;
    }

    if (!isEmailValid) {
      setLocalError(language === 'fr' ? 'Veuillez entrer un email valide' : 'Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email.trim());
      
      const message = language === 'fr'
        ? 'Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte mail.'
        : 'A password reset email has been sent. Check your inbox.';
      
      setSuccessMessage(message);
      setEmail('');
      
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (error) {
      console.error('Password reset request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (!newPassword) {
      setLocalError(language === 'fr' ? 'Veuillez entrer votre nouveau mot de passe' : 'Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      setLocalError(language === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères' : 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError(language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(newPassword);
      
      const message = language === 'fr'
        ? 'Votre mot de passe a été réinitialisé avec succès !'
        : 'Your password has been reset successfully!';
      
      setSuccessMessage(message);
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const translations = {
    fr: {
      requestTitle: 'Réinitialiser votre mot de passe',
      requestSubtitle: 'Entrez votre adresse email pour recevoir un lien de réinitialisation',
      resetTitle: 'Définir un nouveau mot de passe',
      resetSubtitle: 'Choisissez un nouveau mot de passe sécurisé',
      email: 'Adresse email',
      emailPlaceholder: 'vous@exemple.com',
      newPassword: 'Nouveau mot de passe',
      newPasswordPlaceholder: 'Au moins 6 caractères',
      confirmPassword: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Confirmer votre mot de passe',
      sendReset: 'Envoyer le lien',
      updatePassword: 'Réinitialiser',
      backToLogin: 'Retour à la connexion',
      emailRequired: 'Veuillez entrer votre email',
      invalidEmail: 'Veuillez entrer un email valide',
      passwordRequired: 'Veuillez entrer votre mot de passe',
      passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
      passwordsMismatch: 'Les mots de passe ne correspondent pas',
      sending: 'Envoi en cours...',
      updating: 'Mise à jour en cours...',
      resetError: 'Erreur lors de la réinitialisation',
      emailSent: 'Email envoyé avec succès',
      passwordUpdated: 'Mot de passe réinitialisé avec succès'
    },
    en: {
      requestTitle: 'Reset Your Password',
      requestSubtitle: 'Enter your email address to receive a reset link',
      resetTitle: 'Set a New Password',
      resetSubtitle: 'Choose a secure new password',
      email: 'Email address',
      emailPlaceholder: 'you@example.com',
      newPassword: 'New password',
      newPasswordPlaceholder: 'At least 6 characters',
      confirmPassword: 'Confirm password',
      confirmPasswordPlaceholder: 'Confirm your password',
      sendReset: 'Send reset link',
      updatePassword: 'Reset password',
      backToLogin: 'Back to login',
      emailRequired: 'Please enter your email',
      invalidEmail: 'Please enter a valid email',
      passwordRequired: 'Please enter your password',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordsMismatch: 'Passwords do not match',
      sending: 'Sending...',
      updating: 'Updating...',
      resetError: 'Password reset failed',
      emailSent: 'Email sent successfully',
      passwordUpdated: 'Password reset successfully'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B4759] via-[#2C3544] to-[#3B4759]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B4A]/30 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF8F6D]/30 rounded-full filter blur-3xl" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
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
                {step === 'request' ? t.requestTitle : t.resetTitle}
              </h1>
              <p className="text-gray-500 text-sm">
                {step === 'request' ? t.requestSubtitle : t.resetSubtitle}
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
                    {localError || authError?.message || t.resetError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Request Reset Form */}
            {step === 'request' && (
              <form onSubmit={handleRequestReset} className="space-y-5">
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

                {/* Send Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !isEmailValid}
                  className="w-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] hover:from-[#FF5A3A] hover:to-[#FF7F5D] text-white py-3 rounded-xl font-semibold shadow-lg shadow-[#FF6B4A]/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.sending}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      {t.sendReset}
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Reset Password Form */}
            {step === 'reset' && (
              <form onSubmit={handleUpdatePassword} className="space-y-5">
                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                    {t.newPassword}
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setLocalError('');
                      clearAuthError();
                    }}
                    placeholder={t.newPasswordPlaceholder}
                    disabled={isLoading}
                    className="rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#FF6B4A] focus:bg-white focus:outline-none transition"
                  />
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
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{t.passwordsMismatch}</p>
                  )}
                </div>

                {/* Update Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] hover:from-[#FF5A3A] hover:to-[#FF7F5D] text-white py-3 rounded-xl font-semibold shadow-lg shadow-[#FF6B4A]/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.updating}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      {t.updatePassword}
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
            </div>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[#FF6B4A] hover:text-[#FF5A3A] font-medium transition"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.backToLogin}
              </Link>
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
