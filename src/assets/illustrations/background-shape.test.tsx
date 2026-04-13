import { render } from '@testing-library/react';

import { BackgroundShape } from './background-shape';

describe('BackgroundShape', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <svg>
        <BackgroundShape />
      </svg>
    );
    expect(container.firstChild).not.toBeNull();
  });
});
