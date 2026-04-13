import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProductDetailsView } from './product-details-view';

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/home' },
    product: { root: '/product', details: (id: number) => `/product/${id}` },
  },
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

jest.mock('src/components/loading-screen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

jest.mock('src/components/error-content', () => ({
  ErrorContent: ({ title }: any) => <div data-testid="error-content">{title}</div>,
}));

jest.mock('minimal-shared/hooks', () => ({
  useTabs: (initial: string) => ({ value: initial, onChange: jest.fn() }),
  useBoolean: () => ({ value: false, onTrue: jest.fn(), onFalse: jest.fn(), onToggle: jest.fn() }),
}));

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.5)',
}));

jest.mock('../components/product-detail-view/product-details-toolbar', () => ({
  ProductDetailsToolbar: ({ publish }: any) => <div data-testid="details-toolbar">{publish}</div>,
}));

jest.mock('../components/product-detail-view/product-details-summary', () => ({
  ProductDetailsSummary: ({ product }: any) => (
    <div data-testid="details-summary">{product?.name}</div>
  ),
}));

jest.mock('../components/product-detail-view/product-details-carousel', () => ({
  ProductDetailsCarousel: () => <div data-testid="details-carousel" />,
}));

jest.mock('../components/product-detail-view/product-details-description', () => ({
  ProductDetailsDescription: ({ description }: any) => (
    <div data-testid="details-description">{description}</div>
  ),
}));

const mockUseGetProductDetailsById = jest.fn();
jest.mock('src/actions/product/use-get-product-details-by-id', () => ({
  useGetProductDetailsById: (...args: any[]) => mockUseGetProductDetailsById(...args),
}));

const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'A great product',
  images: ['/img1.jpg'],
};

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ProductDetailsView', () => {
  it('shows loading screen while loading', () => {
    mockUseGetProductDetailsById.mockReturnValue({
      product: null,
      isLoading: true,
      isError: false,
    });
    renderWithTheme(<ProductDetailsView id={1} />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('shows error content when fetch fails', () => {
    mockUseGetProductDetailsById.mockReturnValue({
      product: null,
      isLoading: false,
      isError: true,
    });
    renderWithTheme(<ProductDetailsView id={1} />);
    expect(screen.getByTestId('error-content')).toBeInTheDocument();
  });

  it('shows not-found error when product is null after loading', () => {
    mockUseGetProductDetailsById.mockReturnValue({
      product: null,
      isLoading: false,
      isError: false,
    });
    renderWithTheme(<ProductDetailsView id={99} />);
    expect(screen.getByTestId('error-content')).toBeInTheDocument();
  });

  it('renders product details when product is loaded', () => {
    mockUseGetProductDetailsById.mockReturnValue({
      product: mockProduct,
      isLoading: false,
      isError: false,
    });
    renderWithTheme(<ProductDetailsView id={1} />);
    expect(screen.getByTestId('details-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('details-carousel')).toBeInTheDocument();
    expect(screen.getByTestId('details-summary')).toBeInTheDocument();
    expect(screen.getByTestId('details-description')).toBeInTheDocument();
  });

  it('renders breadcrumbs with product name', () => {
    mockUseGetProductDetailsById.mockReturnValue({
      product: mockProduct,
      isLoading: false,
      isError: false,
    });
    renderWithTheme(<ProductDetailsView id={1} />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders product summary with product name', () => {
    mockUseGetProductDetailsById.mockReturnValue({
      product: mockProduct,
      isLoading: false,
      isError: false,
    });
    renderWithTheme(<ProductDetailsView id={1} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders description tab content', () => {
    mockUseGetProductDetailsById.mockReturnValue({
      product: mockProduct,
      isLoading: false,
      isError: false,
    });
    renderWithTheme(<ProductDetailsView id={1} />);
    expect(screen.getByTestId('details-description')).toHaveTextContent('A great product');
  });
});
