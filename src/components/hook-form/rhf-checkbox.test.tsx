import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';

import { RHFCheckbox } from './rhf-checkbox';

function Wrapper({ name = 'agree', label = 'Agree', defaultValue = false }: { name?: string; label?: string; defaultValue?: boolean }) {
  const methods = useForm({ defaultValues: { [name]: defaultValue } });
  return (
    <FormProvider {...methods}>
      <RHFCheckbox name={name} label={label} />
    </FormProvider>
  );
}

describe('RHFCheckbox', () => {
  it('renders checkbox with label', () => {
    render(<Wrapper />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByLabelText('Agree')).toBeInTheDocument();
  });

  it('renders unchecked by default', () => {
    render(<Wrapper />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('renders checked when defaultValue is true', () => {
    render(<Wrapper defaultValue />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
