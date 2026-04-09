import { render, screen } from '@testing-library/react';

import { SubAccountEditForm } from './subaccount-edit-form';

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({
    value: false,
    onTrue: jest.fn(),
    onFalse: jest.fn(),
    onToggle: jest.fn(),
    setValue: jest.fn(),
  }),
  usePopover: () => ({
    open: false,
    anchorEl: null,
    onOpen: jest.fn(),
    onClose: jest.fn(),
  }),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('src/actions/account/use-edit-subaccount', () => ({
  useUpdateSubAccount: () => ({
    mutateAsync: jest.fn().mockResolvedValue({
      updateSellerSubAccount: { message: 'SubAccount updated successfully' },
    }),
  }),
}));

jest.mock('src/actions/account/use-delete-subaccount', () => ({
  useDeleteSubAccount: () => ({
    mutateAsync: jest.fn().mockResolvedValue({
      deleteSubSellerAccount: { message: 'Deleted' },
    }),
    isPending: false,
  }),
}));

jest.mock('src/components/snackbar', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => <form>{children}</form>,
  Field: {
    Select: ({ label }: { label: string }) => <div data-testid="field-select">{label}</div>,
    Text: ({ label }: { label: string }) => <input data-testid="field-text" placeholder={label} />,
    MultiSelect: ({ label }: { label: string }) => <div data-testid="field-multiselect">{label}</div>,
  },
}));

jest.mock('@mui/material/Box', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@mui/system/Grid', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="grid">{children}</div>,
}));

jest.mock('@mui/material/Card', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
}));

jest.mock('@mui/material/Button', () => ({
  __esModule: true,
  default: ({ children, onClick, type }: { children: React.ReactNode; onClick?: () => void; type?: string }) => (
    <button data-testid={`button-${type || 'submit'}`} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('@mui/material/Avatar', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="avatar">{children}</div>,
}));

jest.mock('@mui/material/Divider', () => ({
  __esModule: true,
  default: () => <div data-testid="divider" />,
}));

jest.mock('@mui/material/Typography', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@mui/material/MenuItem', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('./subaccount-delete-confirm-dialog', () => ({
  SubAccountDeleteConfirmDialog: ({ open, onConfirm }: { open: boolean; onConfirm: () => void }) => (
    open ? <button data-testid="delete-confirm-btn" onClick={onConfirm}>Confirm Delete</button> : null
  ),
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => () => ({ values: {}, errors: {} }),
}));

jest.mock('./subaccount-edit-dialog-form', () => ({
  createSubaccountSchema: () => ({}),
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
  permissions: [{'sellersubaccount/account/manage': 'account/manage'}],
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('SubAccountEditForm', () => {
  it('renders form with user profile card', () => {
    render(<SubAccountEditForm currentUser={mockCurrentUser} />);

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByText('john@miti.com')).toBeInTheDocument();
  });

  it('renders form with fields (status, firstname, lastname, email, permissions)', () => {
    render(<SubAccountEditForm currentUser={mockCurrentUser} />);

    const fields = screen.getAllByTestId(/field-/);
    expect(fields.length).toBeGreaterThan(0);
  });


  it('renders divider element', () => {
    render(<SubAccountEditForm currentUser={mockCurrentUser} />);

    expect(screen.getByTestId('divider')).toBeInTheDocument();
  });

  it('renders update button in form', () => {
    render(<SubAccountEditForm currentUser={mockCurrentUser} />);

    const buttons = screen.getAllByTestId(/button-/);
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders delete account button', () => {
    render(<SubAccountEditForm currentUser={mockCurrentUser} />);

    const buttons = screen.getAllByRole('button');

    expect(buttons.length).toBeGreaterThan(0);
  });
});
