import React from 'react';
import { renderHook } from '@testing-library/react';

import { useNavData } from './nav-config-home';

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets' },
}));

jest.mock('src/components/svg-color', () => ({
  SvgColor: ({ src }: any) => <span data-testid={`svg-${src}`} />,
}));

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (ns: string, key?: string) => (key ? `${ns}.${key}` : ns),
  }),
}));

describe('nav-config-dashboard', () => {
  it('returns dashboard navigation data', () => {
    const { result } = renderHook(() => useNavData());

    expect(result.current.length).toBeGreaterThan(0);
    // ✅ en tu paths actual, root es /home
    expect(result.current[0].items[0].path).toBe('/home');
  });

  it('includes products, returns and feedback sections', () => {
    const { result } = renderHook(() => useNavData());
    const items = result.current[1].items;

    expect(items.some((i: any) => i.path.includes('/product'))).toBe(true);
    expect(items.some((i: any) => i.path.includes('/return'))).toBe(true);
    expect(items.some((i: any) => i.path.includes('/feedback'))).toBe(true);
  });
});
