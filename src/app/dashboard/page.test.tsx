import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/sections/dashboard/view', () => ({
  DashboardSummaryView: () => <div data-testid="dashboard-summary-view" />,
}));

describe('DashboardPage', () => {
  it('renders DashboardSummaryView', () => {
    render(<Page />);
    expect(screen.getByTestId('dashboard-summary-view')).toBeInTheDocument();
  });
});
