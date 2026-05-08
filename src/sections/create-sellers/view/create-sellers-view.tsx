import { useState } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useCreateSeller } from 'src/actions/seller/use-create-seller';

import { toast } from 'src/components/snackbar';

import {
  CreateSellersStep1,
  type CreateSellersStep1Values,
} from '../components/create-sellers-step-1';
import {
  CreateSellersStep2,
  type CreateSellersStep2Values,
} from '../components/create-sellers-step-2';
import {
  CreateSellersStep3,
  STEP3_DEFAULT_FORM,
  type CreateSellersStep3Values,
} from '../components/create-sellers-step-3';

// ----------------------------------------------------------------------
// Para agregar un nuevo paso:
//  1. Crear `create-sellers-step-N.tsx` con la firma esperada.
//  2. Sumar su `Partial<...Values>` a `WizardData`
//     y su Values a la unión `AnyStepValues`.
//  3. Sumar sus DEFAULTS y un nuevo `case` en el switch.
//  4. Bump `TOTAL_STEPS`.
// ----------------------------------------------------------------------

type WizardData = Partial<CreateSellersStep1Values> &
  Partial<CreateSellersStep2Values> &
  Partial<CreateSellersStep3Values>;

type AnyStepValues =
  | CreateSellersStep1Values
  | CreateSellersStep2Values
  | CreateSellersStep3Values;

const TOTAL_STEPS = 3;

const STEP1_DEFAULTS: CreateSellersStep1Values = {
  country: '',
  personType: '',
  mainCategory: '',
};

// `documentTypeLabel` no está en este default — se inyecta en step 2 al elegir
// la opción del API. Por eso tipamos como `Omit<...>`.
const STEP2_DEFAULTS: Omit<CreateSellersStep2Values, 'documentTypeLabel'> = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  documentType: '',
  documentNumber: '',
  phone: '',
  addressShop: '',
  shopUrl: '',
};

// ----------------------------------------------------------------------

export function CreateSellersView() {
  const router = useRouter();
  const { translate } = useTranslate();
  const { mutateAsync: createSeller } = useCreateSeller();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({});

  const submitFinal = async (payload: WizardData) => {
    try {
      await createSeller({
        firstname: payload.firstName ?? '',
        lastname: payload.lastName ?? '',
        email: payload.email ?? '',
        password: payload.password ?? '',
        numeroIdentificacionUsuario: payload.documentNumber ?? '',
        tipoIdentificacionUsuario: payload.documentTypeLabel ?? '',
        tipoIdentificacionUsuarioValue: payload.documentType ?? '',
        countryCode: payload.country ?? '',
        typePerson: payload.personType ?? '',
        shopUrl: payload.shopUrl ?? '',
        nationalId: payload.documentNumber ?? '',
        documents: payload.documents ?? {},
      });

      toast.success(translate('createSellers.toasts.submitSuccess'));
      router.push(paths.auth.signIn);
    } catch (error) {
      console.error('create-sellers · mutation error', error);
      toast.error(translate('createSellers.toasts.submitError'));
      throw error;
    }
  };

  const handleNext = async (values: AnyStepValues) => {
    const next: WizardData = { ...data, ...values };
    setData(next);

    if (step >= TOTAL_STEPS) {
      await submitFinal(next);
      return;
    }

    setStep((current) => current + 1);
  };

  const handleBack = () => setStep((current) => Math.max(1, current - 1));

  switch (step) {
    case 1:
      return (
        <CreateSellersStep1
          defaultValues={{ ...STEP1_DEFAULTS, ...data }}
          step={step}
          total={TOTAL_STEPS}
          onNext={handleNext}
        />
      );
    case 2:
      return (
        <CreateSellersStep2
          defaultValues={{ ...STEP2_DEFAULTS, ...data }}
          step={step}
          total={TOTAL_STEPS}
          country={data.country ?? ''}
          onBack={handleBack}
          onNext={handleNext}
        />
      );
    case 3:
      return (
        <CreateSellersStep3
          defaultValues={STEP3_DEFAULT_FORM}
          step={step}
          total={TOTAL_STEPS}
          country={data.country ?? ''}
          personType={data.personType ?? ''}
          onBack={handleBack}
          onNext={handleNext}
        />
      );
    default:
      return null;
  }
}
