import { useState, useEffect, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import supabase from '../supabase-client';
import { AuthContext } from './auth-context';

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
//Session state (user info, sign-in status)
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {

  (async function getInitialSession(){
    try {
       const { data, error } =  await supabase.auth.getSession()
      
      if(error) {
       throw error
      }

      console.log("data.session",data.session)
      setSession(data.session)
    } catch(err) {
      console.error("failed to fecth session", err)
    }
  })()

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
    console.log("updatedSession",updatedSession)
    setSession(updatedSession);
  });

  return () => {
    subscription.unsubscribe();
  };

  }, []);

//Auth functions (signin, signup, logout)


  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
};
