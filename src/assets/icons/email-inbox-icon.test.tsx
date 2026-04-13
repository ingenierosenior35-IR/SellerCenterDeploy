import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import EmailInboxIcon from './email-inbox-icon';

const theme = createTheme({ cssVariables: true });

describe('EmailInboxIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <EmailInboxIcon />
      </ThemeProvider>
    );
    expect(container.firstChild).not.toBeNull();
  });
});
