import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AuthInput from './AuthInput';

describe('AuthInput', () => {
  it('connects the label and input while exposing pending and error state', () => {
    render(
      <AuthInput
        label="Email"
        name="email"
        type="email"
        errorId="signin-error"
        hasError
        isPending
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toBeRequired();
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'signin-error');
  });

  it('omits the error description when there is no error', () => {
    render(
      <AuthInput
        label="Name"
        name="name"
        type="text"
        errorId="signup-error"
        hasError={false}
        isPending={false}
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Name' });

    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).not.toHaveAttribute('aria-describedby');
  });
});
