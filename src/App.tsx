import { useForm, type AnyFieldApi } from '@tanstack/react-form';
import './App.css';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';

interface FormValues {
  accountName: string;
  accountBalance: string;
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  );
}

const App = () => {
  const defaultValues: FormValues = {
    accountName: '',
    accountBalance: '',
  };

  const form = useForm({
    defaultValues: defaultValues,
    onSubmit: async ({ value }) => {
      console.log('Form submitted with values:', value);
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
                    <Label className="p-2 text-slate-300" htmlFor={field.name}>
                      Account Name:
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-slate-300"
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
                    <Label className="p-2 text-slate-300" htmlFor={field.name}>
                      Account Balance:
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-slate-300"
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
