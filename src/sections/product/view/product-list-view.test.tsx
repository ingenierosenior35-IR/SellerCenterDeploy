import { render, screen } from '@testing-library/react';

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
  DataGrid: ({ rows, loading, slots }: any) => (
    <div data-testid="data-grid">
      {loading && <div data-testid="grid-loading">Loading...</div>}
      {rows?.length === 0 && slots?.noRowsOverlay && slots.noRowsOverlay()}
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

describe('ProductListView', () => {
  const theme = createTheme({ cssVariables: true });
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

  beforeEach(() => {
    mockUseGetProducts.mockReturnValue({ products: [], isLoading: false, isError: false });
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
    expect(screen.getByRole('link', { name: /addProduct/i })).toBeInTheDocument();
  });
});
