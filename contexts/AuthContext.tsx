/*
What is Auth Context?
Auth Context is a centralized way to manage authentication state in a React/React Native application.
It uses React's Context API to make authentication data (like user info) and functions (like signOut) 
available throughout the app without prop drilling.

Why is it called Auth Context? 
It's called Auth Context because it provides authentication-related context to the entire application.
The "Context" part comes from React's Context API, and "Auth" indicates it handles authentication.

Why does Auth Context help?
1. Avoids prop drilling - No need to pass auth data through multiple component layers
2. Single source of truth - Authentication state is managed in one place
3. Reusability - Auth-related functions and data can be accessed anywhere in the app
4. Consistency - Ensures consistent auth state across the entire application
5. Separation of concerns - Isolates auth logic from UI components
*/

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { authService, AuthUser } from '../services/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((firebaseUser: User | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 