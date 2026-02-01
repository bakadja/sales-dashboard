import { useAuth } from '../context/useAuth';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderIcon = (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: '8px' }}
    aria-hidden="true"
  >
    <path
      d="M12 2v8M12 14v8M4.93 4.93l5.66 5.66M13.41 13.41l5.66 5.66M2 12h8M14 12h8M4.93 19.07l5.66-5.66M13.41 10.59l5.66-5.66"
      stroke="#29d952"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

function Header() {
  const { signOut, session, users } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const currentUser = users.find((user) => user.id === session?.user?.id);
  console.log(currentUser);

  const handleSignOut = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { success, error: signOutError } = await signOut();
    if (success) {
      navigate('/signin');
    } else {
      setError(signOutError ?? 'Sign out failed.');
    }
  };

  const accountTypeMap: Record<'rep' | 'admin', string> = {
    rep: 'Sales Rep',
    admin: 'Admin',
  };

  const accountType = currentUser?.account_type;
  const displayAccountType =
    accountType && accountType in accountTypeMap
      ? accountTypeMap[accountType as keyof typeof accountTypeMap]
      : '';

  return (
    <header role="banner" aria-label="Dashboard header">
      <nav className="header-email" aria-label="User account navigation">
        <h2>
          <span className="sr-only">Logged in as:</span>
          {currentUser?.name} ({displayAccountType})
        </h2>
        {error ? (
          <div role="alert" className="error-message" id="signout-error">
            {error}
          </div>
        ) : null}
        <button onClick={handleSignOut} aria-label="Sign out of your account">
          Sign out
        </button>
      </nav>
      <h1>
        {HeaderIcon}
        <span>Sales Team Dashboard</span>
      </h1>
    </header>
  );
};

export default Header;
