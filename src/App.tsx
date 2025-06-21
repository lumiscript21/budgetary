import { useForm, type AnyFieldApi } from '@tanstack/react-form';
import './App.css';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import { z } from 'zod';

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
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  );
}

const App = () => {
  const defaultValues: AccountDetails = {
    accountName: '',
    accountBalance: '',
  };

  const form = useForm({
    defaultValues: defaultValues,
    onSubmit: async ({ value }) => {
      const parsed = accountSchema.safeParse(value);
      console.log('Form submitted with values:', parsed.data);
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
                      type="number"
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
                {/* <Button
                  type="reset"
                  onClick={(e) => {
                    // Avoid unexpected resets of form elements (especially <select> elements)
                    e.preventDefault();
                    form.reset();
                  }}
                >
                  Reset
                </Button> */}
              </>
            )}
          />
        </form>
      </section>
    </div>
  );
};

export default App;
