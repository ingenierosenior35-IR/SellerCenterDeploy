'use client';

import type { TableHeadCellProps } from 'src/components/table';

import { useCallback, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { TableCell, TableRow } from '@mui/material';

// ----------------------------------------------------------------------

type CommonTableProps = {
  children?: React.ReactNode;
  tableHeadCell: TableHeadCellProps[];
  contentTable?: any[];
  renderCell: (row: any, rowIndex: number) => React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  filterKeys?: string[];
  filterTemplate?: React.ReactNode;
};

export function CommonTable({
  children,
  tableHeadCell,
  contentTable,
  renderCell,
  searchable = true,
  searchPlaceholder = 'Search...',
  filterKeys,
  filterTemplate,
}: CommonTableProps) {
  const table = useTable({ defaultOrderBy: 'orderNumber' });
  const data = contentTable || [];
  const [searchValue, setSearchValue] = useState('');
  const isLoading = false;
  const searchableKeys = useMemo(
    () =>
      filterKeys && filterKeys.length ? filterKeys : tableHeadCell.map((col) => String(col.id)),
    [filterKeys, tableHeadCell]
  );

  const filteredData = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return data;
    }

    return data.filter((row) =>
      searchableKeys.some((key) =>
        String(row?.[key] ?? '')
          .toLowerCase()
          .includes(query)
      )
    );
  }, [data, searchValue, searchableKeys]);

  const notFound = filteredData.length === 0;

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      table.onResetPage();
      setSearchValue(event.target.value);
    },
    [table]
  );

  return (
    <Card>
      {children}

      {searchable && (
        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              gap: 2,
              width: 1,
              display: 'flex',
              alignItems: 'center',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {filterTemplate ? <Box sx={{ flexShrink: 0 }}>{filterTemplate}</Box> : null}

            <TextField
              fullWidth
              value={searchValue}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </Box>
      )}

      <Box sx={{ position: 'relative' }}>
        <Scrollbar sx={{ minHeight: 444, overflowX: 'auto' }}>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1400 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headCells={tableHeadCell}
              rowCount={filteredData.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {filteredData
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => renderCell(row, index))}

              {isLoading ? (
                <TableSkeleton rowCount={5} cellCount={tableHeadCell.length} />
              ) : notFound ? (
                <TableNoData notFound={notFound} />
              ) : null}
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>

      <TablePaginationCustom
        page={table.page}
        count={filteredData.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
