import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import AvatarShape from './avatar-shape';

const theme = createTheme({ cssVariables: true });

describe('AvatarShape', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <AvatarShape />
      </ThemeProvider>
    );
    expect(container.firstChild).not.toBeNull();
  });
});
