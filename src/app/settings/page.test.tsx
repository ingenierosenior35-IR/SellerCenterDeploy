import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/global-config', () => ({
  CONFIG: { appName: 'Test App' },
}));

jest.mock('src/sections/settings/view/seller-center-settings-view', () => ({
  SellerCenterSettingsView: () => <div data-testid="settings-view" />,
}));

describe('SettingsPage', () => {
  it('renders SellerCenterSettingsView', () => {
    render(<Page />);
    expect(screen.getByTestId('settings-view')).toBeInTheDocument();
  });
});
