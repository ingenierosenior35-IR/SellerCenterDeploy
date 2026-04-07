import type { Theme, SxProps } from '@mui/material/styles';
import type { Prices, OrderRowItemDetail } from 'src/types/order';

import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------
interface OrderDetailsTotalsProps {
  items: OrderRowItemDetail[];
  productsPrice: number;
  shipping: number;
  commission: number;
  profit: number;
  totalInclTax: number;
  totalCreditStore: number | null;
  sx?: SxProps<Theme>;
  prices: Prices;
}

export function OrderDetailsTotals({
  sx,
  items = [],
  productsPrice,
  shipping,
  commission,
  profit,
  totalInclTax,
  totalCreditStore,
  prices,

  ...other
}: OrderDetailsTotalsProps) {
  return (
    <>
      <CardHeader title="Información el pedido" />
      <Box
        sx={{
          p: 3,
          gap: .5,
          display: 'flex',
          textAlign: 'right',
          typography: 'body2',
          alignItems: 'stretch',
          flexDirection: 'column',
        }}
      >
        {/* Total products price */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ color: 'text.secondary' }}>Total productos</Box>
          <Box sx={{ fontWeight: 'bold' }}>
            {`${fCurrency(productsPrice > 0 ? productsPrice : 0)}`}
          </Box>
        </Box>
        {/* Shipping cost */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ color: 'text.secondary' }}>Manejo y envío</Box>
          <Box sx={{ fontWeight: 'bold' }}>{shipping > 0 ? `${fCurrency(shipping)}` : '-'}</Box>
        </Box>
        {/* Taxes price */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
          <Box sx={{ fontWeight: 'bold' }}>{fCurrency(prices.total_tax.value)}</Box>
        </Box>
        {/* Credit store */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ color: 'text.secondary' }}>Crédito de tienda</Box>
          <Box sx={{ fontWeight: 'bold' }}>{`${fCurrency(totalCreditStore)}`}</Box>
        </Box>
        {/* Total price */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ color: 'text.secondary' }}>Monto total del vendedor</Box>

          <Box sx={{ fontWeight: 'bold' }}>
            {fCurrency(
              prices.grand_total.value > 0
                ? prices.grand_total.value
                : prices.subtotal_incl_tax.value + prices.total_shipping.value,
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
