import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const code = searchParams.get('code');
      const type = searchParams.get('type');

      if (!code) {
        setStatus('error');
        setMessage(language === 'fr' 
          ? 'Code de vérification manquant' 
          : 'Verification code missing');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // The code is automatically handled by Supabase
      // When user clicks the email link, Supabase exchanges the code for a session
      setStatus('success');
      setMessage(language === 'fr'
        ? 'Email vérifié avec succès ! Redirection en cours...'
        : 'Email verified successfully! Redirecting...');

      setTimeout(() => {
        navigate('/Annonces');
      }, 2000);
    } catch (error) {
      console.error('Email verification failed:', error);
      setStatus('error');
      setMessage(language === 'fr'
        ? 'Erreur lors de la vérification. Veuillez réessayer.'
        : 'Verification failed. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  const translations = {
    fr: {
      verifying: 'Vérification de votre email...',
      success: 'Email vérifié avec succès !',
      error: 'Erreur de vérification',
      redirecting: 'Redirection en cours...'
    },
    en: {
      verifying: 'Verifying your email...',
      success: 'Email verified successfully!',
      error: 'Verification error',
      redirecting: 'Redirecting...'
    }
  };

  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B4759] via-[#2C3544] to-[#3B4759] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-md w-full text-center"
      >
        {status === 'verifying' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="flex justify-center mb-6"
            >
              <Loader2 className="w-16 h-16 text-[#FF6B4A]" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              {t.verifying}
            </h2>
            <p className="text-gray-500">
              {language === 'fr'
                ? 'Veuillez patienter pendant que nous vérifions votre adresse email...'
                : 'Please wait while we verify your email address...'}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              {t.success}
            </h2>
            <p className="text-gray-500 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-400">
              {t.redirecting}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <AlertCircle className="w-16 h-16 text-red-500" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              {t.error}
            </h2>
            <p className="text-gray-500 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-400">
              {language === 'fr'
                ? 'Vous serez redirigé vers la page de connexion...'
                : 'You will be redirected to the login page...'}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
