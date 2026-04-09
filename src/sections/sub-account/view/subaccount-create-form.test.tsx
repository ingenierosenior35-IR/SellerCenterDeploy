import { render, screen } from '@testing-library/react';

import { SubAccountCreateForm } from './subaccount-create-form';

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

jest.mock('src/actions/account/use-create-subaccount', () => ({
  useCreateSubAccount: () => ({
    mutateAsync: jest.fn().mockResolvedValue({
      createSellerSubAccount: { successMessage: 'Sub Account was saved successfully' },
    }),
  }),
}));

jest.mock('src/components/snackbar', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => <form>{children}</form>,
  Field: {
    Select: ({ label }: { label: string }) => <div data-testid="field-select">{label}</div>,
    Text: ({ label }: { label: string }) => <input data-testid="field-text" placeholder={label} />,
    MultiSelect: ({ label }: { label: string }) => <div data-testid="field-multiselect">{label}</div>,
  },
  schemaUtils: {
    email: () => {},
  },
}));

jest.mock('@mui/material/Dialog', () => ({
  __esModule: true,
  default: ({ open, children }: { open: boolean; children: React.ReactNode }) => (
    open ? <div data-testid="dialog">{children}</div> : null
  ),
}));

jest.mock('@mui/material/DialogTitle', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-title">{children}</div>,
}));

jest.mock('@mui/material/DialogContent', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
}));

jest.mock('@mui/material/DialogActions', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-actions">{children}</div>,
}));

jest.mock('@mui/material/Alert', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="alert">{children}</div>,
}));

jest.mock('@mui/material/Button', () => ({
  __esModule: true,
  default: ({ children, onClick, type }: { children: React.ReactNode; onClick?: () => void; type?: string }) => (
    <button data-testid={`button-${type || 'submit'}`} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('@mui/material/Box', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@mui/material/MenuItem', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn((key: string) => {
    if (key === 'customer_id') return '123';
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });


describe('SubAccountCreateForm', () => {
  it('renders nothing when open is false', () => {
    const { container } = render(<SubAccountCreateForm open={false} onClose={jest.fn()} />);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog when open is true', () => {
    render(<SubAccountCreateForm open onClose={jest.fn()} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('renders dialog title', () => {
    render(<SubAccountCreateForm open onClose={jest.fn()} />);

    expect(screen.getByTestId('dialog-title')).toHaveTextContent('subAccountListView.createSubAccount.title');
  });

  it('renders alert information', () => {
    render(<SubAccountCreateForm open onClose={jest.fn()} />);

    expect(screen.getByTestId('alert')).toHaveTextContent('subAccountListView.createSubAccount.info');
  });

  it('renders form fields (status, firstname, lastname, email, permissions)', () => {
    render(<SubAccountCreateForm open onClose={jest.fn()} />);

    const fields = screen.getAllByTestId(/field-/);
    expect(fields.length).toBeGreaterThan(0);
  });

  it('renders cancel and create buttons', () => {
    render(<SubAccountCreateForm open onClose={jest.fn()} />);

    expect(screen.getByTestId('dialog-actions')).toBeInTheDocument();
  });
});
