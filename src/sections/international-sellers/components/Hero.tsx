'use client';

import { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

export default function Hero() {
  const maxTitleWidth = 1280;
  const backgrounds = [
    "url('/assets/images/international/bg-banner.png')",
  ];

  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const iconRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [iconWidth, setIconWidth] = useState<number>(72); // fallback ancho del icono
  const iconSize = 72; // tamaño de referencia en desktop (px)
  const gapBetween = 134; // px de separación entre texto e icono

  const measureTitle = useCallback(() => {
    const titleEl = titleRef.current as HTMLElement | null;
    if (!titleEl) return;
    const rect = titleEl.getBoundingClientRect();
    const w = Math.min(Math.round(rect.width), maxTitleWidth);
    setContainerWidth(w);
  }, [maxTitleWidth]);

  const measureIcon = useCallback(() => {
    const el = iconRef.current as HTMLElement | null;
    if (!el) return;
    const w = el.getBoundingClientRect().width;
    setIconWidth(Math.round(w || iconSize));
  }, [iconSize]);

  useLayoutEffect(() => {
    measureTitle();
    measureIcon();
  }, [measureTitle, measureIcon]);

  useEffect(() => {
    const onResize = () => requestAnimationFrame(() => { measureTitle(); measureIcon(); });
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    if (document && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { measureTitle(); measureIcon(); }).catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [measureTitle, measureIcon]);

  const descriptionPr = `${iconWidth + gapBetween}px`;
  const iconFontSize = Math.round(iconSize * 0.42);

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        width: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        minHeight: { xs: 360, md: 560 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundImage: backgrounds.join(', '),
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: 'center center, left center',
        backgroundSize: 'cover, contain',
        bgcolor: '#0B0B0C00',
        color: 'common.white',
        px: { xs: 2, md: 0 },
        py: { xs: 4, md: 8 },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: 'linear-gradient(180deg, rgba(11,11,12,0), rgba(11,11,12,0))',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          zIndex: 6,
          top: { xs: 6, sm: 8, md: 6 },
          left: {
            xs: 12,
            sm: 16,
            md: `calc(50% - ${maxTitleWidth / 2}px + 24px)`,
          },
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src="/assets/images/logo/miti-miti.svg"
          alt="MITI‑MITI"
          sx={{
            height: { xs: 18, sm: 14, md: 24 },
            width: 'auto',
            display: 'block',
            m: 1.5,
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box
            ref={containerRef}
            sx={{
              width: containerWidth ? `${containerWidth}px` : `${maxTitleWidth}px`,
              maxWidth: `${maxTitleWidth}px`,
              position: 'relative',
              display: 'block',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Typography
                sx={{
                  maxWidth: 520,
                  color: 'grey.300',
                  fontSize: { xs: 12, md: 13 },
                  textAlign: { xs: 'left', md: 'left' },
                  lineHeight: 1.35,
                  pr: { xs: 2, md: descriptionPr },
                }}
              >
                If you are a supplier based in Mainland China, MITI‑MITI® helps you sell to international customers without dealing with complex import procedures, logistics, or cross‑border operations.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Título */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: { xs: 6, md: 6 } }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Typography
              ref={titleRef}
              component="h1"
              sx={{
                fontWeight: 900,
                color: 'common.white',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.6rem', lg: '3.4rem' },
                lineHeight: 1.02,
                textAlign: { xs: 'center', md: 'left' },
                display: 'inline-block',
                maxWidth: `${maxTitleWidth}px`,
                wordBreak: 'break-word',
              }}
            >
              SELL YOUR PRODUCTS IN
              <br />
              COLOMBIA WITH MITI‑MITI®
            </Typography>
          </Box>
        </Box>

        <IconButton
          ref={iconRef}
          aria-label="Scroll to footer"
          onClick={scrollToFooter}
          sx={{
            position: { xs: 'relative', md: 'absolute' },
            right: { md: 0, xs: 'auto' },
            top: { md: '50%', xs: 'auto' },
            transform: { md: 'translateY(-50%)', xs: 'none' },
            mt: { xs: 3, md: 0 }, // menos margen en xs para acercar secciones
            display: 'flex',
            justifyContent: 'center',
            alignSelf: { xs: 'center', md: 'auto' },
            width: { xs: 44, sm: 56, md: iconSize },
            height: { xs: 44, sm: 56, md: iconSize },
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: 'grey.400',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
            boxShadow: '0 4px 18px rgba(0,0,0,0.4)',
            zIndex: 3,
            p: { xs: 0.5, sm: 0.75, md: 0.75 },
          }}
        >
          <Iconify
            icon="ic:baseline-south-east"
            sx={{
              transform: 'rotate(-270deg)',
              fontSize: { xs: 18, sm: 22, md: `${iconFontSize}px` },
            }}
          />
        </IconButton>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -1,
          height: { xs: 80, md: 140 },
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(11,11,12,0) 0%, rgba(34,34,34,1) 80%)',
        }}
      />
    </Box>
  );
}
