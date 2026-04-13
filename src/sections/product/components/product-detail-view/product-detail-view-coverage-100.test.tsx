import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import ProductDetailsSummary from './product-details-summary';
import ProductDetailsToolbar from './product-details-toolbar';
import { ProductDetailsCarousel } from './product-details-carousel';
import { ProductDetailsDescription } from './product-details-description';
import { ProductConfigurableOptions } from './product-configurable-options';

const mockedOnOpen = jest.fn();
const mockedOnClose = jest.fn();
const mockedSetSelected = jest.fn();
const mockedThumbClick = jest.fn();

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (namespace: string, key?: string) => (key ? `${namespace}.${key}` : namespace),
  }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => <form>{children}</form>,
}));

jest.mock('src/components/markdown', () => ({
  Markdown: ({ children, sx }: { children: React.ReactNode; sx?: any }) => {
    const theme = {};
    (Array.isArray(sx) ? sx : [sx]).forEach((entry: any) => {
      if (typeof entry === 'function') entry(theme);
    });
    return <div data-testid="markdown">{children}</div>;
  },
}));

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (cb: () => void) => () => cb(),
  }),
}));

jest.mock('src/utils/format-number', () => ({
  fCurrency: (value: number) => `$${value}`,
}));

jest.mock('src/components/carousel', () => ({
  useCarousel: () => ({
    arrows: {},
    dots: { dotCount: 2, selectedIndex: 0 },
    mainApi: { scrollTo: jest.fn() },
    options: { thumbs: { slidesToShow: 'auto' } },
    thumbs: { onClickThumb: mockedThumbClick, selectedIndex: 0, thumbsRef: { current: null } },
  }),
  Carousel: ({ children }: { children: React.ReactNode }) => <div data-testid="carousel">{children}</div>,
  CarouselThumb: ({ onClick, index }: { onClick: () => void; index: number }) => (
    <button type="button" onClick={onClick}>
      thumb-{index}
    </button>
  ),
  CarouselThumbs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselArrowNumberButtons: () => <div data-testid="carousel-arrows" />,
}));

let mockLightboxOpen = true;

jest.mock('src/components/lightbox', () => ({
  useLightbox: () => ({
    onClose: mockedOnClose,
    onOpen: mockedOnOpen,
    open: mockLightboxOpen,
    selected: 1,
    setSelected: mockedSetSelected,
  }),
  Lightbox: ({ onGetCurrentIndex, open }: { onGetCurrentIndex: (index: number) => void; open: boolean }) => {
    onGetCurrentIndex(0);
    return <div data-testid={`lightbox-${open}`} />;
  },
}));

const theme = createTheme({ cssVariables: true } as any);

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('product detail view 100 coverage harness', () => {
  it('covers configurable options states and summary branches', () => {
    mockLightboxOpen = true;
    const configurableOptions = [
      {
        frontend_input: 'swatch_visual',
        label: 'Color',
        uid: 'opt-color',
        values: [
          { label: 'Red', swatch: { image_url: '' }, uid: 'val-red' },
          { label: 'Blue', swatch: { image_url: '' }, uid: 'val-blue' },
        ],
      },
      {
        frontend_input: 'select',
        label: 'Size',
        uid: 'opt-size',
        values: [
          { label: 'S', uid: 'val-s' },
          { label: 'M', uid: 'val-m' },
        ],
      },
    ] as any;

    const variants = [
      {
        attributes: [{ uid: 'val-red' }, { uid: 'val-s' }],
        product: {
          name: 'Variant Red S',
          price_range: { minimum_price: { final_price: { value: 10 }, regular_price: { value: 12 } } },
          sku: 'SKU-RED-S',
          stock_saleable: 3,
          stock_status: 'IN_STOCK',
        },
      },
      {
        attributes: [{ uid: 'val-blue' }, { uid: 'val-m' }],
        product: {
          name: 'Variant Blue M',
          price_range: { minimum_price: { final_price: { value: 20 }, regular_price: { value: 25 } } },
          sku: 'SKU-BLU-M',
          stock_saleable: 0,
          stock_status: 'OUT_OF_STOCK',
        },
      },
    ] as any;

    renderWithTheme(
      <ProductConfigurableOptions
        configurableOptions={configurableOptions}
        variants={variants}
        onSelectionChange={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('B'));
    fireEvent.click(screen.getByText('M'));
    fireEvent.click(screen.getByText('S'));

    renderWithTheme(
      <ProductConfigurableOptions
        configurableOptions={configurableOptions}
        disabled
        variants={variants}
      />
    );

    renderWithTheme(<ProductConfigurableOptions configurableOptions={[]} variants={[]} />);

    renderWithTheme(
      <ProductDetailsSummary
        product={{
          category: 'Category A',
          configurableOptions,
          discountPercent: 10,
          inStock: true,
          name: 'Main Product',
          price: 99,
          sku: 'MAIN-SKU',
          stock: 5,
          variants,
        } as any}
      />
    );
    renderWithTheme(
      <ProductDetailsSummary
        product={{
          category: 'Category A',
          configurableOptions,
          discountPercent: 0,
          inStock: true,
          name: 'Main Product no discount',
          price: 99,
          sku: 'MAIN-SKU-2',
          stock: 5,
          variants,
        } as any}
      />
    );

    renderWithTheme(
      <ProductDetailsSummary
        product={{
          category: '',
          configurableOptions: [],
          discountPercent: 0,
          inStock: false,
          name: 'Simple Product',
          price: 49,
          sku: 'SIMPLE-SKU',
          stock: 0,
          variants: [],
        } as any}
      />
    );

    renderWithTheme(
      <ProductDetailsToolbar
        product={{} as any}
        publish="draft"
        onChangePublish={jest.fn()}
        sx={[{ p: 1 }]}
      />
    );
    renderWithTheme(<ProductDetailsToolbar product={{} as any} publish="draft" onChangePublish={jest.fn()} sx={{ p: 1 }} />);

    renderWithTheme(<ProductDetailsDescription description="## markdown" sx={[{ p: 1 }]} />);
    renderWithTheme(<ProductDetailsDescription description="plain text" sx={{ p: 1 }} />);

    renderWithTheme(<ProductDetailsCarousel images={['/img-1.png', '/img-2.png']} />);
    mockLightboxOpen = false;
    renderWithTheme(<ProductDetailsCarousel images={['/img-1.png']} />);
    fireEvent.click(screen.getAllByRole('button', { name: /thumb-/i })[0]);
    fireEvent.click(screen.getAllByAltText('/img-1.png')[0]);

    expect(screen.getAllByTestId('carousel').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('carousel-arrows').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('lightbox-true').length).toBeGreaterThan(0);
    expect(mockedOnOpen).toHaveBeenCalled();
    expect(mockedThumbClick).toHaveBeenCalled();
  });
});
