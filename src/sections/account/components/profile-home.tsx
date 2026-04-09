'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { ICustomer } from 'src/interfaces/customer/customer.interface';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales/langs/i18n';

import { Iconify } from 'src/components/iconify';

type ProfileHomeProps = {
  sx?: SxProps<Theme>;
  customer: ICustomer;
};

export function ProfileHome({ sx, customer }: ProfileHomeProps) {
  const { translate } = useTranslate();
  const firstName = (customer?.firstname ?? '').trim();
  const lastName = (customer?.lastname ?? '').trim();

  const displayName =
    [firstName, lastName].filter(Boolean).join(' ') || customer?.email || translate('customerProfileView.user');

  const email = customer?.email || '';

  const identificationType = customer?.identificationType?.[0]?.code ?? '-';
  const identificationNumber = customer?.identificationNumber?.[0]?.value ?? '-';

  const renderPostCard = () => (
    <Card sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {translate('customerProfileView.personalData')}
        </Typography>

        <Box
          sx={{
            gap: 2,
            display: 'flex',
            lineHeight: '24px',
            alignItems: 'center',
            mb: 1.5,
          }}
        >
          <Iconify width={24} icon="solar:user-rounded-bold" />
          <Link variant="subtitle2" color="inherit">
            {displayName}
          </Link>
        </Box>

        <Box sx={{ gap: 2, display: 'flex', lineHeight: '24px', alignItems: 'center', mb: 1.0 }}>
          <Iconify width={24} icon="solar:letter-bold" />
          <Typography variant="body2">{email}</Typography>
        </Box>

        <Box sx={{ gap: 2, display: 'flex', lineHeight: '24px', alignItems: 'center', mb: 1.0 }}>
          <Iconify width={24} icon="mdi:card-account-details-outline" />
          <Typography variant="body2">{identificationType}</Typography>
        </Box>

        <Box sx={{ gap: 2, display: 'flex', lineHeight: '24px', alignItems: 'center' }}>
          <Iconify width={24} icon="mdi:identifier" />
          <Typography variant="body2">{identificationNumber}</Typography>
        </Box>
      </Box>
    </Card>
  );

  return (
    <Grid container spacing={0} sx={sx}>
      <Grid size={{ xs: 12, md: 8 }} sx={{ gap: 0, display: 'flex', flexDirection: 'column' }}>
        {renderPostCard()}
      </Grid>
    </Grid>
  );
}
