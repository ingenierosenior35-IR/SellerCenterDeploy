import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------
// Environment variables are accessed via process.env.VITE_* so they work
// in both Vite (replaced at build time via vite.config.ts define map) and
// Jest (read directly from process.env).
// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
  auth: {
    method: 'jwt' | 'amplify' | 'firebase' | 'supabase' | 'auth0';
    skip: boolean;
    redirectPath: string;
    tokenExpirationTime: number;
  };
  firebase: {
    appId: string;
    apiKey: string;
    projectId: string;
    authDomain: string;
    storageBucket: string;
    measurementId: string;
    messagingSenderId: string;
  };
  amplify: { userPoolId: string; userPoolWebClientId: string; region: string };
  auth0: { clientId: string; domain: string; callbackUrl: string };
  supabase: { url: string; key: string };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Seller Center MitiMiti',
  appVersion: packageJson.version,
  serverUrl: process.env.VITE_SERVER_URL ?? '',
  assetsDir: process.env.VITE_ASSETS_DIR ?? '',
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.home.root,
    tokenExpirationTime: parseInt(process.env.VITE_TOKEN_EXPIRATION_TIME ?? '30'), // en minutos
  },
  /**
   * Firebase
   */
  firebase: {
    apiKey: process.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: process.env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: process.env.VITE_FIREBASE_APPID ?? '',
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
  },
  /**
   * Amplify
   */
  amplify: {
    userPoolId: process.env.VITE_AWS_AMPLIFY_USER_POOL_ID ?? '',
    userPoolWebClientId: process.env.VITE_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID ?? '',
    region: process.env.VITE_AWS_AMPLIFY_REGION ?? '',
  },
  /**
   * Auth0
   */
  auth0: {
    clientId: process.env.VITE_AUTH0_CLIENT_ID ?? '',
    domain: process.env.VITE_AUTH0_DOMAIN ?? '',
    callbackUrl: process.env.VITE_AUTH0_CALLBACK_URL ?? '',
  },
  /**
   * Supabase
   */
  supabase: {
    url: process.env.VITE_SUPABASE_URL ?? '',
    key: process.env.VITE_SUPABASE_ANON_KEY ?? '',
  },
};
