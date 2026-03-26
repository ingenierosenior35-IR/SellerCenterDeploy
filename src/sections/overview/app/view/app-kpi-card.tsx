'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Badge from '@mui/material/Badge';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fPercent, fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Chart, useChart } from 'src/components/chart';

const MONTHS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Props = {
  readonly title?: string;
  readonly total: number;
  readonly percent?: number;
  readonly series: number[];
  readonly showPeriod?: boolean;
  readonly transparentCard?: boolean;
  readonly monthlyData?: string[];
  readonly typeTotal?: "text" | "value";
};

export function AppKpiCard({
  title,
  total,
  percent,
  series,
  showPeriod = false,
  transparentCard = false,
  monthlyData,
  typeTotal
}: Props) {
  const { translate } = useTranslate();

  const theme = useTheme();
  const isPositive = percent && percent >= 0;

  let chartColor: string;
  if (transparentCard) {
    chartColor = theme.palette.common.white;
  } else if (isPositive) {
    chartColor = theme.palette.success.main;
  } else {
    chartColor = theme.palette.error.main;
  }

  const chartOptions = useChart({
    colors: [chartColor],
    xaxis: { categories: monthlyData || MONTHS },
    stroke: { width: 2 },
    tooltip: {
      y: {
        formatter: (value) => (typeTotal === 'text' ? String(value) : fCurrency(value)),
        title: { formatter: () => '' },
      },
    },
  });

  return (
    <Card sx={{ p: 3, backgroundColor: transparentCard ? 'transparent' : 'background.paper' }}>
      {/* Header */}
      <Box
        sx={{
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="subtitle2"
          color={transparentCard ? 'common.white' : 'common.black'}
          sx={{ fontWeight: 400 }}
        >
          {title}
        </Typography>

        {showPeriod && (
          <Typography variant="subtitle2" color={transparentCard ? 'common.white' : 'common.black'}>
            {translate('dashboardModule.averageOrderValue.period.title')}{' '}
            <Box component="span" sx={{ fontSize: 12, fontWeight: 400, color: 'common.white' }}>
              {translate('dashboardModule.averageOrderValue.period.options.day')}
            </Box>
          </Typography>
        )}
      </Box>

      {/* Total */}
      <Typography
        variant="h4"
        color={transparentCard ? 'common.white' : 'common.black'}
        sx={{ mb: 0.5 }}
      >
        {typeTotal === "text" ? total : fCurrency(total)}
      </Typography>

      {/* Variación */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          typography: 'subtitle2',
          color: isPositive ? 'success.main' : 'error.main',
        }}
      >
        {percent && (
          <Badge
            component="div"
            color={isPositive ? 'success' : 'error'}
            badgeContent={percent ? fPercent(percent) : ''}
            sx={{ left: 16, mr: 5 }}
          />
        )}
        <Box
          component="span"
          color={transparentCard ? 'common.white' : 'common.black'}
          sx={{ fontWeight: 400, fontSize: 12 }}
        >
          {translate('dashboardModule.body.last')} 7{' '}
          {translate('dashboardModule.body.period.options.days')}
        </Box>
      </Box>

      {/* Chart */}
      <Chart
        type="line"
        series={[{ data: series }]}
        options={chartOptions}
        sx={{ height: 'fit-content' }}
      />
    </Card>
  );
}
