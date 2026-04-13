import React from 'react';

import { navData } from './nav-config-main';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

describe('nav-config-main', () => {
  it('exports nav data with home and products', () => {
    expect(navData).toHaveLength(2);
    expect(navData[0].title).toBe('Home');
    expect(navData[1].title).toBe('Products');
  });

  it('contains expected paths', () => {
    expect(navData[0].path).toBe('/');
    expect(navData[1].path).toContain('/product');
  });
});
