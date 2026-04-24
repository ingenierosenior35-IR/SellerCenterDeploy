'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

const ITEMS = [
  { title: 'Direct Access To The Colombian Market' },
  { title: 'No need to manage customs, imports, or local logistics' },
  { title: 'End-to-end order fulfillment handled by MITI-MITI®' },
];

export default function Features() {
  return (
    <Box
      component="section"
      sx={{
        mt: { xs: 6, md: 8 },
        display: 'flex',
        justifyContent: 'center',
        px: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          boxSizing: 'border-box',
          display: 'grid',
          gap: { xs: 2.5, md: 4 },
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          alignItems: 'stretch', // hace que las cards llenen la altura de la fila
        }}
      >
        {ITEMS.map((it, idx) => (
          <Card
            key={idx}
            sx={{
              width: '100%',
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.02)',
              borderRadius: 1,
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 200, md: 240 }, // altura consistente por tarjeta
              p: { xs: 3, md: 4 },
              boxSizing: 'border-box',
            }}
          >
            <Typography
              sx={{
                color: 'grey.100',
                textAlign: 'left',
                fontWeight: 400,
                lineHeight: 1.2,
                fontSize: { xs: '1.125rem', md: '1.4rem' },
              }}
            >
              {it.title}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
