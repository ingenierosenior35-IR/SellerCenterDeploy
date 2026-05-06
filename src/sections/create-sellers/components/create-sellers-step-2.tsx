import * as z from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';
import { EntityType } from 'src/shared/constants/graphql-entity-type';
import { useGetAttributes } from 'src/actions/attributes/use-attributes';
import { AttributeCode } from 'src/shared/constants/graphql-attribute-code';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { darkFieldSx } from './styles';
import { WizardShell } from './wizard-shell';
import { WizardFooter } from './wizard-footer';
import { StepIndicator } from './step-indicator';

// ----------------------------------------------------------------------

type TranslateFn = (key: string) => string;

// Mapa de extensión telefónica por país (E.164). Mantener sincronizado con
// `COUNTRY_OPTIONS` de step 1 cuando se sumen países.
const COUNTRY_PHONE_CODES: Record<string, string> = {
  US: '+1',
  CN: '+86',
  CO: '+57',
};

export const CreateSellersStep2Schema = (t: TranslateFn) =>
  z.object({
    firstName: z.string().min(1, { message: t('createSellers.step2.errors.firstName') }),
    lastName: z.string().min(1, { message: t('createSellers.step2.errors.lastName') }),
    email: z
      .string()
      .min(1, { message: t('createSellers.step2.errors.email') })
      .email({ message: t('createSellers.step2.errors.emailInvalid') }),
    password: z.string().min(6, { message: t('createSellers.step2.errors.password') }),
    confirmPassword: z
      .string()
      .min(6, { message: t('createSellers.step2.errors.password') }),
    documentType: z.string().min(1, { message: t('createSellers.step2.errors.documentType') }),
    documentNumber: z
      .string()
      .min(1, { message: t('createSellers.step2.errors.documentNumberRequired') })
      .regex(/^\d+$/, { message: t('createSellers.step2.errors.documentNumberDigits') }),
    phone: z
      .string()
      .min(7, { message: t('createSellers.step2.errors.phoneInvalid') })
      .regex(/^\d+$/, { message: t('createSellers.step2.errors.phoneDigits') }),
    addressShop: z.string().min(1, { message: t('createSellers.step2.errors.addressShop') }),
    shopUrl: z.string().min(1, { message: t('createSellers.step2.errors.shopUrl') }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('createSellers.step2.errors.passwordMismatch'),
    path: ['confirmPassword'],
  });

type Step2FormValues = z.infer<ReturnType<typeof CreateSellersStep2Schema>>;

/**
 * El wizard recibe los valores del form + el label del documentType resuelto
 * desde las options del API (para enviar `selected_options[0].value` con el
 * texto humano y `value` con el código).
 */
export type CreateSellersStep2Values = Step2FormValues & {
  documentTypeLabel: string;
};

// ----------------------------------------------------------------------

type Props = {
  defaultValues: Step2FormValues;
  step: number;
  total: number;
  /** Código de país elegido en step 1 — define la extensión del teléfono. */
  country: string;
  onBack: () => void;
  onNext: (values: CreateSellersStep2Values) => void | Promise<void>;
};

export function CreateSellersStep2({
  defaultValues,
  step,
  total,
  country,
  onBack,
  onNext,
}: Props) {
  const { translate } = useTranslate();

  const showPassword = useBoolean();
  const showConfirmPassword = useBoolean();

  const phoneCode = COUNTRY_PHONE_CODES[country] ?? '';

  const { attributes, isLoading: isLoadingDocumentTypes } = useGetAttributes({
    attributeCode: AttributeCode.TipoIdentificacionUsuario,
    entityType: EntityType.Customer,
  });

  const documentTypeOptions = useMemo(
    () =>
      Array.isArray(attributes?.items?.options)
        ? attributes.items.options.map((opt) => ({ value: opt.value, label: opt.label }))
        : [],
    [attributes]
  );

  const schema = useMemo(() => CreateSellersStep2Schema(translate), [translate]);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const opt = documentTypeOptions.find((o) => o.value === data.documentType);
    await onNext({ ...data, documentTypeLabel: opt?.label ?? '' });
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <WizardShell>
        <StepIndicator current={step} total={total} onBack={onBack} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Field.Text
            name="firstName"
            label={translate('createSellers.step2.firstName')}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={darkFieldSx}
          />
          <Field.Text
            name="lastName"
            label={translate('createSellers.step2.lastName')}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={darkFieldSx}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '120px 1fr' }, gap: 2 }}>
          <Field.Select
            name="documentType"
            label={translate('createSellers.step2.documentType')}
            disabled={isLoadingDocumentTypes}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={darkFieldSx}
          >
            {documentTypeOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Text
            name="documentNumber"
            label={translate('createSellers.step2.documentNumber')}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={darkFieldSx}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          <Field.Text
            name="phone"
            label={translate('createSellers.step2.phone')}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: phoneCode ? (
                  <InputAdornment position="start">
                    <Typography variant="body2" sx={{ color: 'common.white' }}>
                      {phoneCode} |
                    </Typography>
                  </InputAdornment>
                ) : undefined,
              },
            }}
            sx={darkFieldSx}
          />
        </Box>

        <Field.Text
          name="addressShop"
          label={translate('createSellers.step2.addressShop')}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={darkFieldSx}
        />

        <Field.Text
          name="shopUrl"
          label={translate('createSellers.step2.shopUrl')}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={darkFieldSx}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          <Field.Text
            name="email"
            label={translate('createSellers.step2.email')}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={darkFieldSx}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          <Field.Text
            name="password"
            label={translate('createSellers.step2.password')}
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={showPassword.onToggle}
                      edge="end"
                      sx={{ color: 'common.white' }}
                    >
                      <Iconify
                        icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={darkFieldSx}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          <Field.Text
            name="confirmPassword"
            label={translate('createSellers.step2.confirmPassword')}
            type={showConfirmPassword.value ? 'text' : 'password'}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={showConfirmPassword.onToggle}
                      edge="end"
                      sx={{ color: 'common.white' }}
                    >
                      <Iconify
                        icon={
                          showConfirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={darkFieldSx}
          />
        </Box>

        <WizardFooter loading={isSubmitting} />
      </WizardShell>
    </Form>
  );
}
