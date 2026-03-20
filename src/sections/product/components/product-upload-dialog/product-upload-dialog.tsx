'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { useProductUploadDialog } from 'src/hooks/product/use-product-upload-dialog';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { CsvErrorsAlert } from './csv-errors-alert';

const CSV_ACCEPT_ATTR = '.csv,.xml,.xls';
const IMG_ACCEPT_ATTR = '.jpg,.jpeg,.png';
const ZIP_ACCEPT_ATTR = '.zip';
const IMAGES_OR_ZIP_ACCEPT_ATTR = `${IMG_ACCEPT_ATTR},${ZIP_ACCEPT_ATTR}`;
// const AVAILABLE_FORMAT_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export const ProductUploadDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const {
    csvInputRef,
    imgInputRef,
    csvFile,
    images,
    imagesZip,
    uploading,
    result,
    showCancelDialog,
    csvInvalid,
    imgsInvalid,
    zipInvalid,
    csvErrors,
    onPickCsv,
    onPickImages,
    handleCsvFiles,
    handleImageFiles,
    onDropCsv,
    onDropImages,
    clearAll,
    disabledUpload,
    handleUpload,
    handleCancelUpload,
    handleCancelBulkUpload,
    setCsvFile,
    setImages,
    setImagesZip,
    setShowCancelDialog,
  } = useProductUploadDialog({ onClose });

  const dropZoneSx = (theme: any) => ({
    p: 3,
    borderRadius: 2,
    border: `1px dashed ${theme.vars?.palette?.divider || theme.palette.divider}`,
    bgcolor: 'background.paper',
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
      bgcolor: theme.vars
        ? `rgba(${theme.vars.palette.primary.mainChannel} / 0.04)`
        : 'action.hover',
    },
  });

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle sx={{ pb: 1 }}>Upload products</DialogTitle>
      <DialogContent dividers sx={{ pt: 1.5 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Include the correct measurements (weight, length, width, height, etc.) to ensure
              accurate shipping costs.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              We recommend not exceeding 3600 rows in the format.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Allowed formats: CSV, XLS, XML.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Maximum file size: 1 MB.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              alignItems: 'start',
            }}
          >
            <Stack spacing={1}>
              <Typography variant="subtitle2">File</Typography>
              <Box
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={onDropCsv}
                onClick={onPickCsv}
                sx={(theme) => ({
                  ...dropZoneSx(theme),
                  minHeight: 220,
                })}
              >
                <Stack spacing={1.5} alignItems="center">
                  <Iconify icon="solar:file-text-bold" color="primary.main" width={35}/>
                  <Typography variant="subtitle2">Drag and drop your file here</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {CSV_ACCEPT_ATTR.toUpperCase()} — máx. 1 MB
                  </Typography>
                  <input
                    ref={csvInputRef}
                    type="file"
                    accept={CSV_ACCEPT_ATTR}
                    onChange={(e: any | null) => {
                      handleCsvFiles(e.target.files);
                      e.target.value = null;
                    }}
                    style={{ display: 'none' }}
                  />
                </Stack>
              </Box>

              {!!csvFile && (
                <Chip
                  sx={{ alignSelf: 'flex-start' }}
                  label={`${
                    csvFile.name.length > 20 ? csvFile.name.slice(0, 17) + '...' : csvFile.name
                  } (${Math.round(csvFile.size / 1024)} KB)`}
                  onDelete={() => setCsvFile(null)}
                  size="small"
                />
              )}

              {csvFile && (csvInvalid?.badType || csvInvalid?.tooBig) && (
                <Alert severity="warning" variant="outlined">
                  {csvInvalid.badType && <div>El archivo cargado no tiene un tipo válido.</div>}
                  {csvInvalid.tooBig && <div>El archivo cargado supera 1 MB.</div>}
                </Alert>
              )}
            </Stack>
          </Box>

          {/* Errors file */}
          <CsvErrorsAlert csvFile={csvFile} csvErrors={csvErrors} />

          {result && (
            <Alert
              severity={result.ok ? 'success' : 'error'}
              icon={
                <Iconify
                  icon={result.ok ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                  width={20}
                />
              }
            >
              S{result.ok ? 'Carga exitosa' : 'Carga fallida'}
              {result.message ? ` — ${result.message}` : ''}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {!!csvFile || !!images.length || !!imagesZip ? (
          <Button onClick={clearAll} disabled={uploading} variant="text">
            Limpiar
          </Button>
        ) : null}
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleCancelBulkUpload} disabled={uploading} variant="text">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={disabledUpload}
          startIcon={uploading ? null : <Iconify icon="eva:cloud-upload-fill" />}
        >
          {uploading ? (
            <>
              <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
              Uploading…
            </>
          ) : (
            'Upload file'
          )}
        </Button>
      </DialogActions>

      {!!csvFile || images.length > 0 || !!imagesZip ? (
        <ConfirmDialog
          open={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          title="Cancel product upload"
          content="Are you sure you want to cancel the product upload? Selected files will be lost."
          action={
            <Button variant="contained" onClick={handleCancelUpload}>
              Continue
            </Button>
          }
        />
      ) : null}
    </Dialog>
  );
};
