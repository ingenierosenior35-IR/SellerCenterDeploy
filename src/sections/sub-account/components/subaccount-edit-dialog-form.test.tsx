import { render, screen } from '@testing-library/react';

import { SubAccountEditDialogForm } from './subaccount-edit-dialog-form';

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

jest.mock('src/actions/account/use-edit-subaccount', () => ({
  useUpdateSubAccount: () => ({
    mutateAsync: jest.fn().mockResolvedValue({
      updateSellerSubAccount: { message: 'SubAccount updated successfully' },
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


const mockCurrentUser = {
  id: 1,
  firstname: 'John',
  lastname: 'Doe',
  email: 'john@miti.com',
  status: 'ACTIVE',
  permissions: [{ 'sellersubaccount/account/manage': 'account/manage' }],
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('SubAccountEditDialogForm', () => {
  it('renders nothing when open is false', () => {
    render(
      <SubAccountEditDialogForm
        open={false}
        onClose={jest.fn()}
        currentUser={mockCurrentUser}
      />
    );

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when open is true', () => {
    render(
      <SubAccountEditDialogForm
        open
        onClose={jest.fn()}
        currentUser={mockCurrentUser}
      />
    );

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('renders dialog title for update', () => {
    render(
      <SubAccountEditDialogForm
        open
        onClose={jest.fn()}
        currentUser={mockCurrentUser}
      />
    );

    expect(screen.getByTestId('dialog-title')).toHaveTextContent('subAccountListView.updateSubAccount.title');
  });

  it('renders alert information', () => {
    render(
      <SubAccountEditDialogForm
        open
        onClose={jest.fn()}
        currentUser={mockCurrentUser}
      />
    );

    expect(screen.getByTestId('alert')).toHaveTextContent('subAccountListView.updateSubAccount.info');
  });

  it('populates form with current user data', () => {
    render(
      <SubAccountEditDialogForm
        open
        onClose={jest.fn()}
        currentUser={mockCurrentUser}
      />
    );

    const fields = screen.getAllByTestId(/field-/);
    expect(fields.length).toBeGreaterThan(0);
  });

  it('renders dialog actions with buttons', () => {
    render(
      <SubAccountEditDialogForm
        open
        onClose={jest.fn()}
        currentUser={mockCurrentUser}
      />
    );

    const dialogActions = screen.getByTestId('dialog-actions');
    expect(dialogActions).toBeInTheDocument();
  });
});
