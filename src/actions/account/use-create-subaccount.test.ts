import React from 'react';
import { act, waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useCreateSubAccount } from './use-create-subaccount';

const mockRequest = jest.fn();

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest }),
  },
}));


const mockVariables = {
  customerId: '123',
  firstname: 'John',
  lastname: 'Doe',
  permissionType: 'catalog',
  email: 'john@example.com',
  status: 'active',
};

const mockSuccessResponse = {
  createSellerSubAccount: {
    errorMessage: '',
    successMessage: 'Sub-account created successfully',
  },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};


describe('useCreateSubAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be idle before mutate is called', () => {
    const { result } = renderHook(() => useCreateSubAccount(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
  });

  it('should call GraphQLService.request with the correct variables on mutate', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);

    const { result } = renderHook(() => useCreateSubAccount(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(mockVariables);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(mockRequest).toHaveBeenCalledWith(expect.anything(), mockVariables);
  });

  it('should return the success response data after mutation', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);

    const { result } = renderHook(() => useCreateSubAccount(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(mockVariables);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockSuccessResponse);
  });

  it('should set isError to true when the mutation fails', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useCreateSubAccount(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(mockVariables);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
  });

  it('should invalidate getSubSellerList queries on success', async () => {
    mockRequest.mockResolvedValue(mockSuccessResponse);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(() => useCreateSubAccount(), { wrapper });

    act(() => {
      result.current.mutate(mockVariables);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['getSubSellerList'] });
  });
});
