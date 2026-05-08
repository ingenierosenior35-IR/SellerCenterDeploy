import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProductListView } from './product-list-view';

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/home' },
    product: {
      root: '/product',
      details: (id: number) => `/product/${id}`,
    },
  },
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/product',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, to, children }: any) => <a href={to ?? href}>{children}</a>,
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
  CustomBreadcrumbs: ({ heading, action }: any) => (
    <div data-testid="custom-breadcrumbs">
      <span data-testid="breadcrumbs-heading">{heading}</span>
      {action}
    </div>
  ),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span data-testid="label">{children}</span>,
}));

jest.mock('src/components/empty-content', () => ({
  EmptyContent: ({ title }: any) => <div data-testid="empty-content">{title ?? 'No data'}</div>,
}));

jest.mock('src/components/error-content', () => ({
  ErrorContent: ({ title }: any) => <div data-testid="error-content">{title}</div>,
}));

jest.mock('src/components/snackbar', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows, loading, slots, paginationMode, rowCount }: any) => (
    <div
      data-testid="data-grid"
      data-pagination-mode={paginationMode}
      data-row-count={rowCount}
      data-rows-length={rows?.length ?? 0}
    >
      {loading && <div data-testid="grid-loading">Loading...</div>}
      {rows?.length === 0 && slots?.noRowsOverlay?.()}
      {rows?.map((row: any) => (
        <div key={row.id} data-testid="grid-row" data-row-id={row.id} />
      ))}
    </div>
  ),
  gridClasses: { cell: 'MuiDataGrid-cell' },
}));

jest.mock('src/components/custom-data-grid', () => ({
  useToolbarSettings: () => ({ settings: {} }),
  CustomGridActionsCellItem: ({ label }: any) => <button>{label}</button>,
}));

const mockUseGetProducts = jest.fn();
jest.mock('src/actions/product/useGetProducts', () => ({
  useGetProducts: (...args: any[]) => mockUseGetProducts(...args),
}));

const makeProduct = (overrides: Partial<any> = {}) => ({
  id: 1,
  sku: 'SKU-001',
  productName: 'Producto 1',
  thumbnailUrl: '',
  category: 'Cat',
  finalPrice: 100,
  discount: 0,
  discountPercent: 0,
  stock: 10,
  inStock: true,
  rating: 0,
  isLowStock: false,
  lowStockThreshold: 5,
  lowStockThresholdType: 'DEFAULT',
  ...overrides,
});

describe('ProductListView', () => {
  const theme = createTheme({ cssVariables: true });
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

  beforeEach(() => {
    mockUseGetProducts.mockReturnValue({
      products: [],
      isLoading: false,
      isError: false,
      totalCount: 0,
      isFetching: false,
    });
  });

  it('renders home-content wrapper', () => {
    renderWithTheme(<ProductListView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderWithTheme(<ProductListView />);
    expect(screen.getByTestId('custom-breadcrumbs')).toBeInTheDocument();
  });

  it('renders the DataGrid', () => {
    renderWithTheme(<ProductListView />);
    expect(screen.getByTestId('data-grid')).toBeInTheDocument();
  });

  it('renders empty content when no products', () => {
    renderWithTheme(<ProductListView />);
    expect(screen.getByTestId('empty-content')).toBeInTheDocument();
  });

  it('renders ErrorContent when isError is true', () => {
    mockUseGetProducts.mockReturnValue({ products: [], isLoading: false, isError: true });
    renderWithTheme(<ProductListView />);
    expect(screen.getByTestId('error-content')).toBeInTheDocument();
  });

  it('renders add product button', () => {
    renderWithTheme(<ProductListView />);
    expect(screen.getByRole('button', { name: /addProduct/i })).toBeInTheDocument();
  });

  describe('stock filter tabs', () => {
    it('renders both stock filter tabs', () => {
      renderWithTheme(<ProductListView />);
      expect(screen.getByRole('tab', { name: /productStockTabs\.all/ })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /productStockTabs\.lowStock/ })).toBeInTheDocument();
    });

    it('starts with the "all" tab selected and server pagination', () => {
      mockUseGetProducts.mockReturnValue({
        products: [makeProduct({ id: 1, isLowStock: true }), makeProduct({ id: 2 })],
        isLoading: false,
        isError: false,
        totalCount: 2,
        isFetching: false,
      });
      renderWithTheme(<ProductListView />);

      const allTab = screen.getByRole('tab', { name: /productStockTabs\.all/ });
      expect(allTab).toHaveAttribute('aria-selected', 'true');

      const grid = screen.getByTestId('data-grid');
      expect(grid).toHaveAttribute('data-pagination-mode', 'server');
      expect(grid).toHaveAttribute('data-rows-length', '2');
    });

    it('filters rows to low stock only when "Stock crítico" tab is clicked', () => {
      mockUseGetProducts.mockReturnValue({
        products: [
          makeProduct({ id: 1, isLowStock: true }),
          makeProduct({ id: 2, isLowStock: false }),
          makeProduct({ id: 3, isLowStock: true }),
        ],
        isLoading: false,
        isError: false,
        totalCount: 3,
        isFetching: false,
      });
      renderWithTheme(<ProductListView />);

      const lowStockTab = screen.getByRole('tab', { name: /productStockTabs\.lowStock/ });
      fireEvent.click(lowStockTab);

      expect(lowStockTab).toHaveAttribute('aria-selected', 'true');

      const grid = screen.getByTestId('data-grid');
      expect(grid).toHaveAttribute('data-pagination-mode', 'client');
      expect(grid).toHaveAttribute('data-rows-length', '2');

      const renderedIds = screen
        .getAllByTestId('grid-row')
        .map((node) => node.getAttribute('data-row-id'));
      expect(renderedIds).toEqual(['1', '3']);
    });

    it('does not show a count badge on the "Stock crítico" tab', () => {
      mockUseGetProducts.mockReturnValue({
        products: [makeProduct({ id: 1, isLowStock: true })],
        isLoading: false,
        isError: false,
        totalCount: 14,
        isFetching: false,
      });
      renderWithTheme(<ProductListView />);

      const lowStockTab = screen.getByRole('tab', { name: /productStockTabs\.lowStock/ });
      expect(lowStockTab.querySelector('[data-testid="label"]')).toBeNull();
    });

    it('shows the totalCount on the "Todos" tab badge', () => {
      mockUseGetProducts.mockReturnValue({
        products: [makeProduct()],
        isLoading: false,
        isError: false,
        totalCount: 14,
        isFetching: false,
      });
      renderWithTheme(<ProductListView />);

      const allTab = screen.getByRole('tab', { name: /productStockTabs\.all/ });
      const badge = allTab.querySelector('[data-testid="label"]');
      expect(badge).not.toBeNull();
      expect(badge?.textContent).toBe('14');
    });
  });
});
