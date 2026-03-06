'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { DashboardContent } from 'src/layouts/dashboard';
import { _appInvoices, _appProducts, _appCustomers } from 'src/_mock';

import { AppKpiCard } from './app-kpi-card';
import { AppTopProducts } from '../app-top-products';
import { AppNewInvoices } from '../app-new-invoices';
import { AppTopCustomers } from '../app-top-customers';

// ----------------------------------------------------------------------

export function OverviewAppView() {

  return (
    <DashboardContent maxWidth="xl">

      <Grid container spacing={3}
        sx={{
          backgroundColor: 'common.black',
          borderRadius: 2,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          mb: 2,
          p: 2,
        }}
      >
        <Grid>
          <AppKpiCard
            title="Net Profit"
            total={2657.93}
            percent={2.5}
            series={[10, 12, 11, 13, 14, 15, 17]}
            showPeriod
            transparentCard
          />
        </Grid>
        <Grid>
          <AppKpiCard
            title="Total Sales"
            total={2657.93}
            percent={2.5}
            series={[8, 6, 9, 11, 10, 12, 15]}
          />
        </Grid>
        <Grid>
          <AppKpiCard
            title="Net Profit"
            total={2657.93}
            percent={-3.5}
            series={[15, 14, 14, 13, 11, 10, 10]}
          />
        </Grid>
      </Grid>

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
        sx={{ mb: 2 }}
      >
        <Box sx={{ gridColumn: { md: 'span 2' } }}>
          <AppNewInvoices
            title="Latest Orders"
            tableData={_appInvoices}
            headCells={[
              { id: 'id', label: 'Order' },
              { id: 'customer', label: 'Customer' },
              { id: 'date', label: 'Date' },
              { id: 'total', label: 'Total' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Box>
        <Box sx={{ gridColumn: { md: 'span 1' } }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <AppTopProducts
              title="Top Products"
              list={_appProducts}
            />
            <AppTopCustomers
              title="Top Clients"
              list={_appCustomers}
            />
          </Box>
        </Box>
      </Box>

    </DashboardContent>
  );
}
