import type { ICustomer } from 'src/interfaces/customer/customer.interface';

import * as z from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useTranslate } from 'src/locales/langs/i18n';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

export type FormValues = z.infer<ReturnType<typeof UserSchema>>;

export const UserSchema = (t: (key: string) => string) =>
  z.object({
    displayName: z.string().min(1, { error: t('formErrorRequired.nameRequired') }),
    email: schemaUtils.email(),
    photoURL: schemaUtils.file({ error: t('formErrorRequired.avatarRequired') }).optional().nullable(),
    identificationType: z.string().min(1, { error: t('formErrorRequired.identificationTypeRequired') }),
    identificationNumber: z.string().min(1, { error: t('formErrorRequired.identificationNumberRequired') }),
    phoneNumber: schemaUtils.phoneNumber({ isValid: isValidPhoneNumber }),
    country: schemaUtils.nullableInput(z.string().min(1, { error: t('formErrorRequired.countryRequired') }), {
      error: t('formErrorRequired.countryRequired'),
    }),
    address: z.string().min(1, { error: t('formErrorRequired.addressRequired') }),
    state: z.string().min(1, { error: t('formErrorRequired.stateRequired') }),
    city: z.string().min(1, { error: t('formErrorRequired.cityRequired') }),
    zipCode: z.string().min(1, { error: t('formErrorRequired.zipCodeRequired') }),
    about: z.string().optional().default(''),
    isPublic: z.boolean().optional().default(false),
  });

export const updateUserSchema = UserSchema(key => key);

const defaultValues: FormValues = {
  displayName: '',
  email: '',
  photoURL: null,
  identificationType: '',
  identificationNumber: '',
  phoneNumber: '',
  country: null,
  address: '',
  state: '',
  city: '',
  zipCode: '',
  about: '',
  isPublic: false,
};

type ProfileConfigurationProps = {
  customer: ICustomer;
};

export function ProfileConfiguration({  customer }: ProfileConfigurationProps) {
  const { translate } = useTranslate();
  const { user } = useAuthContext();

  const schemaUser = useMemo(() => UserSchema(translate), [translate]);

  const currentUser: FormValues = useMemo(() => {
    const firstName = (user?.firstName ?? user?.firstname ?? '').trim();
    const lastName = (user?.lastName ?? user?.lastname ?? '').trim();

    const addr = user?.address ?? null;

    const countryCode = addr?.countryCode ?? addr?.countryId ?? null;
    const street = addr?.street || ''; // string ya normalizada en el AuthProvider
    const stateName = addr?.region?.name || addr?.region?.code || '';

    return {
      displayName: [firstName, lastName].filter(Boolean).join(' ') || user?.email || '',
      email: user?.email || '',
      photoURL: null,
      identificationType: user?.identificationType || '',
      identificationNumber: user?.identificationNumber || '',
      phoneNumber: addr?.telephone || '',
      country: countryCode,
      address: street,
      state: stateName,
      city: addr?.city || '',
      zipCode: addr?.postcode || '',
      about: '',
      isPublic: false,
    };
  }, [user]);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(schemaUser),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // TODO: Mutación para actualizar datos en backend
      await new Promise((r) => setTimeout(r, 500));
      toast.success('Update success!');
      // console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Box sx={{ mt: 3 }}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Text name="name" label={translate('formPlaceholder.name')} />
                <Field.Text name="lastName" label={translate('formPlaceholder.lastName')} />
                <Field.Text name="email" label={translate('formPlaceholder.email')} />
                <Field.Text name="identificationType" label={translate('formPlaceholder.identificationType')} />
                <Field.Text name="identificationNumber" label={translate('formPlaceholder.identificationNumber')} />
                <Field.Phone name="phoneNumber" label={translate('formPlaceholder.phoneNumber')} />
                <Field.Text name="address" label={translate('formPlaceholder.address')} />
                <Field.CountrySelect
                  name="country"
                  label={translate('formPlaceholder.country')}
                  placeholder={translate('formPlaceholder.country')}
                  displayValue="code"
                />
                <Field.Text name="state" label={translate('formPlaceholder.state')} />
                <Field.Text name="city" label={translate('formPlaceholder.city')} />
                <Field.Text name="zipCode" label={translate('formPlaceholder.zipCode')} />
              </Box>

              <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
                <Button type="submit" variant="contained" loading={isSubmitting}>
                  {translate('formPlaceholder.btnSave')}
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </Box>
  );
}
