import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Footer, HomeFooter } from './footer';

jest.mock('src/routes/components', () => ({
  RouterLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    faqs: '/faqs',
  },
}));

jest.mock('src/_mock', () => ({
  _socials: [
    { label: 'Twitter', value: 'twitter' },
    { label: 'Facebook', value: 'facebook' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'LinkedIn', value: 'linkedin' },
  ],
}));

jest.mock('src/components/logo', () => ({
  Logo: () => <span data-testid="logo">logo</span>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

describe('main footer components', () => {
  const theme = createTheme({ cssVariables: true } as any);

  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

  it('renders Footer links, socials and legal copy', () => {
    renderWithTheme(<Footer />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByText('Minimal')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'FAQs' })).toHaveAttribute('href', '/faqs');
    expect(screen.getByText('support@minimals.cc')).toBeInTheDocument();
    expect(screen.getByTestId('icon-socials:twitter')).toBeInTheDocument();
    expect(screen.getByTestId('icon-socials:facebook')).toBeInTheDocument();
    expect(screen.getByTestId('icon-socials:instagram')).toBeInTheDocument();
    expect(screen.getByTestId('icon-socials:linkedin')).toBeInTheDocument();
    expect(screen.getByText('© All rights reserved.')).toBeInTheDocument();
  });

  it('renders HomeFooter compact content and external credits link', () => {
    renderWithTheme(<HomeFooter />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('© All rights reserved.'))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'minimals.cc' })).toHaveAttribute(
      'href',
      'https://minimals.cc/'
    );
  });

  it('supports HomeFooter sx array inputs', () => {
    renderWithTheme(<HomeFooter sx={[{ borderTop: '1px solid red' }]} />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'minimals.cc' })).toBeInTheDocument();
  });
});
