import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { validateEmail, AUTH_INPUT_CLASS } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, authError, clearAuthError, user } = useAuth();
  const { language } = useLanguage();
  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const destination = user?.email?.toLowerCase() === adminEmail.toLowerCase()
        ? '/admin/dashboard'
        : '/Annonces';
      navigate(destination);
    }
  }, [isAuthenticated, navigate, user, adminEmail]);

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
      
      const destination = email.trim().toLowerCase() === adminEmail.toLowerCase()
        ? '/admin/dashboard'
        : '/Annonces';
      navigate(destination);
    } catch (error) {
      const msg = error?.message || '';
      if (msg.includes('Invalid login credentials')) {
        setLocalError(t.invalidCredentials);
      }
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
      title: 'Connexion à Riviqo',
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
      title: 'Login to Riviqo',
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
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl" />
      </div>

      <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
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
                    {localError || authError?.message || t.loginError}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError('');
                    clearAuthError();
                  }}
                  placeholder={t.passwordPlaceholder}
                  disabled={isLoading}
                  className={AUTH_INPUT_CLASS}
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
                  <Label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer font-normal">
                    {t.rememberMe}
                  </Label>
                </div>
                <Link
                  to="/password-reset"
                  className="text-sm text-primary hover:text-primary/80 font-medium transition"
                >
                  {t.forgotPassword}
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading || !isEmailValid}
                aria-busy={isLoading}
                className="w-full text-white py-3 rounded-xl font-semibold shadow-hover flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'var(--gradient-coral)' }}
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
                <div className="w-full border-t border-border" />
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                {t.noAccount}{' '}
                <Link
                  to="/register"
                  className="font-semibold text-primary hover:text-primary/80 transition"
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
