import { render, screen } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

const accountName = () => screen.getByLabelText(/account name/i);
const accountBalance = () => screen.getByLabelText(/account balance/i);
const addButton = () => screen.getByRole('button', { name: /Add/i });

describe('App', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('should render the app name', () => {
    expect(
      screen.getByRole('heading', { name: /Budgetary/i }),
    ).toBeInTheDocument();
  });

  it('should render the form with budget account name and budget amount', () => {
    expect(
      screen.getByRole('heading', { name: /Add new account/i }),
    ).toBeInTheDocument();
    expect(accountName()).toBeInTheDocument();
    expect(accountBalance()).toBeInTheDocument();
    expect(addButton()).toBeInTheDocument();
  });

  describe('interacting with the form', () => {
    let user: UserEvent;
    beforeEach(() => {
      user = userEvent.setup();
    });

    it('should display validation errors when fields are touched and invalid', async () => {
      const addButton = screen.getByRole('button', { name: /Add/i });

      await user.click(addButton);

      const errors = screen.getAllByText(/is required/i);

      expect(errors).toHaveLength(2);

      expect(errors[0]).toHaveTextContent(/account name is required/i);
      expect(errors[1]).toHaveTextContent(/account balance is required/i);
    });

    it('should show validation errors only after a field has been touched, but is invalid', async () => {
      accountName().focus();

      await user.click(accountBalance());
      await user.type(accountBalance(), '10');

      expect(screen.getByText(/account name is required/i)).toBeInTheDocument();

      expect(
        screen.queryByText(/balance is required/i),
      ).not.toBeInTheDocument();
    });

    it('should validate that the account balance is a number', async () => {
      await user.type(accountBalance(), 'abc');

      expect(screen.getByText(/balance must be a number/i)).toBeInTheDocument();
    });

    it('should clear the form fields after successful submission', async () => {
      await user.type(accountName(), 'Test Account');
      await user.type(accountBalance(), '1000');

      await user.click(addButton());

      expect(accountName()).toHaveTextContent('');
      expect(accountBalance()).toHaveTextContent('');
    });
  });

  it('should create an entry on the page if the form was submitted with valid data', async () => {
    const user = userEvent.setup();

    await user.type(accountName(), 'Test Account');
    await user.type(accountBalance(), '1000');

    await user.click(addButton());

    expect(screen.getByText(/test account/i)).toBeInTheDocument();
  });

  it('should tally up the total balance of all accounts and display it', async () => {
    const user = userEvent.setup();

    await user.type(accountName(), 'Account 1');
    await user.type(accountBalance(), '1000');
    await user.click(addButton());

    expect(screen.getByText(/total balance: \$1,000/i)).toBeInTheDocument();

    await user.type(accountName(), 'Account 2');
    await user.type(accountBalance(), '2500');
    await user.click(addButton());

    expect(screen.getByText(/total balance: \$3,500/i)).toBeInTheDocument();
  });
});
