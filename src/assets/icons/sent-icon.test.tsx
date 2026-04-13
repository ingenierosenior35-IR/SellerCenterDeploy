import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import SentIcon from './sent-icon';

const theme = createTheme({ cssVariables: true });

describe('SentIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <SentIcon />
      </ThemeProvider>
    );
    expect(container.firstChild).not.toBeNull();
  });
});
