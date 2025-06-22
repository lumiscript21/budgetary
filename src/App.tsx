import { useForm, type AnyFieldApi } from '@tanstack/react-form';
import './App.css';
import { Input, Button, Label } from './components/ui';
import { z } from 'zod';
import { useState } from 'react';

interface AccountDetails {
  accountName: string;
  accountBalance: string;
}

const accountSchema = z.object({
  accountName: z.string().min(1, 'Account name is required'),
  accountBalance: z
    .string()
    .min(1, 'Account balance is required')
    .refine((value) => !isNaN(Number(value)), {
      message: 'Account balance must be a number',
    })
    .transform((value) => Number(value)),
});

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-slate-400">
          {field.state.meta.errors?.[0]?.message}
        </em>
      ) : null}
    </>
  );
}

const App = () => {
  const [accounts, setAccounts] = useState<AccountDetails[]>([]);

  const defaultValues: AccountDetails = {
    accountName: '',
    accountBalance: '',
  };

  const form = useForm({
    defaultValues: defaultValues,
    onSubmit: async ({ value }) => {
      const parsed = accountSchema.safeParse(value);
      if (parsed.success) {
        setAccounts((prev) => [
          ...prev,
          {
            accountName: parsed.data.accountName,
            accountBalance: String(parsed.data.accountBalance),
          },
        ]);

        form.reset();
      }
    },
    validators: {
      onChange: accountSchema,
    },
  });

  return (
    <div className="h-screen bg-slate-800">
      <h1 className="font-serif text-2xl font-bold text-slate-300">
        Budgetary
      </h1>

      <section>
        <h2 className="text-xl font-semibold text-slate-200">
          Add new account
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div>
            <form.Field
              name="accountName"
              children={(field) => {
                return (
                  <>
                    <Label className="text-slate-300" htmlFor={field.name}>
                      Account Name:
                    </Label>
                    <Input
                      className="bg-slate-300"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value}
                    />
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>
          <div>
            <form.Field
              name="accountBalance"
              children={(field) => {
                return (
                  <>
                    <Label className="text-slate-300" htmlFor={field.name}>
                      Account Balance:
                    </Label>
                    <Input
                      className="bg-slate-300"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value}
                    />
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <>
                <Button
                  className="border-slate-300 bg-slate-700 text-slate-300 hover:bg-slate-600"
                  type="submit"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? '...' : 'Add'}
                </Button>
              </>
            )}
          />
        </form>
      </section>
      <section>
        {accounts.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-slate-200">
              Accounts List
            </h2>
            <ul className="list-disc pl-5 text-slate-300">
              {accounts.map((account, index) => (
                <li key={index}>
                  {account.accountName} -{' '}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(Number(account.accountBalance))}
                </li>
              ))}
            </ul>
            <section>
              <h2 className="text-lg font-semibold text-slate-200">
                Total Balance:{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(
                  accounts.reduce(
                    (total, account) => total + Number(account.accountBalance),
                    0,
                  ),
                )}
              </h2>
            </section>
          </div>
        )}
      </section>
    </div>
  );
};

export default App;
