'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export default function MiddlePanel() {
  const sectionHeightMd = 600; // altura de referencia para desktop

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        m: 0,
        p: 0,
        minHeight: { md: `${sectionHeightMd}px` },
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            minHeight: { xs: 'auto', md: `${sectionHeightMd}px` },
            backgroundImage:
              "url('/assets/images/international/content-you-sell.jpg'), linear-gradient(180deg, rgba(6,6,6,0.12), rgba(6,6,6,0.12))",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            display: 'flex',
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: { xs: 'center', md: 'center' },
            boxSizing: 'border-box',
            p: { xs: 4, md: 8 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 680,
              mx: { xs: 'auto', md: '0' },
              ml: { md: 10 }, // original desktop offset
              boxSizing: 'border-box',
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: { xs: 13, md: 14 }, mb: 1, textAlign: { xs: 'center', md: 'left' } }}>
              We provide our customer the finest service available
            </Typography>

            <Typography
              sx={{
                fontWeight: 400,
                color: 'common.white',
                fontSize: { xs: '1rem', md: '2.2rem' },
                lineHeight: 1.3,
                mb: 4,
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              You Sell.
              <br />
              We Handle The Entire Operation.
            </Typography>

            <Typography sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.95)', mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
              MITI‑MITI® Manages:
            </Typography>

            <Box sx={{ color: 'rgba(255,255,255,0.92)', mt: 1, display: 'flex', flexDirection: 'column', gap: 3.5, alignItems: { xs: 'center', md: 'flex-start' } }}>
              <Typography sx={{ fontSize: { xs: 18, md: 20 }, lineHeight: 1.5, textAlign: { xs: 'center', md: 'left' } }}>
                Colombian customs clearance
                <br />
                and import documentation
              </Typography>

              <Typography sx={{ fontSize: { xs: 18, md: 20 }, lineHeight: 1.5, textAlign: { xs: 'center', md: 'left' } }}>
                International shipping and
                <br />
                domestic delivery in Colombia
              </Typography>

              <Typography sx={{ fontSize: { xs: 18, md: 20 }, lineHeight: 1.5, textAlign: { xs: 'center', md: 'left' } }}>
                Customer service, returns,
                <br />
                and after‑sales support
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            minHeight: { xs: 'auto', md: `${sectionHeightMd}px` },
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
            <Box
              sx={{
                bgcolor: '#f3f3f3',
                px: { xs: 3, md: 4 },
                py: { xs: 3, md: 0 },
                flex: { xs: '0 0 auto', md: 1 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: { xs: 'center', md: 'flex-start' },
                borderBottom: { md: '1px solid rgba(0,0,0,0.04)' },
                width: '100%',
                boxSizing: 'border-box',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              <Typography sx={{ fontWeight: 1000, fontSize: { xs: 16, md: 17 }, color: '#111', mb: { xs: 2, md: 7 }, textAlign: { xs: 'center', md: 'left' } }}>
                You Only Need To:
              </Typography>

              <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 500, color: '#111', lineHeight: 1.15, textAlign: { xs: 'center', md: 'left' } }}>
                Provide Basic Company
                <br />
                Documentation
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: '#fafafa',
                px: { xs: 3, md: 4 },
                py: { xs: 3, md: 0 },
                flex: { xs: '0 0 auto', md: 1 },
                display: 'flex',
                alignItems: { xs: 'center', md: 'center' },
                justifyContent: { xs: 'center', md: 'flex-start' },
                borderBottom: { md: '1px solid rgba(0,0,0,0.04)' },
                width: '100%',
                boxSizing: 'border-box',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 500, color: '#111', lineHeight: 1.15, textAlign: { xs: 'center', md: 'left' } }}>
                Be legally established
                <br />
                in Mainland China
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: '#f3f3f3',
                px: { xs: 3, md: 4 },
                py: { xs: 3, md: 0 },
                flex: { xs: '0 0 auto', md: 1 },
                display: 'flex',
                alignItems: { xs: 'center', md: 'center' },
                justifyContent: { xs: 'center', md: 'flex-start' },
                width: '100%',
                boxSizing: 'border-box',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 500, color: '#111', lineHeight: 1.15, textAlign: { xs: 'center', md: 'left' } }}>
                Offer competitive
                <br />
                products suitable for
                <br />
                the Colombian market
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
