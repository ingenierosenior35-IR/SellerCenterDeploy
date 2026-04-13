jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div>{children}</div>,
}));
jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
  isExternalLink: jest.fn((href: string) => href.startsWith('http')),
}));
jest.mock('src/routes/components', () => ({
  RouterLink: 'a',
}));
jest.mock('../image', () => ({
  Image: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));
jest.mock('./styles', () => ({
  MarkdownRoot: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));
jest.mock('./classes', () => ({
  markdownClasses: {
    root: 'markdown-root',
    content: { image: 'md-image', link: 'md-link', codeBlock: 'md-code-block', codeInline: 'md-code-inline', checkbox: 'md-checkbox' },
  },
}));
jest.mock('rehype-raw', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('rehype-highlight', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('remark-gfm', () => ({ __esModule: true, default: jest.fn() }));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { Markdown } from './markdown';

describe('Markdown', () => {
  it('renders markdown content', () => {
    render(<Markdown>Hello World</Markdown>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders plain text content', () => {
    render(<Markdown>Just some text</Markdown>);
    expect(screen.getByText('Just some text')).toBeInTheDocument();
  });

  it('renders without crashing when empty', () => {
    const { container } = render(<Markdown />);
    expect(container).toBeInTheDocument();
  });
});
