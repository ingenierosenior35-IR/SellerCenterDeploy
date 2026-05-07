'use client';

import type { TableHeadCellProps } from 'src/components/table';
import type { ItemsReturnListInterface, ReturnTableFiltersInterface } from 'src/interfaces';

import { useState, useEffect } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { HomeContent } from 'src/layouts/home';
import { useTranslate } from 'src/locales/langs/i18n';
import { useGetReturns } from 'src/actions/return/useGetReturns';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { OrderTableRow } from '../order-table-row';
import { OrderTableToolbar } from '../order-table-toolbar';

// ----------------------------------------------------------------------

export function ReturnListView() {
  const { translate } = useTranslate();

  const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'id', label: translate('id'), width: 150 },
    { id: 'orderReference', label: translate('orderReference'), width: 150 },
    { id: 'customerName', label: translate('customerName') },
    { id: 'status', label: translate('status') },
    { id: 'createdAt', label: translate('createdAt'), width: 150 },
    { id: 'action', label: '' },
  ];

  const table = useTable({ defaultOrderBy: 'orderNumber', defaultRowsPerPage: 10 });

  const confirmDialog = useBoolean();

  const { returns, isFetching } = useGetReturns({
    currentPage: table.page + 1,
    pageSize: table.rowsPerPage,
  });

  const [tableData, setTableData] = useState<ItemsReturnListInterface[]>(
    returns?.returns?.items || []
  );

  const totalCount = returns?.returns?.totalCount ?? 0;

  useEffect(() => {
    setTableData(returns?.returns?.items || []);
  }, [returns]);

  const filters = useSetState<ReturnTableFiltersInterface>({
    name: '',
    status: 'all',
  });
  const { state: currentFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const canReset = !!currentFilters.name;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={translate('returnList')}
        links={[
          { name: translate('sidebarMenu.home.title'), href: paths.home.root },
          { name: translate('sidebarMenu.returns.title'), href: paths.return.root },
          { name: translate('sidebarMenu.returns.subtitles.list') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <OrderTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
          totalCount={totalCount}
        />

        <Box sx={{ position: 'relative' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.uid)
              )
            }
            action={
              <Tooltip title={translate('delete')}>
                <IconButton color="primary" onClick={confirmDialog.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar sx={{ minHeight: 444 }}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headCells={TABLE_HEAD}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {isFetching ? (
                  <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} />
                ) : (
                  <>
                    {dataFiltered.map((row) => (
                      <OrderTableRow
                        key={row.uid}
                        row={row}
                        selected={table.selected.includes(row.uid.toString())}
                        onSelectRow={() => table.onSelectRow(row.uid.toString())}
                        detailsHref={paths.return.details(+row.uid)}
                      />
                    ))}

                    {notFound && <TableNoData notFound={notFound} />}
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          count={totalCount}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </HomeContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ItemsReturnListInterface[];
  filters: ReturnTableFiltersInterface;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(({ number, customer }) =>
      [number, customer.email, customer.name].some((field) =>
        field?.toLowerCase().includes(name.toLowerCase())
      )
    );
  }

  return inputData;
}
