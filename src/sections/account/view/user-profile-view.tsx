'use client';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { usePathname, useSearchParams } from 'src/routes/hooks';

import { HomeContent } from 'src/layouts/home';
import { useTranslate } from 'src/locales/langs/i18n';
import { useGetCustomer } from 'src/actions/customer/use-get-customer';

import { Iconify } from 'src/components/iconify';
import { ErrorContent } from 'src/components/error-content';
import { LoadingScreen } from 'src/components/loading-screen/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

//import { useAuthContext } from "src/auth/hooks";
import { ProfileCover } from '../components/profile-cover';
import {
  ProfileHome,
  ProfileDocuments,
  ProfileConfiguration,
  ProfileChangePassword,
} from '../components';

export function UserProfileView() {
  const { translate } = useTranslate();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const TAB_PARAM = 'tab';
  //---- Define the navigation items for the user profile tabs
  const NAV_ITEMS = [
    { value: '', label: translate('customerProfileView.profile'), icon: <Iconify width={24} icon="solar:user-id-bold" /> },
    {
      value: 'configuration',
      label: translate('customerProfileView.configuration'),
      icon: <Iconify width={24} icon="solar:settings-bold" />,
    },
    {
      value: 'security',
      label: translate('customerProfileView.security'),
      icon: <Iconify width={24} icon="ic:round-vpn-key" />,
    },
    {
      value: 'documents',
      label: translate('customerProfileView.documents'),
      icon: <Iconify width={24} icon="solar:document-add-bold" />,
    },
  ];
  //---- Define the navigation items for the user profile tabs

  const selectedTab: string = searchParams.get(TAB_PARAM) ?? '';

  const { customer, isLoading, isError } = useGetCustomer();

  const firstName = customer?.firstname?.trim() || '';
  const lastName = customer?.lastname?.trim() || '';

  const displayName =
    [firstName, lastName].filter(Boolean).join(' ') || customer?.email || translate('customerProfileView.user');

  const createRedirectPath = (currentPath: string, query: string): string => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !customer) {
    return (
      <ErrorContent title={translate('noResultsFound')} description={translate('noDataFound')} />
    );
  }

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={translate('customerProfileView.profile')}
        links={[
          { name: translate('sidebarMenu.home.title'), href: paths.home.root },
          {
            name: translate('sidebarMenu.account.title'),
            href: paths.account?.root ?? paths.home.root,
          },
          { name: displayName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ height: 290, position: 'relative' }}>
        <ProfileCover role="role" name={displayName} avatarUrl={undefined} coverUrl="coverUrl" />

        <Box
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            px: { md: 3 },
            display: 'flex',
            position: 'absolute',
            bgcolor: 'background.paper',
            justifyContent: { xs: 'center', md: 'flex-end' },
          }}
        >
          <Tabs value={selectedTab}>
            {NAV_ITEMS.map((tab) => (
              <Tab
                component={RouterLink}
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                label={tab.label}
                href={createRedirectPath(pathname, tab.value)}
              />
            ))}
          </Tabs>
        </Box>
      </Card>

      {selectedTab === '' && <ProfileHome sx={{ mt: 3 }} customer={customer} />}
      {selectedTab === 'configuration' && <ProfileConfiguration customer={customer} />}
      {selectedTab === 'security' && <ProfileChangePassword customer={customer} />}
      {selectedTab === 'documents' && <ProfileDocuments />}
    </HomeContent>
  );
}
