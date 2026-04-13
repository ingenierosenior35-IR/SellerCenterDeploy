import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { BlankView } from './view';

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.5)',
}));

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('BlankView', () => {
  it('renders default title "Blank"', () => {
    renderWithTheme(<BlankView />);
    expect(screen.getByText('Blank')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    renderWithTheme(<BlankView title="My Page" />);
    expect(screen.getByText('My Page')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    renderWithTheme(<BlankView description="Some description" />);
    expect(screen.getByText('Some description')).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    const { container } = renderWithTheme(<BlankView />);
    expect(container.querySelectorAll('p').length).toBe(0);
  });
});
