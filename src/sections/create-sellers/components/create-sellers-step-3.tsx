import type { Resolver } from 'react-hook-form';

import * as z from 'zod';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fileToBase64 } from 'src/utils/codificateFile';

import { useTranslate } from 'src/locales';

import { Form } from 'src/components/hook-form';

import { WizardShell } from './wizard-shell';
import { WizardFooter } from './wizard-footer';
import { StepIndicator } from './step-indicator';
import { FileUploadField } from './file-upload-field';
import {
  ACCEPTED_MIME,
  ALL_DOC_CODES,
  MAX_FILE_SIZE,
  getDocRequirements,
} from './document-rules';

// ----------------------------------------------------------------------
// Forma interna del form: cada doc es File | null.
// Forma de salida (lo que recibe el wizard): { documents: { [code]: { file_name, file_content } } }.
// El backend espera `file_content` en base64 (sin el prefijo data:URI).
// ----------------------------------------------------------------------

type FileValue = File | null;
type Step3FormValues = Record<string, FileValue>;

export type CreateSellersStep3Values = {
  documents: Record<string, { file_name: string; file_content: string }>;
};

// ----------------------------------------------------------------------

type TranslateFn = (key: string) => string;

function buildFileSchema(t: TranslateFn) {
  return z
    .instanceof(File, { message: t('createSellers.step3.errors.fileRequired') })
    .refine((f) => f.size <= MAX_FILE_SIZE, {
      message: t('createSellers.step3.errors.fileSize'),
    })
    .refine((f) => f.type === ACCEPTED_MIME, {
      message: t('createSellers.step3.errors.filePdf'),
    });
}

function buildSchema(country: string, personType: string, t: TranslateFn) {
  const reqs = getDocRequirements(country, personType);
  if (!reqs) return z.object({});

  const fileSchema = buildFileSchema(t);

  const shape: Record<string, z.ZodType> = {};
  for (const code of reqs.required) {
    shape[code] = fileSchema;
  }
  for (const alts of reqs.oneOf) {
    for (const code of alts) {
      shape[code] = fileSchema.nullable().optional();
    }
  }

  const base = z.object(shape);
  if (reqs.oneOf.length === 0) return base;

  return base.superRefine((data, ctx) => {
    for (const alts of reqs.oneOf) {
      const found = alts.some((code) => data[code] instanceof File);
      if (!found) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('createSellers.step3.errors.oneOfRequired'),
          path: [alts[0]],
        });
      }
    }
  });
}

export const STEP3_DEFAULT_FORM: Step3FormValues = Object.fromEntries(
  ALL_DOC_CODES.map((code) => [code, null])
);

// ----------------------------------------------------------------------

type Props = {
  defaultValues: Step3FormValues;
  step: number;
  total: number;
  country: string;
  personType: string;
  onBack: () => void;
  onNext: (values: CreateSellersStep3Values) => void | Promise<void>;
};

export function CreateSellersStep3({
  defaultValues,
  step,
  total,
  country,
  personType,
  onBack,
  onNext,
}: Props) {
  const { translate } = useTranslate();

  const reqs = useMemo(() => getDocRequirements(country, personType), [country, personType]);
  const schema = useMemo(
    () => buildSchema(country, personType, translate),
    [country, personType, translate]
  );

  const methods = useForm<Step3FormValues>({
    // El cast es necesario porque cuando reqs es null el schema es z.object({}),
    // que infiere a Record<string, never> y rompe la asignación con Step3FormValues.
    resolver: zodResolver(schema) as unknown as Resolver<Step3FormValues>,
    defaultValues,
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const documents: CreateSellersStep3Values['documents'] = {};
    for (const [code, value] of Object.entries(data)) {
      if (value instanceof File) {
        documents[code] = {
          file_name: value.name,
          file_content: await fileToBase64(value),
        };
      }
    }
    await onNext({ documents });
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <WizardShell>
        <StepIndicator current={step} total={total} onBack={onBack} />

        {!reqs ? (
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', py: 4 }}
          >
            {translate('createSellers.step3.unsupportedCombo')}
          </Typography>
        ) : (
          <>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {translate('createSellers.step3.intro')}
            </Typography>

            {reqs.required.map((code) => (
              <Controller
                key={code}
                control={control}
                name={code}
                render={({ field, fieldState: { error } }) => (
                  <FileUploadField
                    label={translate(`createSellers.step3.docLabels.${code}`)}
                    file={(field.value as FileValue) ?? null}
                    onChange={field.onChange}
                    error={error?.message}
                  />
                )}
              />
            ))}

            {reqs.oneOf.map((alts, idx) => (
              <Box
                key={`one-of-${idx}`}
                sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}
              >
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {translate('createSellers.step3.atLeastOne')}
                </Typography>
                {alts.map((code) => (
                  <Controller
                    key={code}
                    control={control}
                    name={code}
                    render={({ field, fieldState: { error } }) => (
                      <FileUploadField
                        label={translate(`createSellers.step3.docLabels.${code}`)}
                        file={(field.value as FileValue) ?? null}
                        onChange={field.onChange}
                        error={error?.message}
                      />
                    )}
                  />
                ))}
              </Box>
            ))}
          </>
        )}

        <WizardFooter
          loading={isSubmitting}
          disabled={!reqs}
          submitLabelKey="createSellers.common.register"
        />
      </WizardShell>
    </Form>
  );
}
