import React from 'react';
import { render, screen } from '@testing-library/react';

import { SignUpTerms } from './sign-up-terms';

describe('SignUpTerms', () => {
  it('renders terms and privacy links', () => {
    render(<SignUpTerms />);
    expect(screen.getByText('Terms of service')).toBeInTheDocument();
    expect(screen.getByText('Privacy policy')).toBeInTheDocument();
  });
});
