'use client';

import type {
  ProductDetailsVariantInterface,
  ProductDetailsConfigurableOptionInterface,
} from 'src/interfaces';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type SelectedOptions = Record<string, string>;

type VariantStatus = {
  exists: boolean;
  hasStock: boolean;
  variant: ProductDetailsVariantInterface | null;
};

type Props = {
  configurableOptions: ProductDetailsConfigurableOptionInterface[];
  variants: ProductDetailsVariantInterface[];
  onSelectionChange?: (options: SelectedOptions, variant: ProductDetailsVariantInterface | undefined) => void;
  disabled?: boolean;
};

export function ProductConfigurableOptions({
  configurableOptions = [],
  variants = [],
  onSelectionChange,
  disabled = false,
}: Readonly<Props>) {
  const { translate } = useTranslate();

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  // Inicializar con la primera variante disponible
  useEffect(() => {
    if (
      configurableOptions.length > 0 &&
      variants.length > 0 &&
      Object.keys(selectedOptions).length === 0
    ) {
      const firstAvailableVariant = variants.find(
        (variant) =>
          variant.product?.stock_status === 'IN_STOCK' &&
          (variant.product?.stock_saleable || 0) > 0
      );

      if (firstAvailableVariant) {
        const initialSelection: SelectedOptions = {};

        configurableOptions.forEach((option) => {
          const matchingAttribute = firstAvailableVariant.attributes?.find((attr) =>
            option.values?.some((val) => val.uid === attr.uid)
          );
          if (matchingAttribute) {
            initialSelection[option.uid] = matchingAttribute.uid;
          }
        });

        setSelectedOptions(initialSelection);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configurableOptions, variants]);

  // Notificar cambios al padre
  useEffect(() => {
    if (Object.keys(selectedOptions).length > 0) {
      const matchingVariant = variants?.find((variant) => {
        const variantAttributeUids = variant.attributes?.map((attr) => attr.uid) ?? [];
        const selectedUids = Object.values(selectedOptions);
        return selectedUids.every((uid) => variantAttributeUids.includes(uid));
      });

      onSelectionChange?.(selectedOptions, matchingVariant);
    }
  }, [selectedOptions, variants, onSelectionChange]);

  const handleOptionChange = useCallback(
    (optionUid: string, valueUid: string) => {
      if (disabled) return;
      setSelectedOptions((prev) => ({ ...prev, [optionUid]: valueUid }));
    },
    [disabled]
  );

  const isOptionValidWithCurrentSelection = (
    currentOptionUid: string,
    currentValueUid: string
  ): boolean => {
    const tempSelection = { ...selectedOptions, [currentOptionUid]: currentValueUid };
    const selectedUids = Object.values(tempSelection);

    return (
      variants?.some((variant) => {
        const variantAttributeUids = variant.attributes?.map((attr) => attr.uid) ?? [];
        const hasAllAttributes = selectedUids.every((uid) => variantAttributeUids.includes(uid));
        const hasStock =
          variant.product?.stock_status === 'IN_STOCK' &&
          (variant.product?.stock_saleable || 0) > 0;
        return hasAllAttributes && hasStock;
      }) ?? false
    );
  };

  const getCurrentVariantStatus = (): VariantStatus => {
    const selectedUids = Object.values(selectedOptions);

    const currentVariant = variants?.find((variant) => {
      const variantAttributeUids = variant.attributes?.map((attr) => attr.uid) ?? [];
      return selectedUids.every((uid) => variantAttributeUids.includes(uid));
    });

    if (!currentVariant) return { exists: false, hasStock: false, variant: null };

    const hasStock =
      currentVariant.product?.stock_status === 'IN_STOCK' &&
      (currentVariant.product?.stock_saleable || 0) > 0;

    return { exists: true, hasStock, variant: currentVariant };
  };

  if (!configurableOptions || configurableOptions.length === 0) return null;

  const variantStatus = getCurrentVariantStatus();

  return (
    <Stack spacing={3}>
      {configurableOptions.map((option) => (
        <Box key={option.uid}>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            {option.label}
            {selectedOptions[option.uid] && (
              <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                •{' '}
                {option.values?.find((v) => v.uid === selectedOptions[option.uid])?.label}
              </Typography>
            )}
          </Typography>

          {option.frontend_input === 'swatch_visual' ||
          option.frontend_input === 'Text Swatch Image' ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {option.values?.map((value) => {
                const isSelected = selectedOptions[option.uid] === value.uid;
                const isValid = isOptionValidWithCurrentSelection(option.uid, value.uid);

                return (
                  <Tooltip
                    key={value.uid}
                    title={
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {value.label}
                        </Typography>

                        {!isValid && (
                          <Typography variant="caption" display="block" sx={{ color: 'grey.400' }}>
                            {translate('productConfigurable', 'notAvailable')}
                          </Typography>
                        )}
                      </Box>
                    }
                    arrow
                  >
                    <Box
                      onClick={() => handleOptionChange(option.uid, value.uid)}
                      sx={{ position: 'relative', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <Avatar
                        src={value.swatch?.image_url ?? undefined}
                        alt={value.label}
                        sx={{
                          width: 48,
                          height: 48,
                          border: (theme) =>
                            `2px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
                          boxShadow: isSelected ? 2 : 0,
                          opacity: isValid ? 1 : 0.5,
                          filter: isValid ? 'none' : 'grayscale(0.4)',
                          transition: 'all 0.2s',
                          '&:hover': { transform: 'scale(1.08)', boxShadow: 3 },
                        }}
                      >
                        {!value.swatch?.image_url && value.label.charAt(0)}
                      </Avatar>

                      {!isValid && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '70%',
                            height: '1.5px',
                            bgcolor: (theme) => theme.palette.grey[600],
                            transform: 'translate(-50%, -50%) rotate(-45deg)',
                            pointerEvents: 'none',
                          }}
                        />
                      )}

                      {isSelected && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: -4,
                            right: -4,
                            bgcolor: 'primary.main',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 2,
                          }}
                        >
                          <Iconify icon="eva:checkmark-fill" width={14} color="white" />
                        </Box>
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {option.values?.map((value) => {
                const isSelected = selectedOptions[option.uid] === value.uid;
                const isValid = isOptionValidWithCurrentSelection(option.uid, value.uid);

                return (
                  <Tooltip
                    key={value.uid}
                    title={isValid ? '' : translate('productConfigurable', 'notAvailable')}
                    arrow
                  >
                    <Box>
                      <Chip
                        label={value.label}
                        disabled={disabled}
                        onClick={() => handleOptionChange(option.uid, value.uid)}
                        color={isSelected ? 'primary' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                        icon={isSelected ? <Iconify icon="eva:checkmark-fill" width={16} /> : undefined}
                        sx={{
                          fontWeight: isSelected ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          opacity: isValid ? 1 : 0.5,
                          textDecoration: isValid ? 'none' : 'line-through',
                          textDecorationColor: (theme) => theme.palette.grey[600],
                          textDecorationThickness: '1.5px',
                          color: isValid ? undefined : 'text.disabled',
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 },
                        }}
                      />
                    </Box>
                  </Tooltip>
                );
              })}
            </Stack>
          )}
        </Box>
      ))}

      {!variantStatus.exists && (
        <Alert severity="warning" icon={<Iconify icon="solar:danger-triangle-bold" />}>
          <Typography variant="subtitle2">
            {translate('productConfigurable', 'alerts.combinationNotAvailable.title')}
          </Typography>
          <Typography variant="body2">
            {translate('productConfigurable', 'alerts.combinationNotAvailable.description')}
          </Typography>
        </Alert>
      )}

      {variantStatus.exists && !variantStatus.hasStock && (
        <Alert severity="error" icon={<Iconify icon="solar:close-circle-bold" />}>
          <Typography variant="subtitle2">
            {translate('productConfigurable', 'alerts.outOfStock.title')}
          </Typography>
          <Typography variant="body2">
            {translate('productConfigurable', 'alerts.outOfStock.description')}
          </Typography>
        </Alert>
      )}

      {variantStatus.exists && variantStatus.hasStock && (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
            border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.16)}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Iconify icon="solar:check-circle-bold" color="success.main" width={20} />
            {translate('productConfigurable', 'available')}{' '}
            ({variantStatus.variant?.product.stock_saleable}{' '}
            {translate('productConfigurable', 'units')})
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
