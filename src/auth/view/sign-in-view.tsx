'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ClientError } from 'graphql-request';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { ErrorCode, ERROR_MESSAGES } from 'src/lib';
import { useLogin } from 'src/actions/auth/useLogin';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useAuthContext } from '../hooks';
import { getErrorMessage } from '../utils';
import { FormHead } from '../components/form-head';
import { useTranslate } from 'src/locales/langs/i18n';

// ----------------------------------------------------------------------

export type SignInSchemaType = z.infer<typeof SignInSchema>;

export const SignInSchema = z.object({
  email: schemaUtils.email(),
  password: z
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function SignInView() {

  const { translate } = useTranslate();

  const router = useRouter();

  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync } = useLogin();


  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync({ email: data.email, password: data.password });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      let msgErr: string = ErrorCode.UNEXPECTED_ERROR;

      if (error instanceof ClientError) {
        const message =
          error.response.errors?.[0]?.message ||
          ERROR_MESSAGES[ErrorCode.UNEXPECTED_ERROR];

        msgErr = message;
      }

      if (error instanceof Error) {
        if (error.message === 'No se recibió un token de acceso en la respuesta.') {
          msgErr = ErrorCode.UNEXPECTED_ERROR;
        }
      }

      const feedbackMessage = getErrorMessage(msgErr);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text name="email" label={translate("loginPage.emailForm")} slotProps={{ inputLabel: { shrink: true } }} />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        <Field.Text
          name="password"
          label={translate("loginPage.passwordForm")}
          placeholder={translate("loginPage.passwordPh")}
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {errorMessage}
        </Alert>
      )}

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={translate("loginPage.signIn")}
      >
        {translate("loginPage.signIn")}
      </Button>

      <Link
        component={RouterLink}
        href="#"
        variant="body2"
        color="inherit"
        sx={{ alignSelf: 'flex-start' }}
      >
        {translate("loginPage.forgotPassword")}
      </Link>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <FormControlLabel control={<Checkbox defaultChecked />} label={translate("loginPage.keepMe")} />
      </Box>

      <Box>
        <Divider><Typography variant="caption" sx={{ color: 'text.secondary' }}>o</Typography></Divider>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {translate("loginPage.noAccount")}
          <Link
            component={RouterLink}
            // href={paths.auth.jwt.signUp}
            href=""
            variant="subtitle2"
          >
            {translate("loginPage.getStarted")}
          </Link>
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <FormHead
        title={translate("loginPage.title")}
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}
