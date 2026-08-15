import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../context/useAuth';
import { authValue, sessionFor } from '../test/auth-fixtures';
import Form from './Form';

vi.mock('../context/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../supabase-client', () => ({
  default: {
    from: vi.fn(() => ({
      insert: vi.fn(async () => ({ error: null })),
    })),
  },
}));

const mockedUseAuth = vi.mocked(useAuth);

const users = [
  { id: 'rep-1', name: 'Alice', account_type: 'rep' },
  { id: 'rep-2', name: 'Bob', account_type: 'rep' },
  { id: 'admin-1', name: 'Admin', account_type: 'admin' },
];

describe('Form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a rep their own name in a read-only field', () => {
    mockedUseAuth.mockReturnValue(authValue(sessionFor('rep-1'), users));

    render(<Form />);

    const nameInput = screen.getByRole('textbox', {
      name: 'Sales representative name',
    });
    expect(nameInput).toHaveValue('Alice');
    expect(nameInput).toHaveAttribute('readonly');
  });

  it('lets an admin choose from sales representatives only', () => {
    mockedUseAuth.mockReturnValue(authValue(sessionFor('admin-1'), users));

    render(<Form />);

    const select = screen.getByRole('combobox');
    expect(screen.getByRole('option', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Bob' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Admin' })).not.toBeInTheDocument();
    expect(select).toBeEnabled();
  });

  it('shows a validation error when submitted with a user not present in auth state', async () => {
    const user = userEvent.setup();
    mockedUseAuth.mockReturnValue(authValue(sessionFor('admin-1'), users));

    render(<Form />);

    const select = screen.getByRole('combobox');
    const invalidOption = document.createElement('option');
    invalidOption.value = 'Unknown';
    invalidOption.textContent = 'Unknown';
    select.append(invalidOption);

    await user.selectOptions(select, 'Unknown');
    await user.click(screen.getByRole('button', { name: 'Add Deal' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Invalid user selected',
    );
  });
});
