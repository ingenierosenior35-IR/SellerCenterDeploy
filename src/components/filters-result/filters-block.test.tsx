import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { FiltersBlock } from './filters-block';

const theme = createTheme({ cssVariables: true });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('FiltersBlock', () => {
  it('renders nothing when isShow is false', () => {
    const { container } = render(
      <FiltersBlock label="Status" isShow={false}>
        <span>chip</span>
      </FiltersBlock>,
      { wrapper }
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders content when isShow is true', () => {
    render(
      <FiltersBlock label="Status" isShow>
        <span>chip</span>
      </FiltersBlock>,
      { wrapper }
    );
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('chip')).toBeInTheDocument();
  });

  it('renders label', () => {
    render(
      <FiltersBlock label="Priority" isShow>
        <span>item</span>
      </FiltersBlock>,
      { wrapper }
    );
    expect(screen.getByText('Priority')).toBeInTheDocument();
  });
});
