import type { Session } from '@supabase/supabase-js';
import { vi } from 'vitest';
import type { AuthContextValue, UserProfile } from '../context/auth-context';

export const sessionFor = (id: string) =>
  ({ user: { id } }) as unknown as Session;

export const authValue = (
  session: Session | null | undefined,
  users: UserProfile[] = [],
): AuthContextValue => ({
  session,
  users,
  signInUser: vi.fn(async () => ({ success: true })),
  signOut: vi.fn(async () => ({ success: true })),
  signUpNewUser: vi.fn(async () => ({ success: true })),
});
