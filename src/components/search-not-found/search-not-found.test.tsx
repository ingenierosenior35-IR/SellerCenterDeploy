import React from 'react';
import { render, screen } from '@testing-library/react';

import { SearchNotFound } from './search-not-found';

describe('SearchNotFound', () => {
  it('renders placeholder when no query', () => {
    render(<SearchNotFound />);
    expect(screen.getByText('Please enter keywords')).toBeInTheDocument();
  });

  it('renders "Not found" heading when query is provided', () => {
    render(<SearchNotFound query="test query" />);
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });

  it('renders query text in results', () => {
    render(<SearchNotFound query="my search" />);
    expect(screen.getByText(/"my search"/)).toBeInTheDocument();
  });

  it('does not render heading when no query', () => {
    render(<SearchNotFound />);
    expect(screen.queryByText('Not found')).not.toBeInTheDocument();
  });
});
