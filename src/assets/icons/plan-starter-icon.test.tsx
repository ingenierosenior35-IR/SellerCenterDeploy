import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import PlanStarterIcon from './plan-starter-icon';

const theme = createTheme({ cssVariables: true });

describe('PlanStarterIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <PlanStarterIcon />
      </ThemeProvider>
    );
    expect(container.firstChild).not.toBeNull();
  });
});
