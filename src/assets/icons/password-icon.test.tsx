import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import PasswordIcon from './password-icon';

const theme = createTheme({ cssVariables: true });

describe('PasswordIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <PasswordIcon />
      </ThemeProvider>
    );
    expect(container.firstChild).not.toBeNull();
  });
});
