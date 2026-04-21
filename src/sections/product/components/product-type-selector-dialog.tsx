'use client';

import type { IconifyName } from 'src/components/iconify/register-icons';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ProductTypeOption = {
  type: 'simple' | 'configurable';
  titleKey: string;
  descriptionKey: string;
  icon: IconifyName;
  disabled?: boolean;
};

const PRODUCT_TYPE_OPTIONS: ProductTypeOption[] = [
  {
    type: 'simple',
    titleKey: 'simpleTitle',
    descriptionKey: 'simpleDescription',
    icon: 'solar:box-minimalistic-bold',
    disabled: false,
  },
  {
    type: 'configurable',
    titleKey: 'configurableTitle',
    descriptionKey: 'configurableDescription',
    icon: 'solar:settings-bold-duotone',
    disabled: false,
  },
];

// ----------------------------------------------------------------------

type ProductTypeSelectorDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (type: 'simple' | 'configurable') => void;
};

/**
 * Diálogo que muestra dos tarjetas para seleccionar el tipo de producto
 * a crear: Producto Simple o Producto Configurable.
 */
export function ProductTypeSelectorDialog({
  open,
  onClose,
  onSelect,
}: ProductTypeSelectorDialogProps) {
  const { translate } = useTranslate();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>{translate('productTypeSelector', 'title')}</DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {translate('productTypeSelector', 'subtitle')}
        </Typography>

        <Stack spacing={2} sx={{ pb: 2 }}>
          {PRODUCT_TYPE_OPTIONS.map((option) => (
            <Card
              key={option.type}
              sx={(theme) => ({
                p: 3,
                cursor: option.disabled ? 'default' : 'pointer',
                opacity: option.disabled ? 0.5 : 1,
                border: `1px solid ${theme.vars?.palette?.divider || theme.palette.divider}`,
                transition: theme.transitions.create(['box-shadow', 'border-color']),
                ...(!option.disabled && {
                  '&:hover': {
                    borderColor: theme.vars?.palette?.primary?.main || theme.palette.primary.main,
                    boxShadow: theme.shadows[8],
                  },
                }),
              })}
              onClick={() => {
                if (!option.disabled) {
                  onSelect(option.type);
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={(theme) => ({
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    display: 'flex',
                    borderRadius: 1.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    ...(option.disabled && {
                      bgcolor: theme.vars?.palette?.action?.disabledBackground || 'action.disabledBackground',
                      color: theme.vars?.palette?.action?.disabled || 'action.disabled',
                    }),
                  })}
                >
                  <Iconify icon={option.icon} width={28} />
                </Box>

                <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">{translate('productTypeSelector', option.titleKey)}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {translate('productTypeSelector', option.descriptionKey)}
                  </Typography>
                </Stack>

                {option.disabled ? (
                  <Button size="small" variant="outlined" disabled>
                    {translate('productTypeSelector', 'comingSoon')}
                  </Button>
                ) : (
                  <Iconify
                    icon="eva:arrow-ios-forward-fill"
                    width={24}
                    sx={{ color: 'text.secondary', flexShrink: 0 }}
                  />
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
