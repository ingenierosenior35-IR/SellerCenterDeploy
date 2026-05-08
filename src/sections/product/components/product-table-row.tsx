import type { GridCellParams } from '@mui/x-data-grid';
import type { ProductListInterface } from 'src/interfaces/product/seller-product.interface';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress, { type LinearProgressProps } from '@mui/material/LinearProgress';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales/langs/i18n';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams<ProductListInterface>;
};

export function RenderCellPrice({ params }: Readonly<ParamsProps>) {
  return fCurrency(params.row.finalPrice);
}

export function RenderCellSku({ params }: Readonly<ParamsProps>) {
  return params.row.sku;
}

export function RenderCellStock({ params }: Readonly<ParamsProps>) {
  const { translate } = useTranslate();
  const { isLowStock, lowStockThreshold, lowStockThresholdType, inStock, stock } = params.row;

  let color: LinearProgressProps['color'];
  let stockLabel: string;

  if (!inStock) {
    color = 'error';
    stockLabel = translate('outOfStock');
  } else if (isLowStock) {
    color = 'warning';
    stockLabel = translate('lowStock');
  } else {
    color = 'success';
    stockLabel = translate('inStock');
  }

  const thresholdTypeLabel =
    lowStockThresholdType === 'CUSTOM'
      ? translate('lowStockThresholdType.custom')
      : translate('lowStockThresholdType.default');

  const thresholdTooltip = `${translate('lowStockThresholdLabelPrefix')} ${lowStockThreshold} (${thresholdTypeLabel})`;
  const thresholdLabelText = `${translate('lowStockThresholdLabelPrefix')} ${lowStockThreshold}`;

  return (
    <Box sx={{ width: 1, typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        color={color}
        variant="determinate"
        value={(stock / Math.max(stock, 100)) * 100}
        sx={[{ mb: 1, width: 80, height: 6 }]}
      />
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
        <Box component="span" sx={{ fontWeight: isLowStock ? 'fontWeightBold' : 'inherit' }}>
          {stock} {stockLabel}
        </Box>
        {isLowStock && (
          <Tooltip title={thresholdTooltip} arrow>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <Iconify
                icon="solar:danger-triangle-bold"
                width={16}
                sx={{ color: 'warning.main' }}
              />
            </Box>
          </Tooltip>
        )}
      </Stack>
      {isLowStock && (
        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
          <Label color="warning" variant="soft">
            {thresholdLabelText}
          </Label>
          <Label color={lowStockThresholdType === 'CUSTOM' ? 'info' : 'default'} variant="soft">
            {thresholdTypeLabel}
          </Label>
        </Stack>
      )}
    </Box>
  );
}

export function RenderCellProduct({ params, href }: Readonly<ParamsProps & { href: string }>) {
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
          <Link component={RouterLink} to={href} color="inherit">
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
