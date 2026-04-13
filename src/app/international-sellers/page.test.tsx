import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/global-config', () => ({
  CONFIG: { appName: 'Test App' },
}));

jest.mock('src/sections/international-sellers/view/landing-view', () => ({
  LandingView: () => <div data-testid="landing-view" />,
}));

describe('InternationalSellersPage', () => {
  it('renders LandingView', () => {
    render(<Page />);
    expect(screen.getByTestId('landing-view')).toBeInTheDocument();
  });
});
