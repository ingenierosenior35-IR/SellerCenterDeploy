import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProductDetailsDescription } from './product-details-description';

jest.mock('src/components/markdown', () => ({
  Markdown: ({ children }: any) => <div data-testid="markdown">{children}</div>,
}));

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ProductDetailsDescription', () => {
  it('renders the markdown component', () => {
    renderWithTheme(<ProductDetailsDescription description="**Bold text**" />);
    expect(screen.getByTestId('markdown')).toBeInTheDocument();
  });

  it('passes description to Markdown', () => {
    renderWithTheme(<ProductDetailsDescription description="My product description" />);
    expect(screen.getByText('My product description')).toBeInTheDocument();
  });

  it('renders with empty description', () => {
    renderWithTheme(<ProductDetailsDescription description="" />);
    expect(screen.getByTestId('markdown')).toBeInTheDocument();
  });

  it('renders with HTML description', () => {
    renderWithTheme(
      <ProductDetailsDescription description="<p>Product info</p>" />
    );
    expect(screen.getByTestId('markdown')).toBeInTheDocument();
  });
});
