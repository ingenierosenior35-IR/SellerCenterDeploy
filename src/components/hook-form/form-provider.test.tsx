import React from 'react';
import { useForm } from 'react-hook-form';
import { render, screen, fireEvent } from '@testing-library/react';

import { Form } from './form-provider';

function TestForm() {
  const methods = useForm({ defaultValues: { name: '' } });
  return (
    <Form methods={methods}>
      <input {...methods.register('name')} data-testid="name-input" />
      <button type="submit">Submit</button>
    </Form>
  );
}

describe('Form (FormProvider)', () => {
  it('renders children inside a form', () => {
    render(<TestForm />);
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<TestForm />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('submits the form', () => {
    const onSubmit = jest.fn();
    const methods_outer = { methods: null as any };
    function SubmitForm() {
      const methods = useForm({ defaultValues: { name: '' } });
      methods_outer.methods = methods;
      return (
        <Form methods={methods} onSubmit={onSubmit}>
          <button type="submit">Submit</button>
        </Form>
      );
    }
    render(<SubmitForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
