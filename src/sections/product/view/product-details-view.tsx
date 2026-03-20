'use client';

import { useTabs } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { HomeContent } from 'src/layouts/home';
import { useGetProductDetailsById } from 'src/actions/product/useGetProductDetailsById';

import { ErrorContent } from 'src/components/error-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductDetailsToolbar } from '../product-details-toolbar';
import { ProductDetailsSummary } from '../product-details-summary';
import { ProductDetailsCarousel } from '../product-details-carousel';
import { ProductDetailsDescription } from '../product-details-description';

// ----------------------------------------------------------------------

type Props = Readonly<{ id: number }>;

export function ProductDetailsView({ id }: Props) {
  const tabs = useTabs('description');

  const { product, isLoading, isError } = useGetProductDetailsById(id);

  const [publish, setPublish] = useState('published');

  useEffect(() => {
    if (product) {
      setPublish('published');
    }
  }, [product]);

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <HomeContent sx={{ pt: 5 }}>
        <ErrorContent
          title="Producto no disponible"
          description="No pudimos cargar el producto en este momento. Por favor intenta más tarde."
        />
      </HomeContent>
    );
  }

  if (!product) {
    return (
      <HomeContent sx={{ pt: 5 }}>
        <ErrorContent
          title="Producto no encontrado"
          description={`No se encontró ningún producto con id: ${id}`}
        />
      </HomeContent>
    );
  }

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading="Product Details"
        links={[
          { name: 'Home', href: paths.product.root },
          { name: 'My products', href: paths.product.root },
          { name: product.name },
        ]}
        sx={{ mb: { xs: 3, md: 4 } }}
      />

      <ProductDetailsToolbar
        publish={publish}
        onChangePublish={handleChangePublish}
        product={product}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <ProductDetailsCarousel images={product.images} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <ProductDetailsSummary product={product} />
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={[
            (theme) => ({
              px: 3,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        >
          <Tab value="description" label="Descripción" />
        </Tabs>

        {tabs.value === 'description' && (
          <ProductDetailsDescription description={product.description} />
        )}
      </Card>
    </HomeContent>
  );
}
