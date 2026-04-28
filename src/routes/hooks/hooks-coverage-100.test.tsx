import React from 'react';
import { render, screen, fireEvent, renderHook } from '@testing-library/react';

const mockedStart = jest.fn();
const mockedIsEqualPath = jest.fn();
const mockedNavigate = jest.fn();

jest.mock('nprogress', () => ({
  __esModule: true,
  default: { start: (...args: unknown[]) => mockedStart(...args) },
}));

jest.mock('minimal-shared/utils', () => ({
  isEqualPath: (...args: unknown[]) => mockedIsEqualPath(...args),
}));

jest.mock('react-router', () => ({
  useNavigate: () => mockedNavigate,
  useLocation: () => ({ pathname: '/current', search: '', hash: '', state: null, key: 'default' }),
  useParams: () => ({ id: '1' }),
  useSearchParams: () => [new URLSearchParams('q=hello'), jest.fn()],
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
    mockedNavigate.mockReset();
    mockedIsEqualPath.mockReset();
    mockedIsEqualPath.mockReturnValue(false);
  });

  it('renders params, pathname and searchParams from react-router', () => {
    render(<HookHarness />);
    expect(screen.getByTestId('params')).toHaveTextContent('"id":"1"');
    expect(screen.getByTestId('pathname')).toHaveTextContent('/current');
    expect(screen.getByTestId('search')).toHaveTextContent('hello');
  });

  it('push: starts NProgress and calls navigate when path changes', () => {
    render(<HookHarness />);
    fireEvent.click(screen.getByRole('button', { name: 'push' }));
    expect(mockedStart).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith('/target', undefined);
  });

  it('push: does NOT start NProgress when path is equal', () => {
    mockedIsEqualPath.mockReturnValue(true);
    render(<HookHarness />);
    fireEvent.click(screen.getByRole('button', { name: 'push' }));
    expect(mockedStart).not.toHaveBeenCalled();
    expect(mockedNavigate).toHaveBeenCalledWith('/target', undefined);
  });

  it('replace: always starts NProgress and navigates with replace:true', () => {
    render(<HookHarness />);
    fireEvent.click(screen.getByRole('button', { name: 'replace' }));
    expect(mockedStart).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith('/target-replace', { replace: true });
  });

  it('keeps wrapped push/replace methods in the memoized router object', () => {
    const { result, rerender } = renderHook(() => useRouter());
    const first = result.current;
    rerender();
    expect(typeof first.push).toBe('function');
    expect(typeof first.replace).toBe('function');
    expect(typeof first.back).toBe('function');
    expect(typeof first.forward).toBe('function');
    expect(typeof first.refresh).toBe('function');
    expect(typeof first.prefetch).toBe('function');
  });
});
