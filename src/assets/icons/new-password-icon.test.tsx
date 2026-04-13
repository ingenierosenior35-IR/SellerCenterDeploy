import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import NewPasswordIcon from './new-password-icon';

const theme = createTheme({ cssVariables: true });

describe('NewPasswordIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <NewPasswordIcon />
      </ThemeProvider>
    );
    expect(container.firstChild).not.toBeNull();
  });
});
