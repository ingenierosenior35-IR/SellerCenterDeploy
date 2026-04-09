import { gql } from 'graphql-request';

export const CREATE_SUBACCOUNT_MUTATION = gql`
  mutation CreateSellerSubAccount(
    $customerId: String!
    $firstname: String!
    $lastname: String!
    $email: String!
    $permissionType: String!
    $status: String!
  ) {
    createSellerSubAccount(
      customerId: $customerId
      firstname: $firstname
      lastname: $lastname
      email: $email
      permissionType: $permissionType
      status: $status
    ) {
      errorMessage
      successMessage
    }
  }
`;
