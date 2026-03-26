'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { useDashboardData } from 'src/hooks/dashboard/use-dashboard-data';

import { _appInvoices } from 'src/_mock';
import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';

import { LoadingScreen } from 'src/components/loading-screen';

import { AppKpiCard } from './app-kpi-card';
import { AppTopProducts } from '../app-top-products';
import { AppNewInvoices } from '../app-new-invoices';
import { AppTopCustomers } from '../app-top-customers';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { translate } = useTranslate();
  const { topProducts, topCustomers, averageOrderValue, totalSales, ordersOverTime, isLoading} = useDashboardData();
  return (
    <HomeContent maxWidth="xl">
      <Grid
        container
        spacing={3}
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
        title={translate('dashboardModule.averageOrderValue.title')}
        total={Number(averageOrderValue.avg_order_value)}
        series={averageOrderValue.graph_data.map((price) => Number(price))}
        showPeriod
        transparentCard
        monthlyData={averageOrderValue.graph_x_value}
          />
        </Grid>
        <Grid>
          <AppKpiCard
        title={translate('dashboardModule.totalSales.title')}
        total={Number(totalSales.total_sale_amount)}
        series={totalSales.graph_data.map((price) => Number(price))}
        monthlyData={totalSales.graph_x_value}
          />
        </Grid>
        <Grid>
          <AppKpiCard
        title={translate('dashboardModule.ordersOverTime.title')}
        total={Number(ordersOverTime.graph_data.reduce((sum, value) => sum + Number(value), 0))}
        series={ordersOverTime.graph_data.map((value) => Number(value))}
        monthlyData={ordersOverTime.graph_x_value}
        typeTotal='text'
          />
        </Grid>
      </Grid>

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{ xs: '1fr', md: 'repeat(12, 1fr)' }}
        sx={{ mb: 2 }}
      >
        <Box sx={{ gridColumn: { md: 'span 8 ' } }}>
          <AppNewInvoices
            title={translate('tableLatestOrders', 'title')}
            tableData={_appInvoices}
            headCells={[
              { id: 'id', label: translate('tableLatestOrders', 'columns.id') },
              { id: 'customer', label: translate('tableLatestOrders', 'columns.customer') },
              { id: 'date', label: translate('tableLatestOrders', 'columns.date') },
              { id: 'total', label: translate('tableLatestOrders', 'columns.total') },
              { id: 'status', label: translate('tableLatestOrders', 'columns.status') },
              { id: '' },
            ]}
          />
        </Box>
        <Box sx={{ gridColumn: { md: 'span 4' } }}>
          <Box display="flex" flexDirection="column" gap={3}>
            {isLoading ? (
              <LoadingScreen />
            ) : (
              <>
                <AppTopProducts title={translate('TopProducts', 'title')} list={topProducts} />
                <AppTopCustomers title={translate('TopClients', 'title')} list={topCustomers} />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </HomeContent>
  );
}
