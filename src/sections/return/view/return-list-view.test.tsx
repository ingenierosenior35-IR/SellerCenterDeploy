import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ReturnListView } from './return-list-view';

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/home' },
    return: { root: '/return', details: (id: number) => `/return/${id}` },
  },
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (ns: string, key?: string) => (key ? `${ns}.${key}` : ns),
    currentLang: 'es',
  }),
}));

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (ns: string, key?: string) => (key ? `${ns}.${key}` : ns),
    currentLang: 'es',
  }),
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
    orderBy: 'orderNumber',
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
  TablePaginationCustom: ({ count }: any) => (
    <div data-testid="table-pagination">Count: {count}</div>
  ),
  getComparator: () => () => 0,
}));

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({ value: false, onTrue: jest.fn(), onFalse: jest.fn(), onToggle: jest.fn() }),
  useSetState: (initial: any) => ({ state: initial, setState: jest.fn() }),
  usePopover: () => ({ open: false, anchorEl: null, onOpen: jest.fn(), onClose: jest.fn() }),
}));

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.5)',
}));

jest.mock('../order-table-row', () => ({
  OrderTableRow: ({ row }: any) => (
    <tr data-testid="order-table-row">
      <td>{row.uid}</td>
    </tr>
  ),
}));

jest.mock('../order-table-toolbar', () => ({
  OrderTableToolbar: () => <div data-testid="order-table-toolbar" />,
}));

jest.mock('../constants/return/status', () => ({
  useReturnStatus: () => [
    { value: 'PENDING', label: 'Pending', color: 'default' },
    { value: 'APPROVED', label: 'Approved', color: 'success' },
  ],
}));

const mockUseGetReturns = jest.fn();
jest.mock('src/actions/return/useGetReturns', () => ({
  useGetReturns: (...args: any[]) => mockUseGetReturns(...args),
}));

const mockReturns = {
  returns: {
    items: [
      {
        uid: '1',
        number: 'RET-001',
        status: 'PENDING',
        customer: { name: 'Alice', email: 'alice@test.com' },
        createdAt: '2024-01-01',
      },
    ],
    totalCount: 1,
  },
};

describe('ReturnListView', () => {
  const theme = createTheme({ cssVariables: true });
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

  beforeEach(() => {
    mockUseGetReturns.mockReturnValue({ returns: mockReturns, isLoading: false });
  });

  it('renders home content wrapper', () => {
    renderWithTheme(<ReturnListView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderWithTheme(<ReturnListView />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders status filter tabs', () => {
    renderWithTheme(<ReturnListView />);
    expect(screen.getByRole('tab', { name: /returnStatus.all/i })).toBeInTheDocument();
  });

  it('renders order table toolbar', () => {
    renderWithTheme(<ReturnListView />);
    expect(screen.getByTestId('order-table-toolbar')).toBeInTheDocument();
  });

  it('renders table with rows', () => {
    renderWithTheme(<ReturnListView />);
    expect(screen.getByTestId('order-table-row')).toBeInTheDocument();
  });

  it('renders table pagination', () => {
    renderWithTheme(<ReturnListView />);
    expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
  });

  it('renders table-no-data when returns list is empty', () => {
    mockUseGetReturns.mockReturnValue({
      returns: { returns: { items: [] } },
      isLoading: false,
    });
    renderWithTheme(<ReturnListView />);
    expect(screen.getByTestId('table-no-data')).toBeInTheDocument();
  });

  it('renders scrollbar', () => {
    renderWithTheme(<ReturnListView />);
    expect(screen.getByTestId('scrollbar')).toBeInTheDocument();
  });

  it('renders label components for tab counts', () => {
    renderWithTheme(<ReturnListView />);
    expect(screen.getAllByTestId('label').length).toBeGreaterThan(0);
  });
});
