'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { toast } from 'src/components/snackbar';

export default function Hero() {
  const [values, setValues] = useState({ name: '', email: '', phone: '' });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((s) => ({ ...s, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!values.name.trim() || !values.email.trim()) {
      toast.error('Por favor completa Nombre y Email.');
      return;
    }
    if (!consent) {
      toast.error('Por favor acepta el tratamiento de datos personales.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Error en envío');
      setValues({ name: '', email: '', phone: '' });
      setConsent(false);
      toast.success('Solicitud enviada, gracias.');
    } catch (err: any) {
      toast.error(err?.message ?? 'No se pudo enviar');
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#363636',
      borderRadius: '7px',
      color: 'common.white',
      height: { xs: 56, md: 72 },
      fontSize: { xs: 14, md: 15 },
      '& fieldset': { borderColor: '#878787' },
      '&:hover fieldset': { borderColor: '#aaa' },
      '&.Mui-focused fieldset': { borderColor: '#ccc' },
      '& input': { color: 'common.white' },
      '& input::placeholder': { color: 'rgba(255,255,255,0.55)', opacity: 1 },
    },
  } as const;

  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 'auto', md: 820 },
        bgcolor: '#292929',
        color: 'common.white',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: "url('/assets/images/international/bg-banner.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left center',
          backgroundSize: 'cover',
          opacity: 0.7,
        }}
      />

      {/* Logo — absolute top-left */}
      <Box
        component="img"
        src="/assets/images/logo/miti-miti.svg"
        alt="MITI‑MITI"
        sx={{
          position: 'absolute',
          top: { xs: 16, md: 30 },
          left: { xs: 20, md: 100 },
          height: { xs: 20, md: 28 },
          width: 'auto',
          display: 'block',
          zIndex: 6,
        }}
      />

      {/* Login button — absolute top-right */}
      <Link
        href="/auth/sign-in"
        underline="none"
        sx={{
          position: 'absolute',
          top: { xs: 12, md: 26 },
          right: { xs: 16, md: 48 },
          zIndex: 6,
          display: 'inline-block',
          color: 'common.white',
          border: '1px solid rgba(255,255,255,0.7)',
          px: { xs: 2.5, md: 3 },
          py: { xs: 0.75, md: 0.75 },
          borderRadius: '20px',
          fontSize: { xs: 13, md: 15 },
          lineHeight: 1.8,
          '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
        }}
      >
        Login
      </Link>

      {/* Main two-column content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 1440,
          mx: 'auto',
          px: { xs: 3, md: '100px' },
          pt: { xs: 14, md: '233px' },
          pb: { xs: 8, md: '80px' },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 6, md: 6 },
          alignItems: 'flex-start',
        }}
      >
        {/* Left: Title + Description */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '0 0 46%' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontWeight: 1000,
              color: 'common.white',
              WebkitTextStroke: '1.8px rgba(240,240,240,0.98)',
              textShadow: '0 0 0.5px rgba(240,240,240,0.95), 0 0 0.5px rgba(240,240,240,0.95)',
              paintOrder: 'stroke fill',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              fontSize: { xs: '2.2rem', sm: '2.6rem', md: '3.8rem', lg: '5rem' },
              lineHeight: 1,
              mb: { xs: 3, md: 4 },
              maxWidth: { md: 853 },
            }}
          >
            Sell Your Products in Colombia with MITI‑MITI®
          </Typography>

          <Typography
            sx={{
              color: '#f5f5f5',
              fontSize: { xs: 13, md: 15 },
              lineHeight: 1.65,
              maxWidth: 438,
            }}
          >
            If you are a supplier based in Mainland China, MITI‑MITI® helps you sell to
            international customers without dealing with complex import procedures, logistics, or
            cross‑border operations.
          </Typography>
        </Box>

        {/* Right: Form */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '0 0 50%' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            sx={{
              color: 'common.white',
              fontSize: { xs: 14, md: 18 },
              mb: { xs: 2.5, md: 3 },
            }}
          >
            Focus on your products. We handle the rest.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}
          >
            <TextField
              placeholder="Name"
              value={values.name}
              onChange={handleChange('name')}
              fullWidth
              variant="outlined"
              sx={inputSx}
            />
            <TextField
              placeholder="E-mail"
              value={values.email}
              onChange={handleChange('email')}
              fullWidth
              variant="outlined"
              sx={inputSx}
            />
            <TextField
              placeholder="Cellphone"
              value={values.phone}
              onChange={handleChange('phone')}
              fullWidth
              variant="outlined"
              sx={inputSx}
            />

            <FormControlLabel
              sx={{ mt: 0.5 }}
              control={
                <Checkbox
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  sx={{
                    color: '#d9d9d9',
                    '&.Mui-checked': { color: '#d9d9d9' },
                  }}
                />
              }
              label={
                <Typography sx={{ color: '#d9d9d9', fontSize: { xs: 13, md: 14 } }}>
                  I consent to the processing of my personal data.
                </Typography>
              }
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 1, md: 1.5 } }}>
              <Button
                type="submit"
                disabled={loading}
                sx={{
                  color: 'common.white',
                  border: '1px solid rgba(255,255,255,1)',
                  background: 'transparent',
                  px: { xs: 6, md: 10 },
                  py: { xs: 1.5, md: 1.8 },
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: { xs: 16, md: 18 },
                  fontWeight: 700,
                  minWidth: 200,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                  '&.Mui-disabled': {
                    color: 'rgba(255,255,255,0.5)',
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                {loading ? 'Enviando…' : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom gradient fade */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -1,
          height: { xs: 80, md: 140 },
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(34,34,34,0) 0%, rgba(34,34,34,1) 80%)',
        }}
      />
    </Box>
  );
}
