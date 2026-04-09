import type { SubAccountInterface } from 'src/interfaces';

import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Grid from '@mui/system/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useUpdateSubAccount } from 'src/actions/account/use-edit-subaccount';
import { useDeleteSubAccount } from 'src/actions/account/use-delete-subaccount';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { Label, type LabelColor } from 'src/components/label';

import { PERMISSIONS, ACCOUNT_STATUS } from '../constants/status';
import { SubAccountDeleteConfirmDialog } from './subaccount-delete-confirm-dialog';
import { createSubaccountSchema, type UserQuickEditSchemaType } from './subaccount-edit-dialog-form';

// ----------------------------------------------------------------------

type Props = {
  currentUser: SubAccountInterface;
};

export function SubAccountEditForm({ currentUser }: Props) {
  const { mutateAsync } = useUpdateSubAccount();
  const { mutateAsync: deleteSubAccount, isPending: isDeleting } = useDeleteSubAccount();
  const { translate } = useTranslate();
  const deleteDialog = useBoolean();
  const router = useRouter();

  const defaultValues: UserQuickEditSchemaType = {
    firstname: "",
    lastname: "",
    email: "",
    status: "",
    permissions: [],
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(createSubaccountSchema(translate)),
    defaultValues,
    values: currentUser
      ? {
          ...currentUser,
          permissions: currentUser.permissions.map((perm) => Object.keys(perm)[0]),
        }
      : defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await mutateAsync({
        id: currentUser!.id.toString(),
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        status: data.status == 'ACTIVE' ? '1' : '0',
        permissionType: data.permissions.join(','),
        customerId: localStorage.getItem('customer_id')!,
      });

      if (res.updateSellerSubAccount.message !== 'SubAccount updated successfully') {
        throw new Error('Failed to update subaccount');
      }

      toast.success(translate('subAccountListView.updateSubAccount.successMessage'));

    } catch {
      toast.error(translate('subAccountListView.updateSubAccount.errorMessage'));
    }
  });

  const getStatusLabel = (status: string): string => {
    const found = ACCOUNT_STATUS.find((s) => s.value === status);
    if (!found) return status;
    return translate(`subAccountListView.status.${found.value}`);
  };

  const getStatusColor = (status: string): LabelColor =>
    (ACCOUNT_STATUS.find((s) => s.value === status)?.color ?? 'default') as LabelColor;

  const handleDeleteSubAccount = async () => {
    const customerId = localStorage.getItem('customer_id');

    if (!customerId) {
      toast.error(translate('subAccountListView.deleteSubAccount.errorMessage'));
      return;
    }

    try {
      const response = await deleteSubAccount({
        customerId,
        id: currentUser.id.toString(),
      });

      if (!response.deleteSubSellerAccount.message) {
        throw new Error('Failed to delete subaccount');
      }

      toast.success(translate('subAccountListView.deleteSubAccount.successMessage'));
      deleteDialog.onFalse();
      router.push(paths.account.subaccount.root);
    } catch {
      toast.error(translate('subAccountListView.deleteSubAccount.errorMessage'));
    }
  };


  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  mx: 'auto',
                  mb: 2,
                  fontSize: 36,
                  bgcolor: 'primary.white',
                }}
              >
                {currentUser
                  ? currentUser.firstname.charAt(0).toUpperCase() + currentUser.lastname.charAt(0).toUpperCase()
                  : '?'}
              </Avatar>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {currentUser?.email ?? '—'}
            </Typography>

            {currentUser && (
              <Label variant="soft" color={getStatusColor(currentUser.status)}>
                {getStatusLabel(currentUser.status)}
              </Label>
            )}

            <Divider sx={{ py: 2}}/>

            <Button type="button" variant="soft" color="error" sx={{ mt: 3 }} onClick={deleteDialog.onTrue}>
              {translate('subAccountDetailsView.actions.deleteAccount')}
            </Button>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Select name="status" label={translate('subAccountListView.updateSubAccount.status')}>
                {ACCOUNT_STATUS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

              <Field.Text name="firstname" label={translate('subAccountListView.updateSubAccount.firstname')} />
              <Field.Text name="lastname" label={translate('subAccountListView.updateSubAccount.lastname')} />
              <Field.Text name="email" label={translate('subAccountListView.updateSubAccount.email')} />

              <Field.MultiSelect
                chip
                name="permissions"
                label={translate('subAccountListView.updateSubAccount.permissions')}
                options={PERMISSIONS}
              />

            </Box>

            <Button
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ mt: 3 }}
            >
              {translate('subAccountDetailsView.actions.update')}
            </Button>
          </Card>
        </Grid>
      </Grid>
      <SubAccountDeleteConfirmDialog
        open={deleteDialog.value}
        onClose={deleteDialog.onFalse}
        onConfirm={handleDeleteSubAccount}
        isDeleting={isDeleting}
        subAccountName={`${currentUser.firstname} ${currentUser.lastname}`}
      />
    </Form>
  );
}
