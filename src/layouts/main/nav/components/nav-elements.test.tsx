import { render, screen } from '@testing-library/react';

import { Nav, NavLi, NavUl } from './nav-elements';

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (classes: Array<string | undefined>) => classes.filter(Boolean).join(' '),
}));

jest.mock('src/components/nav-section', () => ({
  navSectionClasses: {
    li: 'nav-li',
    ul: 'nav-ul',
  },
}));

describe('nav-elements', () => {
  it('renders nav structure and merges list classes', () => {
    render(
      <Nav aria-label="main-navigation">
        <NavUl className="custom-ul">
          <NavLi className="custom-li">Item one</NavLi>
        </NavUl>
      </Nav>
    );

    expect(screen.getByRole('navigation', { name: 'main-navigation' })).toBeInTheDocument();

    const list = screen.getByRole('list');
    const item = screen.getByRole('listitem');

    expect(list).toHaveClass('nav-ul');
    expect(list).toHaveClass('custom-ul');
    expect(item).toHaveClass('nav-li');
    expect(item).toHaveClass('custom-li');
    expect(screen.getByText('Item one')).toBeInTheDocument();
  });
});
