'use client';

import type { LabelColor } from 'src/components/label';
import type { TableHeadCellProps } from 'src/components/table';
import type { ItemsReturnListInterface, ReturnTableFiltersInterface } from 'src/interfaces';

import { varAlpha } from 'minimal-shared/utils';
import { useState, useEffect, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetReturns } from 'src/actions/return/useGetReturns';

import { Label } from 'src/components/label';
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
import { RETURN_STATUS } from '../constants/return/status';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All', color: 'default' }, ...RETURN_STATUS];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'id', label: 'Id', width: 150 },
  { id: 'orderReference', label: 'Order Reference', width: 150   },
  { id: 'customerName', label: 'Customer' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Created date', width: 150 },
  { id: 'action', label: '' },
];

// ----------------------------------------------------------------------

export function ReturnListView() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const confirmDialog = useBoolean();

  const { returns, isLoading } = useGetReturns();

  const [tableData, setTableData] = useState<ItemsReturnListInterface[]>(returns?.returns?.items || []);

  useEffect(() => {
    setTableData(returns?.returns?.items || []);
  }, [returns]);

  const filters = useSetState<ReturnTableFiltersInterface>({
    name: '',
    status: 'all',
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const canReset =
    !!currentFilters.name ||
    currentFilters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Return List"
        links={[
          { name: 'Home', href: paths.home.root },
          { name: 'Return', href: paths.return.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={currentFilters.status}
          onChange={handleFilterStatus}
          sx={[
            (theme) => ({
              px: { md: 2.5 },
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                    'soft'
                  }
                  color={
                    (tab.color) as LabelColor ||
                    'default'
                  }
                >
                  {RETURN_STATUS.map((status) => status.value).includes(tab.value)
                    ? tableData.filter((returnItem) => returnItem.status === tab.value).length
                    : tableData.length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <OrderTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
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
              <Tooltip title="Delete">
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
                {
                  dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row.uid}
                        row={row}
                        selected={table.selected.includes(row.uid.toString())}
                        onSelectRow={() => table.onSelectRow(row.uid.toString())}
                        detailsHref={paths.return.details(+row.uid)}
                      />
                    ))
                }

                {
                  isLoading ? (
                    <TableSkeleton rowCount={5} cellCount={TABLE_HEAD.length} />
                  ) : notFound ? (
                    <TableNoData notFound={notFound} />
                  ) : null
                }

              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          // dense={table.dense}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          // onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ItemsReturnListInterface[];
  filters: ReturnTableFiltersInterface;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { status, name } = filters;

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

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  return inputData;
}
