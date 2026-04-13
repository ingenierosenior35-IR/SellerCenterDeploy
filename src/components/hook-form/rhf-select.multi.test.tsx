import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';

import { RHFMultiSelect } from './rhf-select';

function Wrap({ chip = false, placeholder = 'Select...' }: any) {
  const methods = useForm({ defaultValues: { tags: [] as string[] } });
  return (
    <FormProvider {...methods}>
      <RHFMultiSelect
        name="tags"
        label="Tags"
        options={[
          { label: 'One', value: '1' },
          { label: 'Two', value: '2' },
        ]}
        chip={chip}
        checkbox
        placeholder={placeholder}
      />
    </FormProvider>
  );
}

describe('RHFMultiSelect', () => {
  it('renders input and label', () => {
    render(<Wrap />);
    expect(screen.getByLabelText('Tags')).toBeInTheDocument();
  });

  it('renders with chip mode', () => {
    render(<Wrap chip />);
    expect(screen.getByLabelText('Tags')).toBeInTheDocument();
  });
});