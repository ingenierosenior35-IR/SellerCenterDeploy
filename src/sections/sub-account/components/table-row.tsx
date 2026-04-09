
import type { LabelColor } from 'src/components/label';
import type { SubAccountInterface } from 'src/interfaces';

import { useBoolean, usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useDeleteSubAccount } from 'src/actions/account/use-delete-subaccount';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { PERMISSIONS, ACCOUNT_STATUS } from '../constants/status';
import { SubAccountEditDialogForm } from './subaccount-edit-dialog-form';
import { SubAccountDeleteConfirmDialog } from './subaccount-delete-confirm-dialog';

// ----------------------------------------------------------------------

type Props = {
  row: SubAccountInterface;
  selected: boolean;
  detailsHref: string;
  onSelectRow: () => void;
};

export function SubAccountTableRow({ row, selected, onSelectRow, detailsHref }: Props) {
  const menuActions = usePopover();
  const quickEditForm = useBoolean();
  const deleteDialog = useBoolean();
  const { mutateAsync, isPending: isDeleting } = useDeleteSubAccount();
  const { translate } = useTranslate();
  const router = useRouter();

  const handleDeleteSubAccount = async () => {
    const customerId = localStorage.getItem('customer_id');

    if (!customerId) {
      toast.error(translate('subAccountListView.deleteSubAccount.errorMessage'));
      return;
    }

    try {
      const response = await mutateAsync({
        customerId,
        id: row.id.toString(),
      });

      if (!response.deleteSubSellerAccount.message) {
        throw new Error('Failed to delete subaccount');
      }

      toast.success(translate('subAccountListView.deleteSubAccount.successMessage'));
      deleteDialog.onFalse();
    } catch {
      toast.error(translate('subAccountListView.deleteSubAccount.errorMessage'));
    }
  };

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            menuActions.onClose()
            router.push(paths.account.subaccount.details(row.id));
          }
          }>

          <Iconify icon="solar:eye-bold" />
          {translate('subAccountListView.actions.view')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            menuActions.onClose();
            quickEditForm.onTrue();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {translate('subAccountListView.actions.edit')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            menuActions.onClose();
            deleteDialog.onTrue();
          }}
          sx={{
            color: 'error.main'
          }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {translate('subAccountListView.actions.delete')}
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  const getStatusLabel = (status: string): string => {
    const statusKey = ACCOUNT_STATUS.find((s) => s.value === status);
    if (!statusKey) return '';
    return translate(`subAccountListView.status.${statusKey.value}`);
  };

  const renderEditForm = () => (
    <SubAccountEditDialogForm
      currentUser={{
        ...row,
        firstname: row.firstname
      }}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
    />
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
                  {row.firstname} {row.lastname}
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
          {
            row.permissions.map((p, idx) => {
              const key = Object.keys(p)[0];
              const permission = PERMISSIONS.find((status) => status.value === key);
              return (
                <Label
                  key={idx}
                  variant="soft"
                  color="info"
                  sx={{
                    marginX: '0.2em',
                    marginY: '0.1em',
                  }}
                >
                  {/* TODO: hay que definir los permisos  */}
                  {permission?.label || translate('subAccountListView.unknownPermissions')}
                </Label>
              );
            })
          }
        </TableCell>


        <TableCell>
          <Label
            variant="soft"
            color={(ACCOUNT_STATUS.find((status) => status.value === row.status)?.color ?? 'default') as LabelColor}
          >
            {getStatusLabel(row.status)}
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
          <IconButton onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {renderMenuActions()}
      {renderEditForm()}
      <SubAccountDeleteConfirmDialog
        open={deleteDialog.value}
        onClose={deleteDialog.onFalse}
        onConfirm={handleDeleteSubAccount}
        isDeleting={isDeleting}
        subAccountName={`${row.firstname} ${row.lastname}`}
      />
    </>
  );
}
