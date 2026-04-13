import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import ComingSoonIllustration from './coming-soon-illustration';

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '' },
}));

jest.mock('./background-shape', () => ({
  __esModule: true,
  BackgroundShape: () => <svg />,
}));

const theme = createTheme({ cssVariables: true });

describe('ComingSoonIllustration', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <ComingSoonIllustration />
      </ThemeProvider>
    );
    expect(container.firstChild).not.toBeNull();
  });
});
