import { render, screen } from '@testing-library/react';

import { SimpleLayout } from './layout';

jest.mock('./content', () => ({
  SimpleCompactContent: ({ children, layoutQuery }: { children: React.ReactNode; layoutQuery: string }) => (
    <div data-testid="simple-compact-content" data-layout-query={layoutQuery}>
      {children}
    </div>
  ),
}));

jest.mock('src/components/logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

jest.mock('../components/settings-button', () => ({
  SettingsButton: () => <button type="button">settings</button>,
}));

jest.mock('../core', () => ({
  HeaderSection: ({ slots }: { slots?: any }) => (
    <header>
      {slots?.topArea}
      {slots?.leftArea}
      {slots?.rightArea}
    </header>
  ),
  MainSection: ({ children }: { children: React.ReactNode }) => (
    <main data-testid="main-section">{children}</main>
  ),
  LayoutSection: ({ children, headerSection, cssVars }: any) => (
    <div data-testid="layout-section" data-css-vars={JSON.stringify(cssVars)}>
      {headerSection}
      {children}
    </div>
  ),
}));

describe('SimpleLayout', () => {
  it('renders children directly when compact is false', () => {
    render(<SimpleLayout>Simple body</SimpleLayout>);

    expect(screen.getByTestId('main-section')).toHaveTextContent('Simple body');
    expect(screen.queryByTestId('simple-compact-content')).not.toBeInTheDocument();
    expect(screen.getByText('Need help?')).toBeInTheDocument();
  });

  it('renders compact content wrapper when compact is true', () => {
    render(
      <SimpleLayout slotProps={{ content: { compact: true } }}>
        Compact body
      </SimpleLayout>
    );

    expect(screen.getByTestId('simple-compact-content')).toHaveTextContent('Compact body');
  });

  it('passes default css variables to layout section', () => {
    render(<SimpleLayout>Body</SimpleLayout>);

    const cssVars = JSON.parse(screen.getByTestId('layout-section').getAttribute('data-css-vars') || '{}');

    expect(cssVars['--layout-simple-content-compact-width']).toBe('448px');
  });
});
