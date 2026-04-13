import { render, screen } from '@testing-library/react';

import { NotificationItem } from './notification-item';

jest.mock('@mui/material/ListItemButton', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('src/utils/format-time', () => ({
  fToNow: () => '3m ago',
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

jest.mock('src/components/file-thumbnail', () => ({
  FileThumbnail: () => <div data-testid="file-thumbnail" />,
}));

describe('NotificationItem', () => {
  it('renders avatar and basic notification text', () => {
    const notification = {
      id: '1',
      type: 'mail',
      title: '<p>New message</p>',
      category: 'Inbox',
      isUnRead: false,
      avatarUrl: 'https://cdn.example.com/avatar.jpg',
      createdAt: Date.now(),
    };

    const { container } = render(<NotificationItem notification={notification} />);

    expect(container.querySelector('img[src="https://cdn.example.com/avatar.jpg"]')).toBeInTheDocument();
    expect(screen.getByText('New message')).toBeInTheDocument();
    expect(screen.getByText(/Inbox/)).toBeInTheDocument();
    expect(screen.getByText(/3m ago/)).toBeInTheDocument();
  });

  it('renders friend actions for friend notifications', () => {
    const notification = {
      id: '2',
      type: 'friend',
      title: '<p>Friend request</p>',
      category: 'Social',
      isUnRead: true,
      avatarUrl: null,
      createdAt: Date.now(),
    };

    render(<NotificationItem notification={notification} />);

    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument();
  });

  it('renders file actions for file notifications', () => {
    const notification = {
      id: '3',
      type: 'file',
      title: '<p>File uploaded</p>',
      category: 'Files',
      isUnRead: false,
      avatarUrl: null,
      createdAt: Date.now(),
    };

    render(<NotificationItem notification={notification} />);

    expect(screen.getByTestId('file-thumbnail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
  });
});
