'use client';

import type { ICustomer } from 'src/interfaces/customer/customer.interface';

import * as z from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales/langs/i18n';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

export type FormPassValue = z.infer<ReturnType<typeof UserPasswordSchema>>;

export const UserPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      oldPassword: z
        .string()
        .min(1, { error: t('formErrorRequired.oldPasswordRequired') })
        .min(6, { error: t('formErrorRequired.oldPasswordMin') }),
      newPassword: z.string().min(1, { error: t('formErrorRequired.newPasswordRequired') }),
      confirmNewPassword: z
        .string()
        .min(1, { error: t('formErrorRequired.confirmNewPasswordRequired') }),
    })
    .refine((val) => val.oldPassword !== val.newPassword, {
      error: t('formErrorRequired.newPasswordDifferent'),
      path: ['newPassword'],
    })
    .refine((val) => val.newPassword === val.confirmNewPassword, {
      error: t('formErrorRequired.passwordsDoNotMatch'),
      path: ['confirmNewPassword'],
    });

export const updateUserPasswordSchema = UserPasswordSchema(key => key);

const defaultValues: FormPassValue = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

type ProfileChangePasswordProps = {
  customer: ICustomer;
};

export function ProfileChangePassword({ customer }: ProfileChangePasswordProps) {
  const { translate } = useTranslate();

  const schemaPassUser = useMemo(() => UserPasswordSchema(translate), [translate]);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(schemaPassUser),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const togglePassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Form methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            p: 3,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Field.Text
            name="oldPassword"
            type={showPassword.oldPassword ? 'text' : 'password'}
            label={translate('formPlaceholder.oldPassword')}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePassword('oldPassword')} edge="end">
                      <Iconify
                        icon={showPassword.oldPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Field.Text
            name="newPassword"
            label={translate('formPlaceholder.newPassword')}
            type={showPassword.newPassword ? 'text' : 'password'}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePassword('newPassword')} edge="end">
                      <Iconify
                        icon={showPassword.newPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            helperText={
              <Box component="span" sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <Iconify icon="solar:info-circle-bold" width={16} /> {translate('formErrorRequired.oldPasswordMin')} 6+
              </Box>
            }
          />

          <Field.Text
            name="confirmNewPassword"
            type={showPassword.confirmNewPassword ? 'text' : 'password'}
            label={translate('formPlaceholder.confirmNewPassword')}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => togglePassword('confirmNewPassword')} edge="end">
                      <Iconify
                        icon={
                          showPassword.confirmNewPassword
                            ? 'solar:eye-bold'
                            : 'solar:eye-closed-bold'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
            {translate('formPlaceholder.btnSave')}
          </Button>
        </Card>
      </Form>
    </Box>
  );
}
