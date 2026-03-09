'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const STEPS = [
  {
    titleLine1: 'Register as',
    titleLine2: 'a supplier',
    desc: 'Submit your company information and export‑ready products from Mainland China.',
    img: '/assets/images/international/how-1.png',
  },
  {
    titleLine1: 'We sell in',
    titleLine2: 'Colombia',
    desc: 'MITI‑MITI® publishes your catalog and manages pricing, promotions and customer interactions.',
    img: '/assets/images/international/how-2.png',
  },
  {
    titleLine1: 'We deliver to',
    titleLine2: 'the customer',
    desc: 'We handle customs clearance, international transport and last‑mile delivery in Colombia.',
    img: '/assets/images/international/how-3.png',
  },
];

export default function HowItWorks() {
  const maxContentWidth = 1280;
  const stepGap = { xs: 8, md: 12 };

  return (
    <Box
      component="section"
      sx={{
        width: '100vw',
        left: '50%',
        transform: 'translateX(-50%)',
        position: 'relative',
        bgcolor: '#f5f5f5',
        py: { xs: 6, md: 12 },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: `${maxContentWidth}px`, mx: 'auto', px: { xs: 3, md: 5 } }}>
        <Typography
          sx={{
            color: '#111',
            mb: { xs: 4, md: 10 },
            textAlign: 'left',
            fontWeight: 800,
            fontSize: { xs: '0.975rem', md: '1.05rem' },
            letterSpacing: '0.06em',
          }}
        >
          How MITI‑MITI® Works
        </Typography>

        {STEPS.map((s, i) => (
          <Box key={s.titleLine1 + s.titleLine2} sx={{ mb: i < STEPS.length - 1 ? stepGap : 0, position: 'relative', overflow: 'visible' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid
                size={{
                  xs: 12,
                  md: 7
                }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography
                    component="div"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.6rem' },
                      lineHeight: 1.02,
                      mb: 1,
                      color: '#111',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    <Box component="span" display="block">
                      {s.titleLine1.toUpperCase()}
                    </Box>
                    <Box component="span" display="block">
                      {s.titleLine2.toUpperCase()}
                    </Box>
                  </Typography>

                  <Typography sx={{ color: '#555', lineHeight: 1.9, maxWidth: 720, mt: 1, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                    {s.desc}
                  </Typography>
                </Box>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 5,
                }}
              >
                <Box sx={{ height: { xs: 0, md: 0 } }} />
              </Grid>
            </Grid>

            <Box
              sx={{
                position: { xs: 'relative', md: 'absolute' },
                right: { xs: 0, md: 0 },
                top: { xs: 'auto', md: '50%' },
                transform: { xs: 'none', md: 'translateY(-50%)' },
                width: { xs: '100%', sm: '86%', md: 360 },
                height: { xs: 92, md: 112 }, // caja gris alturas originales
                bgcolor: '#e6e6e6',
                borderRadius: 2,
                overflow: 'visible',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pl: { xs: 2, md: 3 },
                pr: { xs: 2, md: 4 },
                zIndex: 2,
                mx: { xs: 'auto', md: 0 },
                mt: { xs: 4, md: 0 },
                boxSizing: 'border-box',
                positionStyle: 'relative',
              }}
            >

              <Box
                component="img"
                src={s.img}
                alt={`${s.titleLine1} ${s.titleLine2}`}
                sx={{
                  position: 'absolute',
                  left: { xs: '62%', sm: '66%', md: '68%' },
                  bottom: 0, // bottom edge of image aligned with bottom of grey box
                  transform: 'translateX(-50%)',
                  height: { xs: 150, sm: 130, md: 150 }, // responsive image heights
                  width: 'auto',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                  borderRadius: 2,
                }}
              />
            </Box>

            {i < STEPS.length - 1 && (
              <Box sx={{ mt: { xs: 6, md: 8 }, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Box sx={{ height: 1.5, bgcolor: '#919191', width: '100%', position: 'relative' }} />

                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: '#000',
                    borderRadius: '50%',
                    position: 'absolute',
                    left: 0,
                    transform: 'translate(-50%, -50%)',
                    top: '50%',
                  }}
                />

                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: '#000',
                    borderRadius: '50%',
                    position: 'absolute',
                    right: 0,
                    transform: 'translate(50%, -50%)',
                    top: '50%'
                  }}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
