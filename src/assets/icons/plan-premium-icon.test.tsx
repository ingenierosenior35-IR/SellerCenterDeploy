import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import PlanPremiumIcon from './plan-premium-icon';

const theme = createTheme({ cssVariables: true });

describe('PlanPremiumIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <PlanPremiumIcon />
      </ThemeProvider>
    );
    expect(container.firstChild).not.toBeNull();
  });
});
