'use client';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';


export default function ClientsView() {
  const { translate } = useTranslate();
  return (
    <HomeContent>
      {' '}
      <CustomBreadcrumbs
        heading={translate('feedbackModule.title')}
        links={[
          { name: 'Home', href: paths.home.root },
          { name: translate('clientsModule.title') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {/* <CommonTable
        tableHeadCell={tableHead}
        contentTable={reviewsList}
        renderCell={sellRender}
        filterKeys={['nickname']}
        filterTemplate={
          <Button
            variant="outlined"
            onClick={handleOpenFilterPopup}
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: '50%',
              p: 0,
            }}
          >
            <Iconify icon="ic:round-filter-list" width={20} />
          </Button>
        }
        searchPlaceholder={`${translate('feedbackModule.table.searchFilter')}`}
      /> */}
    </HomeContent>
  );
}
