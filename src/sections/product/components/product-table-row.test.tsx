import type { ProductListInterface } from 'src/interfaces/product/seller-product.interface';

import { render, screen } from '@testing-library/react';

import {
  RenderCellSku,
  RenderCellStock,
  RenderCellPrice,
  RenderCellProduct,
} from './product-table-row';

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
    currentLang: 'es',
  }),
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

jest.mock('src/utils/format-number', () => ({
  fCurrency: (v: number) => `$${v}`,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children, color }: any) => (
    <span data-testid="label" data-color={color}>
      {children}
    </span>
  ),
}));

const baseRow: ProductListInterface = {
  id: 1,
  sku: 'SKU-001',
  productName: 'Test Product',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  category: 'Electronics',
  finalPrice: 99.99,
  discount: 0,
  discountPercent: 0,
  stock: 50,
  inStock: true,
  rating: 0,
  isLowStock: false,
  lowStockThreshold: 5,
  lowStockThresholdType: 'DEFAULT',
};

const makeParams = (row: Partial<ProductListInterface> = {}) =>
  ({ row: { ...baseRow, ...row } } as any);

describe('product-table-row cells', () => {
  describe('RenderCellSku', () => {
    it('renders the sku', () => {
      const { container } = render(<RenderCellSku params={makeParams({ sku: 'ABC-123' })} />);
      expect(container.textContent).toBe('ABC-123');
    });
  });

  describe('RenderCellPrice', () => {
    it('formats the final price', () => {
      const { container } = render(<RenderCellPrice params={makeParams({ finalPrice: 250 })} />);
      expect(container.textContent).toBe('$250');
    });
  });

  describe('RenderCellProduct', () => {
    it('renders product name as link with category', () => {
      render(
        <RenderCellProduct
          params={makeParams({ productName: 'Cool Item', category: 'Books' })}
          href="/product/1"
        />
      );
      const link = screen.getByRole('link', { name: 'Cool Item' });
      expect(link).toHaveAttribute('href', '/product/1');
      expect(screen.getByText('Books')).toBeInTheDocument();
    });
  });

  describe('RenderCellStock', () => {
    it('shows out-of-stock label when not in stock', () => {
      render(<RenderCellStock params={makeParams({ inStock: false, stock: 0 })} />);
      expect(screen.getByText(/outOfStock/i)).toBeInTheDocument();
      expect(screen.queryByTestId('icon-solar:danger-triangle-bold')).not.toBeInTheDocument();
    });

    it('shows in-stock label when stock is healthy and not flagged low', () => {
      render(<RenderCellStock params={makeParams({ inStock: true, isLowStock: false, stock: 50 })} />);
      expect(screen.getByText(/inStock/i)).toBeInTheDocument();
      expect(screen.queryByTestId('icon-solar:danger-triangle-bold')).not.toBeInTheDocument();
      expect(screen.queryByTestId('label')).not.toBeInTheDocument();
    });

    it('highlights row when isLowStock=true with warning icon and threshold labels', () => {
      render(
        <RenderCellStock
          params={makeParams({
            inStock: true,
            isLowStock: true,
            stock: 3,
            lowStockThreshold: 5,
            lowStockThresholdType: 'DEFAULT',
          })}
        />
      );

      expect(screen.getByText('3 lowStock')).toBeInTheDocument();
      expect(screen.getByTestId('icon-solar:danger-triangle-bold')).toBeInTheDocument();

      const labels = screen.getAllByTestId('label');
      expect(labels).toHaveLength(2);
      expect(labels[0]).toHaveTextContent('lowStockThresholdLabelPrefix 5');
      expect(labels[1]).toHaveTextContent('lowStockThresholdType.default');
      expect(labels[1]).toHaveAttribute('data-color', 'default');
    });

    it('uses CUSTOM type label and info color when threshold type is CUSTOM', () => {
      render(
        <RenderCellStock
          params={makeParams({
            inStock: true,
            isLowStock: true,
            stock: 2,
            lowStockThreshold: 12,
            lowStockThresholdType: 'CUSTOM',
          })}
        />
      );

      const labels = screen.getAllByTestId('label');
      expect(labels[0]).toHaveTextContent('lowStockThresholdLabelPrefix 12');
      expect(labels[1]).toHaveTextContent('lowStockThresholdType.custom');
      expect(labels[1]).toHaveAttribute('data-color', 'info');
    });

    it('out-of-stock takes precedence over isLowStock for the main label', () => {
      render(
        <RenderCellStock
          params={makeParams({ inStock: false, isLowStock: true, stock: 0 })}
        />
      );

      expect(screen.getByText('0 outOfStock')).toBeInTheDocument();
      expect(screen.queryByText('0 lowStock')).not.toBeInTheDocument();
    });
  });
});
