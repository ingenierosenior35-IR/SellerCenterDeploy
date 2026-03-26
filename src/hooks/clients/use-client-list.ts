import type { TableHeadCellProps } from 'src/components';

import { useMemo, useEffect } from 'react';

import { useTranslate } from 'src/locales';
import { useGetClients } from 'src/actions/clients/useGetClients';

export function useClientList() {
  const { customers, isLoading, isError } = useGetClients();
  const { translate } = useTranslate();

  const clientList = useMemo(() => customers?.data ?? [], [customers?.data]);
  useEffect(() => {
    if (customers) {
      // Aquí puedes ejecutar efectos cuando los customers cambien
      // Por ejemplo: analytics, actualizar estado local, etc.
    }
  }, [customers]);
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