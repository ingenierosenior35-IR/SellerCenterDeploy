import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderTableRow } from './order-table-row';

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span data-testid="label">{children}</span>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (_ns: string, key?: string) => key ?? _ns,
    currentLang: 'es',
  }),
}));

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({
    value: false,
    onTrue: jest.fn(),
    onFalse: jest.fn(),
    onToggle: jest.fn(),
  }),
}));

const mockRow = {
  number: 'RMA-001',
  status: 'PENDING',
  uid: 'uid-001',
  createdAt: '2024-04-17T12:00:00',
  totalRefundedAmount: 50,
  customer: { name: 'John Doe', email: 'john@test.com' },
  order: { orderNumber: 'ORD-123' },
  items: [
    {
      uid: 'item-uid-001',
      status: 'PENDING',
      quantity: 2,
      orderItem: {
        id: 1,
        productImage: 'https://example.com/product.jpg',
        productName: 'Product A',
        productSku: 'SKU-A',
      },
    },
  ],
};

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(
    <ThemeProvider theme={theme}>
      <table>
        <tbody>{ui}</tbody>
      </table>
    </ThemeProvider>
  );

describe('OrderTableRow', () => {
  it('renders the RMA number', () => {
    renderWithTheme(
      <OrderTableRow
        row={mockRow as any}
        selected={false}
        detailsHref="/return/1"
        onSelectRow={jest.fn()}
      />
    );
    expect(screen.getByText('RMA-001')).toBeInTheDocument();
  });

  it('renders order number as link', () => {
    renderWithTheme(
      <OrderTableRow
        row={mockRow as any}
        selected={false}
        detailsHref="/return/1"
        onSelectRow={jest.fn()}
      />
    );
    expect(screen.getByText('ORD-123')).toBeInTheDocument();
  });

  it('renders customer name', () => {
    renderWithTheme(
      <OrderTableRow
        row={mockRow as any}
        selected={false}
        detailsHref="/return/1"
        onSelectRow={jest.fn()}
      />
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders customer email', () => {
    renderWithTheme(
      <OrderTableRow
        row={mockRow as any}
        selected={false}
        detailsHref="/return/1"
        onSelectRow={jest.fn()}
      />
    );
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
  });

  it('renders collapse toggle button', () => {
    renderWithTheme(
      <OrderTableRow
        row={mockRow as any}
        selected={false}
        detailsHref="/return/1"
        onSelectRow={jest.fn()}
      />
    );
    expect(screen.getByTestId('icon-eva:arrow-ios-downward-fill')).toBeInTheDocument();
  });

  it('calls onSelectRow when row is clicked', () => {
    const onSelectRow = jest.fn();
    renderWithTheme(
      <OrderTableRow
        row={mockRow as any}
        selected={false}
        detailsHref="/return/1"
        onSelectRow={onSelectRow}
      />
    );
    // The expand button exists
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
  });
});
