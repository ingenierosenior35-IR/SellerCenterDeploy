import { render, screen } from '@testing-library/react';

import { ProductLoadView } from './product-load-view';

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/home' },
    product: { root: '/product', uploadList: '/product/load/list' },
  },
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

describe('ProductLoadView', () => {
  it('renders home content', () => {
    render(<ProductLoadView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs with "Load products" heading', () => {
    render(<ProductLoadView />);
    expect(screen.getByText('Load products')).toBeInTheDocument();
  });

  it('renders Bulk loading heading', () => {
    render(<ProductLoadView />);
    expect(screen.getByText('Bulk loading')).toBeInTheDocument();
  });

  it('renders Upload files button linking to uploadList', () => {
    render(<ProductLoadView />);
    const link = screen.getByRole('link', { name: /upload files/i });
    expect(link).toHaveAttribute('href', '/product/load/list');
  });

  it('renders bullet list items', () => {
    render(<ProductLoadView />);
    expect(
      screen.getByText(/Save time by loading multiple products at once/i)
    ).toBeInTheDocument();
  });
});
