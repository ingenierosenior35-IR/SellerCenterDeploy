'use client';

import type { LabelColor } from 'src/components/label';
import type { TableHeadCellProps } from 'src/components/table';
import type { SubAccountInterface, AccountTableFiltersInterface } from 'src/interfaces';

import { useMemo } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
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
import { useSubAccountTable } from './use-subaccount-table';
import { SubAccountCreateForm } from './subaccount-create-form';
import { SubAccountTableRow, SubAccountTableToolbar } from '../components';

// ----------------------------------------------------------------------

const PERMISSION_OPTIONS = [{ value: 'all', label: 'All', color: 'default' }, ...PERMISSIONS];

// ----------------------------------------------------------------------

export function SubAccountListView() {
  const createForm = useBoolean();
  const { translate } = useTranslate();

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

  const TABLE_HEAD = useMemo<TableHeadCellProps[]>(() => {
  const t = translate;

  return [
      { id: 'user', label: t('subAccountListView.table.columns.user') },
      { id: 'permissions', label: t('subAccountListView.table.columns.permissions'), width: 200 },
      { id: 'status', label: t('subAccountListView.table.columns.status') },
      { id: 'createdAt', label: t('subAccountListView.table.columns.createdAt') },
      { id: 'action', label: t('subAccountListView.table.columns.actions') },
    ];
  }, [translate]);

  const renderCreateForm = () => (
    <SubAccountCreateForm
      open={createForm.value}
      onClose={createForm.onFalse}
    />
  );

  return (
    <>
      <HomeContent>
        <CustomBreadcrumbs
          heading={translate('subAccount.manageSubaccounts')}
          links={[
            { name: translate('subAccountListView.breadcrumbs.home'), href: paths.home.root },
            { name: translate('subAccountListView.breadcrumbs.subaccount'), href: paths.account.subaccount.root },
            { name: translate('subAccountListView.breadcrumbs.list') },
          ]}
          action={
            <Button
              onClick={createForm.onTrue}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {translate('subAccountListView.actions.addSubaccount')}
            </Button>
          }
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
              // dense={table.dense}
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
      {renderCreateForm()}
    </>
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
              tableData.filter((account) =>
                tab.value === 'all' || account.permissions.some((perm) => Object.keys(perm).includes(tab.value))
              ).length
            }
          </Label>} />
      ))}
    </Tabs>
  );
}
