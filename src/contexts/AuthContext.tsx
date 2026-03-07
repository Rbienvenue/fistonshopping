import React, { createContext, useContext, ReactNode } from 'react';
import { Profile } from '@/lib/types';

interface AuthContextType {
  user: null;
  session: null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const signIn = async (_email: string, _password: string) => {
    return { error: new Error('Not connected') };
  };

  const signUp = async (_email: string, _password: string, _fullName: string) => {
    return { error: new Error('Not connected') };
  };

  const signOut = async () => {};

  return (
    <AuthContext.Provider
      value={{
        user: null,
        session: null,
        profile: null,
        isAdmin: false,
        isLoading: false,
        signIn,
        signUp,
        signOut,
      }}
    >
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
