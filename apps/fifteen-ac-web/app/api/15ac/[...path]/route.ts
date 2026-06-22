import { getApiErrorDisplayMessage, loadEnv, normalizeApiBaseUrl } from '@17suit/core';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

interface ProxyContext {
  params: Promise<{ path: string[] }>;
}

async function proxyToBackend(request: Request, context: ProxyContext): Promise<NextResponse> {
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
  const targetUrl = `${apiBaseUrl}/api/15ac/${path.join('/')}${incomingUrl.search}`;

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  });

  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const body = await request.text();
    if (body.length > 0) {
      init.body = body;
    }
  }

  let response: Response;

  try {
    response = await fetch(targetUrl, init);
  } catch (error) {
    return NextResponse.json({ message: getApiErrorDisplayMessage(error) }, { status: 503 });
  }

  const payload = await response.text();

  return new NextResponse(payload, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') ?? 'application/json',
    },
  });
}

export async function GET(request: Request, context: ProxyContext): Promise<NextResponse> {
  return proxyToBackend(request, context);
}

export async function POST(request: Request, context: ProxyContext): Promise<NextResponse> {
  return proxyToBackend(request, context);
}

export async function PATCH(request: Request, context: ProxyContext): Promise<NextResponse> {
  return proxyToBackend(request, context);
}

export async function DELETE(request: Request, context: ProxyContext): Promise<NextResponse> {
  return proxyToBackend(request, context);
}
