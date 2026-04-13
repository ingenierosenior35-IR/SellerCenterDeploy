jest.mock('minimal-shared/utils', () => ({
  transformValue: (v: any) => v ?? '',
  transformValueOnBlur: (v: any) => v,
  transformValueOnChange: (v: any) => v,
}));

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { render, screen, fireEvent } from '@testing-library/react';

import { RHFTextField } from './rhf-text-field';

function Wrapper({ name = 'email', defaultValue = '' }: { name?: string; defaultValue?: any }) {
  const methods = useForm({ defaultValues: { [name]: defaultValue } });
  return (
    <FormProvider {...methods}>
      <RHFTextField name={name} label="Email" />
    </FormProvider>
  );
}

describe('RHFTextField', () => {
  it('renders a text field', () => {
    render(<Wrapper />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders with default value', () => {
    render(<Wrapper defaultValue="test@example.com" />);
    const input = screen.getByLabelText('Email') as HTMLInputElement;
    expect(input.value).toBe('test@example.com');
  });

  it('updates value on change', () => {
    render(<Wrapper />);
    const input = screen.getByLabelText('Email') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'new@example.com' } });
    expect(input.value).toBe('new@example.com');
  });
});
