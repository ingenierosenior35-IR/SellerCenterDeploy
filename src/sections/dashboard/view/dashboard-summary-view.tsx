'use client';

import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useSellerSummaryDashboard } from 'src/hooks/dashboard/use-seller-summary-dashboard';

import { fNumber, fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function DashboardSummaryView() {
  const { translate } = useTranslate();

  const today = dayjs();
  const defaultFrom = today.subtract(2, 'year');

  const [dateFilters, setDateFilters] = useState<{ fromDate: Dayjs | null; toDate: Dayjs | null }>({
    fromDate: defaultFrom,
    toDate: today,
  });

  const [dateError, setDateError] = useState(false);
  const [appliedDateRange, setAppliedDateRange] = useState({
    fromDate: defaultFrom.format('YYYY-MM-DD'),
    toDate: today.format('YYYY-MM-DD'),
  });

  const { summary, hasLiveData, isLoading } = useSellerSummaryDashboard(appliedDateRange);

  const handleStartDate = useCallback((newValue: Dayjs | null) => {
    if (!newValue) return;

    setDateFilters((prev) => {
      const next = { ...prev, fromDate: newValue };
      const hasInvalidRange = Boolean(next.toDate?.isBefore(next.fromDate, 'day'));
      setDateError(hasInvalidRange);

      if (!hasInvalidRange && next.toDate) {
        setAppliedDateRange({
          fromDate: next.fromDate.format('YYYY-MM-DD'),
          toDate: next.toDate.format('YYYY-MM-DD'),
        });
      }

      return next;
    });
  }, []);

  const handleEndDate = useCallback((newValue: Dayjs | null) => {
    if (!newValue) return;

    setDateFilters((prev) => {
      const next = { ...prev, toDate: newValue };
      const hasInvalidRange = Boolean(next.toDate?.isBefore(next.fromDate, 'day'));
      setDateError(hasInvalidRange);

      if (!hasInvalidRange && next.fromDate) {
        setAppliedDateRange({
          fromDate: next.fromDate.format('YYYY-MM-DD'),
          toDate: next.toDate.format('YYYY-MM-DD'),
        });
      }

      return next;
    });
  }, []);

  const fallbackSummaryData = {
    sales_account: { total_sales: 0, total_returns: 0 },
    orders_account: {
      created_orders: 0,
      pending_payment_orders: 0,
      pending_return_orders: 0,
      canceled_orders: 0,
      returned_orders: 0,
    },
    products_account: {
      created_products: 0,
      active_products: 0,
      inactive_products: 0,
      pending_approval_products: 0,
      out_of_stock_products: 0,
    },
    logistics_account: {
      pending_shipment_orders: 0,
      shipped_orders: 0,
      delivered_orders: 0,
    },
    reputation_account: {
      reviews_count: 0,
      stars_count: 0,
    },
  };

  const showPlaceholder = isLoading || !hasLiveData;
  const summaryData = summary.data ?? fallbackSummaryData;
  const selectedDays = Math.max(
    dayjs(appliedDateRange.toDate).diff(dayjs(appliedDateRange.fromDate), 'day') + 1,
    1
  );
  const selectedDaysLabel = `Últimos ${selectedDays} ${selectedDays === 1 ? 'día' : 'días'}`;

  const summaryCards = [
    {
      title: translate('dashboardModule.summary.cards.sales'),
      path: paths.order.root,
      icon: 'solar:tag-horizontal-bold-duotone',
      value: showPlaceholder ? '0' : fCurrency(summaryData.sales_account.total_sales),
    },
    {
      title: translate('dashboardModule.summary.cards.orders'),
      path: paths.order.root,
      icon: 'solar:cart-3-bold',
      value: showPlaceholder ? '0' : fNumber(summaryData.orders_account.created_orders),
    },
    {
      title: translate('dashboardModule.summary.cards.products'),
      path: paths.product.root,
      icon: 'solar:list-bold',
      value: showPlaceholder ? '0' : fNumber(summaryData.products_account.created_products),
    },
    {
      title: translate('dashboardModule.summary.cards.logistics'),
      path: paths.return.root,
      icon: 'solar:ssd-round-bold',
      value: showPlaceholder ? '0' : fNumber(summaryData.logistics_account.pending_shipment_orders),
    },
    {
      title: translate('dashboardModule.summary.cards.reputation'),
      path: paths.feedback.root,
      icon: 'solar:cup-star-bold',
      value: showPlaceholder ? '0' : `${fNumber(summaryData.reputation_account.stars_count)}%`,
    },
  ] as const;

  const topMetrics = [
    {
      title: translate('dashboardModule.summary.metrics.grossSales.title'),
      value: showPlaceholder ? '$ 0' : fCurrency(summaryData.sales_account.total_sales),
      subtitle: selectedDaysLabel,
      icon: 'solar:tag-horizontal-bold-duotone',
    },
    {
      title: translate('dashboardModule.summary.metrics.orders.title'),
      value: showPlaceholder ? '0' : fNumber(summaryData.orders_account.created_orders),
      subtitle: translate('dashboardModule.summary.metrics.orders.subtitle'),
      icon: 'solar:cart-3-bold',
    },
    {
      title: translate('dashboardModule.summary.metrics.products.title'),
      value: showPlaceholder ? '0' : fNumber(summaryData.products_account.created_products),
      subtitle: translate('dashboardModule.summary.metrics.products.subtitle'),
      icon: 'solar:list-bold',
    },
  ] as const;

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={translate('sidebarMenu.dashboard.title')}
        links={[
          { name: translate('breadcrumbs.home'), href: paths.home.root },
          { name: translate('sidebarMenu.dashboard.title') },
        ]}
        sx={{ mb: { xs: 2, md: 3 } }}
      />

      <Card variant="outlined" sx={{ p: { xs: 2, md: 2.25 }, mb: 2.5 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{ xs: 12, md: 12, lg: 4 }}
            sx={{
              borderBottom: { xs: (theme) => `1px solid ${theme.palette.divider}`, lg: 0 },
              pb: { xs: 2, lg: 0 },
              mb: { xs: 1, lg: 0 },
              borderRight: { lg: (theme) => `1px solid ${theme.palette.divider}` },
              pr: { lg: 2.5 },
            }}
          >
            <Stack spacing={1.25} sx={{ width: 1 }}>
              <DatePicker
                label={translate('dashboardModule.summary.filters.initialDate')}
                value={dateFilters.fromDate}
                onChange={handleStartDate}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: 'small',
                  },
                }}
                sx={{ width: 1 }}
              />

              <DatePicker
                label={translate('dashboardModule.summary.filters.finalDate')}
                value={dateFilters.toDate}
                onChange={handleEndDate}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: 'small',
                    error: dateError,
                    helperText: dateError ? translate('dashboardModule.summary.filters.invalidRange') : null,
                  },
                }}
                sx={{ width: 1 }}
              />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 12, lg: 8 }}>
            <Grid container rowSpacing={2} columnSpacing={{ xs: 2, md: 2, lg: 1 }}>
              {topMetrics.map((metric) => (
                <Grid key={metric.title} size={{ xs: 12, md: 4 }} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'primary.lighter',
                        color: 'primary.main',
                      }}
                    >
                      <Iconify icon={metric.icon} width={18} />
                    </Avatar>
                    <Stack spacing={0.25}>
                      <Typography variant="caption" color="text.secondary">
                        {metric.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {metric.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {metric.subtitle}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2, md: 2.5 },
          gridTemplateColumns: {
            xs: 'repeat(1, minmax(0, 1fr))',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        {summaryCards.map((card) => (
          <Card
            key={card.title}
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              borderColor: 'divider',
              background: 'background.paper',
              transition: (theme) =>
                theme.transitions.create(['transform', 'box-shadow', 'border-color'], {
                  duration: theme.transitions.duration.shorter,
                }),
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: (theme) => theme.shadows[6],
                borderColor: 'primary.main',
              },
            }}
          >
              <CardActionArea
                component={RouterLink}
                href={card.path}
                sx={{
                  px: { xs: 2.25, md: 2.5 },
                  py: { xs: 2, md: 2.25 },
                  minHeight: { xs: 156, md: 172 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
                aria-label={card.title}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 30,
                        height: 30,
                        color: 'primary.main',
                        bgcolor: 'primary.lighter',
                      }}
                    >
                      <Iconify icon={card.icon} width={16} />
                    </Avatar>

                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {card.title}
                    </Typography>
                  </Stack>

                  {showPlaceholder && (
                    <Typography variant="subtitle2" color="text.secondary">
                      {translate('dashboardModule.summary.upcoming')}
                    </Typography>
                  )}
                </Stack>

                <Stack spacing={0.75}>
                  <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1 }}>
                    {card.value}
                  </Typography>

                  {showPlaceholder && (
                    <Chip
                      size="small"
                      color="default"
                      label={translate('dashboardModule.summary.upcoming')}
                      sx={{ width: 'fit-content', borderRadius: 1.5 }}
                    />
                  )}
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'primary.main' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {translate('dashboardModule.summary.detail')}
                  </Typography>
                  <Iconify icon="eva:arrow-ios-forward-fill" width={14} />
                </Stack>
              </CardActionArea>
          </Card>
        ))}
      </Box>
    </HomeContent>
  );
}
