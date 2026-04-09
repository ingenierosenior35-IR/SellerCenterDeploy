import type { SubAccountInterface } from 'src/interfaces';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';
import { useUpdateSubAccount } from 'src/actions/account/use-edit-subaccount';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { PERMISSIONS, ACCOUNT_STATUS } from '../constants/status';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = z.infer<ReturnType<typeof createSubaccountSchema>>;

export const createSubaccountSchema = (translate: (key: string) => string) => {
  const { firstname, lastname, email, permissionsRequired, permissionsNonEmpty, statusRequired } = {
    firstname: translate('validation.firstnameRequired'),
    lastname: translate('validation.lastnameRequired'),
    email: {
      required: translate('validation.emailRequired'),
      invalid: translate('validation.emailInvalid'),
    },
    permissionsRequired: translate('validation.permissionsRequired'),
    permissionsNonEmpty: translate('validation.permissionsNonEmpty'),
    statusRequired: translate('validation.statusRequired'),
  };

  return z.object({
    firstname: z.string().min(1, { error: firstname }),
    lastname: z.string().min(1, { error: lastname }),
    email: schemaUtils.email({ error: email }),
    permissions: z.array(z.string().min(1, { error: permissionsRequired })).nonempty({
      message: permissionsNonEmpty,
    }),
    status: z.string().nonempty({
      message: statusRequired,
    }),
  })};

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser?: SubAccountInterface;
};

export function SubAccountEditDialogForm({ currentUser, open, onClose }: Props) {
  const { mutateAsync } = useUpdateSubAccount();
  const { translate } = useTranslate();

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
    reset,
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

      reset();
      onClose();
    } catch {
      toast.error(translate('subAccountListView.updateSubAccount.errorMessage'));
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>{translate('subAccountListView.updateSubAccount.title')}</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            {translate('subAccountListView.updateSubAccount.info')}
          </Alert>

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
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              reset();
              onClose();
            }}
          >
            {translate('subAccountListView.updateSubAccount.btnCancel')}
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {translate('subAccountListView.updateSubAccount.btnUpdate')}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
