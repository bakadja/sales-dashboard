import type { ReactNode } from 'react';
import { useAuth } from '../context/useAuth';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session } = useAuth();

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return session ? <>{children}</> : <Navigate to="/signin" />;

};

export default ProtectedRoute;
