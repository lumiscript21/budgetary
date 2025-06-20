import { render, screen } from '@testing-library/react';
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
});
