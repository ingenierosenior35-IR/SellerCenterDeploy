import type { AddressDetail } from 'src/interfaces/order';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';

interface OrderDetailsShippingProps {
  isOwnOrder: boolean;
  shippingAddress: AddressDetail;
  clientName: string;
  clientEmail: string;
}
// ----------------------------------------------------------------------

export function OrderDetailsShipping({
  clientName,
  clientEmail,
}: OrderDetailsShippingProps) {
  return (
    <>
      <CardHeader title="Información de la compra" />
      <Stack spacing={0.5} sx={{ p: 3, typography: 'body2' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, justifyContent: 'space-between' }}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Nombre cliente
          </Box>
          <Box>{clientName}</Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, justifyContent: 'space-between' }}>
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            <Box>E-mail</Box>
          </Box>
          <Box>{clientEmail}</Box>
        </Box>
      </Stack>
    </>
  );
}
