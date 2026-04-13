import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { SubAccountListView } from './subaccount-list-view';

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/home' },
    account: { subaccount: { root: '/account/subaccount' } },
    return: { details: (id: number) => `/return/${id}` },
  },
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span data-testid="label">{children}</span>,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div data-testid="scrollbar">{children}</div>,
}));

jest.mock('src/components/table', () => ({
  useTable: () => ({
    dense: false,
    order: 'asc',
    orderBy: 'lastAccess',
    page: 0,
    rowsPerPage: 10,
    selected: [],
    onSort: jest.fn(),
    onSelectRow: jest.fn(),
    onSelectAllRows: jest.fn(),
    onChangePage: jest.fn(),
    onChangeRowsPerPage: jest.fn(),
    onResetPage: jest.fn(),
  }),
  TableNoData: ({ notFound }: any) =>
    notFound ? (
      <tr>
        <td data-testid="table-no-data">No data</td>
      </tr>
    ) : null,
  TableSkeleton: () => (
    <tr>
      <td data-testid="table-skeleton">Skeleton</td>
    </tr>
  ),
  TableHeadCustom: ({ headCells }: any) => (
    <thead>
      <tr>
        {headCells?.map((c: any, i: number) => (
          <th key={i}>{c.label}</th>
        ))}
      </tr>
    </thead>
  ),
  TableSelectedAction: ({ action }: any) => (
    <div data-testid="table-selected-action">{action}</div>
  ),
  TablePaginationCustom: () => <div data-testid="table-pagination" />,
  getComparator: () => () => 0,
}));

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({ value: false, onTrue: jest.fn(), onFalse: jest.fn(), onToggle: jest.fn() }),
  useSetState: (initial: any) => ({ state: initial, setState: jest.fn() }),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.5)',
}));

jest.mock('../components', () => ({
  SubAccountTableRow: ({ row }: any) => (
    <tr data-testid="subaccount-row">
      <td>{row.name}</td>
    </tr>
  ),
  SubAccountTableToolbar: () => <div data-testid="subaccount-toolbar" />,
}));

jest.mock('./subaccount-create-form', () => ({
  SubAccountCreateForm: () => <div data-testid="subaccount-create-form" />,
}));

jest.mock('./use-subaccount-table', () => ({
  useSubAccountTable: () => ({
    table: {
      dense: false,
      order: 'asc',
      orderBy: 'lastAccess',
      page: 0,
      rowsPerPage: 10,
      selected: [],
      onSort: jest.fn(),
      onSelectRow: jest.fn(),
      onSelectAllRows: jest.fn(),
      onChangePage: jest.fn(),
      onChangeRowsPerPage: jest.fn(),
      onResetPage: jest.fn(),
    },
    confirmDialog: { value: false, onTrue: jest.fn(), onFalse: jest.fn(), onToggle: jest.fn() },
    isLoading: false,
    tableData: [
      {
        id: 142,
        name: 'Ana Garcia',
        email: 'ana@gmail.com',
        phone: '+57 310 555 0192',
        status: 'ACTIVE',
        createdAt: '2022-03-04',
        lastAccess: '2025-03-15T10:42:00Z',
        actions: ['editar'],
        permissions: ['REPORTS'],
      },
    ],
    dataFiltered: [
      {
        id: 142,
        name: 'Ana Garcia',
        email: 'ana@gmail.com',
        phone: '+57 310 555 0192',
        status: 'ACTIVE',
        createdAt: '2022-03-04',
        lastAccess: '2025-03-15T10:42:00Z',
        actions: ['editar'],
        permissions: ['REPORTS'],
      },
    ],
    currentFilters: { name: '', permission: 'all' },
    notFound: false,
    canReset: false,
    filters: { state: { name: '', permission: 'all' }, setState: jest.fn() },
    handleFilterPermission: jest.fn(),
  }),
}));

describe('SubAccountListView', () => {
  const theme = createTheme({ cssVariables: true });
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

  it('renders home content wrapper', () => {
    renderWithTheme(<SubAccountListView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs with heading', () => {
    renderWithTheme(<SubAccountListView />);
    expect(screen.getByText('subAccount.manageSubaccounts')).toBeInTheDocument();
  });

  it('renders SubAccountTableToolbar', () => {
    renderWithTheme(<SubAccountListView />);
    expect(screen.getByTestId('subaccount-toolbar')).toBeInTheDocument();
  });

  it('renders SubAccountTableRow for each account', () => {
    renderWithTheme(<SubAccountListView />);
    expect(screen.getByTestId('subaccount-row')).toBeInTheDocument();
    expect(screen.getByText('Ana Garcia')).toBeInTheDocument();
  });

  it('renders table pagination', () => {
    renderWithTheme(<SubAccountListView />);
    expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
  });

  it('renders scrollbar', () => {
    renderWithTheme(<SubAccountListView />);
    expect(screen.getByTestId('scrollbar')).toBeInTheDocument();
  });
});
