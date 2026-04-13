jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets', appName: 'Test', appVersion: '1.0.0' },
}));
jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
  varAlpha: jest.fn(() => 'rgba(0,0,0,0.1)'),
}));
jest.mock('../iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-icon={icon} />,
}));
jest.mock('./use-file-preview', () => ({
  useFilePreview: jest.fn(() => ({ previewUrl: '' })),
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { FileThumbnail } from './file-thumbnail';

const theme = createTheme({ cssVariables: true });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('FileThumbnail', () => {
  it('renders nothing when file is not provided', () => {
    const { container } = render(<FileThumbnail />, { wrapper });
    expect(container.firstChild).toBeNull();
  });

  it('renders thumbnail for a string file path', () => {
    const { container } = render(<FileThumbnail file="/docs/file.pdf" />, { wrapper });
    expect(container.firstChild).not.toBeNull();
  });

  it('renders remove button when onRemove is provided', () => {
    render(<FileThumbnail file="/docs/file.pdf" onRemove={jest.fn()} />, { wrapper });
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    render(<FileThumbnail file="/docs/file.pdf" onRemove={onRemove} />, { wrapper });
    fireEvent.click(screen.getByRole('button'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('renders with tooltip when tooltip=true', () => {
    const { container } = render(<FileThumbnail file="/docs/file.pdf" tooltip />, { wrapper });
    expect(container.firstChild).not.toBeNull();
  });
});
