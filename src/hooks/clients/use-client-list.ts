import type { TableHeadCellProps } from 'src/components';

import { useMemo } from 'react';

import { useTranslate } from 'src/locales';
import { useGetClients } from 'src/actions/clients/use-get-clients';

export function useClientList() {
  const { customers, isLoading, isError } = useGetClients();
  const { translate } = useTranslate();

  const clientList = useMemo(() => customers?.data ?? [], [customers?.data]);

  const tableHead: TableHeadCellProps[] = [
    { id: 'name', label: `${translate('clientsModule.table.columns.name')}`, width: 150 },
    { id: 'email', label: `${translate('clientsModule.table.columns.email')}`, width: 150 },
    { id: 'address', label: `${translate('clientsModule.table.columns.address')}`, width: 150 },
    { id: 'clientSince', label: `${translate('clientsModule.table.columns.clientSince')}`, width: 150 },
  ];


  return {
    clientList,
    isLoading,
    isError,
    total: customers?.total_count ?? 0,
    tableHead
  };
}
