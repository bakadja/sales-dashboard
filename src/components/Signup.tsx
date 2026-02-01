import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useActionState } from 'react';

const Signup = () => {
  const { signUpNewUser } = useAuth();
  const navigate = useNavigate();

  const [error, submitAction, isPending] = useActionState<Error | null, FormData>(
    async (_previousState, formData) => {
      const email = formData.get('email');
      const password = formData.get('password');
      const name = formData.get('name');
      const accountType = formData.get('account-type');
      if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        typeof name !== 'string' ||
        typeof accountType !== 'string'
      ) {
        return new Error('Please fill out all fields.');
      }
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const trimmedName = name.trim();
      const trimmedAccountType = accountType.trim();

      if (!trimmedEmail || !trimmedPassword || !trimmedName || !trimmedAccountType) {
        return new Error('Please fill out all fields.');
      }
      if (!email || !password || !name || !accountType) {
        return new Error('Please fill out all fields.');
      }

      const {
        success,
        data,
        error: signUpError,
      } = await signUpNewUser(trimmedEmail, trimmedPassword, trimmedName, trimmedAccountType);

      if (signUpError) {
        return new Error(signUpError);
      }
      const session = (data as { session?: unknown } | null | undefined)?.session;
      if (success && session) {
        navigate('/dashboard');
        return null;
      }
      return null;
    },
    null
  );

  return (
    <>
      <h1 className="landing-header">Paper Like A Boss</h1>
      <div className="sign-form-container">
        <form
          action={submitAction}
          aria-label="Sign up form"
          aria-describedby="form-description"
        >
          <div id="form-description" className="sr-only">
            Use this form to create a new account. Enter your email and
            password.
          </div>

          <h2 className="form-title">Sign up today!</h2>
          <p>
            Already have an account?{' '}
            <Link className="form-link" to="/">
              Sign in
            </Link>
          </p>

          <label htmlFor="name">Name</label>
          <input
            className="form-input"
            type="text"
            name="name"
            id="name"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'signup-error' : undefined}
            disabled={isPending}
          />

          <label htmlFor="email">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            id="email"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'signup-error' : undefined}
            disabled={isPending}
          />

          <label htmlFor="password">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            id="password"
            placeholder=""
            required
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'signup-error' : undefined}
            disabled={isPending}
          />

          <fieldset
            className="form-fieldset"
            aria-required="true"
            aria-label="Select your role"
          >
            <legend>Select your role</legend>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="account-type"
                  value="admin"
                  required
                />{' '}
                Admin
              </label>
              <label>
                <input type="radio" name="account-type" value="rep" required />{' '}
                Sales Rep
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            className="form-button"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? 'Signing up...' : 'Sign Up'}
          </button>

          {error ? (
            <div id="signup-error" role="alert" className="sign-form-error-message">
              {error.message}
            </div>
          ) : null}
        </form>
      </div>
    </>
  );
};

export default Signup;
