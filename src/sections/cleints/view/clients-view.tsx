'use client';

import type { ClientListDataTable } from 'src/interfaces/clients/client-list';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { paths } from 'src/routes/paths';

import { useClientList } from 'src/hooks/clients/use-client-list';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CommonTable } from 'src/sections/common/common-table';




const clientRender = (client: ClientListDataTable, index: number) => (
  <TableRow key={index}>
    <TableCell align="left">{client.full_name}</TableCell>
    <TableCell align="left">{client.email}</TableCell>
    <TableCell align="left">{client.location}</TableCell>
    <TableCell align="left">{client.customer_since}</TableCell>
  </TableRow>
);
export default function ClientsView() {
  const { clientList, tableHead } = useClientList();
  const { translate } = useTranslate();
  return (
    <HomeContent>
      {' '}
      <CustomBreadcrumbs
        heading={translate('clientsModule.title')}
        links={[
          { name: translate('breadcrumbs.home'), href: paths.home.root },
          { name: translate('clientsModule.title') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <CommonTable
        tableHeadCell={tableHead}
        contentTable={clientList}
        renderCell={clientRender}
        filterKeys={['full_name', 'email']}
        minWidth={800}
        searchPlaceholder={`${translate('clientsModule.table.searchFilter')}`}
      />
    </HomeContent>
  );
}
