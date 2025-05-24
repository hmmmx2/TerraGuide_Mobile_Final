// authprovider.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { toast } from '@/components/CustomToast';

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userType?: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Set the session when sign in is successful
      setSession(data.session);

      // Get user metadata to determine role
      const userRole = data.user?.user_metadata?.role;
      console.log('User Role from metadata:', userRole); // Debugging log

      // Redirect based on user role
      const router = require('expo-router').router;
      if (userRole === 'admin' || userRole === 'controller') {
        router.replace('/DashboardScreen');
      } else if (userRole === 'parkguide') {
        router.replace('/HomeParkGuideScreen');
      } else {
        // Default to guest screen for undefined or other roles
        router.replace('/HomeGuestScreen');
      }

      toast.success('Welcome back!');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      return { success: false, error: error.message || 'Failed to sign in' };
    }
  };

  // signUp remains unchanged
  const signUp = async (email: string, password: string, userType = 'guest', username = '') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: userType === 'guest' ? 'parkguide' : userType,
            username,
            first_name: username.split(' ')[0] || '',
            last_name: username.split(' ').slice(1).join(' ') || '',
          },
        },
      });
      if (error) throw error;

      toast.success('Account created!');
      const router = require('expo-router').router;
      router.replace('/HomeParkGuideScreen');

      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      return { success: false, error: error.message || 'Failed to sign up' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.info('You have been logged out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'terraguide://reset-password',
      });
      if (error) throw error;
      toast.success('Password reset email sent');
      return { success: true };
    } catch (error: any) {
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
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
      return { success: false, error: error.message || 'Failed to update password' };
    }
  };

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