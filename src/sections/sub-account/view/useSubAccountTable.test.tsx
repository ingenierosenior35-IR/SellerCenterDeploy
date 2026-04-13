import { renderHook } from '@testing-library/react';

import { useSubAccountTable } from './use-subaccount-table';

jest.mock('src/actions/account/use-get-subaccounts', () => ({
  useGetSubAccounts: () => ({
    accounts: [
      {
        id: 142,
        name: 'Ana Garcia',
        email: 'ana@gmail.com',
        status: 'ACTIVE',
        createdAt: '2022-03-04',
        lastAccess: '2025-03-15T10:42:00Z',
        permissions: ['REPORTS', 'ORDERS'],
        actions: [],
        phone: '',
      },
      {
        id: 143,
        name: 'Juan Perez',
        email: 'juan@gmail.com',
        status: 'INACTIVE',
        createdAt: '2022-04-05',
        lastAccess: '2025-04-16T11:42:00Z',
        permissions: ['PRODUCTS'],
        actions: [],
        phone: '',
      },
    ],
    isLoading: false,
  }),
}));

jest.mock('src/components/table', () => ({
  useTable: () => ({
    dense: false,
    order: 'asc',
    orderBy: 'lastAccess',
    page: 0,
    rowsPerPage: 10,
    selected: [],
    onSort: jest.fn(),
    onSelectRow: jest.fn(),
    onSelectAllRows: jest.fn(),
    onChangePage: jest.fn(),
    onChangeRowsPerPage: jest.fn(),
    onResetPage: jest.fn(),
  }),
  getComparator: () => () => 0,
}));

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({
    value: false,
    onTrue: jest.fn(),
    onFalse: jest.fn(),
    onToggle: jest.fn(),
  }),
  useSetState: (initial: any) => {
    const state = { ...initial };
    const setState = jest.fn((newState: any) => Object.assign(state, newState));
    return { state, setState, resetState: jest.fn(), onResetState: jest.fn() };
  },
}));

describe('useSubAccountTable', () => {
  it('returns expected properties', () => {
    const { result } = renderHook(() => useSubAccountTable());
    expect(result.current).toHaveProperty('table');
    expect(result.current).toHaveProperty('tableData');
    expect(result.current).toHaveProperty('dataFiltered');
    expect(result.current).toHaveProperty('currentFilters');
    expect(result.current).toHaveProperty('canReset');
    expect(result.current).toHaveProperty('notFound');
    expect(result.current).toHaveProperty('filters');
    expect(result.current).toHaveProperty('handleFilterPermission');
    expect(result.current).toHaveProperty('confirmDialog');
    expect(result.current).toHaveProperty('isLoading');
  });

  it('initializes with accounts data', () => {
    const { result } = renderHook(() => useSubAccountTable());
    expect(result.current.tableData).toHaveLength(2);
  });

  it('canReset is false with default filters', () => {
    const { result } = renderHook(() => useSubAccountTable());
    expect(result.current.canReset).toBe(false);
  });

  it('isLoading is false', () => {
    const { result } = renderHook(() => useSubAccountTable());
    expect(result.current.isLoading).toBe(false);
  });

  it('handleFilterPermission is a function', () => {
    const { result } = renderHook(() => useSubAccountTable());
    expect(typeof result.current.handleFilterPermission).toBe('function');
  });
});
