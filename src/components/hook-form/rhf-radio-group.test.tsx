import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { render, screen, fireEvent } from '@testing-library/react';

import { RHFRadioGroup } from './rhf-radio-group';

function Wrap({ withLabel = true }: { withLabel?: boolean }) {
  const methods = useForm({ defaultValues: { role: 'a' } });
  return (
    <FormProvider {...methods}>
      <RHFRadioGroup
        name="role"
        label={withLabel ? 'Role' : undefined}
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ]}
      />
    </FormProvider>
  );
}

describe('RHFRadioGroup', () => {
  it('renders label/options and changes value', () => {
    render(<Wrap />);
    expect(screen.getByText('Role')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('B'));
    expect(screen.getByLabelText('B')).toBeChecked();
  });

  it('renders without label branch', () => {
    render(<Wrap withLabel={false} />);
    expect(screen.getByLabelText('A')).toBeInTheDocument();
  });
});