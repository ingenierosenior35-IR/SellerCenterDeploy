jest.mock('./nav-dropdown', () => ({
  NavDropdown: () => null,
}));

jest.mock('./nav-elements', () => ({
  Nav: () => null,
  NavLi: () => null,
  NavUl: () => null,
}));

import * as navComponents from './index';

describe('main nav components index exports', () => {
  it('exports nav dropdown and elements', () => {
    expect(navComponents.NavDropdown).toBeDefined();
    expect(navComponents.Nav).toBeDefined();
    expect(navComponents.NavLi).toBeDefined();
    expect(navComponents.NavUl).toBeDefined();
  });
});
