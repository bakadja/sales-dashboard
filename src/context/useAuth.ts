import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './auth-context';

export const useAuth = (): AuthContextValue => useContext(AuthContext);
