import { paths } from 'src/routes/paths';

import { EXPIRATION_TIME, ACCESS_TOKEN_STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export async function validateSession() {
  try {
    const accessToken = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const expirationTime = sessionStorage.getItem(EXPIRATION_TIME);

    if (accessToken && expirationTime) {
      const currentTime = Date.now() / 1000;

      // Si el token ha expirado, eliminarlo y redirigir al usuario
      if (currentTime - parseFloat(expirationTime) > 3600) {
        sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        sessionStorage.removeItem(EXPIRATION_TIME);
        window.location.href = paths.auth.signIn;
      }
    } else {
      // Si no hay token, redirigir al usuario a la página de inicio de sesión
      window.location.href = paths.auth.signIn;
    }
  } catch (error) {
    console.error('Error during session validation:', error);
    throw error;
  }
}

export async function setSession(accessToken: string | null) {
  try {
    if (accessToken) {
      sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);

      // variable para guardar momento que se guarda el token
      const currentTime = Date.now() / 1000;
      sessionStorage.setItem(EXPIRATION_TIME, currentTime.toString());
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(EXPIRATION_TIME);
      window.location.href = paths.auth.signIn;
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}

export function getSession() {
  try {
    const accessToken = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

    if (!accessToken) {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error('Error during get session');
    throw error;
  }
}
