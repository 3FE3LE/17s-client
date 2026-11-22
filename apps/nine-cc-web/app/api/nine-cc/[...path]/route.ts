import { getApiErrorDisplayMessage, loadEnv, normalizeApiBaseUrl } from '@17suit/core';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// BFF proxy: every `/api/nine-cc/*` request is forwarded to the NestJS
// backend, preserving method, query string, and body. The clerk session is
// resolved into a Bearer token (matches `CLERK_JWT_TEMPLATE` if set, else the
// default session JWT). The backend's `ClerkTokenVerifier` validates the
// JWT and resolves `clerk_user_id` for ownership checks.

interface ProxyContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(request: Request, context: ProxyContext): Promise<NextResponse> {
  return proxyToBackend(request, context);
}

export async function POST(request: Request, context: ProxyContext): Promise<NextResponse> {
  return proxyToBackend(request, context);
}

export async function PUT(request: Request, context: ProxyContext): Promise<NextResponse> {
  return proxyToBackend(request, context);
}

export async function PATCH(request: Request, context: ProxyContext): Promise<NextResponse> {
  return proxyToBackend(request, context);
}

export async function DELETE(
  request: Request,
  context: ProxyContext,
): Promise<NextResponse> {
  return proxyToBackend(request, context);
}

async function proxyToBackend(
  request: Request,
  context: ProxyContext,
): Promise<NextResponse> {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tokenTemplate = process.env.CLERK_JWT_TEMPLATE;
  const token = tokenTemplate ? await getToken({ template: tokenTemplate }) : await getToken();
  if (!token) {
    return NextResponse.json({ error: 'Missing Clerk token' }, { status: 401 });
  }

  const resolvedParams = await context.params;
  const path = Array.isArray(resolvedParams.path) ? resolvedParams.path : [];
  const apiBaseUrl = normalizeApiBaseUrl(loadEnv().API_BASE_URL).replace(/\/api$/, '');
  const incomingUrl = new URL(request.url);
  const targetUrl = `${apiBaseUrl}/nine-care-companion/${path.join('/')}${incomingUrl.search}`;

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  });
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const bodyText = await request.text();
    if (bodyText.length > 0) init.body = bodyText;
  }

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, init);
  } catch (error) {
    return NextResponse.json(
      { error: `Backend unreachable: ${getApiErrorDisplayMessage(error)}` },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  const upstreamType = upstream.headers.get('content-type');
  if (upstreamType) responseHeaders.set('Content-Type', upstreamType);
  responseHeaders.set('Cache-Control', 'no-store');

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
