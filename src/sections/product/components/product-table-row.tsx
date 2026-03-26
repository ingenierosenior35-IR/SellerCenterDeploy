import type { GridCellParams } from '@mui/x-data-grid';
import type { ProductListInterface } from 'src/interfaces/seller-product.interface';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress, { type LinearProgressProps } from '@mui/material/LinearProgress';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales/langs/i18n';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams<ProductListInterface>;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return fCurrency(params.row.finalPrice);
}

export function RenderCellSku({ params }: ParamsProps) {
  return params.row.sku;
}

export function RenderCellStock({ params }: ParamsProps) {
  const { translate } = useTranslate();
  let color: LinearProgressProps['color'];
  let stockLabel: string;

  if (!params.row.inStock) {
    color = 'error';
    stockLabel = translate('outOfStock');
  } else if (params.row.stock > 10) {
    color = 'success';
    stockLabel = translate('inStock');
  } else {
    color = 'warning';
    stockLabel = translate('lowStock');
  }

  return (
    <Box sx={{ width: 1, typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        color={color}
        variant="determinate"
        value={(params.row.stock / Math.max(params.row.stock, 100)) * 100}
        sx={[{ mb: 1, width: 80, height: 6 }]}
      />
      {params.row.stock} {stockLabel}
    </Box>
  );
}

export function RenderCellProduct({ params, href }: ParamsProps & { href: string }) {
  const productName = params.row.productName;

  return (
    <Box sx={{ py: 2, gap: 2, width: 1, display: 'flex', alignItems: 'center' }}>
      <Avatar
        alt={productName}
        src={params.row.thumbnailUrl}
        variant="rounded"
        sx={{ width: 64, height: 64 }}
      />

      <ListItemText
        primary={
          <Link component={RouterLink} href={href} color="inherit">
            {productName}
          </Link>
        }
        secondary={params.row.category}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled' } },
        }}
      />
    </Box>
  );
}
