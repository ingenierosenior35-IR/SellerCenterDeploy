import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import UploadIllustration from './upload-illustration';

jest.mock('./background-shape', () => ({
  __esModule: true,
  BackgroundShape: () => <svg />,
}));

const theme = createTheme({ cssVariables: true });

describe('UploadIllustration', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <UploadIllustration />
      </ThemeProvider>
    );
    expect(container.firstChild).not.toBeNull();
  });
});
