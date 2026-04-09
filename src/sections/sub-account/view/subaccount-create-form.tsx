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
import { useCreateSubAccount } from 'src/actions/account/use-create-subaccount';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { PERMISSIONS, ACCOUNT_STATUS } from '../constants/status';

export const SubAccountSchema = (translate: (key: string) => string) => {
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

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SubAccountCreateForm({ open, onClose }: Omit<Props, 'currentUser'>) {
  const { translate } = useTranslate();

  const schema = SubAccountSchema(translate);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      status: 'ACTIVE',
      permissions: []
    },
  });

  const { mutateAsync } = useCreateSubAccount();

  const { reset, handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await mutateAsync({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        status: data.status == 'ACTIVE' ? '1' : '0',
        permissionType: data.permissions.join(','),
        customerId: localStorage.getItem('customer_id')!,
      });

      if (res.createSellerSubAccount.successMessage != 'Sub Account was saved successfully') {
        throw new Error('Failed to create subaccount');
      }

      toast.success(translate('subAccountListView.createSubAccount.successMessage'));

      reset();
      onClose();
    } catch {
      toast.error(translate('subAccountListView.createSubAccount.errorMessage'));
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <DialogTitle>{translate('subAccountListView.createSubAccount.title')}</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            {translate('subAccountListView.createSubAccount.info')}
          </Alert>

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Select name="status" label={translate('subAccountListView.createSubAccount.status')}>
              {ACCOUNT_STATUS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Field.Text name="firstname" label={translate('subAccountListView.createSubAccount.firstname')} />
            <Field.Text name="lastname" label={translate('subAccountListView.createSubAccount.lastname')} />
            <Field.Text name="email" label={translate('subAccountListView.createSubAccount.email')} />

            <Field.MultiSelect
                chip
                name="permissions"
                label={translate('subAccountListView.createSubAccount.permissions')}
                options={PERMISSIONS}
            />

          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              reset()
              onClose()
            }}
          >
            {translate('subAccountListView.createSubAccount.btnCancel')}
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {translate('subAccountListView.createSubAccount.btnCreate')}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
