jest.mock('@mui/material/styles', () => {
  const actual = jest.requireActual('@mui/material/styles');
  return {
    ...actual,
    useTheme: jest.fn(() => ({
      ...actual.createTheme(),
      direction: 'ltr',
      breakpoints: { down: jest.fn(() => false) },
    })),
  };
});
jest.mock('minimal-shared/hooks', () => ({
  useBoolean: jest.fn(() => ({
    value: true,
    onToggle: jest.fn(),
    onTrue: jest.fn(),
    onFalse: jest.fn(),
  })),
}));
jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));
jest.mock('../components', () => ({
  Nav: ({ children }: any) => <nav>{children}</nav>,
  NavUl: ({ children }: any) => <ul>{children}</ul>,
  NavLi: ({ children }: any) => <li>{children}</li>,
  NavSubheader: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));
jest.mock('./nav-list', () => ({
  NavList: ({ data }: any) => <div data-testid="nav-list">{data.title}</div>,
}));
jest.mock('../styles', () => ({
  navSectionClasses: { vertical: 'nav-vertical' },
  navSectionCssVars: { vertical: jest.fn(() => ({})) },
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { NavSectionVertical } from './nav-section-vertical';

const navData = [
  {
    subheader: 'Main',
    items: [
      { title: 'Home', path: '/', icon: 'home' },
      { title: 'About', path: '/about', icon: 'info' },
    ],
  },
];

describe('NavSectionVertical', () => {
  it('renders subheader when provided', () => {
    render(<NavSectionVertical data={navData} />);
    expect(screen.getByText('Main')).toBeInTheDocument();
  });

  it('renders nav lists for each item', () => {
    render(<NavSectionVertical data={navData} />);
    expect(screen.getAllByTestId('nav-list')).toHaveLength(2);
  });

  it('renders without subheader', () => {
    const dataWithoutSubheader = [
      { items: [{ title: 'Home', path: '/', icon: 'home' }] },
    ];
    render(<NavSectionVertical data={dataWithoutSubheader as any} />);
    expect(screen.getByTestId('nav-list')).toBeInTheDocument();
  });
});
