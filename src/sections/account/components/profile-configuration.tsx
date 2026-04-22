import type { Customer } from 'src/interfaces/customer/customer.interface';

import * as z from 'zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { FieldsetLegend } from 'src/components';
import { useTranslate } from 'src/locales/langs/i18n';
import { useGetCities } from 'src/actions/cities/use-cities';
import { useGetRegions } from 'src/actions/regions/use-regions';
import { EntityType } from 'src/shared/constants/graphql-entity-type';
import { useGetCountries } from 'src/actions/countries/use-countries';
import { useGetAttributes } from 'src/actions/attributes/use-attributes';
import { AttributeCode } from 'src/shared/constants/graphql-attribute-code';

import { toast } from 'src/components/snackbar';
import { ErrorContent } from 'src/components/error-content';
import { Form, Field, schemaUtils } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen/loading-screen';

//---- Define the validation schema for user personal data using Zod
export type FormPersonalDataValues = z.infer<ReturnType<typeof UserPersonalDataSchema>>;

export const UserPersonalDataSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(1, { error: t('formErrorRequired.firstNameRequired') }),
    lastName: z.string().min(1, { error: t('formErrorRequired.lastNameRequired') }),
    email: schemaUtils.email(),
    identificationType: z.object({
      label: z.string().min(1, { error: t('formErrorRequired.identificationTypeRequired') }),
      value: z.string().min(1, { error: t('formErrorRequired.identificationTypeRequired') }),
    }),
    identificationNumber: z
      .string()
      .min(1, { error: t('formErrorRequired.identificationNumberRequired') }),
  });

export const updatePersonalDataSchema = UserPersonalDataSchema((key) => key);

const defaultPersonalDataValues: FormPersonalDataValues = {
  firstName: '',
  lastName: '',
  email: '',
  identificationType: {
    label: '',
    value: '',
  },
  identificationNumber: '',
};
//---- Define the validation schema for user personal data using Zod

//---- Define the validation schema for user address data using Zod
export type FormAddressDataValues = z.infer<ReturnType<typeof UserAddressDataSchema>>;

export const UserAddressDataSchema = (t: (key: string) => string) =>
  z.object({
    phoneNumber: z.string().min(10, { error: t('formErrorRequired.phoneNumberRequired') }),
    country: z.object({
      label: z.string().min(1, { error: t('formErrorRequired.countryRequired') }),
      value: z.string().min(1, { error: t('formErrorRequired.countryRequired') }),
    }),
    address: z.string().min(1, { error: t('formErrorRequired.addressRequired') }),
    state: z.object({
      label: z.string().min(1, { error: t('formErrorRequired.stateRequired') }),
      value: z.string().min(1, { error: t('formErrorRequired.stateRequired') }),
    }),
    city: z.object({
      label: z.string().min(1, { error: t('formErrorRequired.cityRequired') }),
      value: z.string().min(1, { error: t('formErrorRequired.cityRequired') }),
    }),
    zipCode: z.string().min(1, { error: t('formErrorRequired.zipCodeRequired') }),
  });

export const updateUserAddressSchema = UserAddressDataSchema((key) => key);

const defaultAddresslDataValues: FormAddressDataValues = {
  phoneNumber: '',
  country: {
    label: '',
    value: '',
  },
  address: '',
  state: {
    label: '',
    value: '',
  },
  city: {
    label: '',
    value: '',
  },
  zipCode: '',
};
//---- Define the validation schema for user address data using Zod

type ProfileConfigurationProps = {
  customer: Customer;
};

