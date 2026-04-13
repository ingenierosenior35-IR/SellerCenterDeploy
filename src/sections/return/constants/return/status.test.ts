import { renderHook } from '@testing-library/react';

import { useReturnStatus, RETURN_STATUS_VALUES } from './status';

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (_ns: string, key?: string) => key ?? _ns,
    currentLang: 'es',
  }),
}));

describe('RETURN_STATUS_VALUES', () => {
  it('exports an array of status objects', () => {
    expect(Array.isArray(RETURN_STATUS_VALUES)).toBe(true);
    expect(RETURN_STATUS_VALUES.length).toBeGreaterThan(0);
  });

  it('each status has value and color', () => {
    RETURN_STATUS_VALUES.forEach((s) => {
      expect(s).toHaveProperty('value');
      expect(s).toHaveProperty('color');
    });
  });

  it('includes PENDING status', () => {
    const pending = RETURN_STATUS_VALUES.find((s) => s.value === 'PENDING');
    expect(pending).toBeDefined();
    expect(pending!.color).toBe('default');
  });

  it('includes APPROVED status with success color', () => {
    const approved = RETURN_STATUS_VALUES.find((s) => s.value === 'APPROVED');
    expect(approved).toBeDefined();
    expect(approved!.color).toBe('success');
  });

  it('includes REJECTED status with error color', () => {
    const rejected = RETURN_STATUS_VALUES.find((s) => s.value === 'REJECTED');
    expect(rejected).toBeDefined();
    expect(rejected!.color).toBe('error');
  });
});

describe('useReturnStatus', () => {
  it('returns an array with label property', () => {
    const { result } = renderHook(() => useReturnStatus());
    expect(Array.isArray(result.current)).toBe(true);
    result.current.forEach((s) => {
      expect(s).toHaveProperty('label');
      expect(s).toHaveProperty('value');
      expect(s).toHaveProperty('color');
    });
  });

  it('returns same number of items as RETURN_STATUS_VALUES', () => {
    const { result } = renderHook(() => useReturnStatus());
    expect(result.current.length).toBe(RETURN_STATUS_VALUES.length);
  });
});
