import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/global-config', () => ({
  CONFIG: { appName: 'Test App' },
}));

jest.mock('src/sections/product/view/load-options-view', () => ({
  __esModule: true,
  default: () => <div data-testid="load-options-view" />,
}));

describe('ProductLoadListPage', () => {
  it('renders LoadOptionsView', () => {
    render(<Page />);
    expect(screen.getByTestId('load-options-view')).toBeInTheDocument();
  });
});
