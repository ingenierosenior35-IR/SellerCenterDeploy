import { act, renderHook } from '@testing-library/react';

import { useTable } from './use-table';

describe('useTable', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useTable());
    expect(result.current.page).toBe(0);
    expect(result.current.rowsPerPage).toBe(5);
    expect(result.current.order).toBe('asc');
    expect(result.current.orderBy).toBe('name');
    expect(result.current.dense).toBe(false);
    expect(result.current.selected).toEqual([]);
  });

  it('accepts custom defaults', () => {
    const { result } = renderHook(() =>
      useTable({ defaultCurrentPage: 2, defaultRowsPerPage: 10, defaultOrder: 'desc' })
    );
    expect(result.current.page).toBe(2);
    expect(result.current.rowsPerPage).toBe(10);
    expect(result.current.order).toBe('desc');
  });

  it('onSort toggles asc/desc', () => {
    const { result } = renderHook(() => useTable({ defaultOrderBy: 'name' }));
    act(() => result.current.onSort('name'));
    expect(result.current.order).toBe('desc');
    act(() => result.current.onSort('name'));
    expect(result.current.order).toBe('asc');
  });

  it('onSort changes orderBy field', () => {
    const { result } = renderHook(() => useTable());
    act(() => result.current.onSort('email'));
    expect(result.current.orderBy).toBe('email');
  });

  it('onSelectRow adds row to selected', () => {
    const { result } = renderHook(() => useTable());
    act(() => result.current.onSelectRow('row-1'));
    expect(result.current.selected).toContain('row-1');
  });

  it('onSelectRow removes already selected row', () => {
    const { result } = renderHook(() => useTable({ defaultSelected: ['row-1'] }));
    act(() => result.current.onSelectRow('row-1'));
    expect(result.current.selected).not.toContain('row-1');
  });

  it('onSelectAllRows selects all when checked', () => {
    const { result } = renderHook(() => useTable());
    act(() => result.current.onSelectAllRows(true, ['row-1', 'row-2']));
    expect(result.current.selected).toEqual(['row-1', 'row-2']);
  });

  it('onSelectAllRows clears selection when unchecked', () => {
    const { result } = renderHook(() => useTable({ defaultSelected: ['row-1'] }));
    act(() => result.current.onSelectAllRows(false, []));
    expect(result.current.selected).toEqual([]);
  });

  it('onChangePage updates page', () => {
    const { result } = renderHook(() => useTable());
    act(() => result.current.onChangePage(null, 3));
    expect(result.current.page).toBe(3);
  });

  it('onResetPage resets to 0', () => {
    const { result } = renderHook(() => useTable({ defaultCurrentPage: 3 }));
    act(() => result.current.onResetPage());
    expect(result.current.page).toBe(0);
  });

  it('onChangeRowsPerPage updates rowsPerPage and resets page', () => {
    const { result } = renderHook(() => useTable({ defaultCurrentPage: 2 }));
    act(() =>
      result.current.onChangeRowsPerPage({
        target: { value: '25' },
      } as React.ChangeEvent<HTMLInputElement>)
    );
    expect(result.current.rowsPerPage).toBe(25);
    expect(result.current.page).toBe(0);
  });

  it('onChangeDense updates dense state', () => {
    const { result } = renderHook(() => useTable());
    act(() =>
      result.current.onChangeDense({
        target: { checked: true },
      } as React.ChangeEvent<HTMLInputElement>)
    );
    expect(result.current.dense).toBe(true);
  });
});
