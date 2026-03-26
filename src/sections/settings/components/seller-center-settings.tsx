'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRef, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const COUNTRIES = [{ label: 'Colombia', value: 'CO' }] as const;

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)+/g, '');
}

function getFileName(file: string | File | null | undefined) {
  if (!file) return null;
  return typeof file === 'string' ? file : file.name;
}

export const SellerCenterSettingsSchema = z.object({
  storeTitle: z.string().min(1, { error: 'Título de tienda es obligatorio.' }),

  bannerFile: schemaUtils.file({ error: 'Banner es obligatorio.' }).nullable().optional(),
  logoFile: schemaUtils.file({ error: 'Logo es obligatorio.' }).nullable().optional(),

  companyLocation: z.string().default(''),
  // Por ahora textarea (sin Tiny). Luego lo cambiamos a editor si lo necesitan.
  companyDescription: z.string().default(''),

  country: schemaUtils.nullableInput(z.string().min(1, { error: 'País es obligatorio.' }), {
    error: 'País es obligatorio.',
  }),

  metaKeywords: z.string().default(''),
  metaDescription: z.string().default(''),
  googleAnalyticId: z.string().default(''),
});

type FormValues = z.input<typeof SellerCenterSettingsSchema>;

// ----------------------------------------------------------------------

