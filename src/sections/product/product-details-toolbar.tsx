'use client';

import type { ProductDetailsUIInterface } from 'src/interfaces';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

type Props = {
  publish: string;
  onChangePublish: (value: string) => void;
  product: ProductDetailsUIInterface;
  sx?: object;
};

export function ProductDetailsToolbar({ sx, publish, onChangePublish, product, ...other }: Props) {
  return (
    <Box
      sx={[
        { gap: 1.5, display: 'flex', mb: 3 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
}

export default ProductDetailsToolbar;
