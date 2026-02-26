import { environment as localEnv } from './env.dev';
import { environment as prodEnv } from './env.config';

const isDev = process.env.NEXT_PUBLIC_ENV === 'local';

export const ENV = isDev ? localEnv : prodEnv;

if (!ENV.urlBackend) {
  throw new Error("Missing NEXT_PUBLIC_BACKEND_GRAPHQL_URL in environment variables");
}