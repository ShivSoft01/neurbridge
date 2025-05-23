import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

type UserType = 'student' | 'teacher';

interface AuthContextType {
  currentUser: User | null;
  userType: UserType | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (email: string, password: string, userType: UserType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        // Fetch user type from profiles table
        fetchUserType(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        fetchUserType(session.user.id);
      } else {
        setUserType(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserType = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserType(data.user_type as UserType);
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.user) {
        await fetchUserType(data.user.id);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, userType: UserType) => {
    try {
      console.log('Starting registration with userType:', userType);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            userType,
          },
        },
      });
      if (error) throw error;
      
      if (data.user) {
        console.log('User created, checking profile...');
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify the profile was created with correct user type
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Error checking profile:', profileError);
          throw profileError;
        }
        
        if (!profile) {
          console.error('Profile not found after registration');
          throw new Error('Profile not created');
        }
        
        if (profile.user_type !== userType) {
          console.error('Profile created with incorrect user type:', profile.user_type);
          // Update the profile with correct user type
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ user_type: userType })
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error('Error updating profile:', updateError);
            throw updateError;
          }
        }
        
        console.log('Profile verified/updated successfully');
        setUserType(userType);
      }
    } catch (error) {
      console.error('Error in registration:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserType(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userType,
    loading,
    signIn,
    signOut,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 