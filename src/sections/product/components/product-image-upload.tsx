'use client';

import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ImagePreview = {
  file: File;
  preview: string;
};

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg'];
const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg'];

type ProductImageUploadProps = {
  images: ImagePreview[];
  onAdd: (newImages: ImagePreview[]) => void;
  onRemove: (index: number) => void;
  maxImages?: number;
  maxSizeKB?: number;
};

/**
 * Componente reutilizable para subir imágenes de producto.
 * La primera imagen se marca como imagen principal.
 */
export function ProductImageUpload({
  images,
  onAdd,
  onRemove,
  maxImages = 5,
  maxSizeKB = 100,
}: ProductImageUploadProps) {
  const { translate } = useTranslate();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (!fileList) return;

      const allFiles = Array.from(fileList);

      // Validar formatos permitidos
      const invalidFormat = allFiles.find((file) => !ALLOWED_MIME_TYPES.includes(file.type));
      if (invalidFormat) {
        setValidationError(translate('productImageUpload', 'errorFormat'));
        event.target.value = '';
        return;
      }

      // Validar tamaño máximo por imagen
      const oversized = allFiles.find((file) => file.size > maxSizeKB * 1024);
      if (oversized) {
        setValidationError(
          translate('productImageUpload', 'errorSize').replace('{maxSizeKB}', String(maxSizeKB))
        );
        event.target.value = '';
        return;
      }

      // Validar que no se supere el máximo de imágenes
      const remaining = maxImages - images.length;
      if (remaining <= 0) {
        setValidationError(
          translate('productImageUpload', 'errorMaxImages').replace('{maxImages}', String(maxImages))
        );
        event.target.value = '';
        return;
      }

      setValidationError(null);
      const filesToAdd = allFiles.slice(0, remaining);
      const newImages: ImagePreview[] = filesToAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      onAdd(newImages);

      // Resetea el input para poder subir el mismo archivo de nuevo
      event.target.value = '';
    },
    [images.length, maxImages, maxSizeKB, onAdd, translate]
  );

  const canAddMore = images.length < maxImages;

  return (
    <Stack spacing={2}>
      {/* Texto de restricciones */}
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {translate('productImageUpload', 'formatHint')
          .replace('{maxSizeKB}', String(maxSizeKB))
          .replace('{maxImages}', String(maxImages))}
      </Typography>

      <Box
        sx={{
          gap: 1.5,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        }}
      >
        {images.map((img, index) => (
          <Box
            key={`${img.file.name}-${index}`}
            sx={(theme) => ({
              position: 'relative',
              borderRadius: 1.5,
              overflow: 'hidden',
              border: `1px solid ${theme.vars?.palette?.divider || theme.palette.divider}`,
              aspectRatio: '1/1',
            })}
          >
            <Box
              component="img"
              src={img.preview}
              alt={img.file.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* Badge para imagen principal */}
            {index === 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  py: 0.25,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption">{translate('productImageUpload', 'main')}</Typography>
              </Box>
            )}

            {/* Botón eliminar */}
            <IconButton
              size="small"
              onClick={() => onRemove(index)}
              sx={{
                p: 0.25,
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'error.lighter', color: 'error.main' },
              }}
            >
              <Iconify icon="mingcute:close-line" width={16} />
            </IconButton>
          </Box>
        ))}

        {/* Botón para agregar más imágenes */}
        {canAddMore && (
          <Box
            component="label"
            sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1.5,
              aspectRatio: '1/1',
              cursor: 'pointer',
              border: `2px dashed ${theme.vars?.palette?.divider || theme.palette.divider}`,
              bgcolor: theme.vars?.palette?.background?.neutral || 'background.neutral',
              transition: theme.transitions.create(['border-color', 'background-color']),
              '&:hover': {
                borderColor: theme.vars?.palette?.primary?.main || theme.palette.primary.main,
                bgcolor: theme.vars?.palette?.primary?.lighter || 'primary.lighter',
              },
            })}
          >
            <input
              type="file"
              accept={`.${ALLOWED_EXTENSIONS.join(',.')},${ALLOWED_MIME_TYPES.join(',')}`}
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Iconify icon="eva:cloud-upload-fill" width={28} sx={{ color: 'text.secondary', mb: 0.5 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {translate('productImageUpload', 'addImages')}
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Error de validación */}
      {validationError && (
        <Alert severity="error" onClose={() => setValidationError(null)} sx={{ py: 0.5 }}>
          {validationError}
        </Alert>
      )}

      {images.length > 0 && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {images.length}/{maxImages} {translate('productImageUpload', 'images')} • {translate('productImageUpload', 'mainImageHint')}
        </Typography>
      )}
    </Stack>
  );
}

export type { ImagePreview };
