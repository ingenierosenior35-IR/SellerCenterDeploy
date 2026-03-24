
import type { LabelColor } from 'src/components/label';
import type { ItemsReturnListInterface } from 'src/interfaces';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { useReturnStatus } from './constants/return/status';


// ----------------------------------------------------------------------

type Props = {
  row: ItemsReturnListInterface;
  selected: boolean;
  detailsHref: string;
  onSelectRow: () => void;
};

export function OrderTableRow({ row, selected, onSelectRow, detailsHref }: Props) {
  const collapseRow = useBoolean();
  const returnStatus = useReturnStatus();

  const renderPrimaryRow = () => (
    <TableRow hover selected={selected}>
      <TableCell>
          {row.number}
      </TableCell>

      <TableCell>
        <Link component={RouterLink} href={detailsHref} color="inherit" underline="always">
          {row.order.orderNumber}
        </Link>
      </TableCell>

      <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={row.customer.name}
            secondary={row.customer.email}
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
        <Label
          variant="soft"
          color={
            (returnStatus.find((status) => status.value === row.status)?.color) as LabelColor ||
            'default'
          }
        >
          {returnStatus.find((status) => status.value === row.status)?.label}
        </Label>
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(row.createdAt)}
          secondary={fTime(row.createdAt)}
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
            {row.items.map((item) => (
              <Box
                key={item.uid}
                sx={(theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  p: theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: `solid 2px ${theme.vars.palette.background.neutral}`,
                  },
                })}
              >
                <Avatar
                  src={item.orderItem.productImage}
                  variant="rounded"
                  sx={{ width: 48, height: 48, mr: 2 }}
                />

                <ListItemText
                  primary={item.orderItem.productName}
                  slotProps={{
                    primary: { sx: { typography: 'body2' } },
                    secondary: { sx: { color: 'text.disabled' } },
                  }}
                />

                <div>x{item.quantity} </div>

                {/* <Box sx={{ width: 110, textAlign: 'right' }}>{fCurrency(item.orderItem.price)}</Box> */}
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
