import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';

import { RHFSlider } from './rhf-slider';

function Wrap() {
  const methods = useForm({ defaultValues: { volume: 30 } });
  return (
    <FormProvider {...methods}>
      <RHFSlider name="volume" />
    </FormProvider>
  );
}

describe('RHFSlider', () => {
  it('renders slider', () => {
    render(<Wrap />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });
});