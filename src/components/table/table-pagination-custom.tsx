'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { TablePaginationProps } from '@mui/material/TablePagination';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useTranslate } from 'src/locales/langs/i18n';

// ----------------------------------------------------------------------

export type TablePaginationCustomProps = TablePaginationProps & {
  dense?: boolean;
  sx?: SxProps<Theme>;
  onChangeDense?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TablePaginationCustom({
  sx,
  dense,
  onChangeDense,
  rowsPerPageOptions = [5, 10, 25],
  labelRowsPerPage,
  labelDisplayedRows,
  ...other
}: TablePaginationCustomProps) {
  const { translate } = useTranslate();

  return (
    <Box sx={[{ position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        labelRowsPerPage={labelRowsPerPage ?? translate('mui.tablePagination.rowsPerPage')}
        labelDisplayedRows={
          labelDisplayedRows ??
          (({ from, to, count }) =>
            `${from}-${to} ${translate('mui.tablePagination.of')} ${count !== -1 ? count : `${to}+`}`)
        }
        {...other}
        sx={{ borderTopColor: 'transparent' }}
      />

      {onChangeDense && (
        <FormControlLabel
          label={translate('mui.tablePagination.dense')}
          control={
            <Switch
              checked={dense}
              onChange={onChangeDense}
              slotProps={{ input: { id: 'dense-switch' } }}
            />
          }
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: { sm: 'absolute' },
          }}
        />
      )}
    </Box>
  );
}
