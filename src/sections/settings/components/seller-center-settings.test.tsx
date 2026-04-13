import * as z from 'zod';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { SellerCenterSettings } from './seller-center-settings';

const toastSuccess = jest.fn();
const toastInfo = jest.fn();

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/routes/paths', () => ({
  paths: { home: { root: '/home' }, settings: '/settings', product: { root: '/product' } },
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, children, onClick }: any) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (_ns: string, key?: string) => key ?? _ns,
    currentLang: 'es',
  }),
}));

jest.mock('src/components/snackbar', () => ({
  toast: {
    success: (...args: any[]) => toastSuccess(...args),
    error: jest.fn(),
    info: (...args: any[]) => toastInfo(...args),
  },
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="breadcrumbs">{heading}</div>,
}));

// ✅ usar zod real para evitar "Invalid element at key bannerFile"
jest.mock('src/components/hook-form', () => ({
    Form: ({ children, onSubmit }: any) => <form onSubmit={onSubmit}>{children}</form>,
    Field: {
      Text: ({ name, label, ...props }: any) => <input aria-label={label ?? name} name={name} {...props} />,
      Select: ({ name, label, children }: any) => (
        <select aria-label={label ?? name} name={name}>
          {children}
        </select>
      ),
    },
    schemaUtils: {
      file: ({ error }: any = {}) =>
        z
          .union([z.string(), z.instanceof(File), z.null()])
          .refine((val: any) => val !== undefined, { message: error ?? 'required' }),
      nullableInput: (schema: any, options?: any) =>
        schema.nullable().refine((val: any) => val !== null && val !== undefined, {
          message: options?.error ?? 'required',
        }),
    },
  }));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('SellerCenterSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing and breadcrumbs', () => {
    renderWithTheme(<SellerCenterSettings />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders key action controls', () => {
    renderWithTheme(<SellerCenterSettings />);
    expect(screen.getByRole('button', { name: /saveProfile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /saveUrl/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /viewProfile/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /viewCollection/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back/i })).toBeInTheDocument();
  });

  it('submits profile form and shows success toast', async () => {
    renderWithTheme(<SellerCenterSettings />);
    fireEvent.click(screen.getByRole('button', { name: /saveProfile/i }));

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalled();
    });
  });

  it('executes URL save flow and shows success toast', async () => {
    renderWithTheme(<SellerCenterSettings />);
    fireEvent.click(screen.getByRole('button', { name: /saveUrl/i }));

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalled();
    });
  });

  it('shows info toast on view profile and collection actions', () => {
    renderWithTheme(<SellerCenterSettings />);

    fireEvent.click(screen.getByRole('link', { name: /viewProfile/i }));
    fireEvent.click(screen.getByRole('link', { name: /viewCollection/i }));

    expect(toastInfo).toHaveBeenCalledTimes(2);
  });

  it('handles file input changes (banner/logo) and renders preview images', async () => {
    // ✅ jsdom puede no traer createObjectURL
    if (!(URL as any).createObjectURL) {
      (URL as any).createObjectURL = jest.fn(() => 'blob:preview-url');
    } else {
      jest.spyOn(URL, 'createObjectURL').mockImplementation(() => 'blob:preview-url');
    }

    const { container } = renderWithTheme(<SellerCenterSettings />);

    const fileInputs = container.querySelectorAll('input[type="file"]');
    expect(fileInputs.length).toBe(2);

    const file = new File(['dummy'], 'logo.png', { type: 'image/png' });

    fireEvent.change(fileInputs[0], { target: { files: [file] } });
    fireEvent.change(fileInputs[1], { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText('banner preview')).toBeInTheDocument();
      expect(screen.getByAltText('logo preview')).toBeInTheDocument();
    });
  });
});
