import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { FormSocials } from './form-socials';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

describe('FormSocials', () => {
  it('renders 3 social buttons', () => {
    render(<FormSocials />);
    expect(screen.getByTestId('icon-socials:google')).toBeInTheDocument();
    expect(screen.getByTestId('icon-socials:github')).toBeInTheDocument();
    expect(screen.getByTestId('icon-socials:twitter')).toBeInTheDocument();
  });

  it('calls handlers on click', () => {
    const g = jest.fn();
    const gh = jest.fn();
    const tw = jest.fn();

    render(<FormSocials signInWithGoogle={g} singInWithGithub={gh} signInWithTwitter={tw} />);
    const buttons = screen.getAllByRole('button');

    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);

    expect(g).toHaveBeenCalledTimes(1);
    expect(gh).toHaveBeenCalledTimes(1);
    expect(tw).toHaveBeenCalledTimes(1);
  });
});
