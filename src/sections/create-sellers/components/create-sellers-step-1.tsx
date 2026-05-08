import * as z from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

import { useTranslate } from 'src/locales';
import { useCategories } from 'src/actions/category/use-categories';

import { FlagIcon } from 'src/components/flag-icon';
import { Form, Field } from 'src/components/hook-form';

import { darkFieldSx } from './styles';
import { WizardShell } from './wizard-shell';
import { WizardFooter } from './wizard-footer';
import { StepIndicator } from './step-indicator';

// ----------------------------------------------------------------------

type TranslateFn = (key: string) => string;

export const CreateSellersStep1Schema = (t: TranslateFn) =>
  z.object({
    country: z.string().min(1, { message: t('createSellers.step1.errors.country') }),
    personType: z.string().min(1, { message: t('createSellers.step1.errors.personType') }),
    mainCategory: z.string().min(1, { message: t('createSellers.step1.errors.mainCategory') }),
  });

export type CreateSellersStep1Values = z.infer<ReturnType<typeof CreateSellersStep1Schema>>;

const COUNTRY_OPTIONS = [
  { value: 'US', flag: 'us' },
  { value: 'CN', flag: 'cn' },
];

const PERSON_TYPE_OPTIONS = [{ value: 'natural_person' }, { value: 'legal_person' }];

// ----------------------------------------------------------------------

type Props = {
  defaultValues: CreateSellersStep1Values;
  step: number;
  total: number;
  onNext: (values: CreateSellersStep1Values) => void | Promise<void>;
};

export function CreateSellersStep1({ defaultValues, step, total, onNext }: Props) {
  const { translate } = useTranslate();

  const { categoryTree, categoriesLoading } = useCategories();

  const mainCategoryOptions = useMemo(
    () => categoryTree.map((cat) => ({ value: String(cat.id), label: cat.name })),
    [categoryTree]
  );

  const schema = useMemo(() => CreateSellersStep1Schema(translate), [translate]);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit((data) => onNext(data));

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <WizardShell>
        <StepIndicator current={step} total={total} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          <Field.Select
            name="country"
            label={translate('createSellers.step1.country')}
            slotProps={{
              inputLabel: { shrink: true },
              select: {
                renderValue: (selected) => {
                  const opt = COUNTRY_OPTIONS.find((o) => o.value === selected);
                  if (!opt) return null;
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FlagIcon code={opt.flag} />
                      {translate(`createSellers.step1.countries.${opt.value}`)}
                    </Box>
                  );
                },
              },
            }}
            sx={darkFieldSx}
          >
            {COUNTRY_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlagIcon code={opt.flag} />
                  {translate(`createSellers.step1.countries.${opt.value}`)}
                </Box>
              </MenuItem>
            ))}
          </Field.Select>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          <Field.Select
            name="personType"
            label={translate('createSellers.step1.personType')}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={darkFieldSx}
          >
            {PERSON_TYPE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {translate(`createSellers.step1.personTypes.${opt.value}`)}
              </MenuItem>
            ))}
          </Field.Select>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          <Field.Select
            name="mainCategory"
            label={translate('createSellers.step1.mainCategory')}
            disabled={categoriesLoading}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={darkFieldSx}
          >
            {mainCategoryOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Field.Select>
        </Box>

        <WizardFooter loading={isSubmitting} />
      </WizardShell>
    </Form>
  );
}
