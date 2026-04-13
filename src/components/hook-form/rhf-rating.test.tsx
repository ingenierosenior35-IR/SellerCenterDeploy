import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';

import { RHFRating } from './rhf-rating';

function Wrap() {
  const methods = useForm({ defaultValues: { rate: 2 } });
  return (
    <FormProvider {...methods}>
      <RHFRating name="rate" />
    </FormProvider>
  );
}

describe('RHFRating', () => {
  it('renders rating radios', () => {
    render(<Wrap />);
    expect(screen.getAllByRole('radio').length).toBeGreaterThan(0);
  });
});