export function SellerCenterSettings() {
  const { translate } = useTranslate();

  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const defaultValues: FormValues = {
    storeTitle: 'Inter Prueba',

    bannerFile: null,
    logoFile: null,

    companyLocation: '',
    companyDescription: '',

    country: 'CO',

    metaKeywords: '',
    metaDescription: '',
    googleAnalyticId: '',
  };

  const methods = useForm<FormValues>({
    mode: 'all',
    resolver: zodResolver(SellerCenterSettingsSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const shopSlug = useMemo(() => slugify(values.storeTitle || ''), [values.storeTitle]);

  const shopTitleForPath = values.storeTitle || 'shop';
  const base = 'marketplace/seller';

  const profileTargetUrl = `${base}/profile/shop/${shopTitleForPath}`;
  const collectionTargetUrl = `${base}/collection/shop/${shopTitleForPath}`;
  const reviewTargetUrl = `${base}/feedback/shop/${shopTitleForPath}`;
  const locationTargetUrl = `${base}/location/shop/${shopTitleForPath}`;

  const onChooseBanner = () => bannerInputRef.current?.click();
  const onChooseLogo = () => logoInputRef.current?.click();

  const onFileChange =
    (field: 'bannerFile' | 'logoFile', setPreview: (url: string | null) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;

      // schemaUtils.file en este repo acepta string | File, por eso el cast.
      setValue(field, file as unknown as string | File | null, { shouldValidate: true });

      if (file) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }
    };

  const onSubmitProfile = handleSubmit(async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 400));
      toast.success(translate('settings', 'sellerProfile.toasts.saveProfileSuccess'));
    } catch (err) {
      toast.error(translate('settings', 'sellerProfile.toasts.saveProfileError'));
      console.error(err);
    }
  });

  const onSubmitUrls = async () => {
    try {
      await new Promise((r) => setTimeout(r, 300));
      toast.success(translate('settings', 'shopUrl.toasts.saveUrlSuccess'));
    } catch (err) {
      toast.error(translate('settings', 'shopUrl.toasts.saveUrlError'));
      console.error(err);
    }
  };

  return (
    <Form methods={methods} onSubmit={onSubmitProfile}>
      <HomeContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <CustomBreadcrumbs
            heading={translate('settings', 'sellerProfile.breadcrumb.heading')}
            links={[
              { name: translate('sidebarMenu', 'home.title'), href: paths.home.root },
              { name: translate('settings', 'breadcrumb.current') },
            ]}
            sx={{ mb: { xs: 3, md: 5 } }}
          />

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader
                  title={translate('settings', 'sellerProfile.cardTitle')}
                  sx={{
                    py: 2.5,
                    px: 3,
                    '& .MuiCardHeader-title': { typography: 'h6' },
                  }}
                />
                <Divider />

                <Box
                  sx={{
                    p: 3,
                    rowGap: 3,
                    columnGap: 2,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
                  }}
                >
                  <Field.Text name="storeTitle" label={translate('settings', 'sellerProfile.fields.storeTitle')} />

                  <Field.Select name="country" label={translate('settings', 'sellerProfile.fields.country')}>
                    {COUNTRIES.map((c) => (
                      <MenuItem key={c.value} value={c.value}>
                        {c.label}
                      </MenuItem>
                    ))}
                  </Field.Select>

                  <Field.Text
                    name="companyLocation"
                    label={translate('settings', 'sellerProfile.fields.companyLocation')}
                  />

                  <Field.Text
                    name="googleAnalyticId"
                    label={translate('settings', 'sellerProfile.fields.googleAnalyticId')}
                    placeholder={translate('settings', 'sellerProfile.fields.googleAnalyticIdPh')}
                  />

                  <Field.Text
                    name="metaKeywords"
                    label={translate('settings', 'sellerProfile.fields.metaKeywords')}
                    placeholder={translate('settings', 'sellerProfile.fields.metaKeywordsPh')}
                  />

                  <Field.Text
                    name="metaDescription"
                    label={translate('settings', 'sellerProfile.fields.metaDescription')}
                    multiline
                    rows={3}
                  />

                  <Field.Text
                    name="companyDescription"
                    label={translate('settings', 'sellerProfile.fields.companyDescription')}
                    multiline
                    rows={6}
                    helperText={translate('settings', 'sellerProfile.fields.companyDescriptionHelp')}
                    sx={{ gridColumn: { xs: 'auto', md: '1 / span 2' } }}
                  />

                  {/* Banner */}
                  <Box sx={{ gridColumn: { xs: 'auto', md: '1 / span 2' } }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {translate('settings', 'sellerProfile.fields.companyBanner')}
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                      <Button
                        variant="soft"
                        startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                        onClick={onChooseBanner}
                      >
                        {translate('settings', 'common.selectFile')}
                      </Button>

                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {getFileName(values.bannerFile) ?? translate('settings', 'common.noFileSelected')}
                      </Typography>
                    </Stack>

                    {bannerPreview && (
                      <Box
                        component="img"
                        alt="banner preview"
                        src={bannerPreview}
                        sx={{ mt: 2, width: '100%', maxWidth: 720, borderRadius: 1 }}
                      />
                    )}

                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={onFileChange('bannerFile', setBannerPreview)}
                    />
                  </Box>

                  {/* Logo */}
                  <Box sx={{ gridColumn: { xs: 'auto', md: '1 / span 2' } }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {translate('settings', 'sellerProfile.fields.companyLogo')}
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                      <Button
                        variant="soft"
                        startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                        onClick={onChooseLogo}
                      >
                        {translate('settings', 'common.selectFile')}
                      </Button>

                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {getFileName(values.logoFile) ?? translate('settings', 'common.noFileSelected')}
                      </Typography>
                    </Stack>

                    {logoPreview && (
                      <Box
                        component="img"
                        alt="logo preview"
                        src={logoPreview}
                        sx={{
                          mt: 2,
                          width: 140,
                          height: 140,
                          objectFit: 'cover',
                          borderRadius: 2,
                        }}
                      />
                    )}

                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={onFileChange('logoFile', setLogoPreview)}
                    />
                  </Box>
                </Box>

                <Stack direction="row" justifyContent="flex-end" sx={{ p: 3, pt: 0 }}>
                  <Button type="submit" variant="contained" loading={isSubmitting}>
                    {translate('settings', 'sellerProfile.actions.saveProfile')}
                  </Button>
                </Stack>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader
                  title={translate('settings', 'shopUrl.cardTitle')}
                  sx={{
                    py: 2.5,
                    px: 3,
                    '& .MuiCardHeader-title': { typography: 'h6' },
                  }}
                />
                <Divider />

                {/* Aquí NO uso RHF Field porque son campos calculados/read-only */}
                <Box sx={{ p: 3, display: 'grid', gap: 2 }}>
                  <TextField
                    label={translate('settings', 'shopUrl.fields.profileTarget')}
                    value={profileTargetUrl}
                    disabled
                    fullWidth
                  />
                  <TextField
                    label={translate('settings', 'shopUrl.fields.profileRequest')}
                    value={shopSlug}
                    disabled
                    fullWidth
                  />

                  <TextField
                    label={translate('settings', 'shopUrl.fields.collectionTarget')}
                    value={collectionTargetUrl}
                    disabled
                    fullWidth
                  />
                  <TextField
                    label={translate('settings', 'shopUrl.fields.collectionRequest')}
                    value={shopSlug}
                    disabled
                    fullWidth
                  />

                  <TextField
                    label={translate('settings', 'shopUrl.fields.reviewTarget')}
                    value={reviewTargetUrl}
                    disabled
                    fullWidth
                  />
                  <TextField
                    label={translate('settings', 'shopUrl.fields.reviewRequest')}
                    value={shopSlug}
                    disabled
                    fullWidth
                  />

                  <TextField
                    label={translate('settings', 'shopUrl.fields.locationTarget')}
                    value={locationTargetUrl}
                    disabled
                    fullWidth
                  />
                  <TextField
                    label={translate('settings', 'shopUrl.fields.locationRequest')}
                    value={shopSlug}
                    disabled
                    fullWidth
                  />

                  <TextField
                    label={translate('settings', 'shopUrl.fields.privacyPolicyRequest')}
                    value=""
                    disabled
                    fullWidth
                  />
                </Box>

                <Stack direction="row" justifyContent="space-between" sx={{ p: 3, pt: 0 }}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      component={RouterLink}
                      href="#"
                      variant="soft"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info(translate('settings', 'shopUrl.actions.viewProfileMock'));
                      }}
                    >
                      {translate('settings', 'shopUrl.actions.viewProfile')}
                    </Button>

                    <Button
                      component={RouterLink}
                      href="#"
                      variant="soft"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info(translate('settings', 'shopUrl.actions.viewCollectionMock'));
                      }}
                    >
                      {translate('settings', 'shopUrl.actions.viewCollection')}
                    </Button>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button
                      component={RouterLink}
                      href={paths.home.root}
                      color="inherit"
                      startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                    >
                      {translate('settings', 'common.back')}
                    </Button>

                    <Button variant="contained" onClick={onSubmitUrls}>
                      {translate('settings', 'shopUrl.actions.saveUrl')}
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </HomeContent>
    </Form>
  );
}
