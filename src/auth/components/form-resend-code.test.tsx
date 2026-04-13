import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { FormResendCode } from './form-resend-code';

describe('FormResendCode', () => {
  it('renders base text and resend label', () => {
    render(<FormResendCode />);
    expect(screen.getByText(/Don’t have a code\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Resend/i)).toBeInTheDocument();
  });

  it('calls onResendCode when clicking link', () => {
    const onResendCode = jest.fn();
    render(<FormResendCode onResendCode={onResendCode} />);
    fireEvent.click(screen.getByText(/Resend/i));
    expect(onResendCode).toHaveBeenCalledTimes(1);
  });

  it('shows countdown when disabled and value > 0', () => {
    render(<FormResendCode disabled value={12} />);
    expect(screen.getByText('Resend (12s)')).toBeInTheDocument();
  });

  it('does not show countdown when disabled and value <= 0', () => {
    render(<FormResendCode disabled value={0} />);
    expect(screen.getByText(/Resend/)).toBeInTheDocument();
    expect(screen.queryByText(/\(0s\)/)).not.toBeInTheDocument();
  });
});
