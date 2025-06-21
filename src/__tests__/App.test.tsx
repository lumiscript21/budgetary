import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  it('should render the app name', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Budgetary/i }),
    ).toBeInTheDocument();
  });

  it('should render the form with budget account name and budget amount', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Add new account/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/account name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/account balance/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
  });

  it('should display validation errors when fields are touched and invalid', async () => {
    const user = userEvent.setup();
    render(<App />);

    const addButton = screen.getByRole('button', { name: /Add/i });

    // Simulate form submission
    await user.click(addButton);

    const errors = screen.getAllByText(/is required/i);

    // Check for validation messages
    expect(errors).toHaveLength(2);

    expect(errors[0]).toHaveTextContent(/account name is required/i);
    expect(errors[1]).toHaveTextContent(/account balance is required/i);
  });
});
