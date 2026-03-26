'use client';

import { useTabs } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';
import { useGetProductDetailsById } from 'src/actions/product/use-get-product-details-by-id';

import { ErrorContent } from 'src/components/error-content';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductDetailsToolbar } from '../components/product-detail-view/product-details-toolbar';
import { ProductDetailsSummary } from '../components/product-detail-view/product-details-summary';
import { ProductDetailsCarousel } from '../components/product-detail-view/product-details-carousel';
import { ProductDetailsDescription } from '../components/product-detail-view/product-details-description';

// ----------------------------------------------------------------------

type Props = Readonly<{ id: number }>;

export function ProductDetailsView({ id }: Props) {
  const { translate } = useTranslate();
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
          title={translate('productDetails', 'errors.notAvailable.title')}
          description={translate('productDetails', 'errors.notAvailable.description')}
        />
      </HomeContent>
    );
  }

  if (!product) {
    return (
      <HomeContent sx={{ pt: 5 }}>
        <ErrorContent
          title={translate('productDetails', 'errors.notFound.title')}
          description={`${translate('productDetails', 'errors.notFound.description')} ${id}`}
        />
      </HomeContent>
    );
  }

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={String(translate('productDetails', 'heading'))}
        links={[
          { name: String(translate('sidebarMenu', 'home.title')), href: paths.home.root },
          { name: String(translate('sidebarMenu', 'myProducts.title')), href: paths.product.root },
          { name: product.name },
        ]}
        sx={{ mb: { xs: 3, md: 4 } }}
      />

      <ProductDetailsToolbar publish={publish} onChangePublish={handleChangePublish} product={product} />

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
          <Tab value="description" label={translate('productDetails', 'tabs.description')} />
        </Tabs>

        {tabs.value === 'description' && <ProductDetailsDescription description={product.description} />}
      </Card>
    </HomeContent>
  );
}
