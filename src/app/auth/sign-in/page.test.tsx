import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/global-config', () => ({
  CONFIG: { appName: 'Test App' },
}));

jest.mock('src/auth/view', () => ({
  SignInView: () => <div data-testid="sign-in-view" />,
}));

describe('SignInPage', () => {
  it('renders SignInView', () => {
    render(<Page />);
    expect(screen.getByTestId('sign-in-view')).toBeInTheDocument();
  });
});
