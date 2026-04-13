import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import FeedbackView from './feedback-view';

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/routes/paths', () => ({
  paths: { home: { root: '/home' } },
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
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

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: any) => <div data-testid="scrollbar">{children}</div>,
}));

jest.mock('src/components/table', () => ({
  useTable: () => ({
    dense: false,
    order: 'asc',
    orderBy: 'id',
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
      <td>Loading...</td>
    </tr>
  ),
  TableHeadCustom: ({ headCells }: any) => (
    <thead>
      <tr>
        {headCells?.map((c: any) => (
          <th key={c.id}>{c.label}</th>
        ))}
      </tr>
    </thead>
  ),
  TablePaginationCustom: () => <div data-testid="table-pagination" />,
  getComparator: () => () => 0,
}));

const mockHandleFilterClick = jest.fn();

jest.mock('src/hooks/feedback/use-feedback-list', () => ({
  useFeedbackList: () => ({
    reviewsList: [
      {
        sku: 'SKU-001',
        image: '/img.jpg',
        name: 'Test Product',
        price: '4',
        value: '5',
        quality: '3',
        text: 'Great product',
        sumary: 'Good summary',
        nickname: 'user1',
        status: 'APPROVED',
        created_at: '2024-01-01',
      },
    ],
    tableHead: [
      { id: 'sku', label: 'SKU', width: 150 },
      { id: 'name', label: 'Name', width: 200 },
    ],
    handleFilterClick: mockHandleFilterClick,
    isLoading: false,
    isError: false,
  }),
}));

describe('FeedbackView', () => {
  const theme = createTheme({ cssVariables: true });
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

  beforeEach(() => {
    mockHandleFilterClick.mockClear();
  });

  it('renders home content wrapper', () => {
    renderWithTheme(<FeedbackView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderWithTheme(<FeedbackView />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders the CommonTable with search input', () => {
    renderWithTheme(<FeedbackView />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders filter icon button', () => {
    renderWithTheme(<FeedbackView />);
    expect(screen.getByTestId('icon-ic:round-filter-list')).toBeInTheDocument();
  });

  it('opens filter popover when filter button is clicked', () => {
    renderWithTheme(<FeedbackView />);
    const filterBtn = screen.getByRole('button');
    fireEvent.click(filterBtn);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('calls handleFilterClick when Apply is clicked in popover', () => {
    renderWithTheme(<FeedbackView />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Apply'));
    expect(mockHandleFilterClick).toHaveBeenCalledWith('4');
  });

  it('closes popover when Cancel is clicked', async () => {
    renderWithTheme(<FeedbackView />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });

  it('renders table pagination', () => {
    renderWithTheme(<FeedbackView />);
    expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
  });
});
