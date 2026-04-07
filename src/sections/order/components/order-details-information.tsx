import type { BillingAddressDetail, ShippingAddressDetail } from 'src/types/order';

import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';

interface OrderDetailsInformationProps {
  isOwnOrder: boolean;
  shippingAddress: ShippingAddressDetail;
  billingAddress?: BillingAddressDetail;
  shippingMethod: string;
  paymentMethod: string;
}
// ----------------------------------------------------------------------

export function OrderDetailsInformation({
  isOwnOrder,
  shippingAddress,
  billingAddress,
  shippingMethod,
  paymentMethod,
}: OrderDetailsInformationProps) {
  return (
    <Card sx={{ p: 3, typography: 'body2' }}>
      <CardHeader
        title="Información de la orden"
        sx={{
          p: 0,
          mb: 2,
          textAlign: 'left',
          '& .MuiCardHeader-content': { textAlign: 'left' },
          '& .MuiCardHeader-title': { textAlign: 'left' },
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
          <Box sx={{ fontWeight: 'bold' }}>Datos de envío</Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ display: 'flex' }}>{shippingAddress?.street.slice(0, 2).join(', ')}</Box>
          <Box sx={{ display: 'flex' }}>
            {shippingAddress?.city}, {shippingAddress?.region} {shippingAddress?.postcode}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box
          component="span"
          sx={{ color: 'text.secondary', width: 120, flexShrink: 0, fontWeight: 'bold' }}
        >
          Método de envío
        </Box>
        {shippingMethod.split(':')[1]?.split('-')[1]}
        {shippingMethod.split(':')[1]?.split('-')[0]}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box
          component="span"
          sx={{
            color: 'text.secondary',
            width: 120,
            flexShrink: 0,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          Dirección de facturación
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ display: 'flex' }}>{billingAddress?.street.slice(0, 2).join(', ')}</Box>
          <Box sx={{ display: 'flex' }}>
            {billingAddress?.city}, {billingAddress?.region} {billingAddress?.postcode}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box
          component="span"
          sx={{
            color: 'text.secondary',
            width: 120,
            flexShrink: 0,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          Método de pago
        </Box>
        {paymentMethod === 'No Payment Information Required'
          ? 'No se ha especificado el método de pago'
          : paymentMethod}
      </Box>
    </Card>
  );
}
