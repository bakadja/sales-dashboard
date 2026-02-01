import { Suspense, lazy } from 'react';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Header from './components/Header';
import RootRedirect from './routes/RootRedirect';
import ProtectedRoute from './components/ProtectedRoute';
import { createBrowserRouter } from 'react-router-dom';

const Dashboard = lazy(() => import('./routes/Dashboard'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Header />
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
  },
]);
