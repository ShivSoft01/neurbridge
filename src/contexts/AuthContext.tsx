import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // For now, simulate a successful login
      const mockUser = {
        id: '1',
        email,
        name: 'Test User',
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // For now, simulate a successful registration
      const mockUser = {
        id: Date.now().toString(),
        email,
        name: 'New User',
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // TODO: Replace with actual API call
      setCurrentUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
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