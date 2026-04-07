import type { DataFormatedList, OrderRowItemList } from 'src/interfaces/order';

import { useBoolean } from 'minimal-shared/hooks';

// import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { STATUS_WITHOUT_GUIDES } from '../resources/constants';

interface OrderTableRowProps {
  row: DataFormatedList;
  detailsHref: string;
  selected?: boolean;
  onSelectRow?: () => void;
  userRole?: string;
}

// ----------------------------------------------------------------------

export function OrderTableRow({ row, detailsHref, selected, onSelectRow, userRole }: OrderTableRowProps) {
  const collapseRow = useBoolean();
  const displayName = row.customer?.name;
  const displayEmail = row.customer?.email;
  const displayTotal = row.prices.base_grand_total.value > 0 ? row.prices.base_grand_total.value : row.prices.subtotal_incl_tax.value + row.prices.total_shipping.value;

  const renderPrimaryRow = () => (
    <TableRow hover>

      {userRole === 'provider' && (
        <TableCell padding="checkbox" align='center'>
          {STATUS_WITHOUT_GUIDES.includes(row.status) ? '-' : (
            <Tooltip title="Imprimir guía" placement="top" arrow>
              <Checkbox
                color='success'
                checked={selected}
                onClick={onSelectRow}
                disabled={STATUS_WITHOUT_GUIDES.includes(row.status)}
                slotProps={{
                  input: {
                    id: `${row.orderNumber}-checkbox-order`,
                    'aria-label': `${row.orderNumber} checkbox-order`,
                  },
                }}
              />
            </Tooltip>
          )}
        </TableCell>
      )}

      <TableCell>
        <Link component={RouterLink} href={detailsHref} color="inherit" underline="always">
          {row.orderNumber}
        </Link>
      </TableCell>

      <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={displayName}
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.main',
              color: 'white',
              fontSize: 20,
            }}
          >
            {displayName
              .split(' ')
              .filter(Boolean)
              .map((word: string) => word[0]!.toUpperCase())
              .join('')
            }
          </Avatar>
          <ListItemText
            primary={displayName}
            secondary={displayEmail}
            slotProps={{
              primary: {
                sx: { typography: 'body2' },
              },
              secondary: {
                sx: { color: 'text.disabled' },
              },
            }}
          />
        </Box>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.createDate)}
          secondary={fTime(row.createDate)}
          slotProps={{
            primary: {
              noWrap: true,
              sx: { typography: 'body2' },
            },
            secondary: {
              sx: { mt: 0.5, typography: 'caption' },
            },
          }}
        />
      </TableCell>

      <TableCell align="left"> {row.totalQuantity} </TableCell>

      <TableCell> {fCurrency(displayTotal)} </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'Pago por confirmar' && 'warning') ||
            (row.status === 'Orden en Proceso' && 'warning') ||
            (row.status === 'Orden Confirmada' && 'success') ||
            (row.status === 'Entregado' && 'success') ||
            (row.status === 'Completo' && 'success') ||
            (row.status === 'Cancelado' && 'error') ||
            (row.status === 'Devuelto' && 'error') ||
            'default'
          }
        >
          {row.status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapseRow.value ? 'inherit' : 'default'}
          onClick={collapseRow.onToggle}
          sx={{ ...(collapseRow.value && { bgcolor: 'action.hover' }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondaryRow = () => (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapseRow.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            {row.items.map((item: OrderRowItemList) => (
              <Box
                key={item.id}
                sx={(theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  p: theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: `solid 2px ${theme.vars?.palette.background.default}`,
                  },
                })}
              >
                <Link component={RouterLink} href={paths.product.details(item.sku)} underline='none'>
                  <Avatar
                    {...(item.coverUrl ? { src: item.coverUrl } : {})}
                    variant="rounded"
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                </Link>

                <ListItemText
                  primary={
                    <Link component={RouterLink} href={paths.product.details(item.sku)} color="inherit" underline='none'>
                      {item.name}
                    </Link>
                  }
                  secondary={item.sku}
                  slotProps={{
                    primary: { sx: { typography: 'body2' } },
                    secondary: { sx: { color: 'text.disabled' } },
                  }}
                />

                <div>x{item.quantity}</div>

                <Box sx={{ width: 110, textAlign: 'right' }}>
                  {fCurrency(item.priceProvider)}
                </Box>
              </Box>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimaryRow()}
      {renderSecondaryRow()}
    </>
  );
}

