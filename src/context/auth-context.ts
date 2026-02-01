import { createContext } from 'react';
import type { Session } from '@supabase/supabase-js';

export type AuthResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

export type UserProfile = {
  id: string;
  name: string | null;
  account_type: string | null;
};

export type AuthContextValue = {
  session: Session | null | undefined;
  users: UserProfile[];
  signInUser: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  signUpNewUser: (
    email: string,
    password: string,
    name: string,
    accountType: string
  ) => Promise<AuthResult>;
};

export const AuthContext = createContext<AuthContextValue>({
  session: undefined,
  users: [],
  signInUser: async () => ({
    success: false,
    error: 'Auth context not initialized.',
  }),
  signOut: async () => ({
    success: false,
    error: 'Auth context not initialized.',
  }),
  signUpNewUser: async () => ({
    success: false,
    error: 'Auth context not initialized.',
  }),
});
