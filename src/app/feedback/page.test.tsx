import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/sections/feedback/view/feedback-view', () => ({
  __esModule: true,
  default: () => <div data-testid="feedback-view" />,
}));

describe('FeedbackPage', () => {
  it('renders FeedbackView', () => {
    render(<Page />);
    expect(screen.getByTestId('feedback-view')).toBeInTheDocument();
  });
});
