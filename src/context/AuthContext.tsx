import type { ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useCallback, useMemo, useState, useEffect } from 'react';
import supabase from '../supabase-client';
import { AuthContext, type AuthResult, type UserProfile } from './auth-context';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unknown error';

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  //Session state (user info, sign-in status)
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    async function getInitialSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setSession(data.session);
      } catch (error) {
        console.error('Error getting session:', getErrorMessage(error));
      }
    }
    getInitialSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log('Session changed:', session);
    })
  }, []);

  useEffect(() => {
    if (!session) return;

    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, name, account_type');
        if (error) {
          throw error;
        }
        console.log('Fetched users:', data);
        setUsers((data ?? []) as UserProfile[]);
      } catch (error) {
        console.error('Error fetching users:', getErrorMessage(error));
      }
    };
    fetchUsers();

  }, [session]);

  //Auth functions
  const signInUser = useCallback(async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });
      if (error) {
        console.error('Supabase sign-in error:', error.message);
        return { success: false, error: error.message };
      }
      console.log('Supabase sign-in success:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error during sign-in:', getErrorMessage(error));
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }, []);

  const signOut = useCallback(async (): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign-out error:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Unexpected error during sign-out:', getErrorMessage(error));
      return { success: false, error: 'An unexpected error occurred during sign out.' };
    }
  }, []);

  const signUpNewUser = useCallback(async (
    email: string,
    password: string,
    name: string,
    accountType: string
  ): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password,
        options: {
          data: {
            name: name,
            account_type: accountType,
          },
        },
      });
      if (error) {
        console.error('Supabase sign-up error:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error during sign-up:', getErrorMessage(error));
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }, []);

  const contextValue = useMemo(
    () => ({ session, signInUser, signOut, signUpNewUser, users }),
    [session, signInUser, signOut, signUpNewUser, users]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
