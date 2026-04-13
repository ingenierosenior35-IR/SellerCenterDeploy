import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/global-config', () => ({
  CONFIG: { appName: 'Test App' },
}));

jest.mock('src/auth/view', () => ({
  SignUpView: () => <div data-testid="sign-up-view" />,
}));

describe('SignUpPage', () => {
  it('renders SignUpView', () => {
    render(<Page />);
    expect(screen.getByTestId('sign-up-view')).toBeInTheDocument();
  });
});
