'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

export default function CTAForm() {
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '' });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((s) => ({ ...s, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(false);

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
      setSent(true);
      setValues({ name: '', email: '', phone: '', message: '' });
      setConsent(false);
      toast.success('Solicitud enviada, gracias.');
    } catch (err: any) {
      toast.error(err?.message ?? 'No se pudo enviar');
    } finally {
      setLoading(false);
    }
  };

  const maxContentWidth = 1280;

  return (
    <Box component="section" sx={{ width: '100%', boxSizing: 'border-box' }}>
      <Box
        component="header"
        sx={{
          position: 'relative',
          width: '100vw', // full viewport width
          left: '50%',
          transform: 'translateX(-50%)',
          minHeight: { xs: 420, md: 520 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundImage:
            "linear-gradient(180deg, rgba(34,34,34,0.35), rgba(34,34,34,0.55)), url('/assets/images/international/banner-int.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
          bgcolor: '#222', // background base to match page
          color: 'common.white',
          px: { xs: 2, md: 0 },
          py: { xs: 4, md: 8 },
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -1,
            height: { xs: 120, md: 140 },
            zIndex: 1,
            pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(34,34,34,0) 0%, rgba(34,34,34,1) 80%)',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: `${maxContentWidth}px`, mx: 'auto', textAlign: 'center', px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 5 }}>
            <Box
              component="img"
              src="/assets/images/international/division.svg"
              alt="division"
              sx={{
                display: 'block',
                width: { xs: 120, md: 260 },
                height: 'auto',
                mx: 'auto',
              }}
            />
          </Box>

          <Typography sx={{ color: 'grey.300', mb: 3, fontSize: { xs: 13, md: 18 } }}>
            Focus on your products. We handle the rest.
          </Typography>

          <Typography
            sx={{
              fontWeight: 900,
              color: 'common.white',
              fontSize: { xs: '2.4rem', md: '4.25rem' },
              lineHeight: 1,
              letterSpacing: '-0.02em',
              mb: 3,
            }}
          >
            SELL MADE
            <br />
            SIMPLE
          </Typography>

          <Typography sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 760, mx: 'auto', mb: 4, fontSize: { xs: 13, md: 14 } }}>
            We support you at every stage so you can grow with confidence, maintain control of your operation, and focus on what truly
            matters: taking your business further.
          </Typography>

          {/* arrow in circle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 2, md: 0 } }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.85)',
                mx: 'auto',
              }}
            >
              <Iconify icon="mdi:arrow-down" width={24} height={24} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: '100%', maxWidth: `${maxContentWidth}px`, mx: 'auto', px: { xs: 3, md: 0 }, py: { xs: 6, md: 8 } }}>
        {sent && <Alert severity="success" sx={{ mb: 2 }}>Gracias — nos contactaremos pronto.</Alert>}

        <Box component="form" onSubmit={handleSubmit} id="contact">
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 4 } }}>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                <TextField
                  label="Name"
                  value={values.name}
                  onChange={handleChange('name')}
                  fullWidth
                  variant="filled"
                  InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.03)', color: 'common.white' } }}
                  InputLabelProps={{ sx: { color: 'grey.400' } }}
                />
                <TextField
                  label="E-mail"
                  value={values.email}
                  onChange={handleChange('email')}
                  fullWidth
                  variant="filled"
                  InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.03)', color: 'common.white' } }}
                  InputLabelProps={{ sx: { color: 'grey.400' } }}
                />
                <TextField
                  label="Cellphone"
                  value={values.phone}
                  onChange={handleChange('phone')}
                  fullWidth
                  variant="filled"
                  InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.03)', color: 'common.white' } }}
                  InputLabelProps={{ sx: { color: 'grey.400' } }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Message"
                  value={values.message}
                  onChange={handleChange('message')}
                  fullWidth
                  variant="filled"
                  multiline
                  minRows={8}
                  InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.03)', color: 'common.white', alignItems: 'flex-start' } }}
                  InputLabelProps={{ sx: { color: 'grey.400' } }}
                />
              </Box>
            </Box>

            <Box>
              <FormControlLabel
                control={<Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} sx={{ color: 'grey.400' }} />}
                label={
                  <Typography sx={{ color: 'grey.400', fontSize: 13 }}>
                    I consent to the processing of my personal data.
                  </Typography>
                }
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                disabled={loading}
                sx={{
                  color: 'common.white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'transparent',
                  px: 6,
                  py: 1.5,
                  borderRadius: '30px',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                }}
              >
                {loading ? 'Enviando…' : 'Submit'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
