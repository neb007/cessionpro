import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

const AuthContext = createContext();

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
          setUser(session.user);
          setIsAuthenticated(true);
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
        setUser(session.user);
        setIsAuthenticated(true);
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
      console.error('App state check failed:', error);
      setAuthError({
        type: 'auth_error',
        message: error.message || 'Failed to check authentication'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const register = async (email, password) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback`
        }
      });

      if (error) throw error;
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

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Login error:', error);
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
        redirectTo: `${window.location.origin}/reset-password`
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

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
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
    }}>
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
