import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/global-config', () => ({
  CONFIG: { appName: 'Test App' },
}));

jest.mock('src/sections/product/view', () => ({
  ProductListView: () => <div data-testid="product-list-view" />,
}));

describe('ProductPage', () => {
  it('renders ProductListView', () => {
    render(<Page />);
    expect(screen.getByTestId('product-list-view')).toBeInTheDocument();
  });
});
