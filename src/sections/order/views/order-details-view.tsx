'use client';

import type { DataFormatedDetail } from 'src/interfaces/order';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import { paths } from 'src/routes/paths';

import { HomeContent } from 'src/layouts/home';

import { OrderDetailsItems } from '../components/order-details-items';
import { OrderDetailsTotals } from '../components/order-details-totals';
import { OrderDetailsToolbar } from '../components/order-details-toolbar';
import { OrderDetailsShipping } from '../components/order-details-shipping';
import { OrderDetailsInformation } from '../components/order-details-information';

// ----------------------------------------------------------------------

export function OrderDetailsView({
  order,
  userRole,
}: {
  order: DataFormatedDetail;
  userRole?: string;
}) {
  return (
    <HomeContent>
      <OrderDetailsToolbar
        status={order?.status}
        createdAt={order?.createDate}
        orderNumber={order?.orderNumber}
        backHref={paths.order.root}
        orderUid={order?.orderNumber}
        userRole={userRole || 'admin'}
        tracking={order?.tracking}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Card>
                <OrderDetailsInformation
                  isOwnOrder={false}
                  shippingAddress={order?.customer.shippingAddress}
                  billingAddress={order?.billing_address}
                  shippingMethod={order?.shipping_method}
                  paymentMethod={order?.paymentMethodSelected}
                />
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card>
                <OrderDetailsTotals
                  items={order?.items}
                  productsPrice={order?.prices.subtotal_excl_tax.value}
                  shipping={order?.prices.total_shipping.value}
                  commission={order?.prices.total_tax.value}
                  profit={order?.prices.grand_total.value}
                  totalInclTax={order?.prices.subtotal_incl_tax.value}
                  totalCreditStore={order!.prices.total_store_credit?.value ?? 0}
                  prices={order?.prices}
                />
                <OrderDetailsShipping
                  isOwnOrder={false}
                  shippingAddress={order?.customer.shippingAddress}
                  clientName={`${order?.customer.name}`}
                  clientEmail={order?.customer.email ?? ''}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <Box
            sx={{ gap: 3, display: 'flex', flexDirection: { xs: 'column-reverse', md: 'column' } }}
          >
            <OrderDetailsItems
              items={order?.items}
              productsPrice={order?.prices.subtotal_excl_tax.value}
              shipping={order?.prices.total_shipping.value}
              commission={order?.prices.total_tax.value}
              profit={order?.prices.grand_total.value}
              totalInclTax={order?.prices.subtotal_incl_tax.value}
              totalCreditStore={order!.prices.total_store_credit?.value ?? 0}
              prices={order?.prices}
            />
          </Box>
        </Grid>
      </Grid>
    </HomeContent>
  );
}
