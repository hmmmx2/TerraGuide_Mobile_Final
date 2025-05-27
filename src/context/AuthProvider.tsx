import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { toast } from '@/components/CustomToast';
import { Router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
  signIn: (
      email: string,
      password: string,
      router: Router
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
      email: string,
      password: string,
      userType?: string,
      username?: string,
      router?: Router
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: (router: Router) => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshUserSession: () => Promise<{ success: boolean; error?: string }>; // Add this
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastNavigation, setLastNavigation] = useState<number>(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('File: AuthProvider, Function: getSession, Initial session:', session?.user?.user_metadata);
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('File: AuthProvider, Function: onAuthStateChange, Event:', _event, 'Session role:', session?.user?.user_metadata?.role);
      setSession(session);

      if (_event === 'SIGNED_IN' && session && session.user.email_confirmed_at) {
        const now = Date.now();
        if (now - lastNavigation < 1000) {
          console.log('File: AuthProvider, Function: onAuthStateChange, Navigation debounced');
          return;
        }

        const userRole = session.user?.user_metadata?.role?.toString().trim().toLowerCase();
        const router = require('expo-router').router;
        let destination = '/HomeGuestScreen';

        if (userRole === 'parkguide') {
          console.log('File: AuthProvider, Function: onAuthStateChange, Navigating to: HomeParkGuideScreen');
          destination = '/HomeParkGuideScreen';
          AsyncStorage.removeItem('pending_email');
        } else if (userRole === 'admin' || userRole === 'controller') {
          console.log('File: AuthProvider, Function: onAuthStateChange, Navigating to: DashboardScreen');
          destination = '/DashboardScreen';
        } else {
          console.log('File: AuthProvider, Function: onAuthStateChange, Navigating to: HomeGuestScreen');
        }

        router.replace(destination);
        setLastNavigation(now);
      } else if (_event === 'SIGNED_OUT') {
        console.log('File: AuthProvider, Function: onAuthStateChange, Navigating to: LoginScreen');
        const router = require('expo-router').router;
        router.replace('/LoginScreen');
      }
    });

    return () => subscription.unsubscribe();
  }, [lastNavigation]);

  const signIn = async (email: string, password: string, router: Router) => {
    try {
      const { data: emailExists, error: checkError } = await supabase
          .rpc('check_email_exists', { p_email: email });
      if (checkError) {
        console.error('File: AuthProvider, Function: signIn, Email check error:', checkError.message);
        toast.error('Failed to check email availability');
        return { success: false, error: 'Failed to check email availability' };
      }
      if (!emailExists) {
        console.log('File: AuthProvider, Function: signIn, Email does not exist:', email);
        toast.error('No account exists with this email');
        return { success: false, error: 'No account exists with this email' };
      }

      // Refresh session before signing in
      await supabase.auth.refreshSession();

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      setSession(data.session);

      const userRole = data.user?.user_metadata?.role?.toString().trim().toLowerCase();
      console.log('File: AuthProvider, Function: signIn, User Role:', userRole);

      if (userRole === 'admin' || userRole === 'controller') {
        console.log('File: AuthProvider, Function: signIn, Navigating to: DashboardScreen');
        router.replace('/DashboardScreen');
      } else if (userRole === 'parkguide') {
        console.log('File: AuthProvider, Function: signIn, Navigating to: HomeParkGuideScreen');
        router.replace('/HomeParkGuideScreen');
      } else {
        console.log('File: AuthProvider, Function: signIn, Navigating to: HomeGuestScreen');
        router.replace('/HomeGuestScreen');
      }

      toast.success('Welcome back!');
      return { success: true };
    } catch (error: any) {
      console.error('File: AuthProvider, Function: signIn, Error:', error.message);
      let errorMessage = 'Failed to sign in';
      if (error.code === 'user_not_confirmed') {
        errorMessage = 'Please verify your email to log in';
        router.replace('/VerifyEmailScreen');
      } else if (error.code === 'invalid_credentials') {
        errorMessage = 'Invalid email or password';
      }
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (
      email: string,
      password: string,
      userType = 'guest',
      username = '',
      router?: Router
  ) => {
    try {
      const validRoles = ['parkguide'];
      const role = userType === 'guest' ? 'parkguide' : userType;
      if (!validRoles.includes(role)) {
        console.log('File: AuthProvider, Function: signUp, Invalid role:', role);
        toast.error('Invalid user role');
        return { success: false, error: 'Invalid user role' };
      }

      const { data: emailExists, error: checkError } = await supabase
          .rpc('check_email_exists', { p_email: email });
      if (checkError) {
        console.error('File: AuthProvider, Function: signUp, Email check error:', checkError.message);
        toast.error('Failed to check email availability');
        return { success: false, error: 'Failed to check email availability' };
      }
      if (emailExists) {
        console.log('File: AuthProvider, Function: signUp, Email already exists:', email);
        toast.error('An account with this email already exists');
        return { success: false, error: 'An account with this email already exists' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            username,
            first_name: username.split(' ')[0] || '',
            last_name: username.split(' ').slice(1).join(' ') || '',
          },
        },
      });
      if (error) throw error;

      await AsyncStorage.setItem('pending_email', email);
      console.log('File: AuthProvider, Function: signUp, Stored pending_email:', email);

      if (data.session) {
        setSession(data.session);
        console.log('File: AuthProvider, Function: signUp, Session set:', data.session.user.user_metadata);
      }

      toast.success(data.session ? 'Account created!' : 'Account created! Please verify your email.');
      if (router) {
        const destination = data.session ? '/HomeParkGuideScreen' : '/VerifyEmailScreen';
        console.log('File: AuthProvider, Function: signUp, Navigating to:', destination);
        router.replace(destination);
      }

      return { success: true };
    } catch (error: any) {
      console.error('File: AuthProvider, Function: signUp, Error:', error.message);
      const errorMessage = error.message || 'Failed to sign up';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async (router: Router) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      await AsyncStorage.removeItem('pending_email');
      console.log('File: AuthProvider, Function: signOut, Signed out successfully');
      toast.info('You have been logged out');
      router.replace('/LoginScreen');
    } catch (error: any) {
      console.error('File: AuthProvider, Function: signOut, Error:', error.message);
      toast.error('Error signing out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'terraguide://reset-password',
      });
      if (error) throw error;
      console.log('File: AuthProvider, Function: resetPassword, Password reset email sent');
      toast.success('Password reset email sent');
      return { success: true };
    } catch (error: any) {
      console.error('File: AuthProvider, Function: resetPassword, Error:', error.message);
      toast.error(error.message || 'Failed to send password reset email');
      return { success: false, error: error.message || 'Failed to send password reset email' };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      console.log('File: AuthProvider, Function: updatePassword, Password updated successfully');
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error: any) {
      console.error('File: AuthProvider, Function: updatePassword, Error:', error.message);
      toast.error(error.message || 'Failed to update password');
      return { success: false, error: error.message || 'Failed to update password' };
    }
  };

  // Add this to your AuthProvider component
  
  // Add this function to your AuthProvider
  const refreshUserSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      if (data.session) {
        setSession(data.session);
        return { success: true };
      }
      return { success: false, error: 'No session returned' };
    } catch (error: any) {
      console.error('File: AuthProvider, Function: refreshUserSession, Error:', error.message);
      return { success: false, error: error.message };
    }
  };
  
  // Add refreshUserSession to your context value
  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        refreshUserSession, // Add this
        loading: isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useSupabaseAuth = useAuth;