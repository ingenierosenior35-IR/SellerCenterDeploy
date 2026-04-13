import React from 'react';
import { render, screen } from '@testing-library/react';

import { StoreIcon } from './store-icon';

jest.mock('@mui/material/styles', () => ({
  useTheme: () => ({ palette: { common: { white: '#fff' } } }),
  useColorScheme: () => ({ mode: 'dark' }),
}));

describe('StoreIcon', () => {
  it('renders svg', () => {
    const { container } = render(<StoreIcon data-testid="store-svg" />);
    expect(screen.getByTestId('store-svg')).toBeInTheDocument();
    expect(container.querySelectorAll('path').length).toBeGreaterThan(0);
  });
});
