import { render, screen } from '@testing-library/react';

import { NavDesktop } from './nav-desktop';

jest.mock('../components', () => ({
  Nav: ({ children, ...props }: any) => (
    <nav data-testid="desktop-nav" {...props}>
      {children}
    </nav>
  ),
  NavUl: ({ children, ...props }: any) => (
    <ul data-testid="desktop-nav-list" {...props}>
      {children}
    </ul>
  ),
}));

jest.mock('./nav-desktop-list', () => ({
  NavList: ({ data }: any) => <li data-testid="desktop-nav-item">{data.title}</li>,
}));

describe('NavDesktop', () => {
  it('maps all navigation groups into nav list items', () => {
    render(
      <NavDesktop
        data={[
          { title: 'Home', path: '/' },
          { title: 'Returns', path: '/returns' },
        ]}
      />
    );

    expect(screen.getByTestId('desktop-nav')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-nav-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('desktop-nav-item')).toHaveLength(2);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Returns')).toBeInTheDocument();
  });
});
