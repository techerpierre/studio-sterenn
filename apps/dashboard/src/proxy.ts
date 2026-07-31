import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

import core from '@/config/core';
import env from '@/config/env';

const TOKEN_EXPIRY_SKEW_MS = 30_000;

type AccessTokenPayload = {
  exp?: number;
};

function isAccessTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<AccessTokenPayload>(token);
    if (!exp) return true;
    return exp * 1000 <= Date.now() + TOKEN_EXPIRY_SKEW_MS;
  } catch {
    return true;
  }
}

function redirectToSignIn(request: NextRequest) {
  const loginUrl = new URL('/sign-in', request.url);
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = ['/', '/sign-in', '/sign-up', '/validate-2fa'];
  const isPublicPath = publicPaths.some((p) => path === p || path.startsWith(`${p}/`));

  if (isPublicPath) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(env.API_TOKEN_STORED_KEY)?.value;
  const refreshToken = request.cookies.get(env.API_REFRESH_TOKEN_STORED_KEY)?.value;

  if (!accessToken || !refreshToken) {
    return redirectToSignIn(request);
  }

  if (!isAccessTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  try {
    const session = await core.auth.refreshToken({ refreshToken });

    const response = NextResponse.next();
    response.cookies.set(env.API_TOKEN_STORED_KEY, session.token);
    response.cookies.set(env.API_REFRESH_TOKEN_STORED_KEY, refreshToken);
    return response;
  } catch {
    const response = redirectToSignIn(request);
    response.cookies.delete(env.API_TOKEN_STORED_KEY);
    response.cookies.delete(env.API_REFRESH_TOKEN_STORED_KEY);
    response.cookies.delete(env.CURRENT_WORKSPACE_STORED_KEY);
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
