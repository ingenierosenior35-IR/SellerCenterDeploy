import { render, screen } from '@testing-library/react';

import { useGetSubAccounts } from 'src/actions/account/use-get-subaccounts';

import { SubAccountDetailsView } from './subaccount-details-view';

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: { heading: string }) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/actions/account/use-get-subaccounts', () => ({
  useGetSubAccounts: jest.fn(),
}));

jest.mock('@mui/material/Skeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton" />,
}));

jest.mock('../components/subaccount-edit-form', () => ({
  SubAccountEditForm: ({ currentUser }: { currentUser: { firstname: string } }) => (
    <div data-testid="edit-form">{currentUser.firstname}</div>
  ),
}));

const mockUseGetSubAccounts = useGetSubAccounts as jest.MockedFunction<typeof useGetSubAccounts>;


describe('SubAccountDetailsView', () => {
  it('renders loading skeletons while accounts are loading', () => {
    mockUseGetSubAccounts.mockReturnValue({
      accounts: [],
      isLoading: true,
      isError: false,
    });

    render(<SubAccountDetailsView id={1} />);

    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('subAccountDetailsView.breadcrumbs.heading');
    expect(screen.getAllByTestId('skeleton')).toHaveLength(2);
    expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
  });

  it('renders edit form when account exists and loading finished', () => {
    mockUseGetSubAccounts.mockReturnValue({
      accounts: [
        {
          id: 2,
          firstname: 'Jane',
          lastname: 'Doe',
          email: 'jane@miti.com',
          status: 'ACTIVE',
          permissions: [{ 'sellersubaccount/account/manage': 'account/manage' }],
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<SubAccountDetailsView id={2} />);

    expect(screen.getByTestId('edit-form')).toHaveTextContent('Jane');
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });
});
