'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

const BLOCKS = [
  { title: 'No local entity required', icon: '🌐' },
  { title: 'We manage customs', icon: '⚙️' },
  { title: 'Local fulfillment', icon: '📦' },
  { title: 'Customer support', icon: '📞' },
];

export default function Benefits() {
  return (
    <Grid container spacing={2}>
      {BLOCKS.map((b, i) => (
        <Grid
          key={i}
          size={{
            xs: 12, md: 6
          }}
        >
          <Card sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ fontSize: 26 }}>{b.icon}</Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{b.title}</Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
