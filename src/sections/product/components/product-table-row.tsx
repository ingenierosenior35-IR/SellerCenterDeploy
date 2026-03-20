import type { GridCellParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress, { type LinearProgressProps } from '@mui/material/LinearProgress';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return fCurrency(params.row.finalPrice);
}

export function RenderCellSku({ params }: ParamsProps) {
  return params.row.sku;
}

export function RenderCellStock({ params }: ParamsProps) {
  let color: LinearProgressProps['color'];
  let stockLabel: string;

  if (!params.row.inStock) {
    color = 'error';
    stockLabel = 'Out of Stock';
  } else if (params.row.stock > 10) {
    color = 'success';
    stockLabel = 'In Stock';
  } else {
    color = 'warning';
    stockLabel = 'Low Stock';
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
  return (
    <Box sx={{ py: 2, gap: 2, width: 1, display: 'flex', alignItems: 'center' }}>
      <Avatar
        alt={params.row.productName}
        src={params.row.thumbnailUrl}   // <-- FIX: era thumbnail
        variant="rounded"
        sx={{ width: 64, height: 64 }}
      />

      <ListItemText
        primary={
          <Link component={RouterLink} href={href} color="inherit">
            {params.row.productName}
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
