import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/global-config', () => ({
  CONFIG: { appName: 'Test App' },
}));

jest.mock('src/sections/product/view/product-load-view', () => ({
  ProductLoadView: () => <div data-testid="product-load-view" />,
}));

describe('ProductLoadPage', () => {
  it('renders ProductLoadView', () => {
    render(<Page />);
    expect(screen.getByTestId('product-load-view')).toBeInTheDocument();
  });
});
