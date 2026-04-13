import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import { SignUpView } from './sign-up-view';

const mockRefresh = jest.fn();
const mockSignUp = jest.fn();
const mockGetErrorMessage = jest.fn();

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => jest.fn(),
}));

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit:
      (
        callback: (data: {
          firstName: string;
          lastName: string;
          email: string;
          password: string;
        }) => Promise<void>
      ) =>
      async () =>
        callback({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@doe.com',
          password: 'secret123',
        }),
    formState: { isSubmitting: false },
  }),
}));

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({ value: false, onToggle: jest.fn() }),
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children, onSubmit }: { children: React.ReactNode; onSubmit: () => Promise<void> }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      {children}
    </form>
  ),
  Field: {
    Text: ({ name, label }: { name: string; label: string }) => (
      <input aria-label={label || name} name={name} />
    ),
  },
  schemaUtils: {
    email: () => ({ parse: (value: string) => value }),
  },
}));

jest.mock('../context', () => ({
  signUp: (...args: unknown[]) => mockSignUp(...args),
}));

jest.mock('../utils', () => ({
  getErrorMessage: (error: unknown) => mockGetErrorMessage(error),
}));

jest.mock('../components/form-head', () => ({
  FormHead: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock('../components/sign-up-terms', () => ({
  SignUpTerms: () => <div data-testid="sign-up-terms" />,
}));

describe('SignUpView', () => {
  beforeEach(() => {
    mockRefresh.mockClear();
    mockSignUp.mockReset();
    mockGetErrorMessage.mockReset();
  });

  it('renders sign up view with terms section', () => {
    render(<SignUpView />);

    expect(screen.getByRole('heading', { name: 'Get started absolutely free' })).toBeInTheDocument();
    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
    expect(screen.getByTestId('sign-up-terms')).toBeInTheDocument();
  });

  it('submits sign up and refreshes on success', async () => {
    mockSignUp.mockResolvedValue(undefined);

    render(<SignUpView />);

    fireEvent.submit(screen.getByRole('button', { name: 'Create account' }).closest('form')!);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@doe.com',
        password: 'secret123',
      });
    });

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('shows mapped error message when submit fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockSignUp.mockRejectedValue(new Error('signup failed'));
    mockGetErrorMessage.mockReturnValue('No se pudo crear la cuenta');

    render(<SignUpView />);

    fireEvent.submit(screen.getByRole('button', { name: 'Create account' }).closest('form')!);

    expect(await screen.findByText('No se pudo crear la cuenta')).toBeInTheDocument();
    expect(mockRefresh).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
