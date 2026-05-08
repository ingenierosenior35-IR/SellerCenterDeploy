import type { ChangeEvent } from 'react';

import { useRef } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { ACCEPTED_MIME, MAX_FILE_SIZE } from './document-rules';

// ----------------------------------------------------------------------

type Props = {
  label: string;
  hint?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
};

export function FileUploadField({ label, hint, file, onChange, error }: Props) {
  const { translate } = useTranslate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null;
    // permitir volver a elegir el mismo archivo aunque sea inválido
    event.target.value = '';

    if (!picked) {
      onChange(null);
      return;
    }

    if (picked.type !== ACCEPTED_MIME) {
      toast.error(`"${picked.name}" ${translate('createSellers.step3.toasts.notPdf')}`);
      return;
    }

    if (picked.size > MAX_FILE_SIZE) {
      toast.error(`"${picked.name}" ${translate('createSellers.step3.toasts.tooLarge')}`);
      return;
    }

    onChange(picked);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      }}
    >
      <Typography variant="caption" sx={{ color: 'common.white' }}>
        {label}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minHeight: 56,
          px: 1.5,
          borderRadius: 1,
          border: '1px solid',
          borderColor: error ? 'error.main' : 'common.white',
        }}
      >
        {file ? (
          <>
            <Iconify
              icon="solar:file-text-bold"
              width={24}
              sx={{ color: 'common.white', flexShrink: 0 }}
            />
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                color: 'common.white',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {file.name}
            </Typography>
            <IconButton
              type="button"
              size="small"
              onClick={() => onChange(null)}
              aria-label={translate('createSellers.step3.removeFile')}
              sx={{ color: 'common.white' }}
            >
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          </>
        ) : (
          <Button
            type="button"
            fullWidth
            onClick={() => inputRef.current?.click()}
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            sx={{
              color: 'common.white',
              justifyContent: 'flex-start',
              textTransform: 'none',
            }}
          >
            {translate('createSellers.step3.selectPdf')}
          </Button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_MIME}
          hidden
          onChange={handleSelect}
        />
      </Box>

      {hint && !error && (
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {hint}
        </Typography>
      )}
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
}
