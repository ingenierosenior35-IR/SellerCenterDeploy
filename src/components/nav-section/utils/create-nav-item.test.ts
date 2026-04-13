jest.mock('src/routes/components', () => ({
  RouterLink: 'a',
}));

import React from 'react';

import { createNavItem } from './create-nav-item';

describe('createNavItem', () => {
  it('depth=1 is rootItem, not subItem', () => {
    const result = createNavItem({ path: '/home', depth: 1 });
    expect(result.rootItem).toBe(true);
    expect(result.subItem).toBe(false);
    expect(result.subDeepItem).toBe(false);
  });

  it('depth=2 is subItem', () => {
    const result = createNavItem({ path: '/home/sub', depth: 2 });
    expect(result.rootItem).toBe(false);
    expect(result.subItem).toBe(true);
    expect(result.subDeepItem).toBe(false);
  });

  it('depth=3 is subDeepItem', () => {
    const result = createNavItem({ path: '/deep', depth: 3 });
    expect(result.subDeepItem).toBe(true);
  });

  it('external link uses href with target blank', () => {
    const result = createNavItem({ path: 'https://example.com', depth: 1, externalLink: true });
    expect(result.baseProps.href).toBe('https://example.com');
    expect(result.baseProps.target).toBe('_blank');
  });

  it('hasChild without enabledRootRedirect uses div', () => {
    const result = createNavItem({ path: '/parent', depth: 1, hasChild: true });
    expect(result.baseProps.component).toBe('div');
  });

  it('hasChild with enabledRootRedirect uses link', () => {
    const result = createNavItem({ path: '/parent', depth: 1, hasChild: true, enabledRootRedirect: true });
    expect(result.baseProps.href).toBe('/parent');
  });

  it('renders icon directly when icon is not a string', () => {
    const icon = React.createElement('svg');
    const result = createNavItem({ path: '/', depth: 1, icon });
    expect(result.renderIcon).toBe(icon);
  });

  it('renders info directly when not an array', () => {
    const infoEl = React.createElement('span', null, 'Badge');
    const result = createNavItem({ path: '/', depth: 1, info: infoEl });
    expect(result.renderInfo).toBeTruthy();
  });
});
