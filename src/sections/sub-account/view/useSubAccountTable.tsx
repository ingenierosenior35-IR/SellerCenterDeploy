import type { SubAccountInterface, AccountTableFiltersInterface } from 'src/interfaces';

import { useState, useEffect, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import { useGetSubAccounts } from 'src/actions/account/useGetSubAccounts';

import { useTable, getComparator } from 'src/components/table';

interface UseSubAccountTableReturn {
  table: ReturnType<typeof useTable>;
  confirmDialog: ReturnType<typeof useBoolean>;
  isLoading: boolean;
  tableData: SubAccountInterface[];
  dataFiltered: SubAccountInterface[];
  currentFilters: AccountTableFiltersInterface;
  canReset: boolean;
  notFound: boolean;
  filters: ReturnType<typeof useSetState<AccountTableFiltersInterface>>;
  handleFilterPermission: (event: React.SyntheticEvent, newValue: string) => void;
};

export const useSubAccountTable = (): UseSubAccountTableReturn => {
  const table = useTable({ defaultOrderBy: 'lastAccess' });

  const confirmDialog = useBoolean();

  const { accounts, isLoading } = useGetSubAccounts();

  const [tableData, setTableData] = useState<SubAccountInterface[]>(accounts || []);

  useEffect(() => {
    setTableData(accounts);
  }, [accounts]);

  const filters = useSetState<AccountTableFiltersInterface>({
    name: '',
    permission: 'all',
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const canReset =
    !!currentFilters.name || currentFilters.permission !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilterPermission = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ permission: newValue });
    },
    [updateFilters, table]
  );

  return {
    // values
    table,
    confirmDialog,
    isLoading,
    tableData,
    dataFiltered,
    currentFilters,
    canReset,
    notFound,
    filters,
    // handlers
    handleFilterPermission,
  };
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: SubAccountInterface[];
  filters: AccountTableFiltersInterface;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { permission, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(({ name: accountName, email }) =>
      [accountName, email].some((field) =>
        field?.toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  if (permission !== 'all') {
    inputData = inputData.filter((account) => account.permissions.includes(permission));
  }

  return inputData;
}
