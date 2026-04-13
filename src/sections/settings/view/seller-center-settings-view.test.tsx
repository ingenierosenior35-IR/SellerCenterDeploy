import { render, screen } from '@testing-library/react';

import { SellerCenterSettingsView } from './seller-center-settings-view';

jest.mock('../components/seller-center-settings', () => ({
  SellerCenterSettings: () => <div data-testid="seller-center-settings" />,
}));

describe('SellerCenterSettingsView', () => {
  it('renders SellerCenterSettings component', () => {
    render(<SellerCenterSettingsView />);
    expect(screen.getByTestId('seller-center-settings')).toBeInTheDocument();
  });
});
