import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, authError, clearAuthError } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/Annonces');
    }
  }, [isAuthenticated, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

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
      setLocalError(language === 'fr' ? 'Veuillez entrer votre mot de passe' : 'Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
      
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
      navigate('/Annonces');
    } catch (error) {
      console.error('Login failed:', error);
      // Error is already handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const translations = {
    fr: {
      title: 'Connexion à CessionPro',
      subtitle: 'Accédez à votre compte pour explorer les opportunités',
      email: 'Adresse email',
      emailPlaceholder: 'vous@exemple.com',
      password: 'Mot de passe',
      passwordPlaceholder: 'Votre mot de passe sécurisé',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      login: 'Se connecter',
      noAccount: 'Vous n\'avez pas de compte ?',
      createAccount: 'Créer un compte',
      loginError: 'Échec de la connexion',
      invalidCredentials: 'Email ou mot de passe incorrect',
      emailRequired: 'Veuillez entrer votre email',
      invalidEmail: 'Veuillez entrer un email valide',
      passwordRequired: 'Veuillez entrer votre mot de passe',
      connecting: 'Connexion en cours...'
    },
    en: {
      title: 'Login to CessionPro',
      subtitle: 'Access your account to explore opportunities',
      email: 'Email address',
      emailPlaceholder: 'you@example.com',
      password: 'Password',
      passwordPlaceholder: 'Your secure password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      login: 'Sign in',
      noAccount: 'Don\'t have an account?',
      createAccount: 'Create one',
      loginError: 'Sign in failed',
      invalidCredentials: 'Invalid email or password',
      emailRequired: 'Please enter your email',
      invalidEmail: 'Please enter a valid email',
      passwordRequired: 'Please enter your password',
      connecting: 'Signing in...'
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
                {t.title}
              </h1>
              <p className="text-gray-500 text-sm">
                {t.subtitle}
              </p>
            </div>

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
                    {localError || authError?.message || t.loginError}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError('');
                    clearAuthError();
                  }}
                  placeholder={t.passwordPlaceholder}
                  disabled={isLoading}
                  className="rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#FF6B4A] focus:bg-white focus:outline-none transition"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    disabled={isLoading}
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer font-normal">
                    {t.rememberMe}
                  </Label>
                </div>
                <Link
                  to="/password-reset"
                  className="text-sm text-[#FF6B4A] hover:text-[#FF5A3A] font-medium transition"
                >
                  {t.forgotPassword}
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading || !isEmailValid}
                className="w-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8F6D] hover:from-[#FF5A3A] hover:to-[#FF7F5D] text-white py-3 rounded-xl font-semibold shadow-lg shadow-[#FF6B4A]/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.connecting}
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    {t.login}
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

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                {t.noAccount}{' '}
                <Link
                  to="/register"
                  className="font-semibold text-[#FF6B4A] hover:text-[#FF5A3A] transition"
                >
                  {t.createAccount}
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
