import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import PlanFreeIcon from './plan-free-icon';

const theme = createTheme({ cssVariables: true });

describe('PlanFreeIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <PlanFreeIcon />
      </ThemeProvider>
    );
    expect(container.firstChild).not.toBeNull();
  });
});
