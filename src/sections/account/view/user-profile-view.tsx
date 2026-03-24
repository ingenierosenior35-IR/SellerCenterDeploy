'use client';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { usePathname, useSearchParams } from 'src/routes/hooks';

import { HomeContent } from 'src/layouts/home';
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

const TAB_PARAM = 'tab';
//---- Define the navigation items for the user profile tabs
const NAV_ITEMS = [
  { value: '', label: 'Perfil', icon: <Iconify width={24} icon="solar:user-id-bold" /> },
  {
    value: 'configuration',
    label: 'Configuración',
    icon: <Iconify width={24} icon="solar:settings-bold" />,
  },
  {
    value: 'security',
    label: 'Seguridad',
    icon: <Iconify width={24} icon="ic:round-vpn-key" />,
  },
  {
    value: 'documents',
    label: 'Documentos',
    icon: <Iconify width={24} icon="solar:document-add-bold" />,
  },
];
//---- Define the navigation items for the user profile tabs

export function UserProfileView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab: string = searchParams.get(TAB_PARAM) ?? '';

  const { customer, isLoading, isError } = useGetCustomer();

  const firstName = customer?.firstname?.trim() || '';
  const lastName = customer?.lastname?.trim() || '';

  const displayName =
    [firstName, lastName].filter(Boolean).join(' ') || customer?.email || 'Usuario';

  const createRedirectPath = (currentPath: string, query: string): string => {
    const queryString = new URLSearchParams({ [TAB_PARAM]: query }).toString();
    return query ? `${currentPath}?${queryString}` : currentPath;
  };


  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !customer) {
    return (
      <ErrorContent
        title='informacion no disponible'
        description='error al cargar la informacion'
      />
    );
  }

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading="Perfil"
        links={[
          { name: 'Inicio', href: paths.home.root },
          { name: 'Cuenta', href: paths.account?.root ?? paths.home.root },
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
      {selectedTab === 'security' && <ProfileChangePassword />}
      {selectedTab === 'documents' && <ProfileDocuments />}
    </HomeContent>
  );
}
