import type { Theme, SxProps } from '@mui/material/styles';
import type { Prices, OrderRowItemDetail } from 'src/interfaces/order';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { Divider } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------
interface OrderDetailsItemsProps {
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

export function OrderDetailsItems({
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
}: OrderDetailsItemsProps) {
  const renderDetailProduct = (label: string, value: string | number, sku: string) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Box>SKU: {sku}</Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{label}:</Box>
        <Box sx={{ color: 'text.secondary' }}>{value}</Box>
      </Box>
    </Box>
  );

  return (
    <Card {...(sx && { sx })} {...other}>
      <CardHeader title="Detalles de los productos" />

      <Scrollbar>
        {items.map((item) => (
          <Box
            key={item.sku}
            sx={[
              (theme) => ({
                p: 3,
                minWidth: 500,
                display: 'flex',
                alignItems: 'center',
                borderBottom: `dashed 2px ${theme.vars?.palette.background.default}`,
                gap: 2,
              }),
            ]}
          >
            <Link
              component={RouterLink}
              href={paths.product.details(item.sku)}
              underline="none"
            >
              {item.coverUrl && (
                <Avatar
                  src={item.coverUrl}
                  variant="rounded"
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
              )}
            </Link>

            <ListItemText
              primary={
                <Link
                  component={RouterLink}
                  href={paths.product.details(item.sku)}
                  color="inherit"
                  underline="none"
                >
                  {item.name}
                </Link>
              }
              secondary={
                item.selected_options?.length
                  ? renderDetailProduct(
                    item.selected_options.map((variant: any) => `${variant.label}`).join(', '),
                    item.selected_options.map((variant: any) => `${variant.value}`).join(', '),
                    item.sku,
                  )
                  : ''
              }
              slotProps={{
                primary: { sx: { typography: 'body2' } },
                secondary: {
                  sx: { mt: 0.5, color: 'text.disabled' },
                },
              }}
            />
            <Box sx={{ typography: 'body2' }}>x{item.quantity}</Box>
            <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
              {fCurrency(item.priceProvider)}
            </Box>
          </Box>
        ))}
      </Scrollbar>
      <Divider sx={{ borderStyle: 'dashed' }} />
    </Card>
  );
}
