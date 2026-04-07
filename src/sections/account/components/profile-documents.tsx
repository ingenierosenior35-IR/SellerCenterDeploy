'use client';

import type { ChangeEvent } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';

import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useTranslate } from 'src/locales/langs/i18n';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Errors = {
  cedula: string;
  rut: string;
  certificado: string;
  terms: string;
  submit: string;
};

type Payload = {
  cedulaFile: File | null;
  rutFile: File | null;
  certificadoFile: File | null;
  acceptTerms: boolean;
};

type Props = {
  onSubmit?: (payload: Payload) => Promise<void> | void;
  sx?: SxProps<Theme>;
};

export function ProfileDocuments({ onSubmit, sx, ...other }: Props) {
  const { translate } = useTranslate();
  const cedulaRef = useRef<HTMLInputElement | null>(null);
  const rutRef = useRef<HTMLInputElement | null>(null);
  const certificadoRef = useRef<HTMLInputElement | null>(null);

  const [cedulaFile, setCedulaFile] = useState<File | null>(null);
  const [rutFile, setRutFile] = useState<File | null>(null);
  const [certificadoFile, setCertificadoFile] = useState<File | null>(null);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const [errors, setErrors] = useState<Errors>({
    cedula: '',
    rut: '',
    certificado: '',
    terms: '',
    submit: '',
  });

  const ACCEPT = '.pdf';

  const handleChoose =
    (ref: React.RefObject<HTMLInputElement | null>) => () =>
      ref?.current?.click();

  const handleFileChange =
    (setter: React.Dispatch<React.SetStateAction<File | null>>, fieldKey: keyof Errors) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setter(file);
      setErrors((prev) => ({ ...prev, [fieldKey]: '' }));
    };

  const validate = () => {
    const next: Errors = {
      cedula: '',
      rut: '',
      certificado: '',
      terms: '',
      submit: '',
    };

    if (!cedulaFile) next.cedula = translate('formErrorRequired.documentRequired');
    if (!rutFile) next.rut = translate('formErrorRequired.documentRequired');
    if (!certificadoFile) next.certificado = translate('formErrorRequired.documentRequired');
    if (!acceptTerms) next.terms = translate('formErrorRequired.acceptTyC');

    setErrors(next);
    return !next.cedula && !next.rut && !next.certificado && !next.terms;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload: Payload = {
        cedulaFile,
        rutFile,
        certificadoFile,
        acceptTerms,
      };

      if (onSubmit) {
        await onSubmit(payload);
      }
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        submit:
          err?.message ||
          'Ocurrió un error al registrar. Intenta nuevamente.',
      }));
    }
  };

  const renderRow = (
    label: string,
    file: File | null,
    onChoose: () => void,
    helperError: string
  ) => (
    <Box
      sx={{
        gap: 2,
        display: 'grid',
        alignItems: 'center',
        gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
      }}
    >
      <Box>
        <Typography variant="subtitle2">{label}</Typography>
        {!!file && (
          <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
            {file.name}
          </Typography>
        )}
        {!!helperError && (
          <FormHelperText error sx={{ mt: 0.5 }}>
            {helperError}
          </FormHelperText>
        )}
      </Box>

      <Button
        variant="contained"
        color="white"
        startIcon={<Iconify icon="solar:paperclip-2-bold" />}
        onClick={onChoose}
        sx={{ 
          justifySelf: { xs: 'start', sm: 'end' },
        }}
      >
        {translate('formPlaceholder.btnLoad')}
      </Button>
    </Box>
  );

  return (
    <Card
      sx={[
        { mt: 3 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <CardHeader title={translate('customerProfileViewDocuments.title')} />

      <Stack spacing={2.5} sx={{ p: 3 }}>
        {renderRow(
          translate('customerProfileViewDocuments.sellerIdentification'),
          cedulaFile,
          handleChoose(cedulaRef),
          errors.cedula
        )}

        {renderRow('RUT*', rutFile, handleChoose(rutRef), errors.rut)}

        {renderRow(
          translate('customerProfileViewDocuments.bankCertificate'),
          certificadoFile,
          handleChoose(certificadoRef),
          errors.certificado
        )}

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {translate('customerProfileViewDocuments.allowedFormats')}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <FormControlLabel
          control={
            <Checkbox
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (e.target.checked) {
                  setErrors((p) => ({ ...p, terms: '' }));
                }
              }}
            />
          }
          label={
            <Typography variant="body2">
              {translate('customerProfileViewDocuments.acceptTyC')}{' '}
              <Link
                href="/politica-de-datos"
                target="_blank"
                rel="noopener"
                underline="always"
              >
                {translate('customerProfileViewDocuments.privacyPolicy')}
              </Link>
              .
            </Typography>
          }
        />

        {!!errors.terms && (
          <FormHelperText error sx={{ mt: -1 }}>
            {errors.terms}
          </FormHelperText>
        )}

        {!!errors.submit && (
          <Typography variant="body2" color="error">
            {errors.submit}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!acceptTerms || !cedulaFile || !rutFile || !certificadoFile}
          >
            {translate('formPlaceholder.btnRegister')}
          </Button>
        </Box>
      </Stack>

      {/* Inputs ocultos */}
      <input
        ref={cedulaRef}
        type="file"
        accept={ACCEPT}
        style={{ display: 'none' }}
        onChange={handleFileChange(setCedulaFile, 'cedula')}
      />
      <input
        ref={rutRef}
        type="file"
        accept={ACCEPT}
        style={{ display: 'none' }}
        onChange={handleFileChange(setRutFile, 'rut')}
      />
      <input
        ref={certificadoRef}
        type="file"
        accept={ACCEPT}
        style={{ display: 'none' }}
        onChange={handleFileChange(setCertificadoFile, 'certificado')}
      />
    </Card>
  );
}