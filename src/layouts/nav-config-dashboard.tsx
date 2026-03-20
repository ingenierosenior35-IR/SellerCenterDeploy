import type { NavSectionProps } from 'src/components/nav-section';

import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales/langs/i18n';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------
const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  users: icon('ic-users'),
  order: icon('ic-shopping-cart'),
  product: icon('ic-product'),
  dashboard: icon('ic-dashboard'),
  return: icon('ic-refresh'),
  feedback: icon('ic-feedback'),
};

// ----------------------------------------------------------------------

export const useNavData = (): NavSectionProps['data'] => {
  const { translate } = useTranslate();

  return useMemo(
    () => [
      {
        items: [
          {
            title: translate('tableLatestOrders', 'columns.id'),
            path: paths.home.root,
            icon: ICONS.dashboard,
          },
        ],
      },
      {
        items: [
          {
            title: translate('sidebarMenu.myProducts.title'),
            path: paths.product.root,
            icon: ICONS.product,
            children: [
              { title: translate('sidebarMenu.myProducts.subtitles.list'), path: paths.product.root },
              { title: translate('sidebarMenu.myProducts.subtitles.loadProducts'), path: paths.product.load },
            ],
          },
          {
            title: translate('sidebarMenu.returns.title'),
            path: paths.return.root,
            icon: ICONS.return,
            children: [{ title: translate('sidebarMenu.returns.subtitles.list'), path: paths.return.root }],
          },{
                        title: translate('sidebarMenu.feedback.title'),
            path: paths.feedback.root,
            icon: ICONS.feedback,
          }
          
        ],
      },

    ],
    [translate]
  );
};
