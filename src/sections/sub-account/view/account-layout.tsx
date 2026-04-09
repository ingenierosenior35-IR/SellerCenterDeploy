'use client';

import { removeLastSlash } from 'minimal-shared/utils';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { HomeContent, type HomeContentProps} from 'src/layouts/home';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

const NAV_ITEMS = [
  {
    label: 'General',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
    href: paths.account.subaccount.root,
  },
  {
    label: 'Security',
    icon: <Iconify width={24} icon="ic:round-vpn-key" />,
    href: `${paths.account.subaccount.root}/change-password`,
  },
];

// ----------------------------------------------------------------------

export function AccountLayout({ children, ...other }: HomeContentProps) {
  const pathname = usePathname();
  const { translate } = useTranslate();

  return (
    <HomeContent {...other}>
      <CustomBreadcrumbs
        heading={translate('accountLayout.breadcrumbs.heading')}
        links={[
          { name: translate('accountLayout.breadcrumbs.home'), href: paths.account.subaccount.root },
          { name: translate('accountLayout.breadcrumbs.user'), href: paths.account.subaccount.root },
          { name: translate('accountLayout.breadcrumbs.account') },
        ]}
        sx={{ mb: 3 }}
      />

      <Tabs value={removeLastSlash(pathname)} sx={{ mb: { xs: 3, md: 5 } }}>
        {NAV_ITEMS.map((tab) => (
          <Tab
            component={RouterLink}
            key={tab.href}
            label={tab.label}
            icon={tab.icon}
            value={tab.href}
            href={tab.href}
          />
        ))}
      </Tabs>

      {children}
    </HomeContent>
  );
}
