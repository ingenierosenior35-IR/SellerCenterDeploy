import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

const getGraphqlUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_URL;
  if (!url) throw new Error('NEXT_PUBLIC_BACKEND_GRAPHQL_URL is not configured');
  return url;
};

// Helper para detectar si query/mutation contiene un operationName simple
function getOperationNameFromBody(body: Record<string, unknown> | null): string | null {
  try {
    if (!body) return null;
    const q = typeof body === 'string' ? body : (body.query as string) || '';
    const m = q.match(/(mutation|query)\s+([A-Za-z0-9_]+)/);
    if (m) return m[2];
    return null;
  } catch {
    return null;
  }
}

// Heurística para detectar token cifrado (base64 largo sin puntos)
function looksLikeEncrypted(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  const bare = token.replace(/^Bearer\s+/i, '').replace(/^"(.*)"$/, '$1').trim();
  if (bare.split('.').length === 3) return false; // es JWT
  if (bare.length < 80) return false;
  return /^[A-Za-z0-9+/=]+$/.test(bare);
}

// Sanitiza el header de autorización
function sanitizeAuthorizationHeader(auth: string | null | undefined): string | undefined {
  if (!auth) return undefined;
  if (typeof auth !== 'string') return undefined;

  let v = auth.trim();

  // Remove surrounding quotes entirely
  if (/^"(.*)"$/.test(v)) {
    v = v.replace(/^"(.*)"$/, '$1').trim();
  }

  // If header is exactly Bearer "token" with quotes, normalize
  const m = v.match(/^Bearer\s+"(.+)"$/i);
  if (m) return `Bearer ${m[1].trim()}`;

  // If it's already Bearer <token>, leave as-is (but normalize spacing)
  if (/^Bearer\s+/i.test(v)) {
    return v.replace(/^Bearer\s+/i, 'Bearer ').trim();
  }

  // If it's a raw token that looks like JWT (has two dots), prefix Bearer
  const parts = v.split('.');
  if (parts.length === 3) {
    return `Bearer ${v}`;
  }

  return v;
}

// Extrae token de cookie
function getTokenFromCookie(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  const m = cookieHeader.match(/(?:^|; )accessToken=([^;]+)/);
  if (m) {
    try {
      return decodeURIComponent(m[1] || '');
    } catch {
      return m[1];
    }
  }
  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const url = getGraphqlUrl();
    const body = await request.json();

    // Obtener operación (si podemos) para reglas especiales
    const operationName = getOperationNameFromBody(body);
    const isLoginOp = operationName === 'GenerateCustomerToken' ||
                      operationName === 'ValidateOTP' ||
                      operationName === 'ValidateOtpCode';

    const incomingAuth = request.headers.get('authorization') || '';
    const cookieHeader = request.headers.get('cookie');
    const cookieToken = getTokenFromCookie(cookieHeader);

    const sanitizedHeader = sanitizeAuthorizationHeader(incomingAuth);
    const sanitizedCookie = sanitizeAuthorizationHeader(cookieToken);

    // Si la operación es login, NO forwardear Authorization
    let effectiveAuth: string | undefined;
    if (isLoginOp) {
      effectiveAuth = undefined;
      console.warn('[graphql-proxy] Blocking Authorization for login operation:', operationName);
    } else {
      // Normal behavior: if header looks encrypted and cookie holds JWT, prefer cookie
      if (sanitizedHeader && looksLikeEncrypted(sanitizedHeader) && sanitizedCookie && !looksLikeEncrypted(sanitizedCookie)) {
        effectiveAuth = sanitizedCookie;
        console.warn('[graphql-proxy] Detected encrypted Authorization header; using cookie instead.');
      } else if (sanitizedHeader) {
        effectiveAuth = sanitizedHeader;
      } else if (sanitizedCookie) {
        effectiveAuth = sanitizedCookie;
      } else {
        effectiveAuth = undefined;
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (effectiveAuth) {
      headers['Authorization'] = effectiveAuth;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const text = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';

    return new NextResponse(text, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[api/graphql-proxy] proxy error', error);
    return NextResponse.json(
      { message: 'Proxy error', error: String(error) },
      { status: 500 }
    );
  }
}

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     },
//   });
// }
