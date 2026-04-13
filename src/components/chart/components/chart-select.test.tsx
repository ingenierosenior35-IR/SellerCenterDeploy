jest.mock('minimal-shared/hooks', () => ({
  usePopover: jest.fn(() => ({
    open: false,
    anchorEl: null,
    onClose: jest.fn(),
    onOpen: jest.fn(),
  })),
}));
jest.mock('minimal-shared/utils', () => ({
  varAlpha: jest.fn(() => 'rgba(0,0,0,0.1)'),
}));
jest.mock('../../iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-icon={icon} />,
}));
jest.mock('../../custom-popover', () => ({
  CustomPopover: ({ children, open }: any) => open ? <div>{children}</div> : null,
}));

import React from 'react';
import { usePopover } from 'minimal-shared/hooks';
import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ChartSelect } from './chart-select';

const theme = createTheme({ cssVariables: true });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('ChartSelect', () => {
  const options = ['Monthly', 'Weekly', 'Daily'];

  it('renders the current value', () => {
    render(<ChartSelect options={options} value="Monthly" onChange={jest.fn()} />, { wrapper });
    expect(screen.getByText('Monthly')).toBeInTheDocument();
  });

  it('calls onOpen when button is clicked', () => {
    const onOpen = jest.fn();
    (usePopover as jest.Mock).mockReturnValueOnce({ open: false, anchorEl: null, onClose: jest.fn(), onOpen });

    render(<ChartSelect options={options} value="Monthly" onChange={jest.fn()} />, { wrapper });
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onOpen).toHaveBeenCalled();
  });
});
