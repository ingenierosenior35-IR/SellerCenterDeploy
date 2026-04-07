'use client';

import type { FilterModelList, DataFormatedList, ResponseFormatedList } from 'src/interfaces/order';

import { varAlpha } from 'minimal-shared/utils';
import { useSetState } from 'minimal-shared/hooks';
import Tab from 'node_modules/@mui/material/esm/Tab/Tab';
import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useOrders } from 'src/hooks/orders/use-orders';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';
import { useGetOrders } from 'src/actions/order/use-get-orders';
import { adaptOrderListResponse } from 'src/actions/order/adapters/order-list-adapter';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { ErrorContent } from 'src/components/error-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableSkeleton,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import {
  STATUS_COLORS,
  STATUS_WITHOUT_GUIDES,
} from 'src/sections/order/resources/constants';

import { OrderTableRow } from '../components/order-table-row';
import { OrderTableToolbar } from '../components/order-table-toolbar';
import { OrderTableFiltersResult } from '../components/order-table-filters-results';

export function OrderListView() {
  const {TABLE_ORDER_HEAD} =useOrders();
  const { translate } = useTranslate();
  const [tableData, setTableData] = useState<ResponseFormatedList>([]);
  const [countItems, setCountItems] = useState<number>(10);
  const rowsPerPage = 10;
  const [paginatedControl, setPaginatedControl] = useState<number>(0);
  const { data, isLoading, isError } = useGetOrders(rowsPerPage, paginatedControl);
  const [dataStatus, setDataStatus] = useState<string[]>([]);
  const filters = useSetState<FilterModelList>({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const table = useTable({
    defaultOrderBy: 'createdAt',
    defaultOrder: 'desc',
    defaultRowsPerPage: rowsPerPage,
  });
  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const handleChangePagination = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPaginatedControl(newPage);
  };


  const ordersWithGuides = (dataFiltered ?? [])
    .filter((row: { status: string }) => !STATUS_WITHOUT_GUIDES.includes(row.status))
    .map((row: { orderNumber: string }) => row.orderNumber);

  useEffect(() => {
    if (data) {
      setCountItems(data.sellerOrders.total_count);
      const adaptedData = adaptOrderListResponse(data);
      setDataStatus(['all', ...Array.from(new Set(adaptedData.map((order: DataFormatedList) => order.status)))]);
      setTableData(adaptedData);
    }
  }, [data]);

  const canReset =
    !!currentFilters.name ||
    currentFilters.status !== 'all' ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const handleStatusChange = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table],
  );
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  return (
    <HomeContent>
      <Box>
        <CustomBreadcrumbs
          heading={translate('breadcrumbs.orders.list')}
          links={[{ name: translate('breadcrumbs.home'), href: '/' }, { name: translate('breadcrumbs.orders.list') }]}
        />
      </Box>
      {isError ? (
        <ErrorContent
          slotProps={{}}
          title="Ordenes no disponibles"
          description="Lo sentimos, no pudimos cargar las órdenes en este momento. Por favor, intenta nuevamente más tarde."
          sx={{ mt: 0 }}
        />
      ) : (
        <Card>
          {/* Filters section */}
          <Tabs
            value={currentFilters.status}
            onChange={handleStatusChange}
            sx={[
              (theme) => ({
                px: { md: 2.5 },
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars?.palette.grey[500] || '#9E9E9E', 0.08)}`,
              }),
            ]}
          >
            {dataStatus.map((orderStatus) => (
              <Tab
                key={orderStatus}
                label={orderStatus === 'all' ? translate('ordersModule.table.tabs.all') : orderStatus}
                value={orderStatus}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      orderStatus === 'all' || orderStatus === currentFilters.status
                        ? 'filled'
                        : 'soft'
                    }
                    color={
                      orderStatus === 'all'
                        ? 'default'
                        : (STATUS_COLORS[orderStatus as keyof typeof STATUS_COLORS] as any) ||
                          'default'
                    }
                  >
                    {orderStatus === 'all'
                      ? tableData.length
                      : tableData.filter((o) => o.status === orderStatus).length}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <OrderTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          />
          {/* Reset table section */}
          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              totalResults={tableData.length}
              onResetPage={table.onResetPage}
            />
          )}
          {/* Table section */}
          <Box sx={{ position: 'relative' }}>
            {/*  */}
            <TableSelectedAction
              sx={{}}
              action={null}
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={ordersWithGuides.length}
              // customColor="success"
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  tableData
                    .filter((row) => !STATUS_WITHOUT_GUIDES.includes(row.status))
                    .map((row) => row.orderNumber),
                )
              }
            />
            {/* Content table */}
            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  sx={{}}
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_ORDER_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  // onSelectAllRows={false}
                />

                <TableBody>
                  {isLoading ? (
                    <TableSkeleton
                      rowCount={10}
                      cellCount={TABLE_ORDER_HEAD.length}
                      sx={{ height: 69 }}
                    />
                  ) : (
                    dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage,
                      )
                      .map((row: DataFormatedList) => (
                        <OrderTableRow
                          key={row.orderNumber}
                          row={row}
                          detailsHref={paths.order.details(row.orderNumber)}
                          selected={table.selected.includes(row.orderNumber)}
                          onSelectRow={() => table.onSelectRow(row.orderNumber)}
                          // userRole={userRole}
                        />
                      ))
                  )}

                  {!isLoading && (
                    <TableEmptyRows
                      sx={{}}
                      height={table.dense ? 56 : 56 + 20}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />
                  )}

                  <TableNoData sx={{}} notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>
          {/* Pagination section */}
          <TablePaginationCustom
            sx={{}}
            page={paginatedControl}
            dense={table.dense}
            // showDense={false}
            count={countItems}
            rowsPerPage={table.rowsPerPage}
            onPageChange={handleChangePagination}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      )}
    </HomeContent>
  );
}

interface ApplyFilterParams {
  inputData: ResponseFormatedList;
  comparator: (a: any, b: any) => number;
  filters: FilterModelList;
  dateError: boolean;
}

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: ApplyFilterParams): ResponseFormatedList {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis: Array<[any, number]> = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(({ orderNumber, customer }) =>
      [orderNumber, customer.name, customer.email].some((field) =>
        field?.toLowerCase().includes(name.toLowerCase()),
      ),
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.createDate, startDate, endDate));
    }
  }

  return inputData;
}
