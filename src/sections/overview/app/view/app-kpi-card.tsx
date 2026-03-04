'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Badge from '@mui/material/Badge';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { fPercent, fCurrency } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

const MONTHS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Props = {
  readonly title?: string;
  readonly total: number;
  readonly percent: number;
  readonly series: number[];
  readonly showPeriod?: boolean;
  readonly transparentCard?: boolean;
};

export function AppKpiCard({
  title,
  total,
  percent,
  series,
  showPeriod = false,
  transparentCard = false,
}: Props) {
  const theme = useTheme();
  const isPositive = percent >= 0;

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
    xaxis: { categories: MONTHS },
    stroke: { width: 2 },
    tooltip: {
      y: { formatter: (value) => fCurrency(value), title: { formatter: () => '' } },
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
        <Typography variant="subtitle2" color={transparentCard ? "common.white" : "common.black"} sx={{ fontWeight: 400 }}>
          {title}
        </Typography>

        {showPeriod ? (
          <Typography variant="subtitle2" color={transparentCard ? "common.white" : "common.black"}>
            Periodo:{' '}
            <Box component="span" sx={{ fontSize: 12, fontWeight: 400, color: 'common.white' }}>
              Hoy
            </Box>
          </Typography>
        ) : (
          <Link underline="hover" sx={{ typography: 'subtitle2' }}>
            Ver detalle
          </Link>
        )}
      </Box>

      {/* Total */}
      <Typography variant="h4" color={transparentCard ? "common.white" : "common.black"} sx={{ mb: 0.5 }}>
        {fCurrency(total)}
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
        <Badge 
          component="div"
          color={isPositive ? "success" : "error"} 
          badgeContent={fPercent(percent)} 
          sx={{ left: 16, mr: 5 }}
        />
        <Box component="span" color={transparentCard ? "common.white" : "common.black"} sx={{ fontWeight: 400, fontSize: 12 }}>
          Últimos 7 días
        </Box>
      </Box>

      {/* Reference */}
      <Typography
        variant="caption"
        color={transparentCard ? "common.white" : "common.black"}
        sx={{ mt: 1, display: 'block' }}
      >
        $15.000.000
      </Typography>

      {/* Chart */}
      <Chart
        type="line"
        series={[{ data: series }]}
        options={chartOptions}
        sx={{ height: 120 }}
      />
    </Card>
  );
}
