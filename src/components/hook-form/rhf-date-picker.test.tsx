import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { render, screen, fireEvent } from '@testing-library/react';

import { RHFDatePicker, RHFTimePicker, RHFDateTimePicker } from './rhf-date-picker';

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ value, onChange, slotProps }: any) => (
    <div>
      <div data-testid="date-value">{value ? 'has-value' : 'null'}</div>
      <div data-testid="date-helper">{slotProps?.textField?.helperText ?? ''}</div>
      <button onClick={() => onChange(null)}>set-null</button>
      <button onClick={() => onChange('2026-01-01')}>set-valid</button>
      <button onClick={() => onChange('bad-date')}>set-invalid</button>
    </div>
  ),
}));

jest.mock('@mui/x-date-pickers/TimePicker', () => ({
  TimePicker: ({ value, onChange, slotProps }: any) => (
    <div>
      <div data-testid="time-value">{value ? 'has-value' : 'null'}</div>
      <div data-testid="time-helper">{slotProps?.textField?.helperText ?? ''}</div>
      <button onClick={() => onChange(null)}>set-null</button>
      <button onClick={() => onChange('2026-01-01T10:00:00')}>set-valid</button>
      <button onClick={() => onChange('bad-date')}>set-invalid</button>
    </div>
  ),
}));

jest.mock('@mui/x-date-pickers/DateTimePicker', () => ({
  DateTimePicker: ({ value, onChange, slotProps }: any) => (
    <div>
      <div data-testid="datetime-value">{value ? 'has-value' : 'null'}</div>
      <div data-testid="datetime-helper">{slotProps?.textField?.helperText ?? ''}</div>
      <button onClick={() => onChange(null)}>set-null</button>
      <button onClick={() => onChange('2026-01-01T10:00:00')}>set-valid</button>
      <button onClick={() => onChange('bad-date')}>set-invalid</button>
    </div>
  ),
}));

function Wrap({ children, defaultValues }: any) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('RHFDatePicker', () => {
  it('handles null/valid/invalid change branches', () => {
    render(
      <Wrap defaultValues={{ d: undefined }}>
        <RHFDatePicker name="d" slotProps={{ textField: { helperText: 'helper' } }} />
      </Wrap>
    );

    expect(screen.getByTestId('date-helper')).toHaveTextContent('helper');
    fireEvent.click(screen.getByText('set-null'));
    fireEvent.click(screen.getByText('set-valid'));
    fireEvent.click(screen.getByText('set-invalid'));
  });
});

describe('RHFTimePicker', () => {
  it('handles null/valid/invalid change branches', () => {
    render(
      <Wrap defaultValues={{ t: '' }}>
        <RHFTimePicker name="t" slotProps={{ textField: { helperText: 'helper' } }} />
      </Wrap>
    );
    expect(screen.getByTestId('time-helper')).toHaveTextContent('helper');
    fireEvent.click(screen.getByText('set-null'));
    fireEvent.click(screen.getByText('set-valid'));
    fireEvent.click(screen.getByText('set-invalid'));
  });
});

describe('RHFDateTimePicker', () => {
  it('handles null/valid/invalid change branches', () => {
    render(
      <Wrap defaultValues={{ dt: '2026-01-01' }}>
        <RHFDateTimePicker name="dt" slotProps={{ textField: { helperText: 'helper' } }} />
      </Wrap>
    );
    expect(screen.getByTestId('datetime-helper')).toHaveTextContent('helper');
    fireEvent.click(screen.getByText('set-null'));
    fireEvent.click(screen.getByText('set-valid'));
    fireEvent.click(screen.getByText('set-invalid'));
  });
});