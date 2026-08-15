type AuthInputProps = {
  label: string;
  name: string;
  type: 'email' | 'password' | 'text';
  errorId: string;
  hasError: boolean;
  isPending: boolean;
};

const AuthInput = ({
  label,
  name,
  type,
  errorId,
  hasError,
  isPending,
}: AuthInputProps) => (
  <>
    <label htmlFor={name}>{label}</label>
    <input
      className="form-input"
      type={type}
      name={name}
      id={name}
      placeholder=""
      required
      aria-required="true"
      aria-invalid={hasError ? 'true' : 'false'}
      aria-describedby={hasError ? errorId : undefined}
      disabled={isPending}
    />
  </>
);

export default AuthInput;
