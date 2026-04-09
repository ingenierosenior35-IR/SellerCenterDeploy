import { gql } from 'graphql-request';

export const UPDATE_SUBACCOUNT_MUTATION = gql`
  mutation UpdateSellerSubAccount(
    $customerId: String!
    $id: String!
    $firstname: String!
    $lastname: String!
    $email: String!
    $permissionType: String!
    $status: String!
  ) {
    updateSellerSubAccount(
      customerId: $customerId
      id: $id
      firstname: $firstname
      lastname: $lastname
      email: $email
      permissionType: $permissionType
      status: $status
    ) {
      message
    }
  }
`;
