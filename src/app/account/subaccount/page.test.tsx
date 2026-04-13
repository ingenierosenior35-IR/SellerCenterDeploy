import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/global-config', () => ({
  CONFIG: { appName: 'Test App' },
}));

jest.mock('src/sections/sub-account/view', () => ({
  SubAccountListView: () => <div data-testid="subaccount-list-view" />,
}));

describe('SubaccountPage', () => {
  it('renders SubAccountListView', () => {
    render(<Page />);
    expect(screen.getByTestId('subaccount-list-view')).toBeInTheDocument();
  });
});
