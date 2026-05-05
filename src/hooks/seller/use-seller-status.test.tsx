import { renderHook } from '@testing-library/react';

import { useSellerProfile } from 'src/actions/auth/use-seller-profile';

import { useSellerStatus } from './use-seller-status';

jest.mock('src/actions/auth/use-seller-profile', () => ({
  useSellerProfile: jest.fn(),
}));

const mocked = useSellerProfile as jest.MockedFunction<typeof useSellerProfile>;

const buildResult = (data: unknown) => ({ data }) as ReturnType<typeof useSellerProfile>;

describe('useSellerStatus', () => {
  it('falls back to PENDING when the profile query is still loading', () => {
    mocked.mockReturnValue(buildResult(undefined));
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe('PENDING');
    expect(result.current.isPending).toBe(true);
  });

  it('falls back to PENDING when the profile query errored', () => {
    mocked.mockReturnValue(buildResult(undefined));
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe('PENDING');
  });

  it('returns APPROVED with statusLabel from backend', () => {
    mocked.mockReturnValue(
      buildResult({
        sellerId: 1,
        status: 'APPROVED',
        statusCode: 1,
        statusLabel: 'Aprobado',
        shopUrl: 'shop',
      })
    );
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe('APPROVED');
    expect(result.current.statusLabel).toBe('Aprobado');
    expect(result.current.isApproved).toBe(true);
  });

  it.each([
    ['PROCESSING', 2],
    ['DISABLED', 3],
    ['DENIED', 4],
  ] as const)('handles %s', (status, code) => {
    mocked.mockReturnValue(
      buildResult({
        sellerId: 1,
        status,
        statusCode: code,
        statusLabel: '',
        shopUrl: '',
      })
    );
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe(status);
  });

  it('exposes per-status booleans matching the active status', () => {
    mocked.mockReturnValue(
      buildResult({
        sellerId: 1,
        status: 'DENIED',
        statusCode: 4,
        statusLabel: '',
        shopUrl: '',
      })
    );
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.isDenied).toBe(true);
    expect(result.current.isApproved).toBe(false);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isDisabled).toBe(false);
  });

  it('falls back to PENDING when status is undefined (unknown code)', () => {
    mocked.mockReturnValue(
      buildResult({
        sellerId: 1,
        status: undefined,
        statusCode: 99,
        statusLabel: '',
        shopUrl: '',
      })
    );
    const { result } = renderHook(() => useSellerStatus());
    expect(result.current.status).toBe('PENDING');
  });
});
