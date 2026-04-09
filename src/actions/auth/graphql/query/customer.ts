'use client';

export const GET_CURRENT_USER_QUERY = `
  query GetCurrentUser {
    customer {
      email
      firstname
      lastname
    }
  }
`;
