import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';

import { RHFSelect } from './rhf-select';

function Wrapper({ name = 'role', label = 'Role' }: { name?: string; label?: string }) {
  const methods = useForm({ defaultValues: { [name]: '' } });
  return (
    <FormProvider {...methods}>
      <RHFSelect name={name} label={label}>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </RHFSelect>
    </FormProvider>
  );
}

describe('RHFSelect', () => {
  it('renders a select field', () => {
    render(<Wrapper />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the select', () => {
    render(<Wrapper />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
