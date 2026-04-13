import React from 'react';
import { render, screen } from '@testing-library/react';

import { SearchIcon } from './search-icon';

jest.mock('@mui/material/styles', () => ({
  useTheme: () => ({ palette: { common: { white: '#fff' } } }),
  useColorScheme: () => ({ mode: 'dark' }),
}));

describe('SearchIcon', () => {
  it('renders svg', () => {
    const { container } = render(<SearchIcon data-testid="search-svg" />);
    expect(screen.getByTestId('search-svg')).toBeInTheDocument();
    expect(container.querySelector('path')).toBeInTheDocument();
  });
});
