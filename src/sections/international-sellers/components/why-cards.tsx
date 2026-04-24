'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

const ITEMS = [
  {
    title: 'Enter The Colombian\nMarket Without\nEstablishing A Local Entity',
    icon: 'colombian-market.svg',
  },
  {
    title: 'Eliminate Operational\nAnd Regulatory\nComplexity',
    icon: 'regulatory-complexity.svg',
  },
  {
    title: 'Reach Colombian End\nCustomers Through A\nManaged Marketplace',
    icon: 'managed-markedplace.svg',
  },
  {
    title: 'Scale Your Sales Volume\nWith A Predictable And\nControlled Model',
    icon: 'controlled-model.svg',
  },
];

export default function WhyCards() {
  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        px: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1000,
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ mt: 3, mb: 10 }}>
          <Typography
            sx={{
              color: 'grey.300',
              fontSize: { xs: '0.725rem', md: '1rem' },
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}
          >
            Why Sell With MITI‑MITI
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            alignItems: 'stretch',
          }}
        >
          {ITEMS.map((it, i) => (
            <Card
              key={i}
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: 2,
                height: '100%',
                minHeight: { xs: 220, md: 250 },
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              <Box
                component="img"
                src={`/assets/icons/components/${it.icon}`}
                alt={it.title.split('\n')[0] + ' icon'}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 44,
                  height: 44,
                  display: 'block',
                  objectFit: 'contain',
                  bg: 'transparent',
                  m: 1
                }}
              />

              <Box>
                <Typography
                  sx={{
                    color: 'grey.100',
                    textAlign: 'left',
                    fontWeight: 400,
                    lineHeight: 1.15,
                    fontSize: { xs: '1.25rem', md: '1.8rem' },
                    whiteSpace: 'pre-line',
                  }}
                >
                  {it.title}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
