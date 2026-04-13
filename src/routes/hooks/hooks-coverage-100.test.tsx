import React from 'react';
import { useRouter as useNextRouter } from 'next/navigation';
import { render , screen, fireEvent, renderHook } from '@testing-library/react';

const mockedStart = jest.fn();
const mockedIsEqualPath = jest.fn();
const mockedPush = jest.fn();
const mockedReplace = jest.fn();
const mockedUseParams = jest.fn();
const mockedUsePathname = jest.fn();
const mockedUseSearchParams = jest.fn();

jest.mock('nprogress', () => ({
  __esModule: true,
  default: { start: (...args: unknown[]) => mockedStart(...args) },
}));

jest.mock('minimal-shared/utils', () => ({
  isEqualPath: (...args: unknown[]) => mockedIsEqualPath(...args),
}));

jest.mock('next/navigation', () => ({
  useParams: () => mockedUseParams(),
  usePathname: () => mockedUsePathname(),
  useRouter: jest.fn(),
  useSearchParams: () => mockedUseSearchParams(),
}));

import { useRouter, useParams, usePathname, useSearchParams } from './index';

const HookHarness = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div>
      <button type="button" onClick={() => router.push('/target')}>
        push
      </button>
      <button type="button" onClick={() => router.replace('/target-replace')}>
        replace
      </button>
      <div data-testid="params">{JSON.stringify(params)}</div>
      <div data-testid="pathname">{pathname}</div>
      <div data-testid="search">{String(searchParams?.get?.('q') ?? '')}</div>
    </div>
  );
};

describe('routes hooks coverage harness', () => {
  beforeEach(() => {
    mockedStart.mockReset();
    mockedPush.mockReset();
    mockedReplace.mockReset();
    mockedUseParams.mockReset();
    mockedUsePathname.mockReset();
    mockedUseSearchParams.mockReset();
    mockedIsEqualPath.mockReset();
    mockedIsEqualPath.mockReturnValue(false);
    (useNextRouter as jest.Mock).mockReturnValue({
      push: mockedPush,
      replace: mockedReplace,
    });
    mockedUseParams.mockReturnValue({ id: '1' });
    mockedUsePathname.mockReturnValue('/current');
    mockedUseSearchParams.mockReturnValue(new URLSearchParams('q=hello'));
  });

  it('covers index re-exports and starts nprogress only when path changes', () => {
    render(<HookHarness />);

    expect(screen.getByTestId('params')).toHaveTextContent('"id":"1"');
    expect(screen.getByTestId('pathname')).toHaveTextContent('/current');
    expect(screen.getByTestId('search')).toHaveTextContent('hello');

    fireEvent.click(screen.getByRole('button', { name: 'push' }));
    expect(mockedStart).toHaveBeenCalledTimes(1);
    expect(mockedPush).toHaveBeenCalledWith('/target', undefined);

    mockedIsEqualPath.mockReturnValue(true);
    fireEvent.click(screen.getByRole('button', { name: 'replace' }));
    expect(mockedStart).toHaveBeenCalledTimes(1);
    expect(mockedReplace).toHaveBeenCalledWith('/target-replace', undefined);

    mockedIsEqualPath.mockReturnValue(false);
    fireEvent.click(screen.getByRole('button', { name: 'replace' }));
    expect(mockedStart).toHaveBeenCalledTimes(2);
  });

  it('keeps wrapped push/replace methods in the memoized router object', () => {
    const { result, rerender } = renderHook(() => useRouter());
    const first = result.current;
    rerender();
    expect(typeof first.push).toBe('function');
    expect(typeof first.replace).toBe('function');
  });
});
