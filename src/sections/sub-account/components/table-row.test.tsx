import { render, screen } from '@testing-library/react';

import { SubAccountTableRow } from './table-row';

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
    onToggle: jest.fn(),
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

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <i data-testid="iconify" data-icon={icon} />,
}));

jest.mock('src/components/custom-popover', () => ({
  CustomPopover: ({ children }: { children: React.ReactNode }) => <div data-testid="custom-popover">{children}</div>,
}));

jest.mock('@mui/material/MenuList', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="menu-list">{children}</div>,
}));

jest.mock('@mui/material/MenuItem', () => ({
  __esModule: true,
  default: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="menu-item" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <div data-testid="router-link">{children}</div>
  ),
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

jest.mock('./subaccount-edit-dialog-form', () => ({
  SubAccountEditDialogForm: ({ open }: { open: boolean }) => (
    open ? <div data-testid="edit-dialog">Edit Form</div> : null
  ),
}));

jest.mock('./subaccount-delete-confirm-dialog', () => ({
  SubAccountDeleteConfirmDialog: ({ open, onConfirm }: { open: boolean; onConfirm: () => void }) => (
    open ? <button data-testid="delete-confirm" onClick={onConfirm}>Confirm Delete</button> : null
  ),
}));

jest.mock('@mui/material/TableRow', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
}));

jest.mock('@mui/material/TableCell', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
}));

jest.mock('@mui/material/Avatar', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <div data-testid="avatar">{alt}</div>,
}));

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  default: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="icon-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('@mui/material/ListItemText', () => ({
  __esModule: true,
  default: ({ primary, secondary }: { primary: React.ReactNode; secondary: React.ReactNode }) => (
    <div data-testid="list-item-text">
      <div data-testid="list-item-primary">{primary}</div>
      <div data-testid="list-item-secondary">{secondary}</div>
    </div>
  ),
}));

jest.mock('@mui/material/Link', () => ({
  __esModule: true,
  default: ({ children, component: Component }: { children: React.ReactNode; component?: any }) => (
    Component ? <Component>{children}</Component> : <span>{children}</span>
  ),
}));

jest.mock('src/utils/format-time', () => ({
  fDate: (date: string) => '2026-01-01',
  fTime: (date: string) => '10:00 AM',
}));


const mockRow = {
  id: 1,
  firstname: 'John',
  lastname: 'Doe',
  email: 'john@miti.com',
  status: 'ACTIVE',
  permissions: [{ 'sellersubaccount/account/manage': 'account/manage' }],
  createdAt: '2026-01-01T10:00:00.000Z',
};

describe('SubAccountTableRow', () => {
  it('renders row with account name and email', () => {
    render(
      <table>
        <tbody>
          <SubAccountTableRow
            row={mockRow}
            selected={false}
            detailsHref="/account/subaccount/1"
            onSelectRow={jest.fn()}
          />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('router-link')).toHaveTextContent('John');
    expect(screen.getByTestId('router-link')).toHaveTextContent('Doe');
    expect(screen.getByText('john@miti.com')).toBeInTheDocument();
  });

  it('renders icon button for menu actions', () => {
    render(
      <table>
        <tbody>
          <SubAccountTableRow
            row={mockRow}
            selected={false}
            detailsHref="/account/subaccount/1"
            onSelectRow={jest.fn()}
          />
        </tbody>
      </table>
    );

    const iconButton = screen.getByTestId('icon-button');
    expect(iconButton).toBeInTheDocument();
  });

  it('renders status label', () => {
    render(
      <table>
        <tbody>
          <SubAccountTableRow
            row={mockRow}
            selected={false}
            detailsHref="/account/subaccount/1"
            onSelectRow={jest.fn()}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('subAccountListView.status.ACTIVE')).toBeInTheDocument();
  });

  it('renders permissions', () => {
    render(
      <table>
        <tbody>
          <SubAccountTableRow
            row={mockRow}
            selected={false}
            detailsHref="/account/subaccount/1"
            onSelectRow={jest.fn()}
          />
        </tbody>
      </table>
    );

    const elements = screen.queryAllByText(/account\/manage|unknownPermissions/);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('renders date and time', () => {
    render(
      <table>
        <tbody>
          <SubAccountTableRow
            row={mockRow}
            selected={false}
            detailsHref="/account/subaccount/1"
            onSelectRow={jest.fn()}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('2026-01-01')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
  });
});
