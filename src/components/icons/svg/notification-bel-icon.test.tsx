import React from 'react';
import { render, screen } from '@testing-library/react';

import { NotificationBellIcon } from './notification-bel-icon';

jest.mock('@mui/material/styles', () => ({
  useTheme: () => ({ palette: { common: { white: '#fff' } } }),
  useColorScheme: () => ({ mode: 'light' }),
}));

describe('NotificationBellIcon', () => {
  it('renders svg without active dot', () => {
    const { container } = render(<NotificationBellIcon data-testid="bell-svg" />);
    expect(screen.getByTestId('bell-svg')).toBeInTheDocument();
    expect(container.querySelectorAll('path').length).toBe(2);
  });

  it('renders active dot when active=true', () => {
    const { container } = render(<NotificationBellIcon active data-testid="bell-svg-active" />);
    expect(screen.getByTestId('bell-svg-active')).toBeInTheDocument();
    expect(container.querySelectorAll('path').length).toBe(3);
  });
});
