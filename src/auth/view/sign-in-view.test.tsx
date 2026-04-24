import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import { SignInView } from './sign-in-view';

const mockRefresh = jest.fn();
const mockLogin = jest.fn();
const mockGetErrorMessage = jest.fn();

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => jest.fn(),
}));

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit:
      (callback: (data: { email: string; password: string }) => Promise<void>) => async () =>
        callback({ email: 'john@doe.com', password: 'secret123' }),
    formState: { isSubmitting: false },
  }),
}));

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({ value: false, onToggle: jest.fn() }),
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href = '#', children }: { href?: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
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

jest.mock('../hooks', () => ({
  useAuthContext: () => ({ login: mockLogin }),
}));

jest.mock('../utils', () => ({
  getErrorMessage: (error: unknown) => mockGetErrorMessage(error),
}));

jest.mock('../components/form-head', () => ({
  FormHead: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

describe('SignInView', () => {
  beforeEach(() => {
    mockRefresh.mockClear();
    mockLogin.mockReset();
    mockGetErrorMessage.mockReset();
  });

  it('renders translated sign in form content', () => {
    render(<SignInView />);

    expect(screen.getByRole('heading', { name: 'loginPage.title' })).toBeInTheDocument();
    expect(screen.getByLabelText('loginPage.emailForm')).toBeInTheDocument();
    expect(screen.getByLabelText('loginPage.passwordForm')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'loginPage.signIn' })).toBeInTheDocument();
  });

  it('submits login and refreshes session on success', async () => {
    mockLogin.mockResolvedValue(undefined);

    render(<SignInView />);

    fireEvent.submit(screen.getByRole('button', { name: 'loginPage.signIn' }).closest('form')!);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'john@doe.com', password: 'secret123' });
    });

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('shows mapped error message when submit fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockLogin.mockRejectedValue(new Error('backend failed'));
    mockGetErrorMessage.mockReturnValue('Mensaje controlado');

    render(<SignInView />);

    fireEvent.submit(screen.getByRole('button', { name: 'loginPage.signIn' }).closest('form')!);

    expect(await screen.findByText('Mensaje controlado')).toBeInTheDocument();
    expect(mockRefresh).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
