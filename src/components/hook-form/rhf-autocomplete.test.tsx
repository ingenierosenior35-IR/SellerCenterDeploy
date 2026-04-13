import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { render, screen, fireEvent } from '@testing-library/react';

import { RHFAutocomplete } from './rhf-autocomplete';

jest.mock('@mui/material/Autocomplete', () => ({
  __esModule: true,
  default: ({ renderInput, onChange }: any) => (
    <div>
      {renderInput({ inputProps: { 'data-testid': 'auto-input' } })}
      <button onClick={() => onChange(null, 'new-value')}>change</button>
    </div>
  ),
}));

function Wrap() {
  const methods = useForm({ defaultValues: { city: '' } });
  return (
    <FormProvider {...methods}>
      <RHFAutocomplete
        name="city"
        label="City"
        placeholder="Pick city"
        helperText="helper"
        slotProps={{ textField: { 'data-testid': 'text-field' } as any }}
        options={['A', 'B']}
      />
    </FormProvider>
  );
}

describe('RHFAutocomplete', () => {
  it('renders and triggers setValue on change', () => {
    render(<Wrap />);
    expect(screen.getByText('change')).toBeInTheDocument();
    fireEvent.click(screen.getByText('change'));
  });
});