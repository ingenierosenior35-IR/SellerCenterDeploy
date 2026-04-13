import { render, screen, fireEvent } from '@testing-library/react';

import { NotificationsDrawer } from './index';

const onClose = jest.fn();
const onOpen = jest.fn();
const setBooleanValue = jest.fn();

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({
    get value() {
      return setBooleanValue.mock.calls.length > 0 ? setBooleanValue.mock.calls.at(-1)[0] : false;
    },
    onFalse: () => {
      onClose();
      setBooleanValue(false);
    },
    onTrue: () => {
      onOpen();
      setBooleanValue(true);
    },
  }),
}));

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/icons', () => ({
  NotificationBellIcon: () => <span data-testid="notification-bell" />,
}));

jest.mock('src/components/animate', () => ({
  varTap: () => ({}),
  varHover: () => ({}),
  transitionTap: () => ({}),
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('./notification-item', () => ({
  NotificationItem: ({ notification }: any) => (
    <div data-testid={`notification-${notification.id}`}>{notification.title}</div>
  ),
}));

jest.mock('@mui/material/Drawer', () => ({
  __esModule: true,
  default: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
    <div data-testid={`drawer-${open}`}>{children}</div>
  ),
}));

describe('NotificationsDrawer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens drawer from trigger and renders translated CTA', () => {
    render(<NotificationsDrawer />);

    fireEvent.click(screen.getByRole('button', { name: 'Notifications button' }));

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(setBooleanValue).toHaveBeenCalledWith(true);
    expect(screen.getByText('viewAll')).toBeInTheDocument();
  });

  it('shows unread action and marks all as read when clicked', () => {
    const data = [
      {
        id: '1',
        type: 'mail',
        title: 'New mail',
        category: 'Inbox',
        isUnRead: true,
        avatarUrl: null,
        createdAt: Date.now(),
      },
      {
        id: '2',
        type: 'chat',
        title: 'Ping',
        category: 'Chat',
        isUnRead: false,
        avatarUrl: null,
        createdAt: Date.now(),
      },
    ];

    render(<NotificationsDrawer data={data as any} />);

    const markAllButton = screen.getByTestId('icon-eva:done-all-fill').closest('button');
    expect(markAllButton).toBeInTheDocument();
    fireEvent.click(markAllButton!);

    expect(screen.queryByTestId('icon-eva:done-all-fill')).not.toBeInTheDocument();
  });

  it('switches tabs and closes from mobile close button', () => {
    render(<NotificationsDrawer data={[]} />);

    fireEvent.click(screen.getByRole('tab', { name: /Unread 12/i }));
    expect(screen.getByRole('tab', { name: /Unread 12/i })).toHaveAttribute('aria-selected', 'true');

    const mobileCloseButton = screen.getByTestId('icon-mingcute:close-line').closest('button');
    fireEvent.click(mobileCloseButton!);

    expect(onClose).toHaveBeenCalled();
  });
});
