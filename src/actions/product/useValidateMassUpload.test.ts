import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useValidateMassUpload } from './useValidateMassUpload';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest, setHeader: jest.fn() }),
  },
}));

jest.mock('src/auth/context/utils', () => ({
  getSession: jest.fn(() => null),
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

const mockRequest$ = {
  fileContentBase64: 'base64string',
  fileName: 'test.csv',
  fileType: 'text/csv',
  attributeSetId: 4,
};

describe('useValidateMassUpload', () => {
  beforeEach(() => mockRequest.mockReset());

  it('returns a mutateAsync function', () => {
    const { result } = renderHook(() => useValidateMassUpload(), { wrapper: createWrapper() });
    expect(typeof result.current.mutateAsync).toBe('function');
  });

  it('calls graphql.request on mutate', async () => {
    mockRequest.mockResolvedValue({
      validateMassUpload: {
        extension: 'csv',
        file_size_bytes: 1024,
        message: 'OK',
        success: true,
      },
    });
    const { result } = renderHook(() => useValidateMassUpload(), { wrapper: createWrapper() });
    result.current.mutate(mockRequest$);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });

  it('sets isError on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Upload failed'));
    const { result } = renderHook(() => useValidateMassUpload(), { wrapper: createWrapper() });
    result.current.mutate(mockRequest$);
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
