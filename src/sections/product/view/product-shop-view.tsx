'use client';

import { 
  Grid,
  Card,
  Typography, 
  CardContent,
  CircularProgress
} from '@mui/material';

import { useGetProducts } from 'src/hooks/products/useGetProducts';

export function ProductShopView() {
  const { data, isLoading, error } = useGetProducts();

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error al cargar productos</Typography>;

  return (
    <Grid container spacing={3}>
      {data?.products.items.map((product) => (
        <Card key={product.id}>
          <CardContent>
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              SKU: {product.sku}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}