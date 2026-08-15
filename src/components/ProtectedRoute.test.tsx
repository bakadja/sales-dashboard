import type { Session } from '@supabase/supabase-js';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../context/useAuth';
import ProtectedRoute from './ProtectedRoute';

vi.mock('../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

const authValue = (session: Session | null | undefined) => ({
  session,
  users: [],
  signInUser: vi.fn(async () => ({ success: true })),
  signOut: vi.fn(async () => ({ success: true })),
  signUpNewUser: vi.fn(async () => ({ success: true })),
});

const renderRoute = () =>
  render(
    <MemoryRouter initialEntries={['/private']}>
      <Routes>
        <Route
          path="/private"
          element={
            <ProtectedRoute>
              <div>Private content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<div>Sign in page</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading state while the session is unresolved', () => {
    mockedUseAuth.mockReturnValue(authValue(undefined));

    renderRoute();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders protected content for an authenticated session', () => {
    const session = { user: { id: 'user-1' } } as unknown as Session;
    mockedUseAuth.mockReturnValue(authValue(session));

    renderRoute();

    expect(screen.getByText('Private content')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to the sign-in route', () => {
    mockedUseAuth.mockReturnValue(authValue(null));

    renderRoute();

    expect(screen.getByText('Sign in page')).toBeInTheDocument();
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
  });
});
