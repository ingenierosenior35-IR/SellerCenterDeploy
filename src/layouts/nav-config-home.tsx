import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  users: icon('ic-users'),
  order: icon('ic-shopping-cart'),
  product: icon('ic-product'),
  home: icon('ic-dashboard'),
  return: icon('ic-refresh'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    items: [
      {
        title: 'Home',
        path: paths.home.root,
        icon: ICONS.home,
      },
    ],
  },
  /**
   * Management
   */
  {
    // subheader: 'Management',
    items: [
      {
        title: 'My products',
        path: paths.product.root,
        icon: ICONS.product,
        children: [
          { title: 'List', path: paths.product.root },
          { title: 'Load products', path: paths.product.load },
        ],
      },
      {
        title: 'Returns',
        path: paths.return.root,
        icon: ICONS.return,
        children: [
          { title: 'List', path: paths.return.root },
        ],
      },
    ],
  },
  {
    subheader: 'Management',
    items: [
      {
        title: 'Sub Accounts',
        path: paths.account.subaccount.root ,
        icon: ICONS.users,
        // children: [
        //   { title: 'List', path: paths.account.subaccount.root },
        // ],
      }
    ],
  }
];
