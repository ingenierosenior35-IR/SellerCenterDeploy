import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/global-config', () => ({
  CONFIG: { appName: 'Test App' },
}));

jest.mock('src/sections/overview/app/view', () => ({
  OverviewAppView: () => <div data-testid="overview-app-view" />,
}));

describe('HomePage', () => {
  it('renders OverviewAppView', () => {
    render(<Page />);
    expect(screen.getByTestId('overview-app-view')).toBeInTheDocument();
  });
});