export function ProfileConfiguration({ customer }: ProfileConfigurationProps) {
  //---- Load necessary data for the profile configuration form
  const { translate } = useTranslate();

  const {
    attributes,
    isLoading: isLoadingAttributes,
    isError: isErrorAttributes,
  } = useGetAttributes({
    attributeCode: AttributeCode.TipoIdentificacionUsuario,
    entityType: EntityType.Customer,
  });

  const { countries, isLoading: isLoadingCountries, isError: isErrorCountries } = useGetCountries();
  const {
    regions,
    isLoading: isLoadingRegions,
  } = useGetRegions(customer.addresss?.country_code || undefined);

  const [regionId, setRegionId] = useState<number>(
    customer.addresss?.region?.region_id ? Number(customer.addresss.region.region_id) : 0
  );

  const { cities, isLoading: isLoadingCities } = useGetCities(regionId);

  const handleChangeState = (event: React.SyntheticEvent<Element, Event>, value: any) => {
    if (value == null) {
      setRegionId(0);
      // methodAddressData.setValue('state', { label: '', value: '' });
      // methodAddressData.setValue('city', { label: '', value: '' });
    } else {
      setRegionId(Number(value.value));
    }
  };
  //---- Load necessary data for the profile configuration form

  //---- Validation schema for user personal data and methods for handling the personal data form
  const schemaUserPersonalData = useMemo(() => UserPersonalDataSchema(translate), [translate]);
  const currentUserPersonalData: FormPersonalDataValues = useMemo(() => {
    const option = attributes?.items?.options.find(
      (attr) => attr.value === customer?.identificationType?.value
    );
    return {
      firstName: (customer?.firstname || '').trim(),
      lastName: (customer?.lastname || '').trim(),
      email: customer?.email || '',
      identificationType: option || { label: '', value: '' },
      identificationNumber: customer?.identificationNumber?.value || '',
    };
  }, [customer, attributes]);

  const methodPersonalData = useForm({
    mode: 'all',
    resolver: zodResolver(schemaUserPersonalData),
    defaultValues: defaultPersonalDataValues,
    values: currentUserPersonalData,
  });

  const {
    handleSubmit: handleSubmitPersonalData,
    formState: { isSubmitting: isSubmittingPersonalData },
  } = methodPersonalData;

  const onSubmitPersonalData = handleSubmitPersonalData(async (data) => {
    try {
      // TODO: Mutación para actualizar datos en backend
      await new Promise((r) => setTimeout(r, 500));
      toast.success('Update success!');
      // console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });
  //---- Validation schema for user personal data and methods for handling the personal data form

  //---- Validation schema for user address data and methods for handling the personal data form
  const schemaUserAddressData = useMemo(() => UserAddressDataSchema(translate), [translate]);
  const currentUserAddressData: FormAddressDataValues = useMemo(() => {
    const address = customer?.addresss || null;
    //country
    const countryObj = countries?.find((c) => c.id === address?.country_code);
    const country = countryObj
      ? { label: countryObj.full_name_locale, value: countryObj.id }
      : { label: '', value: '' };
    //country
    //region
    const regionObj = regions?.find((r) => r.id === address?.region?.region_id);
    const state = regionObj
      ? { label: regionObj.name, value: String(regionObj.id) }
      : { label: '', value: '' };
    //region
    //city
    const cityObj = cities?.find((c) => c.name === address?.city);
    const city = cityObj
      ? { label: cityObj.name, value: String(cityObj.id) }
      : { label: '', value: '' };
    //city
    return {
      phoneNumber: address?.telephone || '',
      country,
      address: address?.street?.join(' ') || '',
      state,
      city,
      zipCode: address?.postcode || '',
    };
  }, [customer, countries, regions, cities]);

  const methodAddressData = useForm({
    mode: 'all',
    resolver: zodResolver(schemaUserAddressData),
    defaultValues: defaultAddresslDataValues,
    values: currentUserAddressData,
  });

  const {
    handleSubmit: handleSubmitAddressData,
    formState: { isSubmitting: isSubmittingAddressData },
  } = methodAddressData;

  const onSubmitAddressData = handleSubmitAddressData(async (data) => {
    try {
      // TODO: Mutación para actualizar datos en backend
      await new Promise((r) => setTimeout(r, 500));
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });
  //---- Validation schema for user personal data and methods for handling the personal data form

  // const selectedState = useWatch({
  //   control: methodAddressData.control,
  //   name: 'state',
  // });

  if (isLoadingAttributes || isLoadingCountries) {
    return <LoadingScreen />;
  }

  if (isErrorAttributes || isErrorCountries) {
    return (
      <ErrorContent title={translate('noResultsFound')} description={translate('noDataFound')} />
    );
  }

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Form methods={methodPersonalData} onSubmit={onSubmitPersonalData}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 3, border: '1px solid', borderColor: 'divider' }} component="fieldset">
                <FieldsetLegend>informacion personal</FieldsetLegend>
                <Box
                  sx={{
                    rowGap: 3,
                    columnGap: 2,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <Field.Text name="firstName" label={translate('formPlaceholder.firstName')} />
                  <Field.Text name="lastName" label={translate('formPlaceholder.lastName')} />
                  <Field.Text name="email" label={translate('formPlaceholder.email')} />
                  <Field.Autocomplete
                    name="identificationType"
                    label={translate('formPlaceholder.identificationType')}
                    options={
                      Array.isArray(attributes?.items?.options)
                        ? attributes.items?.options.map(
                            (attribute: { label: any; value: any }) => ({
                              label: attribute.label,
                              value: attribute.value,
                            })
                          )
                        : []
                    }
                    getOptionLabel={(option) => option.label ?? ''}
                    isOptionEqualToValue={(option, value) => option.value === value?.value}
                    loading={isLoadingAttributes}
                  />
                  <Field.Text
                    name="identificationNumber"
                    label={translate('formPlaceholder.identificationNumber')}
                  />
                </Box>

                <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
                  <Button type="submit" variant="contained" loading={isSubmittingPersonalData}>
                    {translate('formPlaceholder.btnSave')}
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Form methods={methodAddressData} onSubmit={onSubmitAddressData}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 3, border: '1px solid', borderColor: 'divider' }} component="fieldset">
                <FieldsetLegend>Direccion</FieldsetLegend>
                <Box
                  sx={{
                    rowGap: 3,
                    columnGap: 2,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <Field.Text name="phoneNumber" label={translate('formPlaceholder.phoneNumber')} />
                  {/* <Field.Phone
                    name="phoneNumber"
                    label={translate('formPlaceholder.phoneNumber')}
                  /> */}
                  <Field.Text name="address" label={translate('formPlaceholder.address')} />
                  {/*<Field.CountrySelect
                    name="country"
                    label={translate('formPlaceholder.country')}
                    placeholder={translate('formPlaceholder.country')}
                    displayValue="code"
                  />*/}
                  <Field.Autocomplete
                    name="country"
                    label={translate('formPlaceholder.country')}
                    options={
                      Array.isArray(countries)
                        ? countries.map((country: { full_name_locale: any; id: any }) => ({
                            label: country.full_name_locale,
                            value: country.id,
                          }))
                        : []
                    }
                    getOptionLabel={(option) => option.label ?? ''}
                    isOptionEqualToValue={(option, value) => option.value === value?.value}
                    loading={isLoadingCountries}
                  />
                  <Field.Autocomplete
                    name="state"
                    label={translate('formPlaceholder.state')}
                    options={
                      Array.isArray(regions)
                        ? regions.map((region: { id: any; name: any }) => ({
                            label: region.name,
                            value: region.id,
                          }))
                        : []
                    }
                    getOptionLabel={(option) => option.label ?? ''}
                    isOptionEqualToValue={(option, value) => option.value === value?.value}
                    loading={isLoadingRegions}
                    onCustomChange={handleChangeState}
                  />
                  <Field.Autocomplete
                    name="city"
                    label={translate('formPlaceholder.city')}
                    options={
                      Array.isArray(cities)
                        ? cities.map((city: { id: any; name: any }) => ({
                            label: city.name,
                            value: city.id,
                          }))
                        : []
                    }
                    getOptionLabel={(option) => option.label ?? ''}
                    isOptionEqualToValue={(option, value) => option.value === value?.value}
                    loading={isLoadingCities}
                  />
                  <Field.Text name="zipCode" label={translate('formPlaceholder.zipCode')} />
                </Box>

                <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
                  <Button type="submit" variant="contained" loading={isSubmittingAddressData}>
                    {translate('formPlaceholder.btnSave')}
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </Box>
    </>
  );
}
