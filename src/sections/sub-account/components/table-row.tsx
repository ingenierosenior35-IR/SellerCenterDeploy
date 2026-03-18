
import type { LabelColor } from 'src/components/label';
import type { SubAccountInterface } from 'src/interfaces';

import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { PERMISSIONS, ACCOUNT_STATUS } from '../constants/status';

// ----------------------------------------------------------------------

type Props = {
  row: SubAccountInterface;
  selected: boolean;
  detailsHref: string;
  onSelectRow: () => void;
};

export function SubAccountTableRow({ row, selected, onSelectRow, detailsHref }: Props) {
  const menuActions = usePopover();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => menuActions.onClose()}
          sx={{
            color: 'error.main'
          }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar
              // src={}
            />

            <ListItemText
              primary={
                <Link component={RouterLink} href={detailsHref} color="inherit" underline="always">
                  {row.name}
                </Link>
              }
              secondary={row.email}
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

        <TableCell align="left">
          { /* TODO: CONFIGURAR bien estos estados */}
          {
            row.permissions
              .map((p, idx) => (
                <Label
                  key={idx}
                  variant="soft"
                  color="default"
                  sx={{
                    marginX: '0.2em',
                    marginY: '0.1em',
                  }}
                >
                  {PERMISSIONS.find((status) => status.value === p)?.label || ''}
                </Label>
              ))
          }
        </TableCell>


        <TableCell>
          { /* TODO: CONFIGURAR bien estos estados */}
          <Label
            variant="soft"
            color={(ACCOUNT_STATUS.find((status) => status.value === row.status)?.color ?? 'default') as LabelColor}
          >
            {ACCOUNT_STATUS.find((status) => status.value === row.status)?.label || ''}
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

        <TableCell>
          <IconButton onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {renderMenuActions()}
    </>
  );
}
