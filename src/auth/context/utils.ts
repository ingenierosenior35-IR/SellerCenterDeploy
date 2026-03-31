import type { ICustomer } from 'src/interfaces/customer/customer.interface';

import { jwtDecode } from 'jwt-decode';

import { GraphQLService } from 'src/lib/graphql-client';

import { CUSTOMER_ID, CUSTOMER_KEY, EXPIRATION_TIME, ACCESS_TOKEN_STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export function validateSession() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const expirationTime = localStorage.getItem(EXPIRATION_TIME);

  if (!accessToken || !expirationTime) {
    setSession(null);
    return false;
  }

  const isExpired = parseFloat(expirationTime) < Date.now() / 1000;

  if (isExpired) {
    setSession(null);
    return false;
  }

  return true;
}

export function setSession(accessToken: string | null) {
  if (accessToken) {
    const payload: { uid: string, exp: number } = jwtDecode(accessToken);

    if (!(payload.exp < Date.now() / 1000)) {
      localStorage.setItem(EXPIRATION_TIME, payload.exp.toString());
    }

    localStorage.setItem(CUSTOMER_ID, payload.uid);
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);

  } else {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(EXPIRATION_TIME);
    localStorage.removeItem(CUSTOMER_ID);
  }
}

export function setCustomerStorage(customer: ICustomer | null) {
  try {
    if (customer) {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    } else {
      localStorage.removeItem(CUSTOMER_KEY);
    }
  } catch (error) {
      console.error('Error during set customer storage:', error);
    throw error;
  }
}

export function getSession() {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

    if (!accessToken) {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error('Error during get session');
    throw error;
  }
}
