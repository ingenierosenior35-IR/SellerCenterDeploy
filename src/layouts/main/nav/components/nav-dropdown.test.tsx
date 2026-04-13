import { render, screen } from '@testing-library/react';

import { NavDropdown } from './nav-dropdown';

jest.mock('@mui/material/Fade', () => ({
  __esModule: true,
  default: ({ children, in: inProp }: { children: React.ReactNode; in?: boolean }) => (
    <div data-testid="fade" data-open={String(Boolean(inProp))}>
      {children}
    </div>
  ),
}));

jest.mock('@mui/material/styles', () => ({
  styled: (Component: any) => (stylesArg: any) => {
    if (typeof stylesArg === 'function') {
      const theme = {
        direction: 'ltr',
        zIndex: { drawer: 1200 },
        shape: { borderRadius: 8 },
        spacing: (...args: number[]) => args.join('px '),
        breakpoints: { values: { lg: 1200 } },
        mixins: { paperStyles: () => ({ border: '1px solid transparent' }) },
      };
      stylesArg({ theme });
      stylesArg({ theme: { ...theme, direction: 'rtl' } });
    }

    const StyledComponent = ({ children, ...props }: any) => <Component {...props}>{children}</Component>;

    return StyledComponent;
  },
}));

describe('NavDropdown', () => {
  it('passes open state into fade container', () => {
    const { rerender } = render(<NavDropdown open={false}>Closed content</NavDropdown>);

    expect(screen.getByTestId('fade')).toHaveAttribute('data-open', 'false');
    expect(screen.getByText('Closed content')).toBeInTheDocument();

    rerender(<NavDropdown open>Open content</NavDropdown>);

    expect(screen.getByTestId('fade')).toHaveAttribute('data-open', 'true');
    expect(screen.getByText('Open content')).toBeInTheDocument();
  });
});
