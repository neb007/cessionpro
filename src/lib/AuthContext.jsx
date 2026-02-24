import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/api/supabaseClient';

const AuthContext = createContext(null);
const APP_URL = (import.meta.env.VITE_APP_URL || 'https://riviqo.com').replace(/\/$/, '');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
    
    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_blocked')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError && profileError.code !== '42703') {
            console.warn('Profile check warning (auth state, non-blocking):', profileError);
          }

          if (!profileError && profile?.is_blocked) {
            await supabase.auth.signOut();
            setUser(null);
            setIsAuthenticated(false);
            setAuthError({
              type: 'account_blocked',
              message: 'Votre compte est bloqué. Contactez le support.'
            });
          } else {
            setUser(session.user);
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsLoadingAuth(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      
      // Try to get the current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_blocked')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError && profileError.code !== '42703') {
          console.warn('Profile check warning (non-blocking):', profileError);
        }

        if (profile?.is_blocked) {
          await supabase.auth.signOut();
          setUser(null);
          setIsAuthenticated(false);
          setAuthError({
            type: 'account_blocked',
            message: 'Votre compte est bloqué. Contactez le support.'
          });
        } else {
          setUser(session.user);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      // Set app public settings (can be expanded as needed)
      setAppPublicSettings({
        id: 'public-app',
        public_settings: {}
      });
      
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    } catch (error) {
      if (error?.name === 'AbortError' || error?.name === 'DOMException') {
        console.warn('Auth check aborted:', error);
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
        return;
      }
      console.error('App state check failed:', error);
      setAuthError({
        type: 'auth_error',
        message: error.message || 'Failed to check authentication'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const register = async (email, password, additionalData = {}) => {
    try {
      setAuthError(null);
      
      // Prepare user metadata with additional profile information
      const rawUserMetaData = {
        email,
        full_name: additionalData.firstName && additionalData.lastName 
          ? `${additionalData.firstName} ${additionalData.lastName}` 
          : '',
        first_name: additionalData.firstName || '',
        last_name: additionalData.lastName || '',
        company_name: additionalData.company || '',
        phone: additionalData.phone || '',
        user_goal: additionalData.userGoal || '',
        profile_type: additionalData.profileType || '',
        transaction_size: additionalData.transactionSize || '',
        sectors: additionalData.sectors ? JSON.stringify(additionalData.sectors) : '[]'
      };

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: rawUserMetaData,
          emailRedirectTo: `${APP_URL}/auth-callback`
        }
      });

      if (error) throw error;

      // If signup returns an authenticated session, we can enrich profile immediately.
      // When email confirmation is required, session is often null and RLS blocks writes.
      if (data.user && data.session?.user?.id === data.user.id) {
        await saveProfileData(data.user.id, rawUserMetaData);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError({
        type: 'registration_error',
        message: error.message || 'Registration failed'
      });
      throw error;
    }
  };

  const saveProfileData = async (userId, userData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: userData.email,
          full_name: userData.full_name,
          first_name: userData.first_name,
          last_name: userData.last_name,
          company_name: userData.company_name,
          phone: userData.phone,
          user_goal: userData.user_goal,
          profile_type: userData.profile_type,
          transaction_size: userData.transaction_size,
          sectors: userData.sectors ? (typeof userData.sectors === 'string' ? JSON.parse(userData.sectors) : userData.sectors) : [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) {
        if (error.code === '42501') {
          // Expected in some signup flows without active user session (email confirmation required).
          return;
        }
        console.error('Error saving profile data:', error);
        throw error;
      }
    } catch (error) {
      if (error?.code === '42501') {
        return;
      }
      console.error('Profile save error:', error);
      // Don't throw here - registration was successful, just profile save failed
      setAuthError({
        type: 'profile_save_warning',
        message: 'Registration successful but profile data could not be saved completely'
      });
    }
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_blocked')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError && profileError.code !== '42703') {
          console.warn('Profile check warning during login (non-blocking):', profileError);
        }

        if (profile?.is_blocked) {
          await supabase.auth.signOut();
          setUser(null);
          setIsAuthenticated(false);
          setAuthError({
            type: 'account_blocked',
            message: 'Votre compte est bloqué. Contactez le support.'
          });
          throw new Error('ACCOUNT_BLOCKED');
        }

        // Optimistic auth state update to avoid UI staying blocked on /Login
        // when auth state event is delayed in production environments.
        setUser(data.user);
        setIsAuthenticated(true);
        setIsLoadingAuth(false);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error?.message === 'ACCOUNT_BLOCKED') {
        throw error;
      }
      setAuthError({
        type: 'login_error',
        message: error.message || 'Login failed'
      });
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${APP_URL}/reset-password`
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      setAuthError({
        type: 'reset_error',
        message: error.message || 'Failed to send reset email'
      });
      throw error;
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Password update error:', error);
      setAuthError({
        type: 'update_error',
        message: error.message || 'Failed to update password'
      });
      throw error;
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const logout = async (shouldRedirect = true) => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
      
      if (shouldRedirect) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const navigateToLogin = useCallback(() => {
    window.location.href = '/Login';
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    appPublicSettings,
    logout,
    navigateToLogin,
    checkAppState,
    register,
    login,
    resetPassword,
    updatePassword,
    clearAuthError
  }), [user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError, appPublicSettings]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
