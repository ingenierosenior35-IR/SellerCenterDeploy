'use client';

import type {
  ProductDetailsUIInterface,
  ProductDetailsVariantInterface,
} from 'src/interfaces';

import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { ProductConfigurableOptions } from './product-configurable-options';

// ----------------------------------------------------------------------

type SelectedOptions = Record<string, string>;

type Props = {
  product: ProductDetailsUIInterface;
};

export function ProductDetailsSummary({ product, ...other }: Readonly<Props>) {
  const {
    sku = '',
    name = '',
    category = '',
    inStock,
    stock,
    price,
    discountPercent,
    configurableOptions = [],
    variants = [],
  } = product;

  const isConfigurable = configurableOptions.length > 0 && variants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState<ProductDetailsVariantInterface | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  const methods = useForm({ defaultValues: {} });
  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async () => {});

  // Producto / variante activa
  const currentProduct = selectedVariant?.product ?? null;

  const hasValidSelection = !isConfigurable || (isConfigurable && selectedVariant !== null);

  const currentPrice: number | null = hasValidSelection
    ? (currentProduct?.price_range?.minimum_price?.final_price?.value ?? price)
    : null;

  const currentRegularPrice: number | null = hasValidSelection
    ? (currentProduct?.price_range?.minimum_price?.regular_price?.value ?? price)
    : null;

  const currentStock = currentProduct?.stock_saleable ?? stock;
  const currentStockStatus =
    currentProduct?.stock_status ?? (inStock ? 'IN_STOCK' : 'OUT_OF_STOCK');
  const currentSku = currentProduct?.sku ?? sku;
  const currentName = currentProduct?.name ?? name;

  const handleConfigurableChange = useCallback(
    (options: SelectedOptions, variant: ProductDetailsVariantInterface | undefined) => {
      setSelectedOptions(options);
      setSelectedVariant(variant ?? null);
    },
    []
  );

  const hasAllOptionsSelected = Object.keys(selectedOptions).length === configurableOptions.length;

  const canPurchase = isConfigurable
    ? selectedVariant !== null &&
      hasAllOptionsSelected &&
      currentStockStatus === 'IN_STOCK' &&
      currentStock > 0
    : currentStockStatus === 'IN_STOCK' && currentStock > 0;

  const renderHeader = () => (
    <Stack spacing={1} sx={{ mb: 2 }}>
      <Typography variant="h4">{currentName}</Typography>

      {category && (
        <Alert
          severity="info"
          sx={{
            backgroundColor: 'primary.lighter',
            borderRadius: 3,
            color: 'primary.main',
            py: 0,
            pl: 1,
            width: 'fit-content',
          }}
        >
          {category}
        </Alert>
      )}

      <Typography variant="body2">
        <strong>SKU: </strong>
        {currentSku}
      </Typography>

      <Typography variant="body2">
        <strong>Stock: </strong>
        {currentStock}
      </Typography>
    </Stack>
  );

  const renderPrices = () => (
    <Stack spacing={0.5}>
      {discountPercent > 0 && (
        <Typography variant="body2" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
          {currentRegularPrice !== null ? fCurrency(currentRegularPrice) : '—'}
        </Typography>
      )}
      <Typography variant="h5">
        {currentPrice !== null ? fCurrency(currentPrice) : '—'}
        {discountPercent > 0 && (
          <Typography
            component="span"
            variant="body2"
            sx={{ ml: 1, color: 'error.main', fontWeight: 600 }}
          >
            -{discountPercent}%
          </Typography>
        )}
      </Typography>
    </Stack>
  );

  const commonBtnSx = {
    px: 2,
    py: 0.75,
    minHeight: 36,
    borderRadius: 1.25,
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: 'none',
    flex: { xs: '1 1 100%', sm: '0 1 auto' },
    minWidth: { xs: '100%', sm: 160 },
    whiteSpace: 'nowrap',
  } as const;

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
          {renderHeader()}
          {renderPrices()}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {isConfigurable && configurableOptions.length > 0 && (
          <>
            <ProductConfigurableOptions
              configurableOptions={configurableOptions}
              variants={variants}
              onSelectionChange={handleConfigurableChange}
            />
            <Divider sx={{ borderStyle: 'dashed' }} />
          </>
        )}

        <Box
          sx={{
            gap: 1,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: { xs: 'stretch', sm: 'flex-start' },
            width: '100%',
          }}
        >
          <Button
            variant="contained"
            size="medium"
            disabled={!canPurchase}
            startIcon={<Iconify icon="solar:cart-3-bold" width={18} />}
            sx={commonBtnSx}
          >
            {!canPurchase ? 'No disponible' : 'Generar venta'}
          </Button>

          <Button
            variant="contained"
            size="medium"
            startIcon={<Iconify icon="solar:list-bold" width={18} />}
            sx={commonBtnSx}
          >
            Analizar desempeño
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}

export default ProductDetailsSummary;
