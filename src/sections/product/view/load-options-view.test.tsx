import { render, screen, fireEvent } from '@testing-library/react';

import LoadOptionsView from './load-options-view';

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/home' },
    product: { root: '/product', load: '/product/load' },
  },
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading, action }: any) => (
    <div data-testid="breadcrumbs">
      <span>{heading}</span>
      {action}
    </div>
  ),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock(
  'src/sections/product/components/product-upload-dialog/product-upload-dialog',
  () => ({
    ProductUploadDialog: ({ open, onClose }: any) =>
      open ? (
        <div data-testid="product-upload-dialog">
          <button onClick={onClose}>Close dialog</button>
        </div>
      ) : null,
  })
);

describe('LoadOptionsView', () => {
  it('renders home content', () => {
    render(<LoadOptionsView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs with "Bulk loading" heading', () => {
    render(<LoadOptionsView />);
    expect(screen.getByText('Bulk loading')).toBeInTheDocument();
  });

  it('does not show ProductUploadDialog initially', () => {
    render(<LoadOptionsView />);
    expect(screen.queryByTestId('product-upload-dialog')).not.toBeInTheDocument();
  });

  it('opens ProductUploadDialog when "Upload files" button is clicked', () => {
    render(<LoadOptionsView />);
    const uploadBtn = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.includes('Upload files'));
    expect(uploadBtn).toBeTruthy();
    fireEvent.click(uploadBtn!);
    expect(screen.getByTestId('product-upload-dialog')).toBeInTheDocument();
  });

  it('closes ProductUploadDialog when onClose is called', () => {
    render(<LoadOptionsView />);
    const uploadBtn = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.includes('Upload files'));
    fireEvent.click(uploadBtn!);
    expect(screen.getByTestId('product-upload-dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close dialog'));
    expect(screen.queryByTestId('product-upload-dialog')).not.toBeInTheDocument();
  });
});
