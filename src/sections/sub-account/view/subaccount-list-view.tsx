'use client';

import type { LabelColor } from 'src/components/label';
import type { TableHeadCellProps } from 'src/components/table';
import type { SubAccountInterface, AccountTableFiltersInterface } from 'src/interfaces';

import { varAlpha } from 'minimal-shared/utils';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { HomeContent } from 'src/layouts/home';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { PERMISSIONS } from '../constants/status';
import { useSubAccountTable } from './useSubAccountTable';
import { SubAccountTableRow, SubAccountTableToolbar } from '../components';

// ----------------------------------------------------------------------

const PERMISSION_OPTIONS = [{ value: 'all', label: 'All', color: 'default' }, ...PERMISSIONS];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'user', label: 'User' },
  { id: 'permissions', label: 'Permissions', width: 200   },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Created date' },
  { id: 'lastAccess', label: 'Last Access' },
  { id: 'action', label: 'Action' },
];

// ----------------------------------------------------------------------

export function SubAccountListView() {
  const {
    table,
    confirmDialog,
    isLoading,
    dataFiltered,
    currentFilters,
    tableData,
    notFound,
    filters,
    handleFilterPermission,
  } = useSubAccountTable();

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading="Manage Subaccounts"
        links={[
          { name: 'Home', href: paths.home.root },
          { name: 'Subaccount', href: paths.account.subaccount.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        {generateFilterTabs(currentFilters, handleFilterPermission, tableData)}

        <SubAccountTableToolbar
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
                dataFiltered.map((row) => row.id.toString())
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
                      <SubAccountTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id.toString())}
                        onSelectRow={() => table.onSelectRow(row.id.toString())}
                        detailsHref={paths.return.details(+row.id)}
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
    </HomeContent>
  );
}

// ----------------------------------------------------------------------


function generateFilterTabs(
  currentFilters: AccountTableFiltersInterface,
  handleFilterPermission: (event: React.SyntheticEvent, newValue: string
  ) => void, tableData: SubAccountInterface[]) {

  return (
    <Tabs
      value={currentFilters.permission}
      onChange={handleFilterPermission}
      sx={[
        (theme) => ({
          px: { md: 2.5 },
          boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        }),
      ]}
    >
      {PERMISSION_OPTIONS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={<Label
            variant={((tab.value === 'all' || tab.value === currentFilters.permission) && 'filled') ||
              'soft'}
            color={(tab.color) as LabelColor ||
              'default'}
          >
            {
              tableData.filter((account) => tab.value === 'all' || account.permissions.includes(tab.value)).length
            }
          </Label>} />
      ))}
    </Tabs>
  );
}
