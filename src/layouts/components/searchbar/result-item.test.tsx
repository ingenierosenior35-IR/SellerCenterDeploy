jest.mock('minimal-shared/utils', () => ({
  isExternalLink: (href: string) => href.startsWith('http'),
  varAlpha: (color: string, alpha: number | string) => `rgba(${color}/${alpha})`,
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ResultItem } from './result-item';

describe('ResultItem', () => {
  const theme = createTheme({ cssVariables: true } as any);

  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

  const title = [
    { text: 'Prod', highlight: true },
    { text: 'uct', highlight: false },
  ];
  const path = [
    { text: '/pro', highlight: false },
    { text: 'ducts', highlight: true },
  ];

  it('renders internal link with reversed labels', () => {
    renderWithTheme(
      <ResultItem
        href="/products"
        labels={['Dashboard', 'Catalog']}
        title={title}
        path={path}
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products');
    expect(link).not.toHaveAttribute('target', '_blank');
    expect(screen.getByText('Prod')).toBeInTheDocument();
    expect(screen.getByText('uct')).toBeInTheDocument();

    const labels = screen.getAllByText(/Dashboard|Catalog/);
    expect(labels.map((item) => item.textContent)).toEqual(['Catalog', 'Dashboard']);
  });

  it('renders external link security attributes', () => {
    renderWithTheme(
      <ResultItem
        href="https://example.com/docs"
        labels={['Docs']}
        title={[{ text: 'Docs', highlight: false }]}
        path={[{ text: '/docs', highlight: false }]}
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/docs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
