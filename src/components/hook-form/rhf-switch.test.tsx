import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { render, screen, fireEvent } from '@testing-library/react';

import { RHFSwitch, RHFMultiSwitch } from './rhf-switch';

function WrapSwitch({ label = 'Enabled', name = 'enabled', defaultValue = false }: any) {
  const methods = useForm({ defaultValues: { [name]: defaultValue } });
  return (
    <FormProvider {...methods}>
      <RHFSwitch name={name} label={label} />
    </FormProvider>
  );
}

function WrapMulti() {
  const methods = useForm({ defaultValues: { perms: [] as string[] } });
  return (
    <FormProvider {...methods}>
      <RHFMultiSwitch
        name="perms"
        label="Perms"
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ]}
      />
    </FormProvider>
  );
}

describe('RHFSwitch', () => {
  it('renders and toggles', () => {
    render(<WrapSwitch />);
    const sw = screen.getByRole('checkbox');
    expect(sw).not.toBeChecked();
    fireEvent.click(sw);
    expect(sw).toBeChecked();
  });

  it('adds aria-label branch when no label', () => {
    render(<WrapSwitch label={undefined} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});

describe('RHFMultiSwitch', () => {
  it('renders label and options', () => {
    render(<WrapMulti />);
    expect(screen.getByText('Perms')).toBeInTheDocument();
    expect(screen.getByLabelText('A')).toBeInTheDocument();
    expect(screen.getByLabelText('B')).toBeInTheDocument();
  });

  it('select/unselect option', () => {
    render(<WrapMulti />);
    const a = screen.getByLabelText('A');
    fireEvent.click(a);
    expect(a).toBeChecked();
    fireEvent.click(a);
    expect(a).not.toBeChecked();
  });
});