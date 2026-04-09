'use client';

import type { SubAccountInterface } from 'src/interfaces';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';
import { useGetSubAccounts } from 'src/actions/account/use-get-subaccounts';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SubAccountEditForm } from '../components/subaccount-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: number;
};

export function SubAccountDetailsView({ id }: Props) {
  const { translate } = useTranslate();
  const { accounts, isLoading } = useGetSubAccounts();

  const account: SubAccountInterface | undefined = accounts.find((acc) => acc.id == id);

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={translate('subAccountDetailsView.breadcrumbs.heading')}
        links={[
          { name: translate('subAccountDetailsView.breadcrumbs.home'), href: paths.home.root },
          { name: translate('subAccountDetailsView.breadcrumbs.subaccount'), href: paths.account.subaccount.root },
          { name: translate('subAccountDetailsView.breadcrumbs.details'), href: paths.account.subaccount.root },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {
        isLoading
          ? (
              <Stack spacing={3}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Skeleton variant="rounded" height={360} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Skeleton variant="rounded" height={360} />
                  </Grid>
                </Grid>
              </Stack>
          )
        : (
          account && <SubAccountEditForm currentUser={account} />
        )
      }
    </HomeContent>
  );
}
