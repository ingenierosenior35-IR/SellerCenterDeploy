import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/global-config', () => ({
  CONFIG: { appName: 'Test App' },
}));

jest.mock('src/sections/product/view', () => ({
  ProductDetailsView: ({ id }: { id: number }) => <div data-testid="product-details-view">{id}</div>,
}));

describe('ProductIdPage', () => {
  it('renders ProductDetailsView with valid id', async () => {
    const jsx = await Page({ params: Promise.resolve({ id: '42' }) });
    render(jsx);
    expect(screen.getByTestId('product-details-view')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('throws for invalid id', async () => {
    await expect(Page({ params: Promise.resolve({ id: 'abc' }) })).rejects.toThrow();
  });
});
