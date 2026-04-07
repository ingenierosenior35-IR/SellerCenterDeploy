import type { Dayjs } from 'dayjs';
import type { useSetState } from 'node_modules/minimal-shared/dist/hooks/use-set-state/use-set-state';
import type { FilterModelList } from 'src/interfaces/order';

import React, { useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { useTranslate } from 'src/locales/langs/i18n';

import { Iconify } from 'src/components/iconify';

type FiltersState = ReturnType<typeof useSetState<FilterModelList>>;

// ----------------------------------------------------------------------

export function OrderTableToolbar({ filters, onResetPage, dateError }: { filters: FiltersState; onResetPage: () => void; dateError: boolean }) {

  const { state: currentFilters, setState: updateFilters } = filters;
  const { translate } = useTranslate();
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onResetPage();
      updateFilters({ name: event.target.value });
    },
    [onResetPage, updateFilters],
  );

  const handleFilterStartDate = useCallback(
    (newValue: Dayjs | null) => {
      onResetPage();
      updateFilters({ startDate: newValue });
    },
    [onResetPage, updateFilters],
  );

  const handleFilterEndDate = useCallback(
    (newValue: Dayjs | null) => {
      onResetPage();
      updateFilters({ endDate: newValue });
    },
    [onResetPage, updateFilters],
  );

  return (
    <Box
      sx={{
        p: 2.5,
        gap: 2,
        display: 'flex',
        pr: { xs: 2.5, md: 1 },
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-end', md: 'center' },
      }}
    >
      <DatePicker
        label={translate('ordersModule.table.filters.initialDate')}
        value={currentFilters.startDate }
        onChange={handleFilterStartDate}
        format="DD/MM/YYYY"
        sx={{ maxWidth: { md: 200 } }}
      />

      <DatePicker
        label={translate('ordersModule.table.filters.finalDate')}
        value={currentFilters.endDate}
        format="DD/MM/YYYY"
        onChange={handleFilterEndDate}
        slotProps={{
          textField: {
            error: dateError,
            helperText: dateError ? 'La fecha fin debe ser posterior a la fecha inicio.' : null,
          },
        }}
        sx={{
          maxWidth: { md: 200 },
          [`& .${formHelperTextClasses.root}`]: {
            position: { md: 'absolute' },
            bottom: { md: -40 },
          },
        }}
      />

      <Box
        sx={{
          gap: 2,
          width: 1,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          value={currentFilters.name}
          onChange={handleFilterName}
          placeholder={translate('ordersModule.table.filters.search')}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </Box>
  );
}
